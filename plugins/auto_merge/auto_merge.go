package auto_merge

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/GEPROG/lassie-bot-dog/config"
	autoMergeConfig "github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/GEPROG/lassie-bot-dog/utils"
	gitlab "gitlab.com/gitlab-org/api/client-go/v2"
)

type AutoMergePlugin struct {
	latestFullCheck *time.Time
	lastestChecks   map[int64]*time.Time
	loadedConfig    *autoMergeConfig.AutoMergeConfig
	Client          *gitlab.Client
}

func NewAutoMergePlugin(client *gitlab.Client) *AutoMergePlugin {
	return &AutoMergePlugin{
		lastestChecks: make(map[int64]*time.Time),
		Client:        client,
	}
}

func (plugin *AutoMergePlugin) Name() string {
	return "auto_merge"
}

func (plugin *AutoMergePlugin) Execute(project *gitlab.Project, config config.ProjectConfig) {
	log := utils.Logger(project, nil)
	plugin.loadedConfig = &autoMergeConfig.AutoMergeConfig{}
	err := json.Unmarshal(config.Plugins[plugin.Name()], &plugin.loadedConfig)
	if err != nil {
		log.Error("Can't load config", err)
		return
	}
	log.Debugf("Loaded config: %+v", plugin.loadedConfig)

	now := time.Now()

	mergeRequests := []*gitlab.BasicMergeRequest{}

	if plugin.latestFullCheck == nil || plugin.latestFullCheck.Add(time.Minute*5).Before(now) {
		mergeRequests = append(mergeRequests, plugin.getMergeRequests(project, nil)...)
		plugin.latestFullCheck = &now
	} else {
		mergeRequests = append(mergeRequests, plugin.getUpdatedMergeRequests(project)...)
		mergeRequests = append(mergeRequests, plugin.getUpdatedPipelineMergeRequests(project)...)
		plugin.lastestChecks[project.ID] = &now
	}

	for _, mergeRequest := range mergeRequests {
		plugin.autoMerge(project, mergeRequest)
	}

	log.Debugf("checked total of %d merge-requests\n", len(mergeRequests))
}

func (plugin *AutoMergePlugin) autoMerge(project *gitlab.Project, mergeRequest *gitlab.BasicMergeRequest) {
	log := utils.Logger(project, mergeRequest)
	log.Debug("trying to auto merge >>>", mergeRequest.Title)

	status := plugin.checkMergeRequest(project, mergeRequest)

	if !status.allChecksPassed {
		plugin.updateStatusComment(project, mergeRequest, status)
		return
	}

	squashMessage := fmt.Sprintf("%s (!%d)", mergeRequest.Title, mergeRequest.IID)
	acceptMergeRequestOptions := &gitlab.AcceptMergeRequestOptions{
		SquashCommitMessage:      gitlab.Ptr(squashMessage),
		ShouldRemoveSourceBranch: gitlab.Ptr(true),
		Squash:                   gitlab.Ptr(plugin.loadedConfig.Squash),
	}

	mergedMergeRequest, _, err := plugin.Client.MergeRequests.AcceptMergeRequest(project.ID, mergeRequest.IID, acceptMergeRequestOptions)
	if err != nil {
		log.Error("Can't merge", err)
		status.err = err
		plugin.updateStatusComment(project, mergeRequest, status)
		return
	}

	log.Info("merged >>>", squashMessage)
	status.merged = true
	plugin.updateStatusComment(project, &mergedMergeRequest.BasicMergeRequest, status)
}

func (plugin *AutoMergePlugin) getUpdatedPipelineMergeRequests(project *gitlab.Project) []*gitlab.BasicMergeRequest {
	log := utils.Logger(project, nil)
	var mergeRequests []*gitlab.BasicMergeRequest

	lastCheck := plugin.lastestChecks[project.ID]

	// if this is the first run => we don't need to get MRs with updated pipelines as we already checked all MRs
	if lastCheck == nil {
		return mergeRequests
	}

	opt := &gitlab.ListProjectPipelinesOptions{
		UpdatedAfter: lastCheck,
		Scope:        gitlab.Ptr("finished"),
		ListOptions: gitlab.ListOptions{
			PerPage: 10,
			Page:    1,
		},
	}

	for {
		pipelines, resp, err := plugin.Client.Pipelines.ListProjectPipelines(project.ID, opt)
		if err != nil {
			log.Error("Can't load pipelines", err)
		}

		for _, pipeline := range pipelines {
			// check if pipeline relates to MR and get corresponding MR
			if IsRefMergeRequest(pipeline.Ref) {
				mergeRequestIID, err := GetMergeRequestIDFromRef(pipeline.Ref)
				if err != nil {
					log.Error("Can't get merge-request id of pipeline ", pipeline.ID, " from ref ", pipeline.Ref, ": ", err)
					continue
				}
				mergeRequest, _, err := plugin.Client.MergeRequests.GetMergeRequest(project.ID, mergeRequestIID, &gitlab.GetMergeRequestsOptions{})
				if err != nil {
					log.Error("Can't load merge-request ", mergeRequestIID, ": ", err)
					continue
				}
				if mergeRequest.State != "opened" {
					continue
				}
				mergeRequests = append(mergeRequests, &mergeRequest.BasicMergeRequest)
			}
		}

		// Exit the loop when we've seen all pages
		if resp.CurrentPage >= resp.TotalPages {
			break
		}

		// Update the page number to get the next page
		opt.Page = resp.NextPage
	}

	return mergeRequests
}

func (plugin *AutoMergePlugin) getMergeRequests(project *gitlab.Project, lastCheck *time.Time) []*gitlab.BasicMergeRequest {
	log := utils.Logger(project, nil)
	var mergeRequests []*gitlab.BasicMergeRequest

	opt := &gitlab.ListProjectMergeRequestsOptions{
		State: gitlab.Ptr("opened"),
		// TargetBranch: &project.DefaultBranch,
		UpdatedAfter: lastCheck,
		ListOptions: gitlab.ListOptions{
			PerPage: 10,
			Page:    1,
		},
	}

	for {
		// Get the first page with merge-requests
		_mergeRequests, resp, err := plugin.Client.MergeRequests.ListProjectMergeRequests(project.ID, opt)
		if err != nil {
			log.Error("Can't load merge-requests", err)
		}

		mergeRequests = append(mergeRequests, _mergeRequests...)

		// Exit the loop when we've seen all pages
		if resp.CurrentPage >= resp.TotalPages {
			break
		}

		// Update the page number to get the next page
		opt.Page = resp.NextPage
	}

	return mergeRequests
}

func (plugin *AutoMergePlugin) getUpdatedMergeRequests(project *gitlab.Project) []*gitlab.BasicMergeRequest {
	lastCheck := plugin.lastestChecks[project.ID]

	return plugin.getMergeRequests(project, lastCheck)
}

func IsRefMergeRequest(ref string) bool {
	return strings.HasPrefix(ref, "refs/merge-requests/")
}

func GetMergeRequestIDFromRef(ref string) (int64, error) {
	refID := ref
	refID = strings.TrimPrefix(refID, "refs/merge-requests/")
	refID = strings.TrimSuffix(refID, "/head")

	mergeRequestIID, err := strconv.ParseInt(refID, 10, 64)
	if err != nil {
		return -1, err
	}

	return mergeRequestIID, nil
}

package auto_merge

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/GEPROG/lassie-bot-dog/config"
	autoMergeConfig "github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	log "github.com/sirupsen/logrus"
	"github.com/xanzy/go-gitlab"
)

type autoMergePlugin struct {
	lastestChecks map[int]*time.Time
	loadedConfig  *autoMergeConfig.AutoMergeConfig
	Client        *gitlab.Client
}

func NewAutoMergePlugin(client *gitlab.Client) *autoMergePlugin {
	return &autoMergePlugin{
		lastestChecks: make(map[int]*time.Time),
		Client:        client,
	}
}

func (plugin autoMergePlugin) Name() string {
	return "auto_merge"
}

func (plugin autoMergePlugin) Execute(project *gitlab.Project, config config.ProjectConfig) {

	err := json.Unmarshal(config.Plugins[plugin.Name()], &plugin.loadedConfig)
	if err != nil {
		log.Debug("Can't load config", err)
		return
	}
	log.Debugf("Loaded config: %+v", plugin.loadedConfig)

	now := time.Now()

	mergeRequests := plugin.getUpdatedMergeRequests(project)
	mergeRequests = append(mergeRequests, plugin.getUpdatedPipelineMergeRequests(project)...)

	for _, mergeRequest := range mergeRequests {
		plugin.autoMerge(project, mergeRequest)
	}

	log.Debugf("checked total of %d merge-requests\n", len(mergeRequests))

	plugin.lastestChecks[project.ID] = &now
}

func (plugin autoMergePlugin) autoMerge(project *gitlab.Project, mergeRequest *gitlab.MergeRequest) {
	log.Debug("trying to auto merge >>>", mergeRequest.Title)

	status := plugin.checkMergeRequest(project, mergeRequest)

	if !status.allChecksPassed {
		plugin.updateStatusComment(project, mergeRequest, status)
		return
	}

	squashMessage := fmt.Sprintf("%s (!%d)", mergeRequest.Title, mergeRequest.IID)
	acceptMergeRequestOptions := &gitlab.AcceptMergeRequestOptions{
		SquashCommitMessage:      gitlab.String(squashMessage),
		ShouldRemoveSourceBranch: gitlab.Bool(true),
		Squash:                   gitlab.Bool(plugin.loadedConfig.Squash),
	}

	mergedMergeRequest, _, err := plugin.Client.MergeRequests.AcceptMergeRequest(project.ID, mergeRequest.IID, acceptMergeRequestOptions)
	if err != nil {
		log.Debug("Can't merge", err)
	} else {
		log.Info("merged >>>", squashMessage)
		status.merged = true
	}

	plugin.updateStatusComment(project, mergedMergeRequest, status)
}

func (plugin autoMergePlugin) getUpdatedPipelineMergeRequests(project *gitlab.Project) []*gitlab.MergeRequest {
	var mergeRequests []*gitlab.MergeRequest

	lastCheck := *plugin.lastestChecks[project.ID]

	opt := &gitlab.ListProjectPipelinesOptions{
		UpdatedAfter: &lastCheck,
		ListOptions: gitlab.ListOptions{
			PerPage: 10,
			Page:    1,
		},
	}

	for {
		pipelines, resp, err := plugin.Client.Pipelines.ListProjectPipelines(project.ID, opt)
		if err != nil {
			log.Debug("Can't load pipelines", err)
		}

		for _, pipeline := range pipelines {
			optMR := &gitlab.ListProjectMergeRequestsOptions{
				State:        gitlab.String("opened"),
				SourceBranch: &pipeline.Ref,
				ListOptions: gitlab.ListOptions{
					PerPage: 10,
					Page:    1,
				},
			}

			_mergeRequests, _, err := plugin.Client.MergeRequests.ListProjectMergeRequests(project.ID, optMR)
			if err != nil {
				log.Debug("Can't load merge-requests", err)
			}

			if len(_mergeRequests) < 1 {
				log.Debug("No related merge-request not found")
			} else {
				// if one or more check all merge-requests
				mergeRequests = append(mergeRequests, _mergeRequests...)
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

func (plugin autoMergePlugin) getUpdatedMergeRequests(project *gitlab.Project) []*gitlab.MergeRequest {
	var mergeRequests []*gitlab.MergeRequest

	lastCheck := *plugin.lastestChecks[project.ID]

	opt := &gitlab.ListProjectMergeRequestsOptions{
		State: gitlab.String("opened"),
		// TargetBranch: &project.DefaultBranch,
		UpdatedAfter: &lastCheck,
		ListOptions: gitlab.ListOptions{
			PerPage: 10,
			Page:    1,
		},
	}

	for {
		// Get the first page with merge-requests
		_mergeRequests, resp, err := plugin.Client.MergeRequests.ListProjectMergeRequests(project.ID, opt)
		if err != nil {
			log.Debug("Can't load merge-requests", err)
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

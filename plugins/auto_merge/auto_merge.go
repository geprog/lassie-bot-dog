package auto_merge

import (
	"fmt"
	"time"

	log "github.com/sirupsen/logrus"
	"github.com/xanzy/go-gitlab"
)

type autoMergePlugin struct {
	lastestChecks map[int]*time.Time
	Client        *gitlab.Client
}

func NewAutoMergePlugin(client *gitlab.Client) *autoMergePlugin {
	return &autoMergePlugin{
		Client:        client,
		lastestChecks: make(map[int]*time.Time),
	}
}

func (plugin autoMergePlugin) Execute(project *gitlab.Project) {
	opt := &gitlab.ListProjectMergeRequestsOptions{
		State:        gitlab.String("opened"),
		UpdatedAfter: plugin.lastestChecks[project.ID],
		// TargetBranch: &project.DefaultBranch,
		ListOptions: gitlab.ListOptions{
			PerPage: 10,
			Page:    1,
		},
	}

	totalMergeRequests := 0
	now := time.Now()

	for {
		// Get the first page with merge-requests
		mergeRequests, resp, err := plugin.Client.MergeRequests.ListProjectMergeRequests(project.ID, opt)
		if err != nil {
			log.Debug("Can't load merge-requests", err)
		}

		log.Debugf("checking %d merge-requests ...\n", len(mergeRequests))

		totalMergeRequests = totalMergeRequests + len(mergeRequests)

		for _, mergeRequest := range mergeRequests {
			plugin.autoMerge(project, mergeRequest)
		}

		// Exit the loop when we've seen all pages
		if resp.CurrentPage >= resp.TotalPages {
			break
		}

		// Update the page number to get the next page
		opt.Page = resp.NextPage
	}

	log.Debugf("checked total of %d merge-requests\n", totalMergeRequests)

	plugin.lastestChecks[project.ID] = &now
}

func (plugin autoMergePlugin) autoMerge(project *gitlab.Project, mergeRequest *gitlab.MergeRequest) {
	log.Debug("trying to auto merge >>>", mergeRequest.Title)

	status := plugin.checkMergeRequest(project, mergeRequest)

	if status.allChecksPassed {
		squashMessage := fmt.Sprintf("%s (!%d)", mergeRequest.Title, mergeRequest.IID)
		acceptMergeRequestOptions := &gitlab.AcceptMergeRequestOptions{
			SquashCommitMessage:      gitlab.String(squashMessage),
			ShouldRemoveSourceBranch: gitlab.Bool(true),
			Squash:                   gitlab.Bool(true),
		}
		plugin.Client.MergeRequests.AcceptMergeRequest(project.ID, mergeRequest.IID, acceptMergeRequestOptions)
		log.Info("merged >>>", squashMessage)
	}

	plugin.updateStatusComment(project, mergeRequest, status)
}

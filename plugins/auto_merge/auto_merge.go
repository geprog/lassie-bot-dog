package auto_merge

import (
	"fmt"

	log "github.com/sirupsen/logrus"
	"github.com/xanzy/go-gitlab"
)

type AutoMergePlugin struct {
	Client *gitlab.Client
}

func (plugin AutoMergePlugin) Execute(project *gitlab.Project) {
	opt := &gitlab.ListProjectMergeRequestsOptions{
		State: gitlab.String("opened"),
	}

	mergeRequests, _, err := plugin.Client.MergeRequests.ListProjectMergeRequests(project.ID, opt)
	if err != nil {
		log.Debug("Can't load merge-requests", err)
	}

	for _, mergeRequest := range mergeRequests {
		plugin.autoMerge(project, mergeRequest)
	}
}

func (plugin AutoMergePlugin) autoMerge(project *gitlab.Project, mergeRequest *gitlab.MergeRequest) {
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

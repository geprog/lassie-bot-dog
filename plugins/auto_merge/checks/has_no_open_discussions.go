package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/GEPROG/lassie-bot-dog/utils"
	gitlab "gitlab.com/gitlab-org/api/client-go/v2"
)

type HasNoOpenDiscussionsCheck struct {
	Client *gitlab.Client
}

func (check HasNoOpenDiscussionsCheck) Check(_ *config.AutoMergeConfig, project *gitlab.Project, mergeRequest *gitlab.BasicMergeRequest) bool {
	log := utils.Logger(project, mergeRequest)
	notes, _, err := check.Client.Notes.ListMergeRequestNotes(mergeRequest.ProjectID, mergeRequest.IID, nil)
	if err != nil {
		log.Error("Can't load merge-request notes", err)
		return false
	}
	for _, note := range notes {
		if note.Resolvable && !note.Resolved {
			log.Debug("Found unresolved discussion", note.ID)
			return false
		}
	}
	return true
}

func (check HasNoOpenDiscussionsCheck) Name() string {
	return "has-no-open-discussions"
}

func (check HasNoOpenDiscussionsCheck) PassedText(_ int64) string {
	return "All discussions about your changes have been resolved"
}

func (check HasNoOpenDiscussionsCheck) FailedText(_ int64) string {
	return "There are still some ongoing discussions about your changes"
}

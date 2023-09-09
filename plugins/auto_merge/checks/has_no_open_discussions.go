package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/xanzy/go-gitlab"

	log "github.com/sirupsen/logrus"
)

type HasNoOpenDiscussionsCheck struct {
	Client *gitlab.Client
}

func (check HasNoOpenDiscussionsCheck) Check(_ *config.AutoMergeConfig, _ *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	notes, _, err := check.Client.Notes.ListMergeRequestNotes(mergeRequest.ProjectID, mergeRequest.IID, nil)
	if err != nil {
		log.Error("Can't load merge-request notes", err)
		return false
	}
	for _, note := range notes {
		if note.Resolvable && !note.Resolved {
			log.Debug("Found unresolved discussion", mergeRequest.ProjectID, mergeRequest.IID, note.ID)
			return false
		}
	}
	return true
}

func (check HasNoOpenDiscussionsCheck) Name() string {
	return "has-no-open-discussions"
}

func (check HasNoOpenDiscussionsCheck) PassedText(_ int) string {
	return "All discussions about your changes have been resolved"
}

func (check HasNoOpenDiscussionsCheck) FailedText(_ int) string {
	return "There are still some ongoing discussions about your changes"
}

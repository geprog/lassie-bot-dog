package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/xanzy/go-gitlab"
)

type HasNoOpenDiscussionsCheck struct {
}

func (check HasNoOpenDiscussionsCheck) Check(config *config.AutoMergeConfig, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	return mergeRequest.BlockingDiscussionsResolved
}

func (check HasNoOpenDiscussionsCheck) Name() string {
	return "has-no-open-discussions"
}

func (check HasNoOpenDiscussionsCheck) PassedText(mergeRequestId int) string {
	return "All discussions about your changes have been resolved"
}

func (check HasNoOpenDiscussionsCheck) FailedText(mergeRequestId int) string {
	return "There are still some ongoing discussions about your changes"
}

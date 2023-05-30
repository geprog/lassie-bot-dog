package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/xanzy/go-gitlab"
)

type HasNoOpenDiscussionsCheck struct {
}

func (check HasNoOpenDiscussionsCheck) Check(_ *config.AutoMergeConfig, _ *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	return mergeRequest.BlockingDiscussionsResolved
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

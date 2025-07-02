package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/xanzy/go-gitlab"
)

type HasMilestone struct {
}

func (check HasMilestone) Check(config *config.AutoMergeConfig, _ *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	return !config.RequireMilestone || mergeRequest.Milestone != nil
}

func (check HasMilestone) Name() string {
	return "has-milestone"
}

func (check HasMilestone) PassedText(_ int) string {
	return "Your Merge-Request has a milestone assigned"
}

func (check HasMilestone) FailedText(_ int) string {
	return "Your Merge-Request has no milestone assigned"
}

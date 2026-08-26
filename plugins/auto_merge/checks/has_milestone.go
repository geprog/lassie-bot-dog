package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	gitlab "gitlab.com/gitlab-org/api/client-go/v2"
)

type HasMilestone struct {
}

func (check HasMilestone) Check(_ *config.AutoMergeConfig, _ *gitlab.Project, mergeRequest *gitlab.BasicMergeRequest) bool {
	return mergeRequest.Milestone != nil
}

func (check HasMilestone) Name() string {
	return "has-milestone"
}

func (check HasMilestone) PassedText(_ int64) string {
	return "Your Merge-Request has a milestone assigned"
}

func (check HasMilestone) FailedText(_ int64) string {
	return "Your Merge-Request has no milestone assigned"
}

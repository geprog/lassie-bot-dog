package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/xanzy/go-gitlab"
)

type HasAssignee struct {
}

func (check HasAssignee) Check(_ *config.AutoMergeConfig, _ *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	return mergeRequest.Assignee != nil
}

func (check HasAssignee) Name() string {
	return "has-assignee"
}

func (check HasAssignee) PassedText(_ int) string {
	return "Someone is assigned to your Merge-Request"
}

func (check HasAssignee) FailedText(_ int) string {
	return "No one is assigned to your Merge-Request"
}

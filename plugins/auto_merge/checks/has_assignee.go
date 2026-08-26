package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	gitlab "gitlab.com/gitlab-org/api/client-go/v2"
)

type HasAssignee struct {
}

func (check HasAssignee) Check(_ *config.AutoMergeConfig, _ *gitlab.Project, mergeRequest *gitlab.BasicMergeRequest) bool {
	return mergeRequest.Assignee != nil
}

func (check HasAssignee) Name() string {
	return "has-assignee"
}

func (check HasAssignee) PassedText(_ int64) string {
	return "Someone is assigned to your Merge-Request"
}

func (check HasAssignee) FailedText(_ int64) string {
	return "No one is assigned to your Merge-Request"
}

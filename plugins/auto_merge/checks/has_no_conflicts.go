package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	gitlab "gitlab.com/gitlab-org/api/client-go/v2"
)

type HasNoConflictsCheck struct {
}

func (check HasNoConflictsCheck) Check(_ *config.AutoMergeConfig, _ *gitlab.Project, mergeRequest *gitlab.BasicMergeRequest) bool {
	return !mergeRequest.HasConflicts
}

func (check HasNoConflictsCheck) Name() string {
	return "has-conflicts"
}

func (check HasNoConflictsCheck) PassedText(_ int64) string {
	return "Your changes do not have conflicts with the target branch."
}

func (check HasNoConflictsCheck) FailedText(_ int64) string {
	return "Your changes have some conflicts with the target branch"
}

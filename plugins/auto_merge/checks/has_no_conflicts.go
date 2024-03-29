package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/xanzy/go-gitlab"
)

type HasNoConflictsCheck struct {
}

func (check HasNoConflictsCheck) Check(_ *config.AutoMergeConfig, _ *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	return !mergeRequest.HasConflicts
}

func (check HasNoConflictsCheck) Name() string {
	return "has-conflicts"
}

func (check HasNoConflictsCheck) PassedText(_ int) string {
	return "Your changes do not have conflicts with the target branch."
}

func (check HasNoConflictsCheck) FailedText(_ int) string {
	return "Your changes have some conflicts with the target branch"
}

package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/xanzy/go-gitlab"
)

type HasNoConflictsCheck struct {
}

func (check HasNoConflictsCheck) Check(config *config.AutoMergeConfig, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	return !mergeRequest.HasConflicts
}

func (check HasNoConflictsCheck) Name() string {
	return "has-conflicts"
}

func (check HasNoConflictsCheck) PassedText() string {
	return "Your changes do not have conflicts with the target branch."
}

func (check HasNoConflictsCheck) FailedText() string {
	return "Your changes have some conflicts with the target branch"
}

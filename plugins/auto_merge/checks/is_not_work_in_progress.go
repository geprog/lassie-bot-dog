package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/xanzy/go-gitlab"
)

type IsNotWorkInProgressCheck struct {
}

func (check IsNotWorkInProgressCheck) Check(config *config.AutoMergeConfig, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	return !mergeRequest.WorkInProgress
}

func (check IsNotWorkInProgressCheck) Name() string {
	return "is-not-work-in-progress"
}

func (check IsNotWorkInProgressCheck) PassedText(mergeRequestID int) string {
	return "Your Merge-Request is marked as ready (no WIP-prefix)"
}

func (check IsNotWorkInProgressCheck) FailedText(mergeRequestID int) string {
	return "Your Merge-Request is not ready yet (marked with WIP-prefix)"
}

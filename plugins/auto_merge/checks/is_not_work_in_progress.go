package checks

import (
	"github.com/xanzy/go-gitlab"
)

type IsNotWorkInProgressCheck struct {
}

func (check IsNotWorkInProgressCheck) Check(client *gitlab.Client, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	return !mergeRequest.WorkInProgress
}

func (plugin IsNotWorkInProgressCheck) Name() string {
	return "is-not-work-in-progress"
}

func (plugin IsNotWorkInProgressCheck) PassedText() string {
	return "Your Merge-Request is marked as ready (no WIP-prefix)"
}

func (plugin IsNotWorkInProgressCheck) FailedText() string {
	return "Your Merge-Request is not ready yet (marked with WIP-prefix)"
}

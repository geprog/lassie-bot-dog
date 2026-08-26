package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	gitlab "gitlab.com/gitlab-org/api/client-go/v2"
)

type IsNotWorkInProgressCheck struct {
}

func (check IsNotWorkInProgressCheck) Check(_ *config.AutoMergeConfig, _ *gitlab.Project, mergeRequest *gitlab.BasicMergeRequest) bool {
	return !mergeRequest.Draft
}

func (check IsNotWorkInProgressCheck) Name() string {
	return "is-not-work-in-progress"
}

func (check IsNotWorkInProgressCheck) PassedText(_ int64) string {
	return "Your Merge-Request is marked as ready (no WIP-prefix)"
}

func (check IsNotWorkInProgressCheck) FailedText(_ int64) string {
	return "Your Merge-Request is not ready yet (marked with WIP-prefix)"
}

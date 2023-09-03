package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/xanzy/go-gitlab"

	log "github.com/sirupsen/logrus"
)

type CanMergeCheck struct {
}

func (check CanMergeCheck) Check(_ *config.AutoMergeConfig, _ *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	log.Debug("Checking if user can merge: ", mergeRequest.User.CanMerge)
	return mergeRequest.User.CanMerge
}

func (check CanMergeCheck) Name() string {
	return "can-merge"
}

func (check CanMergeCheck) PassedText(_ int) string {
	return "Lassie is allowed to merge your changes"
}

func (check CanMergeCheck) FailedText(_ int) string {
	return "Lassie is not allowed to merge your changes"
}

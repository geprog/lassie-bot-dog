package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/xanzy/go-gitlab"
)

type HasRequiredLabelsCheck struct {
}

func (check HasRequiredLabelsCheck) Check(config *config.AutoMergeConfig, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	for _, neededLabel := range config.NeededLabels {
		if !check.hasMergeRequestLabel(mergeRequest, neededLabel) {
			return false
		}
	}

	return true
}

func (check HasRequiredLabelsCheck) Name() string {
	return "has-labels"
}

func (check HasRequiredLabelsCheck) PassedText() string {
	return "Your Merge-Request has all required labels"
}

func (check HasRequiredLabelsCheck) FailedText() string {
	return "Your Merge-Request is missing some required labels" // TODO list missing labels
}

func (check HasRequiredLabelsCheck) hasMergeRequestLabel(mergeRequest *gitlab.MergeRequest, searchedLabel string) bool {
	for _, label := range mergeRequest.Labels {
		if searchedLabel == label {
			return true
		}
	}

	return false
}

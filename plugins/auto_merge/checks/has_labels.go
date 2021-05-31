package checks

import (
	"github.com/xanzy/go-gitlab"
)

type HasRequiredLabelsCheck struct {
}

func (check HasRequiredLabelsCheck) Check(client *gitlab.Client, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	neededLabels := [...]string{"👀 Ready for Review"}

	for _, neededLabel := range neededLabels {
		if !check.hasMergeRequestLabel(mergeRequest, neededLabel) {
			return false
		}
	}

	return true
}

func (plugin HasRequiredLabelsCheck) Name() string {
	return "has-labels"
}

func (plugin HasRequiredLabelsCheck) PassedText() string {
	return "Your Merge-Request has all required labels"
}

func (plugin HasRequiredLabelsCheck) FailedText() string {
	return "Your Merge-Request is missing some required labels" // TODO list missing labels
}

func (plugin HasRequiredLabelsCheck) hasMergeRequestLabel(mergeRequest *gitlab.MergeRequest, searchedLabel string) bool {
	for _, label := range mergeRequest.Labels {
		if searchedLabel == label {
			return true
		}
	}

	return false
}
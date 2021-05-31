package checks

import (
	"github.com/xanzy/go-gitlab"
)

type HasNoConflictsCheck struct {
}

func (check HasNoConflictsCheck) Check(client *gitlab.Client, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	return !mergeRequest.HasConflicts
}

func (plugin HasNoConflictsCheck) Name() string {
	return "has-conflicts"
}

func (plugin HasNoConflictsCheck) PassedText() string {
	return "Your changes do not have conflicts with the target branch."
}

func (plugin HasNoConflictsCheck) FailedText() string {
	return "Your changes have some conflicts with the target branch"
}

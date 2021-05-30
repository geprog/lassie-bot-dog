package auto_merge

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/checks"
	"github.com/xanzy/go-gitlab"
)

type mergeCheck interface {
	Check(client *gitlab.Client, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool
	Name() string
	FailedText() string
	PassedText() string
}

type mergeCheckResult struct {
	mergeCheckName   string
	mergeCheckPassed bool
}

type mergeStatus struct {
	checkResults    []*mergeCheckResult
	merged          bool
	allChecksPassed bool
}

func (plugin AutoMergePlugin) checkMergeRequest(project *gitlab.Project, mergeRequest *gitlab.MergeRequest) *mergeStatus {
	status := &mergeStatus{
		checkResults:    []*mergeCheckResult{},
		merged:          mergeRequest.MergedBy != nil,
		allChecksPassed: true,
	}

	for _, mergeCheck := range plugin.mergeChecks() {
		mergeCheckName := mergeCheck.Name()
		mergeCheckPassed := mergeCheck.Check(plugin.Client, project, mergeRequest)

		status.checkResults = append(status.checkResults, &mergeCheckResult{
			mergeCheckName:   mergeCheckName,
			mergeCheckPassed: mergeCheckPassed,
		})

		// as soon as one check failed change allChecksPassed to false
		if !mergeCheckPassed {
			status.allChecksPassed = false
		}
	}

	return status
}

func (plugin AutoMergePlugin) mergeChecks() [6]mergeCheck {
	return [...]mergeCheck{
		checks.HasEnoughApprovalsCheck{},
		checks.HasRequiredLabelsCheck{},
		checks.HasNoConflictsCheck{},
		checks.HasNoOpenDiscussionsCheck{},
		checks.IsNotWorkInProgressCheck{},
		checks.PassesCICheck{},
	}
}

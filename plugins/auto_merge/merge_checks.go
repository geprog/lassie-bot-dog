package auto_merge

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/checks"
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/xanzy/go-gitlab"
)

var mergeChecks []mergeCheck

type mergeCheck interface {
	Check(config *config.AutoMergeConfig, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool
	Name() string
	FailedText(mergeRequestID int) string
	PassedText(mergeRequestID int) string
}

type mergeCheckResult struct {
	mergeCheckName   string
	mergeCheckPassed bool
}

type mergeStatus struct {
	mergeRequestID  int
	checkResults    []*mergeCheckResult
	merged          bool
	allChecksPassed bool
	err             error
}

func (plugin AutoMergePlugin) checkMergeRequest(project *gitlab.Project, mergeRequest *gitlab.MergeRequest) *mergeStatus {
	// TODO: find better place to load this
	plugin.setupMergeChecks()

	status := &mergeStatus{
		mergeRequestID:  mergeRequest.ID,
		checkResults:    []*mergeCheckResult{},
		merged:          mergeRequest.MergedBy != nil,
		allChecksPassed: true,
	}

	for _, mergeCheck := range mergeChecks {
		mergeCheckName := mergeCheck.Name()
		mergeCheckPassed := mergeCheck.Check(plugin.loadedConfig, project, mergeRequest)

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

func (plugin AutoMergePlugin) setupMergeChecks() {
	if mergeChecks != nil {
		return
	}

	mergeChecks = []mergeCheck{
		checks.HasEnoughApprovalsCheck{
			Client: plugin.Client,
		},
		checks.HasRequiredLabelsCheck{},
		checks.HasNoConflictsCheck{},
		checks.HasNoOpenDiscussionsCheck{Client: plugin.Client},
		checks.IsNotWorkInProgressCheck{},
		checks.HasAssignee{},
		checks.HasMilestone{},
		checks.PassesCICheck{
			Client: plugin.Client,
		},
		checks.IsTitleUsingConventionalCommit{},
	}
}

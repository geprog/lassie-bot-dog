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

func (plugin autoMergePlugin) checkMergeRequest(project *gitlab.Project, mergeRequest *gitlab.MergeRequest) *mergeStatus {
	// TODO: find better place to load this
	plugin.setupMergeChecks()

	status := &mergeStatus{
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

func (plugin autoMergePlugin) setupMergeChecks() {
	if mergeChecks != nil {
		return
	}

	mergeChecks = []mergeCheck{
		checks.HasEnoughApprovalsCheck{
			Client: plugin.Client,
		},
		checks.HasRequiredLabelsCheck{},
		checks.HasNoConflictsCheck{},
		checks.HasNoOpenDiscussionsCheck{},
		checks.IsNotWorkInProgressCheck{},
		checks.PassesCICheck{
			Client: plugin.Client,
		},
	}
}

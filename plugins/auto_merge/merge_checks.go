package auto_merge

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/checks"
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	gitlab "gitlab.com/gitlab-org/api/client-go/v2"
)

var mergeChecks []mergeCheck

type mergeCheck interface {
	Check(config *config.AutoMergeConfig, project *gitlab.Project, mergeRequest *gitlab.BasicMergeRequest) bool
	Name() string
	FailedText(mergeRequestID int64) string
	PassedText(mergeRequestID int64) string
}

type mergeCheckResult struct {
	mergeCheckName   string
	mergeCheckPassed bool
}

type mergeStatus struct {
	mergeRequestID  int64
	checkResults    []*mergeCheckResult
	merged          bool
	allChecksPassed bool
	err             error
}

func (plugin AutoMergePlugin) checkMergeRequest(project *gitlab.Project, mergeRequest *gitlab.BasicMergeRequest) *mergeStatus {
	// TODO: find better place to load this
	plugin.setupMergeChecks(plugin.loadedConfig)

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

func (plugin AutoMergePlugin) setupMergeChecks(config *config.AutoMergeConfig) {
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
		checks.PassesCICheck{
			Client: plugin.Client,
		},
		checks.IsTitleUsingConventionalCommit{},
	}

	if config.RequireMilestone {
		mergeChecks = append(mergeChecks, checks.HasMilestone{})
	}
}

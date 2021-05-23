package auto_merge

import (
	log "github.com/sirupsen/logrus"
	"github.com/xanzy/go-gitlab"
)

type mergeStatusLevel int

const (
	mergeStatusSkipped mergeStatusLevel = iota
	mergeStatusSuccess mergeStatusLevel = iota
	mergeStatusFailed  mergeStatusLevel = iota
)

type mergeStatus struct {
	hasConflicts        mergeStatusLevel
	openDicussions      mergeStatusLevel
	isNotWorkInProgress mergeStatusLevel
	hasNeededLabels     mergeStatusLevel
	enoughApprovals     mergeStatusLevel
	passingPipeline     mergeStatusLevel
}

// func equalMergeStatus(mergeStatusA *mergeStatus, mergeStatusB *mergeStatus) bool {
// 	return mergeStatusA.hasConflicts == mergeStatusB.hasConflicts &&
// 		mergeStatusA.openDicussions == mergeStatusB.openDicussions &&
// 		mergeStatusA.passingPipeline == mergeStatusB.passingPipeline &&
// 		mergeStatusA.enoughApprovals == mergeStatusB.enoughApprovals
// }

func hasMergeRequestLabel(mergeRequest *gitlab.MergeRequest, searchedLabel string) bool {
	for _, label := range mergeRequest.Labels {
		if searchedLabel == label {
			return true
		}
	}

	return false
}

func (plugin AutoMergePlugin) checkMergeRequest(project *gitlab.Project, mergeRequest *gitlab.MergeRequest) *mergeStatus {
	status := &mergeStatus{
		openDicussions:      mergeStatusSkipped,
		enoughApprovals:     mergeStatusSkipped,
		passingPipeline:     mergeStatusSkipped,
		hasConflicts:        mergeStatusSkipped,
		isNotWorkInProgress: mergeStatusSkipped,
		hasNeededLabels:     mergeStatusSkipped,
	}

	// has no conflicts
	if !mergeRequest.HasConflicts {
		status.hasConflicts = mergeStatusSuccess
	} else {
		status.hasConflicts = mergeStatusFailed
	}

	// has no open discussions
	if mergeRequest.BlockingDiscussionsResolved {
		status.openDicussions = mergeStatusSuccess
	} else {
		status.openDicussions = mergeStatusFailed
	}

	// is not work-in-progress
	if !mergeRequest.WorkInProgress {
		status.isNotWorkInProgress = mergeStatusSuccess
	} else {
		status.isNotWorkInProgress = mergeStatusFailed
	}

	// has needed labels
	if hasMergeRequestLabel(mergeRequest, "👀 Ready for Review") {
		status.hasNeededLabels = mergeStatusSuccess
	} else {
		status.hasNeededLabels = mergeStatusFailed
	}

	// has enough approvals
	approvals, _, err := plugin.Client.MergeRequests.GetMergeRequestApprovals(project.ID, mergeRequest.IID)
	if err == nil && len(approvals.ApprovedBy) >= 1 {
		status.enoughApprovals = mergeStatusSuccess
	} else {
		status.enoughApprovals = mergeStatusFailed

		if err != nil {
			log.Error("Can't load merge-request approvals", err)
		}
	}

	// passed ci
	pipelines, _, err := plugin.Client.MergeRequests.ListMergeRequestPipelines(project.ID, mergeRequest.IID)
	if err == nil && pipelines[0].Status != "success" {
		status.passingPipeline = mergeStatusSuccess
	} else {
		if err != nil {
			log.Error("Can't load merge-request pipelines", err)
		}

		status.passingPipeline = mergeStatusFailed
	}

	return status
}

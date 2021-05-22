package auto_merge

import (
	"log"

	"github.com/xanzy/go-gitlab"
)

type mergeStatusLevel int

const (
	mergeStatusSkipped mergeStatusLevel = iota
	mergeStatusSuccess mergeStatusLevel = iota
	mergeStatusFailed  mergeStatusLevel = iota
)

type mergeStatus struct {
	hasConflicts    mergeStatusLevel
	openDicussions  mergeStatusLevel
	enoughApprovals mergeStatusLevel
	passingPipeline mergeStatusLevel
}

func equalMergeStatus(mergeStatusA *mergeStatus, mergeStatusB *mergeStatus) bool {
	return mergeStatusA.hasConflicts == mergeStatusB.hasConflicts &&
		mergeStatusA.openDicussions == mergeStatusB.openDicussions &&
		mergeStatusA.passingPipeline == mergeStatusB.passingPipeline &&
		mergeStatusA.enoughApprovals == mergeStatusB.enoughApprovals
}

func (plugin AutoMergePlugin) checkMergeRequest(project *gitlab.Project, mergeRequest *gitlab.MergeRequest) *mergeStatus {
	status := &mergeStatus{
		openDicussions:  mergeStatusSkipped,
		enoughApprovals: mergeStatusSkipped,
		passingPipeline: mergeStatusSkipped,
		hasConflicts:    mergeStatusSkipped,
	}

	// has conflicts
	status.hasConflicts = mergeStatusFailed
	if mergeRequest.HasConflicts {
		return status
	}
	status.hasConflicts = mergeStatusSuccess

	// open discussions
	status.openDicussions = mergeStatusFailed
	if !mergeRequest.BlockingDiscussionsResolved {
		return status
	}
	status.openDicussions = mergeStatusSuccess

	// passing ci
	status.enoughApprovals = mergeStatusFailed
	approvals, _, err := plugin.Client.MergeRequests.GetMergeRequestApprovals(project.ID, mergeRequest.IID)
	if err != nil {
		log.Println("Can't load merge-request approvals", err)
		return status
	}
	if len(approvals.ApprovedBy) < 1 {
		return status
	}
	status.enoughApprovals = mergeStatusSuccess

	// enough approvals
	status.passingPipeline = mergeStatusFailed
	pipelines, _, err := plugin.Client.MergeRequests.ListMergeRequestPipelines(project.ID, mergeRequest.IID)
	if err != nil {
		log.Println("Can't load merge-request pipelines", err)
		return status
	}
	if pipelines[0].Status != "success" {
		return status
	}
	status.passingPipeline = mergeStatusSuccess

	return status
}

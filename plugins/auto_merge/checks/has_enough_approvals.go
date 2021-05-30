package checks

import (
	log "github.com/sirupsen/logrus"
	"github.com/xanzy/go-gitlab"
)

type HasEnoughApprovalsCheck struct {
}

func (check HasEnoughApprovalsCheck) Check(client *gitlab.Client, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	approvals, _, err := client.MergeRequests.GetMergeRequestApprovals(project.ID, mergeRequest.IID)

	if err != nil {
		log.Error("Can't load merge-request approvals", err)
		return false
	}

	return len(approvals.ApprovedBy) >= 1
}

func (plugin HasEnoughApprovalsCheck) Name() string {
	return "has-enough-approvals"
}

func (plugin HasEnoughApprovalsCheck) PassedText() string {
	return "Enough reviewers liked your changes"
}

func (plugin HasEnoughApprovalsCheck) FailedText() string {
	return "You still need some review for your changes"
}

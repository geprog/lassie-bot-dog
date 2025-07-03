package checks

import (
	"fmt"
	"strings"

	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/GEPROG/lassie-bot-dog/utils"
	"github.com/xanzy/go-gitlab"
)

type HasEnoughApprovalsCheck struct {
	Client *gitlab.Client
}

var missingApprovalForLabels map[int][]string

func (check HasEnoughApprovalsCheck) Check(config *config.AutoMergeConfig, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	log := utils.Logger(project, mergeRequest)
	approvals, _, err := check.Client.MergeRequests.GetMergeRequestApprovals(project.ID, mergeRequest.IID)
	if err != nil {
		log.Error("Can't load merge-request approvals", err)
		return false
	}

	if missingApprovalForLabels == nil {
		missingApprovalForLabels = make(map[int][]string)
	}

	missingApprovalForLabels[mergeRequest.ID] = []string{}

	for _, neededApproval := range config.NeededApprovals {
		if neededApproval.Label == "" || len(neededApproval.Users) == 0 {
			log.Warn("Invalid needed approval config")
			return false
		}

		// skip (don't require approval) if the label does not exists on the MR and the required label is not a wildcard (always check)
		if !utils.StringInSlice(neededApproval.Label, mergeRequest.Labels) && neededApproval.Label != "*" {
			continue
		}

		// get amount of users that need to approve and already approved
		approvedBy := len(check.getApprovals(approvals.ApprovedBy, neededApproval.Users, mergeRequest.Assignee))
		atLeast := utils.Max(neededApproval.AtLeast, 1)

		if approvedBy < atLeast {
			label := fmt.Sprintf("~\"%s\"", neededApproval.Label)
			if neededApproval.Label == "*" {
				label = "`*`"
			}
			missingApprovalForLabels[mergeRequest.ID] = append(missingApprovalForLabels[mergeRequest.ID], label)
		}
	}

	return len(missingApprovalForLabels[mergeRequest.ID]) == 0
}

func (check HasEnoughApprovalsCheck) Name() string {
	return "has-enough-approvals"
}

func (check HasEnoughApprovalsCheck) PassedText(_ int) string {
	return "Enough reviewers liked your changes"
}

func (check HasEnoughApprovalsCheck) FailedText(mergeRequestID int) string {
	missingLabels := strings.Join(missingApprovalForLabels[mergeRequestID], ", ")
	return fmt.Sprintf("You still need some review for your changes %s", missingLabels)
}

func (check HasEnoughApprovalsCheck) getApprovals(approvedByAll []*gitlab.MergeRequestApproverUser, possibleApprovers []string, assignee *gitlab.BasicUser) []string {
	var approvedBy []string

	for _, approver := range approvedByAll {
		if utils.StringInSlice(approver.User.Username, possibleApprovers) && (assignee == nil || approver.User.Username != assignee.Username) {
			approvedBy = append(approvedBy, approver.User.Username)
		}
	}

	return approvedBy
}

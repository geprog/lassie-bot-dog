package checks

import (
	"fmt"
	"strings"

	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/GEPROG/lassie-bot-dog/utils"
	log "github.com/sirupsen/logrus"
	"github.com/xanzy/go-gitlab"
)

type HasEnoughApprovalsCheck struct {
	Client *gitlab.Client
}

var missingApprovalForLabels map[int][]string

func (check HasEnoughApprovalsCheck) Check(config *config.AutoMergeConfig, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	approvals, _, err := check.Client.MergeRequests.GetMergeRequestApprovals(project.ID, mergeRequest.IID)
	if err != nil {
		log.Error("Can't load merge-request approvals", err)
		return false
	}

	if missingApprovalForLabels == nil {
		missingApprovalForLabels = make(map[int][]string)
	}

	missingApprovalForLabels[mergeRequest.ID] = nil

	for _, neededApproval := range config.NeededApprovals {
		// check if this MR has the label to check approvals for (empty label means wildcard => check for every MR)
		if neededApproval.Label != "" && !utils.StringInSlice(neededApproval.Label, mergeRequest.Labels) {
			continue
		}

		approvedBy := check.getApprovals(approvals.ApprovedBy, neededApproval.Users)

		if len(approvedBy) < neededApproval.AtLeast {
			label := neededApproval.Label

			missingApprovalForLabels[mergeRequest.ID] = append(missingApprovalForLabels[mergeRequest.ID], fmt.Sprintf("~\"%s\"", label))
		}
	}

	return len(missingApprovalForLabels[mergeRequest.ID]) == 0
}

func (plugin HasEnoughApprovalsCheck) Name() string {
	return "has-enough-approvals"
}

func (plugin HasEnoughApprovalsCheck) PassedText(mergeRequestId int) string {
	return "Enough reviewers liked your changes"
}

func (plugin HasEnoughApprovalsCheck) FailedText(mergeRequestId int) string {
	missingLabels := strings.Join(missingApprovalForLabels[mergeRequestId], ", ")
	return fmt.Sprintf("You still need some review for your changes %s", missingLabels)
}

func (plugin HasEnoughApprovalsCheck) getApprovals(approvedByAll []*gitlab.MergeRequestApproverUser, possibleApprovers []string) []string {
	var approvedBy []string

	for _, approver := range approvedByAll {
		if utils.StringInSlice(approver.User.Username, possibleApprovers) {
			approvedBy = append(approvedBy, approver.User.Username)
		}
	}

	return approvedBy
}

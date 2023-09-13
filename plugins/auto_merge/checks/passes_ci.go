package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/GEPROG/lassie-bot-dog/utils"

	"github.com/xanzy/go-gitlab"
)

type PassesCICheck struct {
	Client *gitlab.Client
}

func (check PassesCICheck) Check(_ *config.AutoMergeConfig, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	log := utils.Logger(project, mergeRequest)
	pipelines, _, err := check.Client.MergeRequests.ListMergeRequestPipelines(project.ID, mergeRequest.IID)
	if err != nil {
		log.Error("Can't load merge-request pipelines", err)
		return false
	}

	return len(pipelines) > 0 && pipelines[0].Status == "success"
}

func (check PassesCICheck) Name() string {
	return "passes-ci"
}

func (check PassesCICheck) PassedText(_ int) string {
	return "A pipline successfully tested your changes"
}

func (check PassesCICheck) FailedText(_ int) string {
	return "A pipeline detected some errors with your changes"
}

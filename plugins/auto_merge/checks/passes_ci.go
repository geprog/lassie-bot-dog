package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	log "github.com/sirupsen/logrus"

	"github.com/xanzy/go-gitlab"
)

type PassesCICheck struct {
	Client *gitlab.Client
}

func (check PassesCICheck) Check(_ *config.AutoMergeConfig, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
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

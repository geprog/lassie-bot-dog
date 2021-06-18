package checks

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	log "github.com/sirupsen/logrus"

	"github.com/xanzy/go-gitlab"
)

type PassesCICheck struct {
	Client *gitlab.Client
}

func (check PassesCICheck) Check(config *config.AutoMergeConfig, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	pipelines, _, err := check.Client.MergeRequests.ListMergeRequestPipelines(project.ID, mergeRequest.IID)
	if err != nil {
		log.Error("Can't load merge-request pipelines", err)
		return false
	}

	return len(pipelines) > 0 && pipelines[0].Status == "success"
}

func (plugin PassesCICheck) Name() string {
	return "passes-ci"
}

func (plugin PassesCICheck) PassedText() string {
	return "A pipline successfully tested your changes"
}

func (plugin PassesCICheck) FailedText() string {
	return "A pipeline detected some errors with your changes"
}

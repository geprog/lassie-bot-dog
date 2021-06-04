package checks

import (
	log "github.com/sirupsen/logrus"

	"github.com/xanzy/go-gitlab"
)

type PassesCICheck struct {
}

func (check PassesCICheck) Check(client *gitlab.Client, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	pipelines, _, err := client.MergeRequests.ListMergeRequestPipelines(project.ID, mergeRequest.IID)
	if err != nil {
		log.Error("Can't load merge-request pipelines", err)
		return false
	}

	return pipelines[0].Status == "success"
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

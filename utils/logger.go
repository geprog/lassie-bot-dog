package utils

import (
	log "github.com/sirupsen/logrus"
	gitlab "gitlab.com/gitlab-org/api/client-go/v2"
)

func Logger(project *gitlab.Project, mergeRequest *gitlab.BasicMergeRequest) *log.Entry {
	fields := log.Fields{
		"webURL": project.WebURL,
	}
	if mergeRequest != nil {
		fields = log.Fields{
			"webURL": mergeRequest.WebURL,
		}
	}
	return log.WithFields(fields)
}

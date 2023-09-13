package utils

import (
	log "github.com/sirupsen/logrus"
	"github.com/xanzy/go-gitlab"
)

func Logger(project *gitlab.Project, mergeRequest *gitlab.MergeRequest) *log.Entry {
	fields := log.Fields{
		"project": project.NameWithNamespace,
		"webURL":  project.WebURL,
	}
	if mergeRequest != nil {
		fields = log.Fields{
			"project":      project.NameWithNamespace,
			"mergeRequest": mergeRequest.ID,
			"webURL":       mergeRequest.WebURL,
		}
	}
	return log.WithFields(fields)
}

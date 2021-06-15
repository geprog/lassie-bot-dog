package plugins

import (
	"github.com/GEPROG/lassie-bot-dog/config"
	"github.com/xanzy/go-gitlab"
)

type Plugin interface {
	Name() string
	Execute(project *gitlab.Project, config config.ProjectConfig)
}

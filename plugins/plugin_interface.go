package plugins

import (
	"github.com/GEPROG/lassie-bot-dog/config"
	gitlab "gitlab.com/gitlab-org/api/client-go/v2"
)

type Plugin interface {
	Name() string
	Execute(project *gitlab.Project, config config.ProjectConfig)
}

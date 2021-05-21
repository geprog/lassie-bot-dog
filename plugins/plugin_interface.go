package plugins

import "github.com/xanzy/go-gitlab"

type Plugin interface {
	Execute(project *gitlab.Project)
}

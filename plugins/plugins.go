package plugins

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge"
	"github.com/xanzy/go-gitlab"
)

func GetPlugins(client *gitlab.Client) []Plugin {
	plugins := []Plugin{auto_merge.AutoMergePlugin{Client: client}}
	return plugins
}

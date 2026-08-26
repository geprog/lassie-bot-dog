package plugins

import (
	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge"
	gitlab "gitlab.com/gitlab-org/api/client-go/v2"
)

func GetPlugins(client *gitlab.Client) []Plugin {
	plugins := []Plugin{auto_merge.NewAutoMergePlugin(client)}
	return plugins
}

package config

import (
	"encoding/json"

	"github.com/xanzy/go-gitlab"
)

type ProjectConfig struct {
	Plugins map[string]json.RawMessage `json:"plugins"`
}

func LoadConfig(client *gitlab.Client, project *gitlab.Project) *ProjectConfig {
	opts := &gitlab.GetRawFileOptions{}
	raw, _, err := client.RepositoryFiles.GetRawFile(project.ID, "lassie.json", opts)
	if err != nil {
		return nil
	}

	config := ProjectConfig{}
	err = json.Unmarshal(raw, &config)
	if err != nil {
		return nil
	}

	return &config
}

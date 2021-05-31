package main

import (
	"os"
	"strings"
	"time"

	"github.com/GEPROG/lassie-bot-dog/plugins"
	"github.com/GEPROG/lassie-bot-dog/utils"
	"github.com/go-co-op/gocron"
	"github.com/joho/godotenv"
	log "github.com/sirupsen/logrus"
	"github.com/xanzy/go-gitlab"
)

var ENABLED_PROJECTS []string
var loadedPlugins []plugins.Plugin

func runPluginOnProject(client *gitlab.Client, project *gitlab.Project) {
	for _, plugin := range loadedPlugins {
		plugin.Execute(project)
	}
}

func loop(client *gitlab.Client) {
	p := &gitlab.ListProjectsOptions{}
	projects, _, err := client.Projects.ListProjects(p)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}

	for _, project := range projects {
		if utils.StringInSlice(project.PathWithNamespace, ENABLED_PROJECTS) {
			runPluginOnProject(client, project)
		}
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Debug("No .env file found")
	}

	if os.Getenv("LOG") == "debug" {
		log.SetLevel(log.DebugLevel)
	}

	GITLAB_URL := os.Getenv("GITLAB_URL")
	GITLAB_TOKEN := os.Getenv("GITLAB_TOKEN")
	ENABLED_PROJECTS = strings.Split(os.Getenv("ENABLED_PROJECTS"), ",")

	log.Info("Lassie is waking up '" + GITLAB_URL + "' ...")

	client, err := gitlab.NewClient(GITLAB_TOKEN,
		gitlab.WithBaseURL(GITLAB_URL))
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}

	loadedPlugins = plugins.GetPlugins(client)

	log.Info("Lassie is now watching for jobs!")

	s := gocron.NewScheduler(time.UTC)
	s.Every(30).Seconds().Do(func() {
		loop(client)
	})

	s.StartBlocking()
}

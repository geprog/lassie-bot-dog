package main

import (
	"os"
	"time"

	"github.com/GEPROG/lassie-bot-dog/config"
	"github.com/GEPROG/lassie-bot-dog/plugins"
	"github.com/go-co-op/gocron"
	"github.com/joho/godotenv"
	log "github.com/sirupsen/logrus"
	"github.com/xanzy/go-gitlab"
)

var loadedPlugins []plugins.Plugin
var projectConfigs map[string]config.ProjectConfig

func loopConfig(client *gitlab.Client) {
	log.Debug("Starting config loop ...")

	p := &gitlab.ListProjectsOptions{}
	projects, _, err := client.Projects.ListProjects(p)
	if err != nil {
		log.Debugf("Failed to receive project list: %v", err)
	}

	for _, project := range projects {
		config := config.LoadConfig(client, project)
		if config == nil {
			log.Debugf("No project config found for %s", project.PathWithNamespace)
			continue
		}

		projectConfigs[project.PathWithNamespace] = *config
		log.Debugf("Found Lassie config for %s", project.PathWithNamespace)
	}
}

func loopPlugins(client *gitlab.Client) {
	log.Debug("Starting plugin loop ...")

	p := &gitlab.ListProjectsOptions{}
	projects, _, err := client.Projects.ListProjects(p)
	if err != nil {
		log.Debugf("Failed to receive project list: %v", err)
	}

	for _, project := range projects {
		if config, ok := projectConfigs[project.PathWithNamespace]; ok {
			for _, plugin := range loadedPlugins {
				log.Debugf("Running plugin '%s' on project '%s'", plugin.Name(), project.PathWithNamespace)
				plugin.Execute(project, config)
			}
		}
	}
}

func main() {
	projectConfigs = make(map[string]config.ProjectConfig)

	err := godotenv.Load()
	if err != nil {
		log.Debug("No .env file found")
	}

	if os.Getenv("LOG") == "debug" {
		log.SetLevel(log.DebugLevel)
	}

	GITLAB_URL := os.Getenv("GITLAB_URL")
	if GITLAB_URL == "" {
		log.Fatal("Please provide a gitlab url with GITLAB_URL='https://gitlab.example.com'")
	}

	GITLAB_TOKEN := os.Getenv("GITLAB_TOKEN")
	if GITLAB_TOKEN == "" {
		log.Fatal("Please provide a gitlab token with GITLAB_TOKEN")
	}

	log.Info("Lassie is waking up '" + GITLAB_URL + "' ...")

	client, err := gitlab.NewClient(GITLAB_TOKEN, gitlab.WithBaseURL(GITLAB_URL))
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}

	loadedPlugins = plugins.GetPlugins(client)

	log.Info("Lassie is now waiting for some work!")

	updateInterval := 30
	if os.Getenv("LOG") == "debug" {
		updateInterval = 5
	}

	sC := gocron.NewScheduler(time.UTC)
	sC.SingletonMode()
	sC.Every(5).Minutes().Do(func() {
		loopConfig(client)
	})
	sC.StartAsync()

	sP := gocron.NewScheduler(time.UTC)
	sP.SingletonMode()
	sP.Every(updateInterval).Seconds().Do(func() {
		loopPlugins(client)
	})
	sP.StartBlocking()
}

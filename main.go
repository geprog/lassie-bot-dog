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

func loop(client *gitlab.Client) {
	log.Debug("Starting plugin loop ...")

	p := &gitlab.ListProjectsOptions{}
	projects, _, err := client.Projects.ListProjects(p)
	if err != nil {
		log.Debugf("Failed to receive project list: %v", err)
		return
	}

	for _, project := range projects {
		config := config.LoadConfig(client, project)
		if config == nil {
			log.Debugf("No project config found for %s", project.PathWithNamespace)
			continue
		}

		log.Debugf("Found Lassie config for %s", project.PathWithNamespace)

		for _, plugin := range loadedPlugins {
			log.Debugf("Running plugin '%s' on project '%s'", plugin.Name(), project.PathWithNamespace)
			plugin.Execute(project, *config)
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

	gitlabURL := os.Getenv("GITLAB_URL")
	if gitlabURL == "" {
		log.Fatal("Please provide a gitlab url with GITLAB_URL='https://gitlab.example.com'")
	}

	gitlabToken := os.Getenv("GITLAB_TOKEN")
	if gitlabToken == "" {
		log.Fatal("Please provide a gitlab token with GITLAB_TOKEN")
	}

	log.Info("Lassie is waking up '" + gitlabURL + "' ...")

	client, err := gitlab.NewClient(gitlabToken, gitlab.WithBaseURL(gitlabURL))
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}

	loadedPlugins = plugins.GetPlugins(client)

	log.Info("Lassie is now waiting for some work!")

	updateInterval := 30
	if os.Getenv("LOG") == "debug" {
		updateInterval = 5
	}

	s := gocron.NewScheduler(time.UTC)
	s.SetMaxConcurrentJobs(1, gocron.RescheduleMode)
	s.Every(updateInterval).Seconds().Do(func() {
		loop(client)
	})
	s.StartBlocking()
}

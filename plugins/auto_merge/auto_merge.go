package auto_merge

import (
	"fmt"
	"log"

	"github.com/xanzy/go-gitlab"
)

type AutoMergePlugin struct {
	Client *gitlab.Client
}

func (plugin AutoMergePlugin) Execute(project *gitlab.Project) {
	opt := &gitlab.ListProjectMergeRequestsOptions{
		State:  gitlab.String("opened"),
		Labels: []string{"👀 Ready for Review"},
	}

	mergeRequests, _, err := plugin.Client.MergeRequests.ListProjectMergeRequests(project.ID, opt)
	if err != nil {
		log.Fatal("Can't load merge-requests", err)
	}

	for _, mergeRequest := range mergeRequests {
		plugin.autoMerge(project, mergeRequest)
	}
}

func (plugin AutoMergePlugin) autoMerge(project *gitlab.Project, mergeRequest *gitlab.MergeRequest) {
	log.Println("trying >>>", mergeRequest.Title)

	status := plugin.checkMergeRequest(project, mergeRequest)
	if status.hasConflicts != mergeStatusSuccess ||
		status.openDicussions != mergeStatusSuccess ||
		status.passingPipeline != mergeStatusSuccess ||
		status.enoughApprovals != mergeStatusSuccess {
		plugin.updateStatusComment(project, mergeRequest, status)
		return
	}

	squashMessage := fmt.Sprintf("%s (!%d)", mergeRequest.Title, mergeRequest.IID)
	acceptMergeRequestOptions := &gitlab.AcceptMergeRequestOptions{
		SquashCommitMessage:      gitlab.String(squashMessage),
		ShouldRemoveSourceBranch: gitlab.Bool(true),
		Squash:                   gitlab.Bool(true),
	}
	plugin.Client.MergeRequests.AcceptMergeRequest(project.ID, mergeRequest.IID, acceptMergeRequestOptions)

	createMergeRequestNoteOptions := &gitlab.CreateMergeRequestNoteOptions{
		Body: gitlab.String(":dog: Thank you for your contribution. Looks great to me :feet:"),
	}
	plugin.Client.Notes.CreateMergeRequestNote(project.ID, mergeRequest.IID, createMergeRequestNoteOptions)

	plugin.updateStatusComment(project, mergeRequest, status)

	log.Println("merged >>>", squashMessage)
}

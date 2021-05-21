package auto_merge

import (
	"fmt"
	"log"

	"github.com/xanzy/go-gitlab"
)

type AutoMergePlugin struct {
	Client *gitlab.Client
}

// danger => :poop: :collision: :exclamation:
// success => :green_heart:
// skipped => :hourglass_flowing_sand:

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

	listMergeRequestNotesOptions := &gitlab.ListMergeRequestNotesOptions{}
	notes, _, _ := plugin.Client.Notes.ListMergeRequestNotes(project.ID, mergeRequest.IID, listMergeRequestNotesOptions)
	for _, note := range notes {
		if !note.System {
			log.Println(note.Author.Name, ":", note.Body)
		}
	}

	if mergeRequest.HasConflicts {
		return
	}

	if !mergeRequest.BlockingDiscussionsResolved {
		return
	}

	approvals, _, err := plugin.Client.MergeRequests.GetMergeRequestApprovals(project.ID, mergeRequest.IID)
	if err != nil {
		log.Fatal("Can't load merge-request approvals", err)
		return
	}

	if len(approvals.ApprovedBy) < 1 {
		return
	}

	pipelines, _, err := plugin.Client.MergeRequests.ListMergeRequestPipelines(project.ID, mergeRequest.IID)
	if err != nil {
		log.Fatal("Can't load merge-request pipelines", err)
		return
	}

	if pipelines[0].Status != "success" {
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

	log.Println("merged >>>", squashMessage)
}

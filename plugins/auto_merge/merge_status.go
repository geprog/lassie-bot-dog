package auto_merge

import (
	"regexp"

	log "github.com/sirupsen/logrus"
	"github.com/xanzy/go-gitlab"
)

const authorTag = "<!-- author:lassie-bot-dog -->"

func getMergeStatusLevelEmojis(mergeStatusLevel mergeStatusLevel) string {
	if mergeStatusLevel == mergeStatusSuccess {
		return ":green_heart:"
	}

	if mergeStatusLevel == mergeStatusFailed {
		return ":poop:" // :collision: :exclamation:
	}

	// mergeStatusLevel == mergeStatusSkipped
	return ":hourglass_flowing_sand:"
}

// func decodeMergeStatus(comment string) *mergeStatus {
// 	// TODO
// 	hasConflicts := mergeStatusFailed
// 	openDicussions := mergeStatusSkipped
// 	passingPipeline := mergeStatusSkipped
// 	enoughApprovals := mergeStatusSkipped

// 	return &mergeStatus{
// 		hasConflicts:    hasConflicts,
// 		openDicussions:  openDicussions,
// 		passingPipeline: passingPipeline,
// 		enoughApprovals: enoughApprovals,
// 	}
// }

func encodeMergeStatus(status *mergeStatus) string {
	comment := authorTag + "\n"
	comment = comment + "### Your current merge request status is:\n\n"
	comment = comment + "- " + getMergeStatusLevelEmojis(status.hasNeededLabels) + " Your merge request has all needed labels to be auto-merged\n"
	comment = comment + "- " + getMergeStatusLevelEmojis(status.isNotWorkInProgress) + " Your merge request is marked as ready (removed WIP: prefix)\n"
	comment = comment + "- " + getMergeStatusLevelEmojis(status.hasConflicts) + " Your changes do not have conflicts with the target branch\n"
	comment = comment + "- " + getMergeStatusLevelEmojis(status.openDicussions) + " All discussions about your changes have been resolved\n"
	comment = comment + "- " + getMergeStatusLevelEmojis(status.passingPipeline) + " A pipline successfully tested your code\n"
	comment = comment + "- " + getMergeStatusLevelEmojis(status.enoughApprovals) + " Enough reviewers liked your code\n"
	comment = comment + "---\nI am [Lassie](@lassie) :dog: and I will watch your progress from time to time to auto merge your changes once finished.\n"

	return comment
}

func (plugin AutoMergePlugin) updateStatusComment(project *gitlab.Project, mergeRequest *gitlab.MergeRequest, status *mergeStatus) {
	comment := ""
	note := plugin.getStatusComment(project, mergeRequest)
	// if note != nil {
	// 	comment = note.Body
	// }

	// lastStatus := decodeMergeStatus(comment)

	// if lastStatus == nil || !equalMergeStatus(status, lastStatus) {
	comment = encodeMergeStatus(status)
	plugin.saveStatusComment(project, mergeRequest, comment, note)
	// } else {
	// 	log.Println("skip")
	// }
}

func (plugin AutoMergePlugin) getStatusComment(project *gitlab.Project, mergeRequest *gitlab.MergeRequest) *gitlab.Note {
	listMergeRequestNotesOptions := &gitlab.ListMergeRequestNotesOptions{}
	notes, _, _ := plugin.Client.Notes.ListMergeRequestNotes(project.ID, mergeRequest.IID, listMergeRequestNotesOptions)

	r, _ := regexp.Compile("^" + authorTag + ".*?")

	for _, note := range notes {
		if !note.System && r.MatchString(note.Body) {
			return note
		}
	}

	return nil
}

func (plugin AutoMergePlugin) saveStatusComment(project *gitlab.Project, mergeRequest *gitlab.MergeRequest, comment string, note *gitlab.Note) {
	log.Debug("comment", comment)

	// update existing note
	if note != nil {
		updateMergeRequestNoteOptions := &gitlab.UpdateMergeRequestNoteOptions{
			Body: gitlab.String(comment),
		}
		plugin.Client.Notes.UpdateMergeRequestNote(project.ID, mergeRequest.IID, note.ID, updateMergeRequestNoteOptions)
		return
	}

	createMergeRequestNoteOptions := &gitlab.CreateMergeRequestNoteOptions{
		Body: gitlab.String(comment),
	}
	plugin.Client.Notes.CreateMergeRequestNote(project.ID, mergeRequest.IID, createMergeRequestNoteOptions)

}

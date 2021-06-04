package auto_merge

import (
	"regexp"
	"strings"

	log "github.com/sirupsen/logrus"
	"github.com/xanzy/go-gitlab"
)

const authorTag = "<!-- author:lassie-bot-dog -->"

func encodeMergeCheckStatus(mergeCheck mergeCheck, status *mergeStatus) string {
	for _, mergeCheckResult := range status.checkResults {
		if mergeCheckResult.mergeCheckName == mergeCheck.Name() {
			if mergeCheckResult.mergeCheckPassed {
				return "- :green_heart: " + mergeCheck.PassedText() + "\n"
			} else {
				// :collision: :exclamation:
				return "- :poop: " + mergeCheck.FailedText() + "\n"
			}
		}
	}

	return ""
}

func (plugin autoMergePlugin) encodeMergeStatus(status *mergeStatus) string {
	comment := authorTag + "\n"

	if status.merged {
		comment = comment + ":dog: Thank you for your contribution. Always nice to have some helping hands :feet:"
		comment = comment + "---\n"
		comment = comment + "I am [Lassie](@lassie) :dog: and I help with some housekeeping tasks.\n"
	} else {
		comment = comment + "### Your current merge request status is:\n\n"
		for _, mergeCheck := range plugin.mergeChecks() {
			comment = comment + encodeMergeCheckStatus(mergeCheck, status)
		}
		comment = comment + "---\n"
		comment = comment + "I am [Lassie](@lassie) :dog: and I will watch your progress from time to time to auto merge your changes once finished.\n"
	}

	// gitlab removes new-lines from the comments so we do so as well
	return strings.TrimSuffix(comment, "\n")
}

func (plugin autoMergePlugin) updateStatusComment(project *gitlab.Project, mergeRequest *gitlab.MergeRequest, status *mergeStatus) {
	note := plugin.getStatusComment(project, mergeRequest)
	comment := plugin.encodeMergeStatus(status)
	plugin.saveStatusComment(project, mergeRequest, comment, note)
}

func (plugin autoMergePlugin) getStatusComment(project *gitlab.Project, mergeRequest *gitlab.MergeRequest) *gitlab.Note {
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

func (plugin autoMergePlugin) saveStatusComment(project *gitlab.Project, mergeRequest *gitlab.MergeRequest, comment string, note *gitlab.Note) {
	log.Trace("comment", comment)

	// update existing note
	if note != nil {
		if note.Body == comment {
			log.Debug("comment is already up to date")
			return
		}

		updateMergeRequestNoteOptions := &gitlab.UpdateMergeRequestNoteOptions{
			Body: gitlab.String(comment),
		}
		plugin.Client.Notes.UpdateMergeRequestNote(project.ID, mergeRequest.IID, note.ID, updateMergeRequestNoteOptions)

		log.Debug("update comment")

		return
	}

	createMergeRequestNoteOptions := &gitlab.CreateMergeRequestNoteOptions{
		Body: gitlab.String(comment),
	}
	plugin.Client.Notes.CreateMergeRequestNote(project.ID, mergeRequest.IID, createMergeRequestNoteOptions)

	log.Debug("create comment")
}

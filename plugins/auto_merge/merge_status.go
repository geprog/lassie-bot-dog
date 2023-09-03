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
				return "- :green_heart: " + mergeCheck.PassedText(status.mergeRequestID) + "\n"
			}

			// :collision: :exclamation:
			return "- :poop: " + mergeCheck.FailedText(status.mergeRequestID) + "\n"
		}
	}

	return ""
}

func (plugin AutoMergePlugin) encodeMergeStatus(status *mergeStatus) string {
	comment := authorTag + "\n"

	if status.err != "" {
		comment = comment + ":warning: I am sorry but I sniffed something strange while checking your merge request:\n"
		comment = comment + "```\n"
		comment = comment + status.err + "\n"
		comment = comment + "```\n"
		comment = comment + "---\n"
	}

	if status.merged {
		comment = comment + ":dog: Thank you for your contribution. Always nice to have some helping hands :feet:\n"
		comment = comment + "---\n"
		comment = comment + "I am [Lassie](@lassie) :dog: and I help you with some housekeeping tasks.\n"
	} else {
		comment = comment + "### Your current merge request status is:\n\n"
		for _, mergeCheck := range mergeChecks {
			comment = comment + encodeMergeCheckStatus(mergeCheck, status)
		}
		comment = comment + "---\n"
		comment = comment + "I am [Lassie](@lassie) :dog: and I will watch your progress from time to time to auto merge your changes once finished.\n"
	}

	// gitlab removes new-lines from the comments so we do so as well
	return strings.TrimSuffix(comment, "\n")
}

func (plugin AutoMergePlugin) updateStatusComment(project *gitlab.Project, mergeRequest *gitlab.MergeRequest, status *mergeStatus) {
	note, err := plugin.getStatusComment(project, mergeRequest)
	if err != nil {
		log.Error("Failed to get status comment: ", err)
		return
	}
	comment := plugin.encodeMergeStatus(status)
	plugin.saveStatusComment(project, mergeRequest, comment, note)
}

func (plugin AutoMergePlugin) getStatusComment(project *gitlab.Project, mergeRequest *gitlab.MergeRequest) (*gitlab.Note, error) {
	listMergeRequestNotesOptions := &gitlab.ListMergeRequestNotesOptions{
		Sort: gitlab.String("asc"), // oldest first as lassie should do one of the first comments
	}
	r, _ := regexp.Compile("^" + authorTag + ".*?")

	for {
		notes, resp, err := plugin.Client.Notes.ListMergeRequestNotes(project.ID, mergeRequest.IID, listMergeRequestNotesOptions)

		if err != nil {
			return nil, err
		}

		for _, note := range notes {
			if !note.System && r.MatchString(note.Body) {
				return note, nil
			}
		}

		// Exit the loop when we've seen all pages
		if resp.CurrentPage >= resp.TotalPages {
			break
		}

		// Update the page number to get the next page
		listMergeRequestNotesOptions.Page = resp.NextPage
	}

	return nil, nil
}

func (plugin AutoMergePlugin) saveStatusComment(project *gitlab.Project, mergeRequest *gitlab.MergeRequest, comment string, note *gitlab.Note) {
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
		_, _, err := plugin.Client.Notes.UpdateMergeRequestNote(project.ID, mergeRequest.IID, note.ID, updateMergeRequestNoteOptions)
		if err != nil {
			log.Error("Failed to update merge request note")
		}

		log.Debug("update comment")

		return
	}

	createMergeRequestNoteOptions := &gitlab.CreateMergeRequestNoteOptions{
		Body: gitlab.String(comment),
	}
	_, _, err := plugin.Client.Notes.CreateMergeRequestNote(project.ID, mergeRequest.IID, createMergeRequestNoteOptions)
	if err != nil {
		log.Error("Failed to create merge request note")
	}

	log.Debug("create comment")
}

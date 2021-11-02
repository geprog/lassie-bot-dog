package auto_merge_test

import (
	"testing"

	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge"
)

func TestIsRefMergeRequest(t *testing.T) {
	ref := "refs/merge-requests/50/head"
	if !auto_merge.IsRefMergeRequest(ref) {
		t.Error()
	}

	ref = "refs/main"
	if auto_merge.IsRefMergeRequest(ref) {
		t.Error()
	}
}

func TestGetMergeRequestIdFromRef(t *testing.T) {
	ref := "refs/merge-requests/50/head"
	mergeRequestIID, err := auto_merge.GetMergeRequestIDFromRef(ref)
	if mergeRequestIID != 50 || err != nil {
		t.Error()
	}

	ref = "refs/main"
	mergeRequestIID, err = auto_merge.GetMergeRequestIDFromRef(ref)
	if mergeRequestIID != -1 || err == nil {
		t.Error()
	}
}

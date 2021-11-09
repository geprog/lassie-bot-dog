package utils_test

import (
	"testing"

	"github.com/GEPROG/lassie-bot-dog/utils"
)

func TestMin(t *testing.T) {
	if utils.Max(7, 1) != 7 {
		t.Error()
	}

	if utils.Max(5, 99) != 99 {
		t.Error()
	}

	if utils.Max(3, 3) != 3 {
		t.Error()
	}
}

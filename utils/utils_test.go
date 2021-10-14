package utils_test

import (
	"testing"

	"github.com/GEPROG/lassie-bot-dog/utils"
)

func TestMin(t *testing.T) {
	if utils.Min(7, 1) != 7 {
		t.Error()
	}

	if utils.Min(5, 99) != 99 {
		t.Error()
	}

	if utils.Min(3, 3) != 3 {
		t.Error()
	}
}

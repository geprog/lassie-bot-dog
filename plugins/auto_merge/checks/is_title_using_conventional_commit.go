package checks

import (
	"regexp"

	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/config"
	"github.com/xanzy/go-gitlab"
)

var conventionalCommitSpecURL = "https://www.conventionalcommits.org/en/v1.0.0/#specification"
var ConventionalCommitRegex = regexp.MustCompile(`^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(?:\((.*)\))?(\!)?\: (.*)$`)

type IsTitleUsingConventionalCommit struct {
}

func (check IsTitleUsingConventionalCommit) Check(config *config.AutoMergeConfig, project *gitlab.Project, mergeRequest *gitlab.MergeRequest) bool {
	return ConventionalCommitRegex.MatchString(mergeRequest.Title)
}

func (check IsTitleUsingConventionalCommit) Name() string {
	return "is-title-using-conventional-commit"
}

func (check IsTitleUsingConventionalCommit) PassedText(mergeRequestID int) string {
	return "Your Merge-Request title is using [conventional commit syntax](" + conventionalCommitSpecURL + ")"
}

func (check IsTitleUsingConventionalCommit) FailedText(mergeRequestID int) string {
	return "Your Merge-Request is NOT using [conventional commit syntax](" + conventionalCommitSpecURL + ")"
}

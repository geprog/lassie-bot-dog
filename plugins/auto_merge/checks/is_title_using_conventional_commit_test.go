package checks_test

import (
	"testing"

	"github.com/GEPROG/lassie-bot-dog/plugins/auto_merge/checks"
)

func TestConventionalCommitSyntax(t *testing.T) {
	// correct commit messages
	commitMessage := "fix: do some cool stuff"
	if !checks.ConventionalCommitRegex.MatchString(commitMessage) {
		t.Error()
	}

	commitMessage = "feat: allow provided config object to extend other configs"
	if !checks.ConventionalCommitRegex.MatchString(commitMessage) {
		t.Error()
	}

	commitMessage = "refactor!: drop support for Node 6"
	if !checks.ConventionalCommitRegex.MatchString(commitMessage) {
		t.Error()
	}

	commitMessage = "refactor(runtime)!: drop support for Node 6"
	if !checks.ConventionalCommitRegex.MatchString(commitMessage) {
		t.Error()
	}

	commitMessage = "docs: correct spelling of CHANGELOG"
	if !checks.ConventionalCommitRegex.MatchString(commitMessage) {
		t.Error()
	}

	commitMessage = "feat(lang): add polish language"
	if !checks.ConventionalCommitRegex.MatchString(commitMessage) {
		t.Error()
	}

	commitMessage = "fix: correct minor typos in code"
	if !checks.ConventionalCommitRegex.MatchString(commitMessage) {
		t.Error()
	}

	commitMessage = "feat: :sparkles: check merge-request titles for conventional commit syntax"
	if !checks.ConventionalCommitRegex.MatchString(commitMessage) {
		t.Error()
	}

	// incorrect commit messages
	commitMessage = "feat:without space"
	if checks.ConventionalCommitRegex.MatchString(commitMessage) {
		t.Error()
	}

	commitMessage = "bug: incorrect type"
	if checks.ConventionalCommitRegex.MatchString(commitMessage) {
		t.Error()
	}

	commitMessage = "bug?: incorrect breaking symbol"
	if checks.ConventionalCommitRegex.MatchString(commitMessage) {
		t.Error()
	}
}

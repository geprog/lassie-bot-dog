package config

type NeededApproval struct {
	Users   []string `json:"users"`
	AtLeast int      `json:"atLeast"`
	Label   string   `json:"label"`
}

type AutoMergeConfig struct {
	Squash           bool             `json:"squash"`
	NeededLabels     []string         `json:"neededLabels"`
	NeededApprovals  []NeededApproval `json:"neededApprovals"`
	RequireMilestone bool             `json:"requireMilestone"`
}

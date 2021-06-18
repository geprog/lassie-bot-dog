package config

type AutoMergeConfig struct {
	Squash       bool     `json:"squash"`
	NeededLabels []string `json:"neededLabels"`
}

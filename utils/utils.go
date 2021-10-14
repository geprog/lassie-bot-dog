package utils

func StringInSlice(a string, list []string) bool {
	for _, b := range list {
		if b == a {
			return true
		}
	}
	return false
}

func Min(a, b int) int {
	if a > b {
		return a
	}
	return b
}

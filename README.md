# Lassie

> :dog: Lassie loves :hotdog: `s and her doghouse is in the garden of Gitlab,
 but as a Rough Collie she has more to offer:

- She can check your progress on Merge-Requests, merge them and hand out treats for diligent contributors
- More to come ...

## Installation

### Create new Gitlab account for lassie

TBD :thinking:

### Install lassie with helm

```bash
helm repo add lassie-bot-dog https://geprog.github.io/lassie-bot-dog/
helm search repo lassie-bot-dog
helm install lassie-bot-dog lassie-bot-dog/lassie-bot-dog
```

## Project setup

1. Grant your lassie bot account access to the project / repository
1. Add a config file for lassie ([Config-file docs](#config))

## Config

Lassie can be controlled with a config file. To enable lassie for a project you have to create this file called `lassie.json` at the top-level of the repository.

```json5
{
  "plugins": {
    "auto_merge": {
      "squash": true,
      "neededLabels": ["👀 Ready for Review"]
    }
  }
}
```
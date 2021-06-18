# Lassie

> :dog: Lassie loves :hotdog: `s and her doghouse is in the garden of Gitlab,
 but as a Rough Collie she has more to offer:

- She can check your progress on Merge-Requests, merge them and hand out treats for diligent contributors
- More to come ...

## Installation

### Create new Gitlab account for Lassie

First, create a user for Lassie on your GitLab. We'll use `lassie` as username.

### Create Gitlab api-token

TBD

### Install Lassie with helm

[Helm](https://helm.sh) must be installed to use the charts. Please refer to
Helm's [documentation](https://helm.sh/docs) to get started.

Once Helm has been set up correctly, add the repo as follows:

```bash
helm repo add lassie-bot-dog https://geprog.github.io/lassie-bot-dog/
```

If you had already added this repo earlier, run `helm repo update` to retrieve
the latest versions of the packages.

You can then run `helm search repo lassie-bot-dog` to see the charts.

To install the `lassie-bot-dog` chart:

```bash
helm install my-lassie-bot-dog lassie-bot-dog/lassie-bot-dog
```

To uninstall the chart:

```bash
helm delete my-lassie-bot-dog
```

## Project setup

1. Add Lassie to your projects as Developer or Maintainer, the latter being required if she should be able to merge to protected branches
1. Add a config file for Lassie ([Config-file docs](#config))

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

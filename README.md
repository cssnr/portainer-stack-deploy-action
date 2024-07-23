[![Tags](https://img.shields.io/github/actions/workflow/status/cssnr/portainer-stack-deploy-action/tags.yaml?logo=github&logoColor=white&label=tags)](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/tags.yaml)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/portainer-stack-deploy-action?logo=github)](https://github.com/cssnr/portainer-stack-deploy-action/releases/latest)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/portainer-stack-deploy-action?logo=htmx&logoColor=white)](https://github.com/cssnr/portainer-stack-deploy-action)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&logoColor=white)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)

# Portainer Stack Deploy Action

Deploy or Update a Portainer Stack from a GitHub Repository. Currently, supports repository and file deployments and
updates.

This action is written from the ground up in VanillaJS and is not a fork/clone of existing actions.

* [Inputs](#Inputs)
* [Examples](#Examples)
* [Known Issues](#Known-Issues)
* [Support](#Support)
* [Contributing](#Contributing)

> [!NOTE]   
> Please submit
> a [Feature Request](https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/cssnr/portainer-stack-deploy-action/issues) if you find any
> bugs.

## Inputs

| input    | required | default           | description           |
|----------|----------|-------------------|-----------------------|
| token    | **Yes**  | -                 | Portainer Token *     |
| url      | **Yes**  | -                 | Portainer URL         |
| name     | **Yes**  | -                 | Stack Name            |
| file     | No       | `compose.yaml`    | Compose File          |
| endpoint | No       | `endpoints[0].Id` | Portainer Endpoint *  |
| ref      | No       | `current ref`     | Repository Ref *      |
| repo     | No       | `current repo`    | Repository URL *      |
| tlsskip  | No       | `false`           | Skip Repo TLS Verify  |
| prune    | No       | `true`            | Prune Services        |
| pull     | No       | `true`            | Pull Images           |
| type     | No       | `repo`            | Type `[repo, file]` * |
| env_json | No       | -                 | Dotenv JSON Data *    |
| env_file | No       | -                 | Dotenv File Path *    |
| username | No       | -                 | Repository Username * |
| password | No       | -                 | Repository Password * |

**token** - To create a Portainer API token see: https://docs.portainer.io/api/access

**endpoint** - If `endpoint` is not provided the first endpoint returned by the API will be used.
If you only have one endpoint, this will work as expected, otherwise, you should provide an endpoint.

**ref** - If you want to deploy a different ref than the one triggering the workflow.
Useful if you are deploying from another repository. Example: `refs/heads/master`

**repo** - This defaults to the repository running the action. If you want to deploy a different repository
put the full http URL to that repository here.

**type** - Type of Deployment. Currently, supports either `repo` or `file`.

**env_json/env_file** - Optional environment variables used when creating the stack. File should be in dotenv format and
JSON should be an object. Example: `{"var_name": "Test Value"}`

**username/password** - Only set these if the `repo` is private and requires authentication.
This is NOT the Portainer username/password, see `token` for Portainer authentication.

```yaml
  - name: "Portainer Deploy"
    uses: cssnr/portainer-stack-deploy-action@v1
    with:
      token: ${{ secrets.PORTAINER_TOKEN }}
      url: https://portainer.example.com:9443
      name: stack-name
      file: docker-compose.yaml
```

## Examples

Deploying a repository other than the current repository:

```yaml
  - name: "Portainer Deploy"
    uses: cssnr/portainer-stack-deploy-action@v1
    with:
      token: ${{ secrets.PORTAINER_TOKEN }}
      url: https://portainer.example.com:9443
      name: stack-name
      file: docker-compose.yaml
      repo: https://github.com/user/some-other-repo
      ref: refs/heads/master
```

Deploy from compose file and not repository:

```yaml
  - name: "Portainer Deploy"
    uses: cssnr/portainer-stack-deploy-action@v1
    with:
      token: ${{ secrets.PORTAINER_TOKEN }}
      url: https://portainer.example.com:9443
      name: stack-name
      file: docker-compose.yaml
      type: file
```

To include this in a general workflow but only run on release events use an if:

- `if: ${{ github.event_name == 'release' }}`

```yaml
  - name: "Portainer Deploy"
    uses: cssnr/portainer-stack-deploy-action@v1
    if: ${{ github.event_name == 'release' }}
    with:
      token: ${{ secrets.PORTAINER_TOKEN }}
      url: https://portainer.example.com:9443
      name: stack-name
      file: docker-compose.yaml
```

This example builds a docker image using BuildX Bake, then pushes and deploys to Portainer.

```yaml
name: "Build"

on:
  workflow_dispatch:
  push:
    branches:
      - master

jobs:
  build:
    name: "Build"
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      packages: write

    steps:
      - name: "Checkout"
        uses: actions/checkout@v4

      - name: "Docker Login"
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ vars.GHCR_USER }}
          password: ${{ secrets.GHCR_PASS }}

      - name: "Setup Buildx"
        uses: docker/setup-buildx-action@v2
        with:
          platforms: linux/amd64,linux/arm64

      - name: "Bake and Push"
        uses: docker/bake-action@v5
        with:
          push: true
          files: docker-compose-build.yaml

      - name: "Portainer Deploy"
        uses: cssnr/portainer-stack-deploy-action@v1
        with:
          token: ${{ secrets.PORTAINER_TOKEN }}
          url: https://portainer.example.com
          name: stack-name
          file: docker-compose-swarm.yaml
```

## Known Issues

- Does not support additional variables, but will be added once
  a [feature request](https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/feature-requests) is
  made.

This is a fairly simple action, for more details see
[src/index.js](src%2Findex.js) and [src/portainer.js](src%2Fportainer.js).

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/portainer-stack-deploy-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General
  Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Portainer%20Stack%20Deploy)

# Contributing

Currently, the best way to contribute to this project is to star this project on GitHub.

Additionally, you can support other GitHub Actions I have published:

- [VirusTotal Action](https://github.com/cssnr/virustotal-action)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action)
- [Portainer Stack Deploy](https://github.com/cssnr/portainer-stack-deploy-action)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action)

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)

[![Tags](https://img.shields.io/github/actions/workflow/status/cssnr/portainer-stack-deploy-action/tags.yaml?logo=github&logoColor=white&label=tags)](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/tags.yaml)
[![Test](https://img.shields.io/github/actions/workflow/status/cssnr/portainer-stack-deploy-action/test.yaml?logo=github&logoColor=white&label=test)](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/test.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_portainer-stack-deploy-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_portainer-stack-deploy-action)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/portainer-stack-deploy-action?logo=github)](https://github.com/cssnr/portainer-stack-deploy-action/releases/latest)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/portainer-stack-deploy-action?logo=github&logoColor=white&label=updated)](https://github.com/cssnr/portainer-stack-deploy-action/graphs/commit-activity)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/portainer-stack-deploy-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/portainer-stack-deploy-action)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/portainer-stack-deploy-action?logo=htmx&logoColor=white)](https://github.com/cssnr/portainer-stack-deploy-action)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&logoColor=white)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)

# Portainer Stack Deploy Action

Deploy or Update a Portainer Stack from a Repository or Compose File. Supports most features including specifying the
repository, compose file, environment variables and much more...

This action is written from the ground up in VanillaJS and is not a fork/clone of existing actions.

-   [Inputs](#Inputs)
-   [Outputs](#Outputs)
-   [Examples](#Examples)
-   [Troubleshooting](#Troubleshooting)
-   [Support](#Support)
-   [Contributing](#Contributing)

> [!NOTE]  
> Please submit
> a [Feature Request](https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/cssnr/portainer-stack-deploy-action/issues) if you find any
> bugs.

## Inputs

| input      | required | default               | description             |
| ---------- | -------- | --------------------- | ----------------------- |
| token      | **Yes**  | -                     | Portainer Token \*      |
| url        | **Yes**  | -                     | Portainer URL           |
| name       | **Yes**  | -                     | Stack Name              |
| file       | No       | `docker-compose.yaml` | Compose File            |
| endpoint   | No       | `endpoints[0].Id`     | Portainer Endpoint \*   |
| ref        | No       | `current reference`   | Repository Ref \*       |
| repo       | No       | `current repository`  | Repository URL \*       |
| tlsskip    | No       | `false`               | Skip Repo TLS Verify    |
| prune      | No       | `true`                | Prune Services          |
| pull       | No       | `true`                | Pull Images             |
| type       | No       | `repo`                | Type `[repo, file]` \*  |
| standalone | No       | `false`               | Deploy Standalone Stack |
| env_json   | No       | -                     | Dotenv JSON Data \*     |
| env_file   | No       | -                     | Dotenv File Path \*     |
| username   | No       | -                     | Repository Username \*  |
| password   | No       | -                     | Repository Password \*  |

**token** - To create a Portainer API token see: https://docs.portainer.io/api/access

**endpoint** - If `endpoint` is not provided the first endpoint returned by the API will be used.
If you only have one endpoint, this will work as expected, otherwise, you should provide an endpoint.

**ref** - If you want to deploy a different ref than the one triggering the workflow.
Useful if you are deploying from another repository. Example: `refs/heads/master`

**repo** - This defaults to the repository running the action. If you want to deploy a different repository
put the full http URL to that repository here.

**type** - Type of Deployment. Currently, supports either `repo` or `file`.

**env_json/env_file** - Optional environment variables used when creating the stack. File should be in dotenv format and
JSON should be an object. Example: `{"KEY": "Value"}`

**username/password** - Only set these if the `repo` is private and requires authentication.
This is NOT the Portainer username/password, see `token` for Portainer authentication.

```yaml
- name: 'Portainer Deploy'
  uses: cssnr/portainer-stack-deploy-action@v1
  with:
      token: ${{ secrets.PORTAINER_TOKEN }}
      url: https://portainer.example.com:9443
      name: stack-name
      file: docker-compose.yaml
```

For more information on variables, see the Portainer API
Documentation: https://app.swaggerhub.com/apis/portainer/portainer-ce/2.19.5

## Outputs

| output     | description |
| ---------- | ----------- |
| stackID    | Stack ID    |
| swarmID    | Swarm ID    |
| endpointID | Endpoint ID |

```yaml
- name: 'Portainer Deploy'
  id: stack
  uses: cssnr/portainer-stack-deploy-action@v1
  with:
      token: ${{ secrets.PORTAINER_TOKEN }}
      url: https://portainer.example.com:9443
      name: stack-name

- name: 'Echo Output'
  run: |
      echo 'stackID: ${{ steps.stack.outputs.stackID }}'
      echo 'swarmID: ${{ steps.stack.outputs.swarmID }}'
      echo 'endpointID: ${{ steps.stack.outputs.endpointID }}'
```

## Examples

Deploying a repository other than the current repository:

```yaml
- name: 'Portainer Deploy'
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
- name: 'Portainer Deploy'
  uses: cssnr/portainer-stack-deploy-action@v1
  with:
      token: ${{ secrets.PORTAINER_TOKEN }}
      url: https://portainer.example.com:9443
      name: stack-name
      file: docker-compose.yaml
      type: file
```

Specify environment variables, may use json, or file, or a combination of both:

```yaml
- name: 'Portainer Deploy'
  uses: cssnr/portainer-stack-deploy-action@v1
  with:
      token: ${{ secrets.PORTAINER_TOKEN }}
      url: https://portainer.example.com:9443
      name: stack-name
      file: docker-compose.yaml
      type: file
      env_json: '{"KEY": "Value"}'
      env_file: .env
```

To include this in a general workflow but only run on release events use an if:

-   `if: ${{ github.event_name == 'release' }}`

```yaml
- name: 'Portainer Deploy'
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
name: 'Build'

on:
    workflow_dispatch:
    push:
        branches:
            - master

jobs:
    build:
        name: 'Build'
        runs-on: ubuntu-latest
        timeout-minutes: 15
        permissions:
            contents: read
            packages: write

        steps:
            - name: 'Checkout'
              uses: actions/checkout@v4

            - name: 'Docker Login'
              uses: docker/login-action@v2
              with:
                  registry: ghcr.io
                  username: ${{ vars.GHCR_USER }}
                  password: ${{ secrets.GHCR_PASS }}

            - name: 'Setup Buildx'
              uses: docker/setup-buildx-action@v2
              with:
                  platforms: linux/amd64,linux/arm64

            - name: 'Bake and Push'
              uses: docker/bake-action@v5
              with:
                  push: true
                  files: docker-compose-build.yaml

            - name: 'Portainer Deploy'
              uses: cssnr/portainer-stack-deploy-action@v1
              with:
                  token: ${{ secrets.PORTAINER_TOKEN }}
                  url: https://portainer.example.com
                  name: stack-name
                  file: docker-compose-swarm.yaml
```

This is a fairly simple action, for more details see
[src/index.js](src/index.js) and [src/portainer.js](src/portainer.js).

## Troubleshooting

Some common errors you might see:

-   No such image: ghcr.io/user/repo-name:tag

Make sure your package is not private. If you intend to use a private package, then:  
Go to Portainer Registries: https://portainer.example.com/#!/registries/new  
Choose Custom registry, set `ghcr.io` for Registry URL, enable authentication, and add your username/token.

-   Error: Resource not accessible by integration

Only applies to `build-push-action` or `bake-action` type actions, not this action.  
Go to your repository action settings: https://github.com/user/repo/settings/actions  
Make sure Workflow permissions are set to Read and write permissions.

# Support

For general help or to request a feature, see:

-   Q&A Discussion: https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/q-a
-   Request a Feature: https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

-   Report an Issue: https://github.com/cssnr/portainer-stack-deploy-action/issues
-   Chat with us on Discord: https://discord.gg/wXy6m2X8wY
-   Provide General
    Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Portainer%20Stack%20Deploy)

# Contributing

Currently, the best way to contribute to this project is to star this project on GitHub.

Additionally, you can support other GitHub Actions I have published:

-   [VirusTotal Action](https://github.com/cssnr/virustotal-action)
-   [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action)
-   [Update JSON Value Action](https://github.com/cssnr/update-json-value-action)
-   [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action)
-   [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action)
-   [Portainer Stack Deploy](https://github.com/cssnr/portainer-stack-deploy-action)
-   [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action)

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)

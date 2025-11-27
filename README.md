[![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/portainer-stack-deploy-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/portainer-stack-deploy-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/portainer-stack-deploy-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/portainer-stack-deploy-action/releases)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/portainer-stack-deploy-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/portainer-stack-deploy-action/releases/latest)
[![GitHub Dist Size](https://img.shields.io/github/size/cssnr/portainer-stack-deploy-action/dist%2Findex.js?logo=bookstack&logoColor=white&label=dist%20size)](https://github.com/cssnr/portainer-stack-deploy-action/blob/master/src)
[![Action Run Using](https://img.shields.io/badge/dynamic/yaml?url=https%3A%2F%2Fraw.githubusercontent.com%2Fcssnr%2Fportainer-stack-deploy-action%2Frefs%2Fheads%2Fmaster%2Faction.yml&query=%24.runs.using&logo=githubactions&logoColor=white&label=runs)](https://github.com/cssnr/portainer-stack-deploy-action/blob/master/action.yml)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/cssnr/portainer-stack-deploy-action/release.yaml?logo=cachet&label=release)](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/release.yaml)
[![Workflow Test](https://img.shields.io/github/actions/workflow/status/cssnr/portainer-stack-deploy-action/test.yaml?logo=cachet&label=test)](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/test.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/cssnr/portainer-stack-deploy-action/lint.yaml?logo=cachet&label=lint)](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_portainer-stack-deploy-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_portainer-stack-deploy-action)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/portainer-stack-deploy-action?logo=github&label=updated)](https://github.com/cssnr/portainer-stack-deploy-action/pulse)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/portainer-stack-deploy-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/portainer-stack-deploy-action)
[![Docs Last Commit](https://img.shields.io/github/last-commit/cssnr/portainer-stack-deploy-docs?logo=vitepress&logoColor=white&label=docs)](https://portainer-deploy.cssnr.com/)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/cssnr/portainer-stack-deploy-action?logo=bookstack&logoColor=white&label=repo%20size)](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/portainer-stack-deploy-action?logo=htmx)](https://github.com/cssnr/portainer-stack-deploy-action/blob/master/src)
[![GitHub Contributors](https://img.shields.io/github/contributors-anon/cssnr/portainer-stack-deploy-action?logo=github)](https://github.com/cssnr/portainer-stack-deploy-action/graphs/contributors)
[![GitHub Discussions](https://img.shields.io/github/discussions/cssnr/portainer-stack-deploy-action?logo=github)](https://github.com/cssnr/portainer-stack-deploy-action/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/portainer-stack-deploy-action?style=flat&logo=github)](https://github.com/cssnr/portainer-stack-deploy-action/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/portainer-stack-deploy-action?style=flat&logo=github)](https://github.com/cssnr/portainer-stack-deploy-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# Portainer Stack Deploy Action

<a title="Portainer Stack Deploy" href="https://portainer-deploy.cssnr.com/" target="_blank">
<img alt="Portainer Stack Deploy" align="right" width="128" height="auto" src="https://raw.githubusercontent.com/cssnr/portainer-stack-deploy-docs/refs/heads/master/docs/public/images/logo/logo.png"></a>

- [Features](#Features)
- [Inputs](#Inputs)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Troubleshooting](#Troubleshooting)
- [Tags](#Tags)
- [Support](#Support)
- [Contributing](#Contributing)

Deploy, Update or Create a Portainer Stack from a Repository or Compose File.
Supports both Swarm and Standalone Docker deployments for Portainer Community and Business Enterprise Edition.
Includes most [features](#features) including file or repo deploy, deploy from other repo, custom headers, and much more...

This action is written from the ground up in Vanilla JavaScript and is not a fork/clone of existing actions.
You can view an [Action Comparison](https://portainer-deploy.cssnr.com/guides/features#action-comparison) of all available actions on the website.

> [!TIP]  
> ▶️ View the [Getting Started Guide](https://portainer-deploy.cssnr.com/guides/get-started) on the website.

```yaml
- name: 'Portainer Deploy'
  uses: cssnr/portainer-stack-deploy-action@v1
  with:
    name: stack-name
    file: docker-compose.yaml
    url: ${{ secrets.PORTAINER_URL }}
    token: ${{ secrets.PORTAINER_TOKEN }}
```

Make sure to review the [Inputs](#inputs) and checkout additional [Examples](#examples).

This is a fairly simple action, for more details see [src/index.js](src/index.js) and [src/portainer.js](src/portainer.js).

_No Portainer? You can deploy directly to Docker Swarm or Compose over SSH with: [cssnr/stack-deploy-action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
or [cssnr/docker-context-action](https://github.com/cssnr/docker-context-action?tab=readme-ov-file#readme)._

## Features

- Deploy or re-deploy an existing stack otherwise create a new stack.
- Deploy from a repository or a compose file, see [type](https://portainer-deploy.cssnr.com/docs/inputs#type).
- Deploy from a different [repo](https://portainer-deploy.cssnr.com/docs/inputs#repo) than the current one.
- Provide environment variables in [JSON/YAML](https://portainer-deploy.cssnr.com/docs/inputs#env_data) or [file](https://portainer-deploy.cssnr.com/docs/inputs#env_data) format.
- Automatically parse [Endpoint ID](https://portainer-deploy.cssnr.com/docs/inputs#endpoint) if only one endpoint.
- Supports Docker Swarm and Docker [Standalone](https://portainer-deploy.cssnr.com/docs/inputs#standalone).
- Supports custom [headers](https://portainer-deploy.cssnr.com/docs/inputs#headers) for services like Cloudflare Zero Trust.
- **To view all features see the [Inputs Documentation](https://portainer-deploy.cssnr.com/docs/inputs).**

You can [get started here](https://portainer-deploy.cssnr.com/guides/get-started) or view [workflow examples](https://portainer-deploy.cssnr.com/guides/examples).

## Inputs

> [!IMPORTANT]  
> Visit the [Documentation Site](https://portainer-deploy.cssnr.com/) for comprehensive, up-to-date documentation.

| Input      | Default&nbsp;Value    | Description&nbsp;of&nbsp;the&nbsp;Input     |
| :--------- | :-------------------- | :------------------------------------------ |
| name       | _Required_            | Stack Name [⤵️](#name)                      |
| url        | _Required_            | Portainer URL [⤵️](#url)                    |
| token      | _Required_            | Portainer Token [⤵️](#token)                |
| file       | `docker-compose.yaml` | Compose File [⤵️](#file)                    |
| endpoint   | `endpoints[0].Id`     | Portainer Endpoint [⤵️](#endpoint)          |
| ref        | `current reference`   | Repository Ref [⤵️](#ref)                   |
| repo       | `current repository`  | Repository URL [⤵️](#repo)                  |
| tlsskip    | `false`               | Skip Repo TLS Verify                        |
| prune      | `true`                | Prune Services                              |
| pull       | `true`                | Pull Images                                 |
| type       | `repo`                | Type [`repo`, `file`] [⤵️](#type)           |
| standalone | `false`               | Deploy Standalone Stack                     |
| env_data   | -                     | Env JSON/YAML Data [⤵️](#env_data)          |
| env_json   | **DEPRECATED**        | This has changed to [env_data](#env_data)   |
| env_file   | -                     | Dotenv File Path [⤵️](#env_file)            |
| merge_env  | `false`               | Merge Env Vars [⤵️](#merge_env)             |
| username   | -                     | Repository Username [⤵️](#usernamepassword) |
| password   | -                     | Repository Password [⤵️](#usernamepassword) |
| fs_path    | -                     | Relative Path (BE) [⤵️](#fs_path)           |
| headers    | -                     | Custom Headers JSON/YAML [⤵️](#headers)     |
| summary    | `true`                | Add Summary to Job [⤵️](#summary)           |

> For more details, see the [Inputs Documentation](https://portainer-deploy.cssnr.com/docs/inputs)
> and [Portainer API Documentation](https://app.swaggerhub.com/apis/portainer/portainer-ce/).

#### name

Swarm sack name or Compose project name.

Example: `cool-stack`

#### url

Portainer URL.

This is the base url to your Portainer instance.

Example: `https://portainer.example.com:9443`

#### token

Portainer API token.

For Instructions to create an API token visit: https://docs.portainer.io/api/access

#### file

The Docker compose file. This path is relative to your working directory.

If you check out your repository to the root, and the compose file is called `docker-compose.yaml`, and is in the `app` directory, set `file` to: `app/docker-compose.yaml`

Default: `docker-compose.yaml`

#### endpoint

If endpoint is not provided the first endpoint returned by the API will be used.
If you only have one endpoint, this will work as expected, otherwise, you should provide an endpoint.

Example: `1`

Default: `${endpoints[0]}`

#### ref

This defaults to the reference that triggered the workflow.

If deploying from a different repository than the current one, you may want to specify the `ref` of that repository to deploy from.

Example: `refs/heads/master`

Default: <span v-pre>`${{ github.ref }}`</span>

#### repo

This defaults to the repository running the action.

If you want to deploy a different repository, put the full http URL to that repository.

Example: `https://github.com/cssnr/portainer-stack-deploy-action`

Default: <span v-pre>`${{ github.server_url }}/${{ github.repository }}`</span>

#### tlsskip

Skips SSL verification when cloning the Git repository.
Set to `true` to enable.

Default: `false`

#### prune

Prune services that are no longer referenced (only available for Swarm stacks).
Set to `false` to disable.

Default: `true`

#### pull

Pull latest image before deploy. Set to `false` to disable.

Default: `true`

#### type

Type of Deployment. Supports either `repo` or `file`.

Default: `repo`

#### standalone

Deploy a **compose** stack instead of _swarm_. Set to `true` to enable.

Default: `false`

#### env_data

Optional environment variables used when creating the stack.

These can be provided in JSON or YAML format and can be used with [env_file](#env_file).
Values in [env_file](#env_file) take precedence over these values.

<details><summary>👀 View Example JSON/YAML Data Format</summary>

These examples are identical, just different ways of passing the input.

```yaml
data: |
  {
    "key1": "value1",
    "key2": "value2"
  }
```

```yaml
data: |
  key1: value1
  key2: value2
```

</details>

> [!WARNING]  
> Inputs are NOT secure unless using secrets or secure output.
> Using `env_data` on a public repository will otherwise expose this data.
> To securely pass an environment use the `env_file` option.

#### env_file

Environment File in [dotenv](https://www.npmjs.com/package/dotenv) format, parsed using [dotenv](https://www.npmjs.com/package/dotenv).

This can be used with [env_data](#env_data). Values in this file take precedence over [env_data](#env_data).

<details><summary>👀 View Environment File Example</summary>

```yaml
- uses: cssnr/portainer-stack-deploy-action@v1
  with:
    env_file: .env
```

```dotenv
KEY="Value"
KEY_2="Value 2"
```

Note: Additional [inputs](../docs/inputs.md) are excluded for brevity.

</details>

#### merge_env

Set this to `true` to merge the current environment variables from the existing stack
with any newly provided variables in the [env_data](#env_data) or [env_file](#env_file) inputs.

When not providing the [env_data](#env_data) or [env_file](#env_file) inputs the
current environment variables from the existing stack are always used.

When deploying a new stack, there are no current environment variables to merge, and this has no effect.

Default: `false`

#### username/password

Username for private repository authentication when [type](#type) is set to `repo`.

This is **NOT** your Portainer username, see [token](#token) for Portainer authentication.

#### fs_path

Relative Path Support for Portainer BE.
Set this to enable relative path volumes support for volume mappings in your compose file.

_For more info see the [Portainer Documentation - Relative Path Support](https://docs.portainer.io/advanced/relative-paths)._

#### headers

Custom Headers in JSON or YAML format for services like Cloudflare Zero Trust.

The `headers` are parsed with `JSON.parse` or `yaml.load` and passed directly to axios.

<details><summary>👀 View Custom Headers Example</summary>

YAML

```yaml
- uses: cssnr/portainer-stack-deploy-action@v1
  with:
    env_data: |
      CF-Access-Client-Id: ${{ secrets.CF_CLIENT_ID }}
      CF-Access-Client-Secret: ${{ secrets.CF_CLIENT_SECRET }}
```

Multi-Line JSON

```yaml
- uses: cssnr/portainer-stack-deploy-action@v1
  with:
    env_data: |
      {
        "CF-Access-Client-Id": "${{ secrets.CF_CLIENT_ID }}",
        "CF-Access-Client-Secret": "${{ secrets.CF_CLIENT_SECRET }}"
      }
```

toJSON Output

```yaml
- uses: cssnr/portainer-stack-deploy-action@v1
  with:
    env_data: ${{ toJSON(steps.import-secrets.outputs) }}
```

</details>

#### summary

Write a Summary for the job. To disable this set to `false`.

To view a workflow run, click on a recent [Test](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/test.yaml) job _(requires login)_.

<details><summary>👀 View Example Job Summary</summary>

---

🎉 **Created** New Stack 112: `test_portainer-stack-deploy`

<details><summary>Stack Details</summary><table><tr><th>Item</th><th>Value</th></tr><tr><td>ID</td><td>112</td></tr><tr><td>Name</td><td>test_portainer-stack-deploy</td></tr><tr><td>File</td><td>docker-compose.yml</td></tr><tr><td>Type</td><td>Swarm</td></tr><tr><td>Status</td><td>Active</td></tr><tr><td>Created</td><td>2/28/2025, 3:09:16 AM</td></tr><tr><td>Updated</td><td>-</td></tr><tr><td>Path</td><td>/data/compose/112</td></tr><tr><td>EndpointID</td><td>1</td></tr><tr><td>SwarmID</td><td>wr8i8agdr05n6wsf1tkcnhwik</td></tr></table></details>

---

</details>

> [!TIP]  
> View the [Inputs Documentation](https://portainer-deploy.cssnr.com/docs/inputs) for more details.

```yaml
- name: 'Portainer Deploy'
  uses: cssnr/portainer-stack-deploy-action@v1
  with:
    token: ${{ secrets.PORTAINER_TOKEN }}
    url: https://portainer.example.com:9443
    name: stack-name
    file: docker-compose.yaml
```

## Outputs

| Output     | Output&nbsp;Description |
| :--------- | :---------------------- |
| stackID    | Resulting Stack ID      |
| swarmID    | Resulting Swarm ID      |
| endpointID | Endpoint ID             |

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
    echo "stackID: '${{ steps.stack.outputs.stackID }}'"
    echo "swarmID: '${{ steps.stack.outputs.swarmID }}'"
    echo "endpointID: '${{ steps.stack.outputs.endpointID }}'"
```

## Examples

View more [Examples](https://portainer-deploy.cssnr.com/guides/examples) on the website.

💡 _Click on an example heading to expand or collapse the example._

<details open><summary>Deploy from a compose file</summary>

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

</details>
<details><summary>Deploy from the repository</summary>

```yaml
- name: 'Portainer Deploy'
  uses: cssnr/portainer-stack-deploy-action@v1
  with:
    token: ${{ secrets.PORTAINER_TOKEN }}
    url: https://portainer.example.com:9443
    name: stack-name
    file: docker-compose.yaml
```

</details>
<details><summary>Deploy from a different repository</summary>

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

</details>
<details><summary>Specify environment variables</summary>

You can use env_data, env_file, or both.

```yaml
- name: 'Portainer Deploy'
  uses: cssnr/portainer-stack-deploy-action@v1
  with:
    token: ${{ secrets.PORTAINER_TOKEN }}
    url: https://portainer.example.com:9443
    name: stack-name
    file: docker-compose.yaml
    type: file
    env_data: '{"KEY": "Value"}'
    env_file: .env
```

</details>
<details><summary>Merging existing environment variables</summary>

This will add the provided variables to the existing stack variables.

```yaml
- name: 'Portainer Deploy'
  uses: cssnr/portainer-stack-deploy-action@v1
  with:
    token: ${{ secrets.PORTAINER_TOKEN }}
    url: https://portainer.example.com:9443
    name: stack-name
    file: docker-compose.yaml
    type: file
    env_data: |
      KEY: Value
    merge_env: true
```

</details>
<details><summary>Multiline JSON data input</summary>

Note: Secrets are secure in this context.

```yaml
- name: 'Portainer Deploy'
  uses: cssnr/portainer-stack-deploy-action@v1
  with:
    token: ${{ secrets.PORTAINER_TOKEN }}
    url: https://portainer.example.com:9443
    name: stack-name
    file: docker-compose.yaml
    type: file
    env_data: |
      {
        "APP_PRIVATE_KEY": "${{ secrets.APP_PRIVATE_KEY }}",
        "VERSION": "${{ inputs.VERSION }}"
      }
```

</details>
<details><summary>Only run on release events</summary>

This is accomplished by adding an `if` to the step.

- `if: ${{ github.event_name == 'release' }}`

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

</details>
<details><summary>Deploy with relative path volumes</summary>

Portainer Business Edition Only.

```yaml
- name: 'Portainer Deploy'
  uses: cssnr/portainer-stack-deploy-action@v1
  with:
    token: ${{ secrets.PORTAINER_TOKEN }}
    url: https://portainer.example.com:9443
    name: stack-name
    file: docker-compose.yaml
    fs_path: /mnt
```

</details>
<details><summary>Full build and deploy workflow</summary>

This example builds an image, pushes to a registry, then deploys to Portainer.

```yaml
name: 'Portainer Stack Deploy'

on:
  workflow_dispatch:
    inputs:
      tags:
        description: 'Tags: comma,separated'
        required: true
        default: 'latest'

env:
  REGISTRY: 'ghcr.io'

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}
  cancel-in-progress: true

jobs:
  build:
  name: 'Build'
  runs-on: ubuntu-latest
  timeout-minutes: 15
  permissions:
    packages: write

  steps:
    - name: 'Checkout'
      uses: actions/checkout@v5

    - name: 'Setup Buildx'
      uses: docker/setup-buildx-action@v3
      with:
        platforms: 'linux/amd64,linux/arm64'

    - name: 'Docker Login'
      uses: docker/login-action@v3
      with:
        registry: $${{ env.REGISTRY }}
        username: ${{ secrets.GHCR_USER }}
        password: ${{ secrets.GHCR_PASS }}

    - name: 'Generate Tags'
      id: tags
      uses: cssnr/docker-tags-action@v1
      with:
        images: $${{ env.REGISTRY }}/${{ github.repository }}
        tags: ${{ inputs.tags }}

    - name: 'Build and Push'
      uses: docker/build-push-action@v6
      with:
        context: .
        platforms: 'linux/amd64,linux/arm64'
        push: true
        tags: ${{ steps.tags.outputs.tags }}
        labels: ${{ steps.tags.outputs.labels }}

  deploy:
    name: 'Deploy'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    needs: build

    steps:
      - name: 'Checkout'
        uses: actions/checkout@v5

      - name: 'Portainer Deploy'
        uses: cssnr/portainer-stack-deploy-action@v1
        with:
          token: ${{ secrets.PORTAINER_TOKEN }}
          url: https://portainer.example.com
          name: stack-name
          file: docker-compose-swarm.yaml

  cleanup:
    name: 'Cleanup'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    needs: deploy

    steps:
      - name: 'Purge Cache'
        uses: cssnr/cloudflare-purge-cache-action@v2
        with:
          token: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          zones: cssnr.com
```

</details>

For more examples, you can check out other projects using this action:  
https://github.com/cssnr/portainer-stack-deploy-action/network/dependents

## Troubleshooting

- No such image: ghcr.io/user/repo-name:tag

Make sure your package is not private. If you intend to use a private package, then:  
Go to Portainer Registries: https://portainer.example.com/#!/registries/new  
Choose Custom registry, set `ghcr.io` for Registry URL, enable authentication, and add your username/token.

- Error: Resource not accessible by integration

Only applies to `build-push-action` or `bake-action` type actions, not this action.  
Permissions can be added on the job or step level with:

```yaml
permissions:
  packages: write
```

Permissions documentation for
[Workflows](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token)
and [Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication).

## Tags

The following rolling [tags](https://github.com/cssnr/portainer-stack-deploy-action/tags) are maintained.

| Version&nbsp;Tag                                                                                                                                                                                                                           | Rolling | Bugs | Feat. |   Name    |  Target  | Example  |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :--: | :---: | :-------: | :------: | :------- |
| [![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/portainer-stack-deploy-action?sort=semver&filter=!v*.*&style=for-the-badge&label=%20&color=44cc10)](https://github.com/cssnr/portainer-stack-deploy-action/releases/latest) |   ✅    |  ✅  |  ✅   | **Major** | `vN.x.x` | `vN`     |
| [![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/portainer-stack-deploy-action?sort=semver&filter=!v*.*.*&style=for-the-badge&label=%20&color=blue)](https://github.com/cssnr/portainer-stack-deploy-action/releases/latest) |   ✅    |  ✅  |  ❌   | **Minor** | `vN.N.x` | `vN.N`   |
| [![GitHub Release](https://img.shields.io/github/v/release/cssnr/portainer-stack-deploy-action?style=for-the-badge&label=%20&color=red)](https://github.com/cssnr/portainer-stack-deploy-action/releases/latest)                           |   ❌    |  ❌  |  ❌   | **Micro** | `vN.N.N` | `vN.N.N` |

You can view the release notes for each version on the [releases](https://github.com/cssnr/portainer-stack-deploy-action/releases) page.

The **Major** tag is recommended. It is the most up-to-date and always backwards compatible.
Breaking changes would result in a **Major** version bump. At a minimum you should use a **Minor** tag.

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/portainer-stack-deploy-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Portainer%20Stack%20Deploy)

For more information, see the CSSNR [SUPPORT.md](https://github.com/cssnr/.github/blob/master/.github/SUPPORT.md#support).

# Contributing

Contributions of all kinds are welcome, including updating this [README.md](https://github.com/cssnr/portainer-stack-deploy-action/blob/master/README.md).
If you would like to submit a PR, please review the [CONTRIBUTING.md](#contributing-ov-file).

To contribute to the [documentation site](https://portainer-deploy.cssnr.com/) go to [cssnr/portainer-stack-deploy-docs](https://github.com/cssnr/portainer-stack-deploy-docs).

Please consider making a donation to support the development of this project
and [additional](https://cssnr.com/) open source projects.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cssnr)

[![Actions Tools](https://raw.githubusercontent.com/smashedr/repo-images/refs/heads/master/actions/actions-tools.png)](https://actions-tools.cssnr.com/)

Additionally, you can support other [GitHub Actions](https://actions.cssnr.com/) I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy Action](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [Docker Context Action](https://github.com/cssnr/docker-context-action?tab=readme-ov-file#readme)
- [Actions Up Action](https://github.com/cssnr/actions-up-action?tab=readme-ov-file#readme)
- [Zensical Action](https://github.com/cssnr/zensical-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)
- [TOML Action](https://github.com/cssnr/toml-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [JSON Key Value Check Action](https://github.com/cssnr/json-key-value-check-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Package Changelog Action](https://github.com/cssnr/package-changelog-action?tab=readme-ov-file#readme)
- [NPM Outdated Check Action](https://github.com/cssnr/npm-outdated-action?tab=readme-ov-file#readme)
- [Label Creator Action](https://github.com/cssnr/label-creator-action?tab=readme-ov-file#readme)
- [Algolia Crawler Action](https://github.com/cssnr/algolia-crawler-action?tab=readme-ov-file#readme)
- [Upload Release Action](https://github.com/cssnr/upload-release-action?tab=readme-ov-file#readme)
- [Check Build Action](https://github.com/cssnr/check-build-action?tab=readme-ov-file#readme)
- [Web Request Action](https://github.com/cssnr/web-request-action?tab=readme-ov-file#readme)
- [Get Commit Action](https://github.com/cssnr/get-commit-action?tab=readme-ov-file#readme)

<details><summary>❔ Unpublished Actions</summary>

These actions are not published on the Marketplace, but may be useful.

- [cssnr/create-files-action](https://github.com/cssnr/create-files-action?tab=readme-ov-file#readme) - Create various files from templates.
- [cssnr/draft-release-action](https://github.com/cssnr/draft-release-action?tab=readme-ov-file#readme) - Keep a draft release ready to publish.
- [cssnr/env-json-action](https://github.com/cssnr/env-json-action?tab=readme-ov-file#readme) - Convert env file to json or vice versa.
- [cssnr/push-artifacts-action](https://github.com/cssnr/push-artifacts-action?tab=readme-ov-file#readme) - Sync files to a remote host with rsync.
- [smashedr/update-release-notes-action](https://github.com/smashedr/update-release-notes-action?tab=readme-ov-file#readme) - Update release notes.
- [smashedr/combine-release-notes-action](https://github.com/smashedr/combine-release-notes-action?tab=readme-ov-file#readme) - Combine release notes.

---

</details>

<details><summary>📝 Template Actions</summary>

These are basic action templates that I use for creating new actions.

- [javascript-action](https://github.com/smashedr/javascript-action?tab=readme-ov-file#readme) - JavaScript
- [typescript-action](https://github.com/smashedr/typescript-action?tab=readme-ov-file#readme) - TypeScript
- [py-test-action](https://github.com/smashedr/py-test-action?tab=readme-ov-file#readme) - Dockerfile Python
- [test-action-uv](https://github.com/smashedr/test-action-uv?tab=readme-ov-file#readme) - Dockerfile Python UV
- [docker-test-action](https://github.com/smashedr/docker-test-action?tab=readme-ov-file#readme) - Docker Image Python

Note: The `docker-test-action` builds, runs and pushes images to [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

---

</details>

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)

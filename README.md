[![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/portainer-stack-deploy-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/portainer-stack-deploy-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/portainer-stack-deploy-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/portainer-stack-deploy-action/tags)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/portainer-stack-deploy-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/portainer-stack-deploy-action/releases/latest)
[![GitHub Dist Size](https://img.shields.io/github/size/cssnr/portainer-stack-deploy-action/dist%2Findex.js?label=dist%20size)](https://github.com/cssnr/portainer-stack-deploy-action/blob/master/src/index.js)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/cssnr/portainer-stack-deploy-action/release.yaml?logo=github&label=release)](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/release.yaml)
[![Workflow Test](https://img.shields.io/github/actions/workflow/status/cssnr/portainer-stack-deploy-action/test.yaml?logo=github&label=test)](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/test.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/cssnr/portainer-stack-deploy-action/lint.yaml?logo=github&label=lint)](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_portainer-stack-deploy-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_portainer-stack-deploy-action)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/portainer-stack-deploy-action?logo=github&label=updated)](https://github.com/cssnr/portainer-stack-deploy-action/graphs/commit-activity)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/portainer-stack-deploy-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/portainer-stack-deploy-action)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/portainer-stack-deploy-action?logo=htmx)](https://github.com/cssnr/portainer-stack-deploy-action)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/portainer-stack-deploy-action?style=flat&logo=github)](https://github.com/cssnr/portainer-stack-deploy-action/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/portainer-stack-deploy-action?style=flat&logo=github)](https://github.com/cssnr/portainer-stack-deploy-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)

# Portainer Stack Deploy Action

- [Inputs](#Inputs)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Tags](#Tags)
- [Troubleshooting](#Troubleshooting)
- [Support](#Support)
- [Contributing](#Contributing)

Deploy or Update a Portainer Stack from a Repository or Compose File. Supports most features including specifying the
repository, compose file, environment variables and much more...

This action is written from the ground up in VanillaJS and is not a fork/clone of existing actions.

_No Portainer?_ You can deploy directly to a docker over ssh with: [cssnr/stack-deploy-action](https://github.com/cssnr/stack-deploy-action)

> [!NOTE]  
> Please submit a [Feature Request](https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/cssnr/portainer-stack-deploy-action/issues) if you find any bugs.

This is a fairly simple action, for more details see [src/index.js](src/index.js) and [src/portainer.js](src/portainer.js).

## Inputs

| Input        |  Req.   | Default&nbsp;Value    | Input&nbsp;Description   |
| :----------- | :-----: | :-------------------- | :----------------------- |
| `token`      | **Yes** | -                     | Portainer Token \*       |
| `url`        | **Yes** | -                     | Portainer URL            |
| `name`       | **Yes** | -                     | Stack Name               |
| `file`       |    -    | `docker-compose.yaml` | Compose File             |
| `endpoint`   |    -    | `endpoints[0].Id`     | Portainer Endpoint \*    |
| `ref`        |    -    | `current reference`   | Repository Ref \*        |
| `repo`       |    -    | `current repository`  | Repository URL \*        |
| `tlsskip`    |    -    | `false`               | Skip Repo TLS Verify     |
| `prune`      |    -    | `true`                | Prune Services           |
| `pull`       |    -    | `true`                | Pull Images              |
| `type`       |    -    | `repo`                | Type [`repo`, `file`] \* |
| `standalone` |    -    | `false`               | Deploy Standalone Stack  |
| `env_json`   |    -    | -                     | Dotenv JSON Data \*\*    |
| `env_file`   |    -    | -                     | Dotenv File Path \*      |
| `merge_env`  |    -    | `false`               | Merge Env Vars \*        |
| `username`   |    -    | -                     | Repository Username \*   |
| `password`   |    -    | -                     | Repository Password \*   |
| `fs_path`    |    -    | -                     | Relative Path (BE) \*    |
| `summary`    |    -    | `true`                | Add Summary to Job \*    |

> For more details on inputs, see the Portainer API [documentation](https://app.swaggerhub.com/apis/portainer/portainer-ce/).

**token:** To create a Portainer API token see: https://docs.portainer.io/api/access

**endpoint:** If `endpoint` is not provided the first endpoint returned by the API will be used.
If you only have one endpoint, this will work as expected, otherwise, you should provide an endpoint.

**ref:** If you want to deploy a different ref than the one triggering the workflow.
Useful if you are deploying from another repository. Example: `refs/heads/master`

**repo:** This defaults to the repository running the action. If you want to deploy a different repository
put the full http URL to that repository here.

**type:** Type of Deployment. Currently, supports either `repo` or `file`.

**env_json/env_file:** Optional environment variables used when creating the stack. File should be in dotenv format and
JSON should be an object. Example: `{"KEY": "Value"}`

> [!WARNING]  
> Inputs are NOT secure unless using secrets or secure output.
> Using `env_json` on a public repository will otherwise expose this data.
> To securely pass an environment use the `env_file` option.

**merge_env:** If this is `true` and the stack exists, will update the existing Env with the provided `env_json/env_file`.
If you are not providing an env, the existing env will be used, and you do not need to set this.

**username/password:** Only set these if the `repo` is private and requires authentication.
This is NOT the Portainer username/password, see `token` for Portainer authentication.

**fs_path:** Relative Path Support for Portainer BE.
Set this to enable relative path volumes support for volume mappings in your compose file.
See the [docs](https://docs.portainer.io/advanced/relative-paths) for more info.

**summary:** Write a Summary for the job. To disable this set to `false`.

To view a workflow run, click on a recent [Test](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/test.yaml) job _(requires login)_.

<details><summary>👀 View Example Job Summary</summary>

---

🎉 **Created** New Stack 112: `test_portainer-stack-deploy`

<details><summary>Stack Details</summary><table><tr><th>Item</th><th>Value</th></tr><tr><td>ID</td><td>112</td></tr><tr><td>Name</td><td>test_portainer-stack-deploy</td></tr><tr><td>File</td><td>docker-compose.yml</td></tr><tr><td>Type</td><td>Swarm</td></tr><tr><td>Status</td><td>Active</td></tr><tr><td>Created</td><td>2/28/2025, 3:09:16 AM</td></tr><tr><td>Updated</td><td>-</td></tr><tr><td>Path</td><td>/data/compose/112</td></tr><tr><td>EndpointID</td><td>1</td></tr><tr><td>SwarmID</td><td>wr8i8agdr05n6wsf1tkcnhwik</td></tr></table></details>

---

</details>

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

You can use env_json, env_file, or both.

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
    env_json: '{"KEY": "Value"}'
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
    env_json: |
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
name: 'Portainer Stack Deploy Action'

on:
  workflow_dispatch:
    inputs:
      tags:
        description: 'Tags: comma,separated'
        required: true
        default: 'latest'

env:
  REGISTRY: 'ghcr.io'

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
      uses: actions/checkout@v4

    - name: 'Setup Buildx'
      uses: docker/setup-buildx-action@v2
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
    needs: [build]

    steps:
      - name: 'Checkout'
        uses: actions/checkout@v4

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
    needs: [deploy]
    permissions:
      contents: read
      packages: write

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

Currently, the best way to contribute to this project is to star this project on GitHub.

If you would like to submit a PR, please review the [CONTRIBUTING.md](CONTRIBUTING.md).

Additionally, you can support other GitHub Actions I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)
- [Package Changelog Action](https://github.com/cssnr/package-changelog-action?tab=readme-ov-file#readme)
- [NPM Outdated Check Action](https://github.com/cssnr/npm-outdated-action?tab=readme-ov-file#readme)

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)

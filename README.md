[![Release](https://img.shields.io/github/actions/workflow/status/cssnr/portainer-stack-deploy-action/release.yaml?logo=github&logoColor=white&label=release)](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/release.yaml)
[![Test](https://img.shields.io/github/actions/workflow/status/cssnr/portainer-stack-deploy-action/test.yaml?logo=github&logoColor=white&label=test)](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/test.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_portainer-stack-deploy-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_portainer-stack-deploy-action)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/portainer-stack-deploy-action?logo=github)](https://github.com/cssnr/portainer-stack-deploy-action/releases/latest)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/portainer-stack-deploy-action?logo=github&logoColor=white&label=updated)](https://github.com/cssnr/portainer-stack-deploy-action/graphs/commit-activity)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/portainer-stack-deploy-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/portainer-stack-deploy-action)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/portainer-stack-deploy-action?logo=htmx&logoColor=white)](https://github.com/cssnr/portainer-stack-deploy-action)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&logoColor=white)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)

# Portainer Stack Deploy Action

- [Inputs](#Inputs)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Troubleshooting](#Troubleshooting)
- [Development](#Development)
- [Support](#Support)
- [Contributing](#Contributing)

Deploy or Update a Portainer Stack from a Repository or Compose File. Supports most features including specifying the
repository, compose file, environment variables and much more...

This action is written from the ground up in VanillaJS and is not a fork/clone of existing actions.

_No Portainer?_ You can deploy directly to a docker over ssh with: [cssnr/stack-deploy-action](https://github.com/cssnr/stack-deploy-action)

> [!NOTE]  
> Please submit
> a [Feature Request](https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/cssnr/portainer-stack-deploy-action/issues) if you find any
> bugs.

## Inputs

| input      | required | default               | description              |
| ---------- | :------: | --------------------- | ------------------------ |
| token      | **Yes**  | -                     | Portainer Token \*       |
| url        | **Yes**  | -                     | Portainer URL            |
| name       | **Yes**  | -                     | Stack Name               |
| file       |    -     | `docker-compose.yaml` | Compose File             |
| endpoint   |    -     | `endpoints[0].Id`     | Portainer Endpoint \*    |
| ref        |    -     | `current reference`   | Repository Ref \*        |
| repo       |    -     | `current repository`  | Repository URL \*        |
| tlsskip    |    -     | `false`               | Skip Repo TLS Verify     |
| prune      |    -     | `true`                | Prune Services           |
| pull       |    -     | `true`                | Pull Images              |
| type       |    -     | `repo`                | Type [`repo`, `file`] \* |
| standalone |    -     | `false`               | Deploy Standalone Stack  |
| env_json   |    -     | -                     | Dotenv JSON Data \*\*    |
| env_file   |    -     | -                     | Dotenv File Path \*      |
| merge_env  |    -     | `false`               | Merge Env Vars \*        |
| username   |    -     | -                     | Repository Username \*   |
| password   |    -     | -                     | Repository Password \*   |
| fs_path    |    -     | -                     | Relative Path (BE) \*    |
| summary    |    -     | `true`                | Add Summary to Job \*    |

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

> [!WARNING]  
> Inputs are NOT secure and using `env_json` on a public repository will expose this data.  
> To securely pass an environment use the `env_file` option.

**merge_env** - If this is `true` and the stack exists, will update the existing Env with the provided `env_json/env_file`.
If you are not providing an env, the existing env will be used, and you do not need to set this.

**username/password** - Only set these if the `repo` is private and requires authentication.
This is NOT the Portainer username/password, see `token` for Portainer authentication.

**fs_path** - Relative Path Support for Portainer BE.
Set this to enable relative path volumes support for volume mappings in your compose file.
See the [docs](https://docs.portainer.io/advanced/relative-paths) for more info.

**summary** - Write a Summary for the job. To disable this set to `false`.

<details><summary>📜 View Example Summary</summary>

---

🎉 **Updated** Existing Stack 110: `alpine-test`

<details><summary>Stack Details</summary><table><tr><th>Item</th><th>Value</th></tr><tr><td>ID</td><td>110</td></tr><tr><td>Name</td><td>alpine-test</td></tr><tr><td>File</td><td>docker-compose.yml</td></tr><tr><td>Type</td><td>Swarm</td></tr><tr><td>Status</td><td>Active</td></tr><tr><td>Created</td><td>2/22/2025, 9:02:26 PM</td></tr><tr><td>Updated</td><td>2/23/2025, 3:41:02 AM</td></tr><tr><td>Path</td><td>/data/compose/110</td></tr><tr><td>EndpointID</td><td>1</td></tr><tr><td>SwarmID</td><td>wr8i8agdr05n6wsf1tkcnhwik</td></tr></table></details>

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

For more information on variables, see the Portainer API Documentation:  
https://app.swaggerhub.com/apis/portainer/portainer-ce/

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
    echo stackID: '${{ steps.stack.outputs.stackID }}'
    echo swarmID: '${{ steps.stack.outputs.swarmID }}'
    echo endpointID: '${{ steps.stack.outputs.endpointID }}'
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

Merging existing environment variables with additional variables:

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

Deploy with relative path volumes (BE only):

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

To include this in a general workflow but only run on release events use an if:

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

# Development

Until the `CONTRIBUTING.md` is finished being created, here is a quick rundown:

1. Fork the repository.
2. Create a branch in your fork!
3. Run: `npm install`
4. Make your changes.
5. Build or watch: `npm run build:watch`
6. [Test](#Testing) your changes.
7. Ensure changes are built: `npm build`
8. Commit and push your changes (including `dist`).
9. Create a PR to this repository.
10. Verify the tests pass, otherwise resolve.
11. Make sure to keep your branch up-to-date.

### Testing

Currently, the test is in [push.yaml](.github/workflows/push.yaml).
You can either test on GitHub by enabling this workflow, or locally using [act](https://github.com/nektos/act).
In both cases, you will need to have the secrets added either to GitHub or the `.secrets` file.

For instructions on running/testing actions locally, there is more information in this
[README.md](https://github.com/smashedr/docker-test-action?tab=readme-ov-file#development) and this
[README.md](https://github.com/smashedr/js-test-action?tab=readme-ov-file#local-development).

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

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)

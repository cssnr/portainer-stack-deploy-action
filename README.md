[![Tags](https://img.shields.io/github/actions/workflow/status/cssnr/portainer-stack-deploy-action/tags.yaml?logo=github&logoColor=white&label=tags)](https://github.com/cssnr/portainer-stack-deploy-action/actions/workflows/tags.yaml)
[![CSSNR Website](https://img.shields.io/badge/pages-website-blue?logo=github&logoColor=white&color=blue)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
# Portainer Stack Deploy Action

Deploy or Update a Portainer Stack from a GitHub Repository.

This action is written from the ground up in VanillaJS and is not a fork/clone of existing actions.

*   [Inputs](#Inputs)
*   [Example](#Example)
*   [Known Issues](#Known-Issues)
*   [Support](#Support)

> [!NOTE]   
> Please submit
> a [Feature Request](https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/cssnr/portainer-stack-deploy-action/issues) if you find any bugs.

## Inputs

| input    | required | default           | description           |
|----------|----------|-------------------|-----------------------|
| url      | Yes      | -                 | Portainer URL         |
| token    | Yes      | -                 | Portainer Token       |
| endpoint | No       | `endpoints[0].Id` | Portainer Endpoint ID |
| name     | Yes      | -                 | Stack Name            |
| file     | No       | `compose.yaml`    | Compose File          |
| prune    | No       | `true`            | Prune Services        |
| pull     | No       | `true`            | Pull Images           |

Creating a Portainer API Token: https://docs.portainer.io/api/access

Note: If an `endpoint` is not provided the first endpoint returned by the API will be used.
If you only have one endpoint, this will work as expected, otherwise, you should provide an endpoint. 

```yaml
  - name: "Portainer Deploy"
    uses: cssnr/portainer-stack-deploy-action@v1
    with:
      url: https://portainer.example.com:9443
      token: ${{ secrets.PORTAINER_TOKEN }}
      name: stack-name
      file: docker-compose.yaml
```

## Example

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
          url: https://portainer.example.com
          token: ${{ secrets.PORTAINER_TOKEN }}
          name: stack-name
          file: docker-compose-swarm.yaml
```

To include this in a general workflow but only run on release events use an if:

- `if: ${{ github.event_name == 'release' }}`

```yaml
  - name: "Portainer Deploy"
    uses: cssnr/portainer-stack-deploy-action@v1
    if: ${{ github.event_name == 'release' }}
    with:
      url: https://portainer.example.com:9443
      token: ${{ secrets.PORTAINER_TOKEN }}
      name: stack-name
      file: docker-compose.yaml
```

## Known Issues

- Repository authentication options have not been added yet, but are coming soon...
- Only works for repository stacks but can be expanded to support other types.

This is a fairly simple action, for more details see
[src/index.js](src%2Findex.js) and [src/portainer.js](src%2Fportainer.js).

## Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/portainer-stack-deploy-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/portainer-stack-deploy-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Portainer%20Stack%20Deploy)

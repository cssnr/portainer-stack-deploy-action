# Contributing

> [!WARNING]  
> This guide is a work in progress and may not be complete.

This is a basic contributing guide and is a work in progress.

## Workflow

1. Fork the repository.
2. Create a branch in your fork.
3. Run `npm install`.
4. Make your changes.
5. Build or watch `npm run build:watch`.
6. [Test](#Testing) your changes.
7. Ensure changes are built `npm run build`.
8. Commit and push your changes (including `dist`).
9. Create a PR to this repository.
10. Verify the tests pass, otherwise resolve.
11. Make sure to keep your branch up-to-date.

## Testing

GitHub is easier to set up, but you have to push your commits to test.  
Running locally is harder to set up, but it is much easier to test; and by far recommended!

Currently, the test is in [test.yaml](.github/workflows/test.yaml) and works on the push event.
You can either test on GitHub by enabling this workflow, or locally using [act](https://github.com/nektos/act).
In both cases, you will need to have the secrets added either to GitHub or the `.secrets` file.

### GitHub

You will need to add your secrets to GitHub Actions Secrets.

When you push your branch to your repository, the [test.yaml](.github/workflows/test.yaml) should run...

### Locally

To run actions locally you need to install act: https://nektosact.com/installation/index.html

You will need to add your secrets to a `.secrets` file in env file format.

```shell
npm install
npm run build:watch
act -j test -e event.json
```

To print your secrets in plan text (insecure) use `--insecure-secrets`

To see all available jobs run `act -l` and see `act --help`

For more information see the documentation: https://nektosact.com/usage/index.html

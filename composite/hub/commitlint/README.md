<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>commitlint</h1></td>
</tr></table>

Composite action that sets up Node.js, installs npm dependencies, and runs
[commitlint](https://commitlint.js.org/) on every commit in a pull request range.

## Usage

```yaml
- name: Checkout
  uses: actions/checkout@v4
  with:
    fetch-depth: 0

- name: Lint commits
  uses: <org>/modules-hub/composite/hub/commitlint@v1
  with:
    pr-base-sha: ${{ github.event.pull_request.base.sha }}
    pr-head-sha: ${{ github.event.pull_request.head.sha }}
```

`fetch-depth: 0` is required so the full commit history is available for
`git merge-base` and the commitlint range walk.

## Inputs

| Name | Required | Description |
|---|---|---|
| `pr-base-sha` | yes | PR base branch SHA (`github.event.pull_request.base.sha`). |
| `pr-head-sha` | yes | PR head commit SHA (`github.event.pull_request.head.sha`). |

## How it works

1. Installs Node.js LTS and caches the npm store.
2. Runs `npm ci` to install project dependencies (including `commitlint` and its config).
3. Resolves the true merge-base with `git merge-base` and lints every commit in that range.

<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>semantic-release</h1></td>
</tr></table>

Composite action that installs Node.js dependencies and runs
[`semantic-release`](https://semantic-release.gitbook.io/) against a specific
branch. Overrides `GITHUB_REF` / `GITHUB_REF_NAME` inside the release step so
`workflow_run`-triggered runs release from the triggering branch instead of
the runner's default branch context.

## Usage

```yaml
- name: Release
  uses: <org>/modules-hub/composite/config/semantic-release@v1
  with:
    target_ref: ${{ inputs.ref }}
    github_token: ${{ secrets.RELEASE_TOKEN }}
```

## Inputs

| Name | Required | Description |
|---|---|---|
| `target_ref` | yes | Branch name `semantic-release` should release from. Must match a branch declared in `.releaserc.json`. |
| `github_token` | yes | Token with permissions to push tags/commits and publish GitHub releases. |
| `node_version` | no | Passed to `actions/setup-node`. Defaults to `lts/*`. |

## Requirements

- `actions/checkout` must run **before** this composite with `fetch-depth: 0`.
- A `package.json` + `package-lock.json` defining `semantic-release` and plugins
  must exist in the repository root.
- If commits are signed, run `composite/config/setup-gpg` **before** this step.
- If the release iterates over sibling branches, run
  `composite/config/materialize-release-branches` **before** this step.

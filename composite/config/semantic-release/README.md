<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>semantic-release</h1></td>
</tr></table>

Composite action that installs Node.js dependencies and runs
[`semantic-release`](https://semantic-release.gitbook.io/) against a specific
branch. Overrides `GITHUB_REF` / `GITHUB_REF_NAME` inside the release step so
`workflow_run`-triggered runs release from the triggering branch instead of
the runner's default branch context.

When the release runs from a pre-release branch (i.e. `target_ref` differs
from `stable_ref`), the composite strips `@semantic-release/changelog` and
`@semantic-release/git` from `.releaserc.json` before invoking
`semantic-release`. Pre-releases therefore publish a tag and a GitHub Release
but do not update `CHANGELOG.md` and do not push a release commit back to the
repository — only the stable branch maintains the changelog.

## Usage

```yaml
- name: Release
  uses: <org>/modules-hub/composite/config/semantic-release@v1
  with:
    target_ref: ${{ inputs.ref }}
    stable_ref: main
    github_token: ${{ secrets.RELEASE_TOKEN }}
```

## Inputs

| Name | Required | Description |
|---|---|---|
| `target_ref` | yes | Branch name `semantic-release` should release from. Must match a branch declared in `.releaserc.json`. |
| `stable_ref` | no | Stable branch name. When `target_ref` equals this value the full plugin set runs (changelog + release commit). Any other value is treated as a pre-release and the changelog/git plugins are stripped. Defaults to `main`. |
| `github_token` | yes | Token with permissions to push tags/commits and publish GitHub releases. |
| `node_version` | no | Passed to `actions/setup-node`. Defaults to `lts/*`. |

## Requirements

- `actions/checkout` must run **before** this composite with `fetch-depth: 0`.
- A `package.json` + `package-lock.json` defining `semantic-release` and plugins
  must exist in the repository root.
- If commits are signed, run `composite/config/setup-gpg` **before** this step.
- If the release iterates over sibling branches, run
  `composite/config/materialize-release-branches` **before** this step.

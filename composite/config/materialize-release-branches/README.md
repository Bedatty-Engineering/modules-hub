<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>materialize-release-branches</h1></td>
</tr></table>

Composite action that creates local refs for the release branches tracked by
`semantic-release`. `actions/checkout` only materializes the target branch, but
`semantic-release` iterates over every branch declared in its config
(`.releaserc.json` or `release.config.{js,cjs,mjs}`) running
`git tag --merged <name>`, which requires a local ref.

## Usage

```yaml
- name: Materialize local release branches
  uses: <org>/modules-hub/composite/config/materialize-release-branches@v1
  with:
    current_ref: ${{ inputs.ref }}
```

## Inputs

| Name | Required | Description |
|---|---|---|
| `current_ref` | yes | Branch already checked out in the worktree; skipped from materialization (git refuses to force-update the active branch). |
| `release_branches` | no | Space-separated branches to materialize. Defaults to `main dev stg prd`. Override when release branches diverge from the convention. |

## Requirements

- `actions/checkout` must run **before** this composite with `fetch-depth: 0` so
  remote refs are available locally.

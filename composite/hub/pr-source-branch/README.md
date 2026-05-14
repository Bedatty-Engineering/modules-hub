<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>pr-source-branch</h1></td>
</tr></table>

Composite action that enforces a source-branch policy for pull requests
into protected target branches. Pull requests targeting any branch outside
the protected list skip the check automatically.

## Usage

```yaml
- name: Validate source branch
  uses: <org>/modules-hub/composite/hub/pr-source-branch@v1
  with:
    allowed-branches: "dev|hotfix/*|release-*"
    target-branches: "main"
```

## Inputs

| Name | Default | Description |
|---|---|---|
| `source` | `github.head_ref` | PR source branch. |
| `target` | `github.base_ref` | PR target branch. |
| `allowed-branches` | `dev\|hotfix/*` | Allowed source branches. Pipe- or newline-separated; supports trailing `*`. |
| `target-branches` | `main` | Targets that require source validation. PRs to any other target skip. |

## Outputs

| Name | Description |
|---|---|
| `outcome` | `success`, `failure`, or `skipped`. |

## Pattern matching

- Exact match: `dev`
- Prefix glob (single trailing `*`): `hotfix/*` matches `hotfix/oncall-42`.
- More complex patterns (mid-string `*`, brace expansion) are intentionally not supported — keep policies simple.

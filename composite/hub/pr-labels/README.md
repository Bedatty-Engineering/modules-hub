<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>pr-labels</h1></td>
</tr></table>

Composite action that applies labels to a pull request based on a simple
YAML config of `label: [glob, ...]`. A label is applied when any changed
file matches any of its globs.

## Usage

```yaml
- name: Auto-label PR
  uses: <org>/modules-hub/composite/hub/pr-labels@v1
  with:
    config-path: .github/labeler.yml
    sync: "true"
```

Requires `pull-requests: write` permission.

## Inputs

| Name | Default | Description |
|---|---|---|
| `github-token` | `${{ github.token }}` | Token with `pull-requests: write`. |
| `config-path` | `.github/labeler.yml` | Labeler config file inside the repo. |
| `sync` | `false` | When `true`, removes labels declared in the config that no longer match. |

## Outputs

| Name | Description |
|---|---|
| `outcome` | `success`, `failure`, or `skipped` (config missing). |
| `applied` | Space-separated list of labels applied. |

## Config format

```yaml
documentation:
  - 'docs/**'
  - '**/*.md'
ci:
  - '.github/workflows/**'
terraform:
  - 'composite/terraform/**'
  - '**/*.tf'
```

Globs use bash extglob semantics (`*`, `**`, `?`, character classes). Mid-string
`**` matches across directory separators when `globstar` would; in practice
prefer `prefix/**` for "anything under". Patterns that need anchoring (e.g.
match only files at the repo root) should be written explicitly: `*.md`.

## Notes

- The config is read via sparse-checkout so the workflow doesn't need a full clone.
- Labels that don't exist on the repo will fail the GitHub API call — create them first.

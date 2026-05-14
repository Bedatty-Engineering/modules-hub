<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>pr-title</h1></td>
</tr></table>

Composite action that validates a pull request title against the
[Conventional Commits](https://www.conventionalcommits.org/) spec, with
configurable allowed types and an optional scope allowlist.

## Usage

```yaml
- name: Validate PR title
  uses: <org>/modules-hub/composite/hub/pr-title@v1
  with:
    types: |
      feat
      fix
      chore
    scopes: |
      api
      web
      infra
    require-scope: "true"
```

The action defaults to `github.event.pull_request.title`, so on a
`pull_request` event no input is required.

## Inputs

| Name | Default | Description |
|---|---|---|
| `pr-title` | `github.event.pull_request.title` | Title to validate. |
| `types` | `feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert` | Allowed types. Newline- or pipe-separated. |
| `scopes` | _(empty)_ | Allowed scopes. Empty means any scope. |
| `require-scope` | `false` | Fail when the title has no scope. |

## Outputs

| Name | Description |
|---|---|
| `outcome` | `success` or `failure` (also reflected in the step status). |

## Format expected

```
<type>(<scope>)!: <subject>
<type>: <subject>
```

`!` for breaking changes is accepted but optional.

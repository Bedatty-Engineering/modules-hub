<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>pr-assignee</h1></td>
</tr></table>

Composite action that assigns a pull request to one or more GitHub users.
Defaults to the PR author, so the person who opened the PR is also its
assignee.

## Usage

```yaml
- name: Auto-assign PR to author
  uses: <org>/modules-hub/composite/hub/pr-assignee@v1

- name: Assign PR to specific reviewers
  uses: <org>/modules-hub/composite/hub/pr-assignee@v1
  with:
    assignee: alice,bob
```

Requires the workflow token to carry `issues: write` permission (PR
assignees use the issues endpoint).

## Inputs

| Name | Default | Description |
|---|---|---|
| `github-token` | `${{ github.token }}` | Token with `issues: write`. |
| `assignee` | `github.event.pull_request.user.login` | Login(s) to assign. Comma-separated. |

## Outputs

| Name | Description |
|---|---|
| `outcome` | `success`, `failure`, or `skipped` (no valid login, or non-PR context). |
| `assigned` | Comma-separated list of logins that were requested. |

## Behavior

- The POST is idempotent — existing assignees remain assigned, new ones are added.
- Logins that the repo cannot assign (non-collaborators, deleted accounts) are silently dropped by the GitHub API; the step still reports `success`.
- When the PR opener is a bot (e.g. `dependabot[bot]`), the default `github.event.pull_request.user.login` may not be assignable; pass an explicit `assignee` if you want a real account in that case.

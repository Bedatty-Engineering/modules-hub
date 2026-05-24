<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>pr-summary</h1></td>
</tr></table>

Composite action that posts (or updates) a sticky PR comment with a validation
status table and, optionally, a findings section sourced from the GitHub
Annotations API.

## Two-phase architecture

The composite runs in two separate jobs to give fast feedback without blocking
on slow checks (e.g. CodeQL):

| Phase | Job | When | What it posts |
|---|---|---|---|
| 1 | `pr-summary` | After `pr-hygiene` + `advisory-checks` (~1 min) | Table + Overall status |
| 2 | `pr-findings` | After **all** jobs complete | Updates comment with findings from every job |

Phase 2 strips the previous findings section from the comment and replaces it
with fresh annotations fetched from the GitHub Check Run Annotations API.
Any step that emits `::warning` or `::error` automatically appears — no
per-tool wiring needed.

## Usage

### Phase 1 — post table (inside a reusable validate workflow)

```yaml
- name: Post summary
  uses: <org>/modules-hub/composite/hub/pr-summary@v1
  with:
    github-token: ${{ secrets.REPOSITORY_OPERATOR || github.token }}
    title-result: ${{ needs.pr-hygiene.outputs.title-result || 'skipped' }}
    description-result: ${{ needs.pr-hygiene.outputs.description-result || 'skipped' }}
    source-branch-result: ${{ needs.pr-hygiene.outputs.source-branch-result || 'skipped' }}
    size-result: ${{ needs.advisory-checks.outputs.size-result || 'skipped' }}
    label-result: ${{ needs.advisory-checks.outputs.label-result || 'skipped' }}
    assignee-result: ${{ needs.advisory-checks.outputs.assignee-result || 'skipped' }}
```

### Phase 2 — update findings (in the caller workflow, after all jobs)

```yaml
pr-findings:
  name: PR findings
  runs-on: ubuntu-latest
  needs: [base, modules-hub]          # wait for every workflow
  if: always() && github.event_name == 'pull_request'
  steps:
    - name: Update findings
      uses: <org>/modules-hub/composite/hub/pr-summary@v1
      with:
        github-token: ${{ secrets.REPOSITORY_OPERATOR || github.token }}
        findings-only: "true"
```

## Inputs

| Name | Default | Description |
|---|---|---|
| `github-token` | `${{ github.token }}` | Token with `pull-requests: write` and `actions: read`. |
| `title-result` | `skipped` | Outcome of the title check. |
| `title-message` | `""` | Error detail shown when title check fails. |
| `description-result` | `skipped` | Outcome of the description check. |
| `description-message` | `""` | Error detail shown when description check fails. |
| `source-branch-result` | `skipped` | Outcome of the source-branch check. |
| `source-branch-message` | `""` | Error detail shown when source-branch check fails. |
| `size-result` | `skipped` | Outcome of the size check. |
| `size-message` | `""` | Error detail shown when size check fails. |
| `label-result` | `skipped` | Outcome of the auto-label step. |
| `label-message` | `""` | Error detail shown when auto-label fails. |
| `assignee-result` | `skipped` | Outcome of the auto-assign step. |
| `assignee-message` | `""` | Error detail shown when auto-assign fails. |
| `findings-only` | `false` | When `true`, skip the table and only update the findings section. |
| `post-comment` | `true` | Set to `false` to skip the sticky comment (still writes step summary). |
| `marker` | `<!-- pr-validation-summary -->` | HTML marker used to locate the sticky comment. |

## Outputs

| Name | Description |
|---|---|
| `overall` | `success` if every check is `success` or `skipped`; `failure` if any is `failure`. Only meaningful in Phase 1. |

## Findings section

When Phase 2 runs, it queries `GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs`
to list all completed jobs, then fetches `GET /repos/{owner}/{repo}/check-runs/{id}/annotations`
for each. Jobs named "PR summary" and "PR findings" are excluded. Annotations matching
platform advisories (e.g. CodeQL on.push bootstrap warning) are filtered out.

Each job with findings gets a collapsible `<details>` block:

- ❌ annotation level `failure` → `[ERROR]`
- ⚠️ annotation level `warning` → `[WARNING]`
- 🔵 all other levels → level name uppercased

## Sticky comment behavior

Phase 1 POSTs a new comment (or PATCHes an existing one) identified by the
HTML marker on the first line. Phase 2 reads the existing comment, strips
everything from the `---` separator onwards, and appends the new findings
before PATCHing. The PR never accumulates duplicate comments.

## Required permissions

```yaml
permissions:
  pull-requests: write
  issues: write
  actions: read
```

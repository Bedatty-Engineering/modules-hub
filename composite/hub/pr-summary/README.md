<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>pr-summary</h1></td>
</tr></table>

Composite action that aggregates the outcomes of the other `pr-*`
composites and posts (or updates) a single sticky comment on the pull
request summarizing the run. Also writes the table to
`GITHUB_STEP_SUMMARY`.

## Usage

```yaml
- name: PR validation summary
  uses: <org>/modules-hub/composite/hub/pr-summary@v1
  with:
    title-result: ${{ needs.blocking.outputs.title-result }}
    description-result: ${{ needs.blocking.outputs.description-result }}
    source-branch-result: ${{ needs.blocking.outputs.source-branch-result }}
    size-result: ${{ needs.advisory.outputs.size-result }}
    label-result: ${{ needs.advisory.outputs.label-result }}
```

Requires `pull-requests: write` permission to post / edit the comment.

## Inputs

| Name | Default | Description |
|---|---|---|
| `github-token` | `${{ github.token }}` | Token with `pull-requests: write`. |
| `title-result` | `skipped` | Outcome of the title check. |
| `description-result` | `skipped` | Outcome of the description check. |
| `source-branch-result` | `skipped` | Outcome of the source-branch check. |
| `size-result` | `skipped` | Outcome of the size check. |
| `label-result` | `skipped` | Outcome of the auto-label step. |
| `assignee-result` | `skipped` | Outcome of the auto-assign step. |
| `post-comment` | `true` | Set to `false` to skip the sticky comment (still writes step summary). |
| `marker` | `<!-- pr-validation-summary -->` | HTML marker used to locate the existing sticky comment. |

## Outputs

| Name | Description |
|---|---|
| `overall` | `success` if every blocking check (title/description/source) is `success` or `skipped`; `failure` if any is `failure`. |

## Sticky comment behavior

On first run the action POSTs a new comment containing the marker as the
first line. On subsequent runs it locates the comment by that marker and
PATCHes it in place, so the PR doesn't accumulate duplicates.

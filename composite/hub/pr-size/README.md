<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>pr-size</h1></td>
</tr></table>

Composite action that classifies a pull request into an `XS/S/M/L/XL`
size bucket based on `additions + deletions` and applies a label
(default prefix `size/`). Lockfiles and snapshot artifacts are excluded
from the count by default.

## Usage

```yaml
- name: Label PR size
  uses: <org>/modules-hub/composite/hub/pr-size@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    fail-on-xl: "true"
```

Requires `pull-requests: write` permission to manage labels.

## Inputs

| Name | Default | Description |
|---|---|---|
| `github-token` | `${{ github.token }}` | Token with `pull-requests: write`. |
| `xs-threshold` | `10` | Inclusive upper bound for the XS bucket. |
| `s-threshold` | `100` | Inclusive upper bound for the S bucket. |
| `m-threshold` | `500` | Inclusive upper bound for the M bucket. |
| `l-threshold` | `1000` | Inclusive upper bound for the L bucket. Above this is XL. |
| `label-prefix` | `size/` | Label prefix (full label is `<prefix><bucket>`). |
| `exclude-paths` | _lockfiles + `*.snap`_ | Pipe-separated glob list excluded from the count. |
| `fail-on-xl` | `false` | Fail the step when the PR ends up in `XL`. |

## Outputs

| Name | Description |
|---|---|
| `outcome` | `success` or `failure`. |
| `size` | One of `XS`, `S`, `M`, `L`, `XL`. |
| `total` | Total lines changed (additions + deletions, post-exclusion). |

## Label management

The action removes any other label whose name starts with `label-prefix`
before applying the new one, so a PR never accumulates stale size labels.

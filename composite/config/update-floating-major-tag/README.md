<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>update-floating-major-tag</h1></td>
</tr></table>

Composite action that moves the floating `v<major>` tag to point at the latest
non-prerelease release tag. Consumers pin with `@v1` and always resolve to the
newest 1.x.x stable release.

Idempotent: exits early when no stable tag exists or the floating tag is
already at the target SHA.

## Usage

```yaml
- name: Update floating major tag
  if: inputs.ref == 'main'
  uses: <org>/modules-hub/composite/config/update-floating-major-tag@v1
```

Gate the step on the release channel (typically `main` for stable) so
prerelease branches never move the floating tag.

## Inputs

| Name | Required | Description |
|---|---|---|
| `tag_glob` | no | Glob for candidate release tags. Defaults to `v[0-9]*.[0-9]*.[0-9]*`. |
| `prerelease_pattern` | no | Extended regex matching prerelease tags to exclude. Defaults to `-(alpha\|beta\|rc)\.`. |

## Outputs

| Name | Description |
|---|---|
| `has_update` | `true` when the floating tag was force-pushed; `false` when skipped. |
| `latest_stable` | Resolved latest stable tag (empty when none exists). |

## Requirements

- `actions/checkout` must run **before** this composite with `fetch-depth: 0`.
- Git must be configured with credentials allowing a force push to the tag
  (typically inherited from `actions/checkout` when a `token:` was provided).

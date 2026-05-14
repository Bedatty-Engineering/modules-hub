<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>pr-description</h1></td>
</tr></table>

Composite action that fails when a pull request body is empty or contains
nothing but template scaffolding (HTML comments, headings, empty
checkboxes, bullets).

## Usage

```yaml
- name: Validate PR description
  uses: <org>/modules-hub/composite/hub/pr-description@v1
  with:
    min-length: "40"
```

## Inputs

| Name | Default | Description |
|---|---|---|
| `pr-body` | `github.event.pull_request.body` | Body text to validate. |
| `min-length` | `20` | Minimum non-whitespace chars after stripping comments / headings / empty list items. |

## Outputs

| Name | Description |
|---|---|
| `outcome` | `success` or `failure`. |

## How it works

1. Strips `<!-- ... -->` HTML comments (multi-line aware).
2. Drops markdown headings, bare bullets, and unchecked task boxes.
3. Counts the remaining non-whitespace characters; fails under `min-length`.

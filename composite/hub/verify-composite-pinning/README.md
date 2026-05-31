<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>verify-composite-pinning</h1></td>
</tr></table>

Composite action that verifies action references inside composite `action.yml`
files are pinned to an allowed ref.

## Usage

```yaml
- name: Verify composite pinning
  uses: <org>/modules-hub/composite/hub/verify-composite-pinning@v1
  with:
    files: composite/hub/example/action.yml
```

## Inputs

| Name | Required | Description |
|---|---|---|
| `files` | yes | Space-separated composite `action.yml` files to check. |

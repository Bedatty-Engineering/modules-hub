<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>verify-composite-readmes</h1></td>
</tr></table>

Composite action that verifies changed composite directories include a
`README.md` alongside `action.yml`.

## Usage

```yaml
- name: Verify composite READMEs
  uses: <org>/modules-hub/composite/hub/verify-composite-readmes@v1
  with:
    files: composite/hub/example/action.yml composite/hub/example/README.md
```

## Inputs

| Name | Required | Description |
|---|---|---|
| `files` | yes | Space-separated composite `action.yml` and `README.md` files. |

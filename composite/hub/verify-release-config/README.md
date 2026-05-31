<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>verify-release-config</h1></td>
</tr></table>

Composite action that verifies release automation files are present.

## Usage

```yaml
- name: Verify release config
  uses: <org>/modules-hub/composite/hub/verify-release-config@v1
```

## Inputs

| Name | Required | Description |
|---|---|---|
| `config-files` | no | Space-separated semantic-release config files to check. Defaults to common semantic-release config filenames. |
| `required-files` | no | Space-separated files that must exist for release automation. Defaults to `package.json package-lock.json`. |

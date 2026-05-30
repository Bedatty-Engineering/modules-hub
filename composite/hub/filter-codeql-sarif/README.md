<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>filter-codeql-sarif</h1></td>
</tr></table>

Composite action that filters generated CodeQL SARIF files before upload.

It is intended for narrowly scoped suppressions that should stay active in
CodeQL, while removing known first-party findings from the uploaded SARIF.

## Usage

```yaml
- name: Filter CodeQL SARIF
  uses: <org>/modules-hub/composite/hub/filter-codeql-sarif@v1
  with:
    sarif-directory: codeql-results
    rule-id: actions/unpinned-tag
    message-pattern: Bedatty-Engineering/modules-hub/composite/
```

## Inputs

| Name | Required | Description |
|---|---|---|
| `sarif-directory` | no | Directory containing CodeQL SARIF files. Defaults to `codeql-results`. |
| `rule-id` | no | CodeQL rule ID to filter. Defaults to `actions/unpinned-tag`. |
| `message-pattern` | no | Regex pattern for findings to suppress. Defaults to `Bedatty-Engineering/modules-hub/composite/`. |

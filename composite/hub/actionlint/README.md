<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>actionlint</h1></td>
</tr></table>

Composite action that downloads [actionlint](https://github.com/rhysd/actionlint)
and lints all GitHub Actions workflow files in the repository.

## Usage

```yaml
- name: Checkout
  uses: actions/checkout@v4

- name: Lint GitHub workflows
  uses: <org>/modules-hub/composite/hub/actionlint@v1
```

Pin a specific version via the `version` input when you need reproducible runs.

## Inputs

| Name | Required | Description |
|---|---|---|
| `version` | no | actionlint version to install. Defaults to `1.7.4`. |

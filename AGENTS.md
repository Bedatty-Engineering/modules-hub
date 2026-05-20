# modules-hub — Agent Instructions

## Commitlint scopes

Read `commitlint.config.js` before proposing any commit. Allowed scopes for this repo:
`terraform`, `config`, `hub`, `modules`, `release`, `deps`, `docs`

## CI check output — warning/error annotation pattern

**Any CI check added to this repo that produces warnings or errors MUST emit them as GitHub Actions annotations.**

Use the built-in formats where available:
- **yamllint**: `yamllint -f github` (native GitHub annotation output)
- **actionlint**: `-format '{{range $err := .}}::error file={{$err.Filepath}},line={{$err.Line}},col={{$err.Column}}::{{$err.Message}} [{{$err.RuleID}}]{{"\n"}}{{end}}'`
- **Any other linter**: pipe output through a converter that emits `::warning file=PATH,line=N::MESSAGE` or `::error file=PATH,line=N::MESSAGE`

**Why:** The `composite/hub/pr-summary` action uses the GitHub Check Run Annotations API
(`GET /check-runs/{id}/annotations`) to automatically collect findings from every completed
job in the workflow run and render them as collapsible `<details>` toggles in the PR comment,
grouped by job. This requires no changes to `pr-summary` when new checks are added — the only
contract is that each check emits annotations in the standard `::warning/::error` format.

**Never:** capture tool output as a raw string and pass it through job outputs to `pr-summary`.
That approach breaks the generic contract and requires wiring for every new tool.

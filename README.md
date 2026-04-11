<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>modules-hub</h1></td>
</tr></table>

Shared **GitHub Actions**: reusable workflows under `.github/workflows/` and composite actions under `composite/`. Consumed by other repositories via pinned refs (for example release tags).

## Where to look

| What | Where |
|------|--------|
| Reusable workflows | `.github/workflows/*.yml` |
| Composite actions | `composite/**/action.yml` (each folder usually has a `README.md`) |
| Agent / contributor rules | [`AGENTS.md`](AGENTS.md) |
| Detailed conventions | [`.cursor/composite-actions.mdc`](.cursor/composite-actions.mdc), [`.cursor/reusable-workflows.mdc`](.cursor/reusable-workflows.mdc) |

Composites are grouped by **domain** under `composite/<domain>/…` (Terraform, config/bootstrap-style steps, shared hub utilities, etc.). Domains may grow over time — the tree in the repo is the source of truth.

Workflows that only run **in this repository** often use a `self-` prefix and call local reusables with `./.github/workflows/…`.

## Using this from another repository

Reference a reusable workflow with your org, this repo name, file path, and a **pinned ref** (release tag recommended):

```yaml
jobs:
  ci:
    uses: <org>/modules-hub/.github/workflows/<workflow>.yml@v1
    secrets: inherit
```

Composites under `composite/` are normally reached **through** those workflows (`uses: ./composite/…` inside this repo). To call a composite directly from your own workflow YAML, use `<org>/modules-hub/composite/<domain>/<action>@<ref>` — see the `README.md` next to that action for inputs.

## Releases

Versions are published with **semantic-release** (Git tags). Prefer **semver tags** (`@v1`, `@v1.2.3`) over branch names when wiring `uses:` in production.

## Contributing

See [`AGENTS.md`](AGENTS.md) for commit style, security expectations, and where the detailed rules live.

## Conventions (stable)

- Workflow and action metadata use the **`.yml`** extension (not `.yaml`).
- Third-party actions should be pinned by **commit SHA** where possible; this repo’s workflows are typically referenced by **version tag** from consumers.
- Changes that affect callers should be described in PRs and, when needed, in the relevant composite `README.md` or docs next to the feature.

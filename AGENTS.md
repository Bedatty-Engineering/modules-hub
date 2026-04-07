# Agent Guidelines — modules-hub

Read this file before making changes. It orients AI agents and contributors working in this repository.

---

## What this repository is

A **public** collection of reusable **GitHub Actions** workflows and **composite actions** for [Bedatty Engineering](https://github.com/bedatty). Changes here can affect every consumer repo that pins these workflows — treat edits as shared infrastructure.

Primary reference: [`README.md`](README.md).

**Cursor rules (detailed conventions):**

| Topic | File |
|-------|------|
| Composite actions (`composite/…`) | [`.cursor/composite-actions.mdc`](.cursor/composite-actions.mdc) |
| Reusable workflows (`.github/workflows/…`) | [`.cursor/reusable-workflows.mdc`](.cursor/reusable-workflows.mdc) |

---

## Key conventions (read before editing)

### Workflows vs composite actions

| Type | Location | Purpose |
|------|----------|---------|
| Reusable workflow | `.github/workflows/*.yml` | Callable via `workflow_call` from other repositories |
| Composite action | `composite/<domain>/<action>/` | Reusable step bundles, invoked from workflows in this repo |

Domains follow the root README: **`terraform`**, **`config`**, **`hub`**. Each composite must include `action.yml` and `README.md`.

Entrypoint workflows for **this** repo use the `self-*` prefix (e.g. `self-validate.yml`) and call reusables via `./.github/workflows/<name>.yml`.

### Composite paths in reusable workflows

Two different ideas apply when a reusable workflow in **modules-hub** runs for an **external** caller:

1. **`github` context** — Associated with the **caller** (e.g. `github.repository` is the consumer repo). Default **`actions/checkout`** checks out the **caller** (e.g. Terraform stacks live there).
2. **`uses: ./composite/...`** — Resolved from the repository and ref of the **workflow file** (this repo). So steps can run composites from `modules-hub` while the workspace holds the caller’s code.

**Do not** use `uses: ./composite/...` inside workflow YAML that lives in a **consumer** repo unless that repo actually contains the same layout; consumers should call `<org>/modules-hub/.github/workflows/<workflow>.yml@<ref>` instead.

### Skip-enabling outputs

When a workflow or composite gates downstream work (nothing to build, no stacks changed, etc.), expose **outputs** callers can use in `if:` — for example boolean-style `'true'` / `'false'` with names like `has_<noun>`, or the patterns already used here (e.g. matrix driven from JSON). See the Cursor rule files for examples.

### `dry_run`

Add a `dry_run` input only when a workflow **mutates or destroys** external state. Read-only validation workflows do **not** need it. When present, use `type: boolean` and sensible defaults (see [`.cursor/reusable-workflows.mdc`](.cursor/reusable-workflows.mdc)).

### Branches and commits

- Default integration branches in CI today include **`main`** and **`dev`** (see `self-validate.yml`). Do not assume a `develop` branch unless the project adds it.
- Follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject` — aligned with **commitlint** in this repo (`commitlint.config.js`).

### Files to treat carefully

| File | Note |
|------|------|
| `.releaserc.json` | Drives **semantic-release**; coordinate before changing release rules |
| `package.json` / `package-lock.json` | Release and tooling deps |

**Extension:** use **`.yml`** only, not `.yaml`, for workflows, `action.yml`, and YAML config in this repository.

---

## Issues and pull requests

This repository may not yet include `.github/ISSUE_TEMPLATE/`, `pull_request_template.md`, or `CONTRIBUTING.md`. When they exist, follow them. Until then:

- **Issues** — Describe the workflow or composite path, expected vs actual behavior, and a minimal repro or log snippet.
- **PRs** — Use a Conventional Commit-style title; explain what changed, why, and how you validated it (e.g. link to an Actions run).

For **security vulnerabilities**, do not use a public issue if the project defines a private reporting path; use that process when documented.

---

## Refactoring existing workflows or composites

There is no separate `refactoring.mdc` in this repo. For non-trivial edits:

1. Summarize current behavior: inputs, outputs, jobs/steps, and known callers.
2. Propose a short numbered plan; call out **breaking** changes and migration notes.
3. Apply focused diffs; update READMEs or `docs/` when behavior or usage changes.

**Avoid changing without clear need:** input/output names, defaults, required secrets, or step order that alters artifacts or outputs consumers rely on.

---

## Security rules

- **Third-party actions** — Prefer **commit SHA** pins with a `# vX.Y.Z` comment. If `.github/dependabot.yml` exists for Actions, use it for bumps.
- **This repository** — Workflows and composites are referenced by consumers with **version tags** (e.g. `@v1`), not `@main`, in documentation and examples.
- Never use `@main` or `@master` for third-party actions.
- Never hardcode tokens; use `secrets` / `inputs`. Never print secrets in logs or step summaries.

```yaml
# Examples (pattern only — use current SHAs from GitHub)
uses: actions/checkout@<sha> # v4
uses: <org>/modules-hub/composite/terraform/setup@v1
```

### `pull_request_target` — never run unchecked fork code

- Do not checkout the PR head from forks and execute their scripts with elevated permissions.
- Prefer `pull_request` when possible.
- Avoid `secrets: inherit` in ways that expose secrets to untrusted fork code.

### Expression injection — untrusted values in `run:`

Do not interpolate PR titles, bodies, branch names, etc. directly in shell scripts. Pass through `env:` and use shell variables (see [`.cursor/reusable-workflows.mdc`](.cursor/reusable-workflows.mdc)).

### `workflow_run` — artifacts

Treat artifacts from other workflows as untrusted until validated. Do not execute extracted scripts without verification.

### Permissions — least privilege

Declare explicit `permissions:`; default narrow (`contents: read`) and widen only on jobs that need it.

### Forks and secrets

Fork `pull_request` runs do not receive secrets by default — do not bypass that casually. Split trusted vs untrusted workflows if both are required.

### Branches and shell

Quote variables; branch names can contain shell metacharacters.

### Self-hosted runners

Avoid self-hosted runners for public fork `pull_request` / `pull_request_target` unless execution is fully isolated.

### Reserved names

Do not name custom `inputs` or `secrets` with prefixes `GITHUB_*`, `ACTIONS_*`, or `RUNNER_*`. Use names like `github-token`, `RELEASE_TOKEN`, `MANAGE_TOKEN`.

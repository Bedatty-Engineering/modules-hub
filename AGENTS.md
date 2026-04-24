<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>Agent Guidelines — modules-hub</h1></td>
</tr></table>

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

### Display names (`name:` in YAML)

GitHub shows the top-level **`name`** in the Actions UI—use a **suffix** so callables are obvious:

| Artifact | Suffix on `name:` | Notes |
|----------|-------------------|--------|
| **Reusable workflow** (`on: workflow_call`) | **` [Reusable]`** | e.g. `Terraform Plan [Reusable]` |
| **Composite action** (`composite/.../action.yml`) | **` [composite]`** | lowercase label, consistent across composites |
| **`self-*` workflow** (entrypoint only) | *(none)* | Not the reusable definition; keep a short title (e.g. `Validate`) |

Older files may predate this rule; rename opportunistically when editing.

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
- **Scope is mandatory** and must be one of the values enforced by `commitlint.config.js` (`scope-enum`). The authoritative list lives in that file; the current mapping is:

  | Scope | Area |
  |---|---|
  | `terraform` | `composite/terraform/**`, Terraform workflows |
  | `config`    | `composite/config/**`, top-level workflow files (`self-*.yml`, `validate.yml`, `release.yml`), GitHub metadata |
  | `hub`       | `composite/hub/**` |
  | `modules`   | `composite/modules/**` |
  | `release`   | `.releaserc.json`, `package*.json`, `commitlint.config.js` |
  | `deps`      | dependency bumps (Dependabot uses `chore(deps): `) |
  | `docs`      | `docs/**`, READMEs, `AGENTS.md` |

  Generic scopes such as `ci`, `test`, `build` are **not** accepted. When in doubt, read `commitlint.config.js` and recent commit history before crafting the message.

### Documentation and comments *(low churn)*

Write **markdown, YAML comments, and code comments** so they stay useful without constant edits:

- Prefer **short, generic, assertive** wording over exhaustive lists that go stale (inventories of files, versions, or actions).
- Put **volatile detail** in the source of truth (workflows, `action.yml`, manifests); docs should state **rules and pointers**, not duplicate tables that drift.
- In **code**, comment **why** or non-obvious constraints—not a play-by-play of obvious syntax.
- If a doc would need updating on every small change, **narrow the doc** or **remove the duplication** instead.

**Dependabot** (see below) follows the same idea: keep `.github/dependabot.yml` headers minimal.

### Files to treat carefully

| File | Note |
|------|------|
| `.releaserc.json` | Drives **semantic-release**; coordinate before changing release rules |
| `package.json` / `package-lock.json` | Release and tooling deps |
| `.github/dependabot.yml` | Dependabot config; filename **`dependabot.yml`** only (GitHub). Adjust **`groups` / `ignore`** when new external `owner/*` actions appear—see **Dependabot maintenance** |

**Extension:** use **`.yml`** only, not `.yaml`, for workflows, `action.yml`, and YAML config in this repository. **Exception:** the Dependabot file must be exactly `.github/dependabot.yml` as required by GitHub.

### Dependabot maintenance

Same discipline as **Documentation and comments** above: no long inventories in the YAML header.

When **`uses:`** adds a **new external `owner/*` namespace** not covered by **`groups.patterns`**, update **`groups`** (and **`ignore`** only when something must not auto-update). Keep **`prefix: "chore(deps): "`** for **commitlint**; third-party actions use **SHA + `# vX.Y.Z`** in YAML; review Dependabot PRs before merge.

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

- **Third-party actions** — Prefer **commit SHA** pins with a `# vX.Y.Z` comment. If `.github/dependabot.yml` exists, use it for bumps; when a **new `owner/*`** appears, extend **`groups`** / **`ignore`** as needed (see **Dependabot maintenance**).
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

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

---

## Reusable Workflows

**Docs and comments:** Prefer stable, **generic** README and YAML commentary—assert rules, avoid exhaustive lists that go stale. See **Documentation and comments** below.

### Modifying an existing workflow?

For non-trivial edits, summarize current jobs, inputs, secrets, and callers; outline the change and blast radius before refactoring. Match patterns used in sibling workflows in this repository.

---

### Before you create anything

**Step 1 — Check if it already exists in this repo**

Search `.github/workflows/` before starting. If a workflow already covers the same pipeline:

- Summarize what it does: jobs, `workflow_call` inputs, secrets, and notable `env`
- Identify the gap versus the new requirement
- Propose an **adaptation plan** (new job, new input, new secret, split workflow) instead of duplicating files

**Step 2 — Check the GitHub Actions Marketplace first**

Before large inline shell in a workflow, search the [Marketplace](https://github.com/marketplace?type=actions):

- Prefer maintained actions over ad-hoc scripts for non-trivial logic
- If wrapping is needed, add or extend a composite under `composite/<domain>/<name>/` and call it from the workflow (see **Composite Actions** below)
- **Third-party actions** (outside the org) must be pinned by **commit SHA**, with a `# vX.Y.Z` comment for humans. If `.github/dependabot.yml` exists for Actions, use it to bump SHAs
- **Actions from within this org** (`Bedatty-Engineering/*`) may be pinned by **release tag** (e.g. `@v1`) — SHA is still acceptable but not required
- **Composites from this repo** in reusable workflows that may be called from **external repos**: use the full path `Bedatty-Engineering/modules-hub/composite/<domain>/<name>@<ref>` — GitHub resolves `./composite/...` against the **caller's** filesystem, so a local path fails for external callers. The `./` shorthand is only safe in `self-*` entrypoint workflows that always run within this repo
- Never use `@main` or `@master` for third-party actions
- Document non-obvious action choices in **`docs/terraform/`**, **`docs/hub/`**, or the relevant **`README.md`**, depending on area (see root `README.md`)

**Step 3 — Keep Dependabot in sync**

After you add or change **`uses:`** on an external action in `.github/workflows/`:

1. Open **`.github/dependabot.yml`** (must use that exact filename on GitHub).
2. If a **new `owner/*` namespace** is not covered by **`groups.patterns`**, add or extend **`groups`**; add **`ignore`** only when an action must not auto-update. Do **not** maintain a detailed per-action inventory in YAML comments—keep the header **generic** (see **Dependabot maintenance** below).
3. Keep Dependabot commit **`prefix: "chore(deps): "`** for **commitlint**.

**Commit scopes:** every commit must declare a scope from the allowlist in `commitlint.config.js` (`scope-enum`). Workflow and composite changes typically use `config`. Generic scopes like `ci`, `test`, `build` are rejected. See **Branches and commits** below.

Only implement from scratch when nothing suitable exists or security/customization requires it.

---

### Architecture model

```
Caller repository workflow    ← triggers, `uses:` reusable workflow, `secrets:` / `with:`
         ↓
Reusable workflow             ← jobs, runners, permissions, secrets, matrix
(.github/workflows/*.yml)
         ↓
Composite action              ← shared steps
(composite/<domain>/<name>/action.yml)
```

**Rules:**

- Caller workflows stay thin: triggers, job(s) that call reusable workflows, pass `with:` and `secrets:`
- Reusable workflows own job structure, `permissions`, secret wiring, and `if:` / `needs:` orchestration
- Composites own step sequences for one capability (see **Composite Actions** below)

**Example (this repo — Terraform plan)**

```
caller: consumer repo  .github/workflows/terraform-plan.yml  (on: pull_request)
    ↓
reusable: <org>/modules-hub/.github/workflows/terraform-plan.yml@v1
    ↓ job: detect-changes  →  ./composite/terraform/detect-stacks
    ↓ job: plan (matrix)   →  ./composite/terraform/setup, plan-make | plan, post-plan-comment, …
```

### When to use each

| Need | Use |
|---|---|
| Standardize a full pipeline across repos | Reusable workflow |
| Reuse steps inside a job | Composite under `composite/` |
| Multiple jobs, matrix, environments | Reusable workflow |
| Pass secrets from caller into jobs | Reusable workflow (`secrets:` on `workflow_call`) |

### Display name (`name:`)

- Workflows that expose **`on: workflow_call`** (reusable definitions) must set top-level **`name:`** to end with **` [Reusable]`** (e.g. `Validate [Reusable]`, `Terraform Plan [Reusable]`).
- **`self-*` entrypoints** must **not** use `[Reusable]`—they are thin wrappers; use a short plain title (e.g. `Validate`, `Release`).

### self-* workflows (entrypoints for this repo)

Files prefixed with `self-` are **thin entrypoints** for automation in **this** repository only. They are not reusable via `workflow_call` from other repos.

Rules:

- **Must NOT declare `workflow_call`** on the `self-*` file itself
- **`dry_run`** — only add when the workflow can mutate or destroy something; follow the boolean conventions below
- Call reusable workflows with a **repo-relative path**: `./.github/workflows/<name>.yml`
- Triggers are repo-specific (`push`, `pull_request`, `workflow_dispatch`, …)
- Keep logic minimal; orchestration lives in the reusable workflow

```yaml
# ✅ Pattern used in this repo (simplified)
name: Validate
on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]
jobs:
  ci:
    uses: ./.github/workflows/validate.yml
    with:
      is_pull_request: ${{ github.event_name == 'pull_request' }}
```

---

### Runner

Use the same runner labels as existing workflows in this repository. Today that is **`ubuntu-latest`** for reusable workflows such as `validate.yml`, `terraform-plan.yml`, and `release.yml`.

```yaml
jobs:
  plan:
    runs-on: ubuntu-latest
```

If the organization later standardizes on a different label (e.g. larger GitHub-hosted or custom runner), update workflows together and adjust this rule.

### Workflow structure

Reusable workflows intended for **external callers** should:

- Declare `on: workflow_call` with explicit `inputs` and `secrets` as needed — avoid relying on implicit undocumented context
- Declare **`permissions:`** explicitly (see Security — least privilege)
- Prefer **not** mixing unrelated concerns in one file (split Terraform plan vs apply vs validate vs release)

**`workflow_dispatch` on reusable workflows:** avoid unless there is a clear need. If operators need a manual entrypoint, a **`self-*`** workflow with `workflow_dispatch` that calls the reusable workflow is often clearer.

**`dry_run` input:** add only when the workflow **applies** changes (deploy, release to prod, destructive cleanup, etc.), not for read-only validation.

When present:

- `type: boolean`, `required: false`
- `default: true` for destructive operations (preview safe by default)
- `default: false` for non-destructive but state-changing syncs when "run for real" is the common case

```yaml
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      dry_run:
        description: Preview changes without applying them
        required: false
        type: boolean
        default: true
    secrets:
      DEPLOY_TOKEN:
        required: true
```

Dry-run vs real-run logging (when you implement `dry_run`):

| Mode | Goal |
|---|---|
| `dry_run: true` | Verbose preview; tool flags like `--dry-run`, `--plan` where applicable |
| `dry_run: false` | Apply; avoid noisy debug unless diagnosing failures |

### Configurability — bridge callers and composites

Reusable workflows surface **caller-facing** toggles as `workflow_call` inputs and pass them into composites with `with:`. Use **`if:`** on steps (or jobs) to skip entire composite invocations when a feature is off.

- Workflow inputs: prefer **`snake_case`**
- Composite inputs: typically **`kebab-case`** (pass explicitly in `with:`)

```yaml
on:
  workflow_call:
    inputs:
      post_plan_comment:
        type: boolean
        default: true
      use_makefile:
        type: boolean
        default: true

jobs:
  plan:
    steps:
      - name: Plan (Makefile)
        if: inputs.use_makefile == true
        uses: ./composite/terraform/plan-make
        with:
          stack: ${{ matrix.stack }}

      - name: Post plan to PR
        if: always() && inputs.post_plan_comment == true && github.event_name == 'pull_request'
        uses: ./composite/terraform/post-plan-comment
        with:
          stack_name: ${{ matrix.stack }}
```

### Skip-enabling outputs and conditional jobs

When downstream work should be skipped (nothing to build, no stacks changed, etc.):

- Prefer **`workflow_call` `outputs`** that callers can use in `if:` on dependent jobs, **or**
- Document patterns already used here (e.g. matrix from JSON, `needs.<job>.outputs.stacks != '[]'`)

For simple yes/no gates, use boolean-style strings `'true'` / `'false'` and names like `has_<noun>`:

```yaml
on:
  workflow_call:
    outputs:
      has_changes:
        description: Whether there is work to do (true/false)
        value: ${{ jobs.detect.outputs.has_changes }}
```

### Step section titles

When a job has several logical step groups, use section comments:

```yaml
# ----------------- Setup -----------------
- name: Checkout
  uses: actions/checkout@<sha> # v4

# ----------------- Terraform -----------------
- name: Setup Terraform
  uses: ./composite/terraform/setup
```

**Rules:**

- Format: `# ----------------- Title -----------------`
- Use when there are two or more clear groups in the same job
- Comment immediately before the first step of the group (no blank line between comment and step)

### Referencing composites from reusable workflows

Understand **two different "repos"** when a reusable workflow in `modules-hub` is called from another repository:

1. **`github` context** — For reusable workflows, the `github` context is tied to the **caller** workflow (e.g. `github.repository` is the consumer repo). Default **`actions/checkout`** therefore checks out the **caller** — which is what you want when Terraform stacks and app code live in the consumer repo.
2. **Local composite paths (`uses: ./composite/...`)** — GitHub resolves `./` against the **caller's** checkout, **not** the reusable workflow's repo. This means `./composite/...` will **fail** when the workflow is called from an external repo. Use the full path with a ref instead: `Bedatty-Engineering/modules-hub/composite/<domain>/<name>@<ref>`. The `./` shorthand is only safe in `self-*` entrypoint workflows that always run within this repo.

Implications:

- **Consumers** should not copy `composite/` into their repo for those steps; they call the **reusable workflow URL** with a pinned `@ref`.
- **Do not** use `uses: ./composite/...` inside reusable workflows — GitHub resolves `./` against the caller's checkout, so the composite won't be found. Use `Bedatty-Engineering/modules-hub/composite/...@<ref>` instead.
- If a step needs files from **both** repos, combine default checkout (caller) with explicit `actions/checkout` of `modules-hub` only when truly necessary — most Terraform flows here rely on caller checkout + hub composites only.

### Secrets management

Secrets always come from the **caller** — never hardcode values in reusable workflows.

```yaml
# Caller
jobs:
  release:
    uses: <org>/modules-hub/.github/workflows/release.yml@v1
    secrets:
      RELEASE_TOKEN: ${{ secrets.RELEASE_TOKEN }}

# Reusable workflow
on:
  workflow_call:
    secrets:
      RELEASE_TOKEN:
        required: true
```

Use `secrets: inherit` only when appropriate and safe for the trigger (never blindly with `pull_request_target` from forks — see Security).

### Naming conventions

- **Descriptive, kebab-case file names:** `terraform-plan.yml`, `validate.yml`, `self-validate.yml`
- Avoid generic names like `ci.yml` or `pipeline.yml` unless the scope is truly repo-wide and documented
- Extension **`.yml`** only, not `.yaml`, for workflows and action metadata

### Documentation

- **Terraform** consumers: maintain or add guides under **`docs/terraform/`** (see root `README.md`) when behavior is non-trivial
- **Hub / shared actions:** use **`docs/hub/`** when present
- **Per-workflow** `docs/<same-name-as-workflow>.md` is optional; prefer the area docs above when they already cover usage
- Do not require a third-party org branding header; keep docs consistent with Bedatty Engineering / this repo

#### Usage example ref policy

In docs and README examples, avoid recommending **`@main`** for production:

```yaml
# Testing — branch
uses: <org>/modules-hub/.github/workflows/terraform-plan.yml@chore/my-branch

# Production — semver tag
uses: <org>/modules-hub/.github/workflows/terraform-plan.yml@v1
```

### Anti-patterns

```yaml
# ❌ Huge inline script in workflow — extract to composite or script with review
run: |
  200 lines of bash ...

# ❌ Composite with jobs: (invalid — composites are steps only)
runs:
  using: composite
  jobs: ...

# ❌ Using uses: ./composite/... from a workflow YAML that lives in the consumer repo
#    (local ./ actions resolve from the repo that owns that workflow file — use <org>/modules-hub/.github/workflows/... instead)

# ❌ `./composite/...` in a reusable workflow — GitHub resolves ./ against the caller's checkout, not this repo
uses: ./composite/hub/actionlint

# ❌ Third-party action at a mutable ref
uses: some-owner/some-action@main

# ❌ Third-party action pinned by tag instead of SHA — tags can be force-pushed
uses: some-owner/some-action@v3

# ✅ Third-party action pinned by SHA with version comment
uses: some-owner/some-action@abc1234def5678 # v3

# ✅ Org-internal composite in a reusable workflow — full path with tag
uses: Bedatty-Engineering/modules-hub/composite/hub/actionlint@v1

# ✅ Org-internal workflow pinned by tag
uses: Bedatty-Engineering/modules-hub/.github/workflows/validate.yml@v1

# ✅ `./composite/...` ONLY inside self-* entrypoints (same-repo calls)
uses: ./composite/hub/actionlint  # valid only in self-* workflows
```

### Security rules

- **Pin third-party actions by commit SHA** where feasible; add `# vX.Y.Z` for readability
- **Composites and workflows from this repo** use **version tags** for external refs (`@v1`, …)
- Never use `@main` / `@master` for third-party actions
- Do not interpolate untrusted input directly into `run:` (see below)
- Do not print secrets (`echo`, env dumps, step summaries)
- Heavy branching and policy belong in the workflow for visibility in logs

#### pull_request_target — NEVER checkout fork code

- Do not checkout the PR head from forks in `pull_request_target` and then run their code with elevated token
- If `pull_request_target` is required (labels, comments on base), avoid executing fork-supplied build/test scripts
- Prefer `pull_request` when possible
- Do not use `secrets: inherit` in ways that expose all secrets to untrusted fork code

#### Expression injection — sanitize untrusted inputs in `run:`

Avoid passing these directly inside `run:` script bodies; use `env:` indirection:

```yaml
# ❌ Injectable in run: body
${{ github.event.pull_request.title }}
${{ github.event.pull_request.body }}
${{ github.head_ref }}
# ... (issue/comment/commit/discussion fields — same idea)
```

```yaml
# ✅ Pass through env, reference shell variable
env:
  PR_TITLE: ${{ github.event.pull_request.title }}
run: echo "$PR_TITLE"
```

#### workflow_run — treat artifacts as untrusted

- Do not trust artifact contents from another workflow without validation
- Never extract and run scripts from artifacts without verification

#### Permissions — least privilege

- Set explicit `permissions:` at workflow level where possible
- Default narrow (`contents: read`); escalate per job (e.g. `pull-requests: write` only on jobs that comment)
- Avoid `write-all` and avoid leaving permissions implicit when broad defaults are unsafe

```yaml
permissions:
  contents: read

jobs:
  comment:
    permissions:
      pull-requests: write
```

#### Secrets in fork contexts

- Fork `pull_request` runs do not receive secrets by default — do not bypass that casually
- If both secrets and untrusted code are needed, split trusted vs untrusted workflows (`pull_request` + `workflow_run` pattern)

#### Script injection via branches / labels

- Quote variables in shell; branch names can contain metacharacters

```yaml
env:
  BRANCH_NAME: ${{ github.head_ref }}
run: echo "$BRANCH_NAME"
```

#### Self-hosted runners

- Do not use self-hosted runners for `pull_request` / `pull_request_target` from **public** forks unless you fully isolate untrusted code
- Safer triggers: `push`, `workflow_dispatch`, `schedule`, internal PRs only (org policy)

#### Reserved names — secrets and inputs

Do not declare custom `secrets:` or `inputs:` names that collide with GitHub reserved prefixes:

| Prefix | Examples |
|---|---|
| `GITHUB_*` | `GITHUB_TOKEN`, `GITHUB_SHA` |
| `ACTIONS_*` | `ACTIONS_RUNTIME_TOKEN` |
| `RUNNER_*` | `RUNNER_OS` |

For a custom PAT from the caller, use names like `MANAGE_TOKEN`, `BOT_TOKEN`, or `GH_PAT`.

```yaml
# ❌
secrets:
  GITHUB_TOKEN:
    required: true

# ✅
secrets:
  RELEASE_TOKEN:
    required: true
```

---

## Composite Actions

**Docs and comments:** Prefer stable, **generic** README and YAML commentary—assert rules, avoid exhaustive lists that go stale. See **Documentation and comments** below.

### Display name (`name:`)

Every **`composite/.../action.yml`** must set top-level **`name:`** to end with **` [composite]`** (e.g. `Setup Terraform [composite]`) so the Actions UI distinguishes composites from jobs and marketplace actions.

### Modifying an existing composite?

For non-trivial changes, summarize behavior today, the intended change, and which workflows or repos call the composite; confirm the plan before large refactors. Keep edits consistent with sibling actions under the same domain (`composite/terraform/*`, `composite/config/*`, `composite/hub/*`).

---

### Before you create anything

**Step 1 — Check if it already exists in this repo**

Search `composite/` before starting. If a composite already covers the same capability:

- Summarize what the existing composite does and which inputs it exposes
- Identify the gap between the existing behavior and the new requirement
- Propose an **adaptation plan** (add an input, extend steps, split into two) instead of creating a new directory

**Step 2 — Check the GitHub Actions Marketplace first**

Before writing custom steps from scratch, search the [Marketplace](https://github.com/marketplace?type=actions) for an existing action that covers the need:

- Prefer a well-maintained marketplace action over custom shell scripting for non-trivial logic
- Wrap it in a composite under `composite/<domain>/<name>/` if it needs input normalization or extra steps
- **Third-party actions** (outside the org) **must be pinned by commit SHA**, not by tag — add a `# vX.Y.Z` comment for readability (e.g. `uses: actions/checkout@abc123 # v4`). Tags can be moved or force-pushed upstream. If the repo uses Dependabot for Actions, SHA updates can be automated there.
- **Actions from within this org** (`Bedatty-Engineering/*`) may be pinned by **release tag** (e.g. `@v1`) — SHA is still acceptable but not required
- **Local composites** referenced via `./composite/...` are only safe in `self-*` entrypoint workflows that run within this repo. In reusable workflows callable from external repos, GitHub resolves `./` against the **caller's** checkout — use the full path `Bedatty-Engineering/modules-hub/composite/<domain>/<name>@<ref>` instead
- Never use `@main` or `@master` for third-party actions
- Document in the composite `README.md` why a third-party action was chosen (and any version pin rationale)

**Step 3 — Keep Dependabot in sync**

After you add or change **`uses:`** on an external action in `action.yml`:

1. Open **`.github/dependabot.yml`** (must use that exact filename on GitHub).
2. If a **new `owner/*` namespace** is not covered by **`groups.patterns`**, add or extend **`groups`**; add **`ignore`** only when an action must not auto-update. Do **not** grow a long per-action comment block in that file—keep the YAML header **generic** (see **Dependabot maintenance** below).
3. Keep Dependabot commit **`prefix: "chore(deps): "`** for **commitlint**.

**Commit scopes:** every commit must declare a scope from the allowlist in `commitlint.config.js` (`scope-enum`). Composite changes typically use `config`, `hub`, `modules`, or `terraform` depending on the domain. Generic scopes like `ci`, `test`, `build` are rejected. See **Branches and commits** below.

Only implement from scratch when no suitable action exists or when existing ones do not meet security or customization requirements.

---

### Directory layout

Composites live under **`composite/<domain>/<name>/`**, grouped by domain (see root `README.md`):

```
composite/
├── terraform/<action>/   ← Terraform plan/apply, masking, Makefile helpers, …
├── config/<action>/      ← Bootstrap / repo configuration (e.g. GPG setup)
└── hub/<action>/         ← Reserved for non-Terraform, non-config shared steps
```

Each composite has exactly two files:

```
composite/config/setup-gpg/
├── action.yml   ← required
└── README.md    ← required
```

> **File extension rule:** always use `.yml`, never `.yaml`. This applies to `action.yml`, workflow files, and YAML config in this repository.

### Relationship to reusable workflows

```
Caller repository workflow    ← triggers + job references
         ↓
Reusable workflow             ← jobs, runners, secrets, matrix
(.github/workflows/*.yml)
         ↓
Composite action            ← reusable step bundles
(composite/<domain>/<name>/action.yml)
```

**Rules:**

- Caller workflows stay thin (triggers, `uses:` of reusable workflows, secrets)
- Reusable workflows orchestrate jobs and pass inputs into composites
- Composites encapsulate steps for a single responsibility

### action.yml structure

```yaml
name: Human-readable name [composite]
description: One-line description.

inputs:
  github-token:
    description: GitHub token with required permissions
    required: true
  some-option:
    description: What this option controls
    required: false
    default: "default-value"

runs:
  using: composite
  steps:
    - name: Checkout
      uses: actions/checkout@<sha> # v4
    - name: Do the work
      uses: some-owner/some-action@<sha> # v1
      with:
        token: ${{ inputs.github-token }}
        option: ${{ inputs.some-option }}
```

### Configurability — defaults first, override when needed

Every composite should be **usable with sensible defaults** where possible. Optional inputs should declare a `default` so callers can omit them unless they need to override.

#### Composite layer — defaults for optional inputs

```yaml
inputs:
  plan_file:
    description: Path (relative to workspace) for plan output
    required: false
    default: plan-output.txt
```

#### Reusable workflow layer — expose toggles for optional behavior

When behavior is optional at the pipeline level (skip a step, choose Makefile vs directory mode), expose inputs on `workflow_call` and use `if:` on steps — pass values into composites when those steps run.

```yaml
on:
  workflow_call:
    inputs:
      post_plan_comment:
        type: boolean
        default: true
      use_makefile:
        type: boolean
        default: true

jobs:
  plan:
    steps:
      - name: Plan (Makefile)
        if: inputs.use_makefile == true
        uses: ./composite/terraform/plan-make
        with:
          stack: ${{ matrix.stack }}

      - name: Post plan to PR
        if: always() && inputs.post_plan_comment == true && github.event_name == 'pull_request'
        uses: ./composite/terraform/post-plan-comment
        with:
          stack_name: ${{ matrix.stack }}
```

**Rules:**

- Optional **feature-style** inputs on the composite should have a `default`; avoid `required: true` for pure toggles
- Reusable workflow `workflow_call` inputs often use **snake_case**; map them explicitly into composite `with:` (composite inputs typically use **kebab-case**)
- Job/step-level `if:` that decides *whether* a composite runs belongs in the **reusable workflow** (or caller), not hidden inside unrelated composites

### Skip-enabling outputs

Composites that detect changes, drift, or pass/fail gates should expose **boolean outputs** (string `'true'` / `'false'`) so callers can skip downstream work.

```yaml
outputs:
  has_changes:
    description: Whether any changes were detected (true/false)
    value: ${{ steps.detect.outputs.has_changes }}
```

Naming: `has_<noun>` (e.g. `has_changes`, `has_updates`, `has_drift`).

### Step section titles

When a composite has more than one logical group of steps, separate groups with a titled section comment:

```yaml
runs:
  using: composite
  steps:
    # ----------------- Setup -----------------
    - name: Setup Terraform
      ...

    # ----------------- Plan -----------------
    - name: Terraform plan
      ...
```

**Rules:**

- Format: `# ----------------- Title -----------------`
- Use when there are two or more logical groups
- Place the comment immediately before the first step of the group (no blank line between comment and step)

### Design rules

- **Roughly 5–15 steps** — split if much larger
- **Single responsibility** — one composite, one capability
- Must not define `jobs:` or `uses:` a reusable workflow (only `steps:` under `runs:`)
- Avoid duplicating full pipeline policy inside the composite when the workflow already branches with `if:`
- Avoid mixing unrelated toolchains in one composite (e.g. do not combine heavy Terraform and unrelated runtimes in a single action unless the repo explicitly standardizes that)

### Domain examples (this repo)

Terraform-focused steps:

```
composite/terraform/setup/           ← Terraform CLI on PATH
composite/terraform/plan/            ← init, validate, plan in a directory
composite/terraform/detect-stacks/   ← change detection for matrix stacks
```

Cross-cutting / repo setup:

```
composite/config/setup-gpg/          ← signing keys for release flows
```

Add new **hub** composites under `composite/hub/<name>/` when they are not Terraform- or config-specific.

### Runner

Composites inherit the runner from the calling job. In **README examples**, use the same runner style as reusable workflows in this repository (currently **`ubuntu-latest`** unless a workflow explicitly standardizes on another label):

```yaml
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - uses: <org>/modules-hub/composite/terraform/plan@v1
        with:
          working_directory: stacks/my-stack
```

### README.md expectations

Align with existing composites in this repo (see `composite/config/setup-gpg/README.md` as a reference):

1. **Title** and short description of what the action does
2. **Usage** — full `uses:` example with path `<org>/modules-hub/composite/<domain>/<name>@<ref>` and `with:` / secrets as needed
3. **Inputs** table — name, required, description (and default when relevant)
4. **Outputs** table — when the composite defines outputs
5. **Permissions or secrets** — when callers must grant scopes or add repository secrets

Optional: link to `docs/terraform/` or `docs/hub/` when the behavior is documented there.

#### Usage example ref policy

Do not tell consumers to pin **`@main`** for releases. Prefer:

```yaml
# Testing — branch or pre-release ref
uses: <org>/modules-hub/composite/terraform/plan@chore/my-branch

# Production — semver tag from release automation
uses: <org>/modules-hub/composite/terraform/plan@v1
```

### After adding a new composite

- Update **root `README.md`** (domain table) if the composite is part of the public contract for external callers
- If the composite is Terraform-related, update or add docs under **`docs/terraform/`** when behavior is non-obvious

### Reserved names — never use as input names

Never declare inputs using GitHub reserved prefixes — they can be overridden or break resolution:

```yaml
# ❌ Reserved — will conflict with the runtime variable
inputs:
  GITHUB_TOKEN:
  GITHUB_SHA:
  ACTIONS_RUNTIME_TOKEN:
  RUNNER_OS:

# ✅ Use distinct names
inputs:
  github-token:
  manage-token:
```

Reserved prefixes: `GITHUB_*`, `ACTIONS_*`, `RUNNER_*`.

---

## Documentation and comments

Prefer stable, **generic** README and YAML commentary — assert rules and invariants, avoid exhaustive lists of specific files, action versions, or workflow names that go stale. Write _why_ a rule exists, not a catalog of current state.

## Branches and commits

Every commit must declare a scope from the allowlist in `commitlint.config.js` (`scope-enum`). Generic scopes like `ci`, `test`, `build` are rejected. Use the domain-specific scope that best fits the change.

## Dependabot maintenance

In `.github/dependabot.yml`, keep the header generic. Use `groups.patterns` to cover namespaces — do not maintain a per-action inventory in YAML comments. Add `ignore` entries only when an action must not auto-update.

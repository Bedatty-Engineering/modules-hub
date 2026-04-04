# Terraform — usage

Reusable workflows: **`.github/workflows/terraform/`**. Actions: **`composite/terraform/<name>/`** (each folder has `action.yml`).

From a repo with `stacks/`, `modules/`, and a root `Makefile` (e.g. **infra-cloudflare**):

```yaml
# Caller: .github/workflows/terraform-plan.yml
name: Terraform Plan
on:
  pull_request:
    branches: [main]
    paths: [stacks/**, modules/**]

permissions:
  contents: read
  issues: write
  pull-requests: write

concurrency:
  group: terraform-plan-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  terraform:
    uses: Bedatty-Engineering/modules-hub/.github/workflows/terraform/plan.yml@main
    with:
      terraform_version: "1.7.5"
      concurrency_group: ${{ github.event.pull_request.number }}
    secrets: inherit
```

```yaml
# Caller: .github/workflows/terraform-apply.yml
name: Terraform Apply
on:
  push:
    branches: [main]
    paths: [stacks/**, modules/**]

permissions:
  contents: read
  issues: write
  pull-requests: write

jobs:
  terraform:
    uses: Bedatty-Engineering/modules-hub/.github/workflows/terraform/apply.yml@main
    with:
      terraform_version: "1.7.5"
    secrets: inherit
```

Pin a **tag** or **commit SHA** instead of `@main` when you need stable CI.

### Secrets (per GitHub Environment)

Typical names: `TF_API_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ZONE_ID`. Variable `DOMAIN` is passed as `TF_VAR_domain`.

### Without Makefile

Set `use_makefile: false` in `with:`. The workflow runs `composite/terraform/setup` then `plan` or `apply` under `${stacks_dir}/${stack}`.

## Actions under `composite/terraform/`

| Folder | Role |
|--------|------|
| `detect-stacks` | Git diff → JSON stack list |
| `mask-secrets` | Log masking for TFC + Cloudflare |
| `setup` | Install Terraform CLI |
| `verify-tfc-token` | Assert `TF_TOKEN_app_terraform_io` |
| `init-make` / `validate-make` / `plan-make` / `apply-make` | Makefile targets |
| `plan` / `apply` / `destroy` | Raw Terraform (run `setup` first) |
| `post-plan-comment` | PR comment + collapsible plan |
| `report-apply-failure` | Issue on failed apply |

Standalone example:

```yaml
- uses: Bedatty-Engineering/modules-hub/composite/terraform/plan@v1.0.0
  with:
    working_directory: stacks/my-app
```

`uses:` points at the directory that contains `action.yml`.

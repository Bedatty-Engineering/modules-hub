# Hub repository layout

| Area | Path | Purpose |
|------|------|---------|
| **Terraform** | `.github/workflows/terraform/` | Reusable plan / apply workflows |
| **Terraform** | `composite/terraform/<action>/` | One composite action per folder |
| **Config** | `composite/config/<action>/` | Configuration / bootstrap helpers (optional) |
| **Hub** | `composite/hub/<action>/` | Everything else that is not Terraform or config |
| **Hub CI** | `.github/workflows/hub/` | Validates this repository |
| **Docs** | `docs/terraform/`, `docs/hub/` | Documentation by area |

Terraform workflows reference actions with `./composite/terraform/<action>` from the repo root.

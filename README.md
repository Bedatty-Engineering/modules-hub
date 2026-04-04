# modules-hub

Shared **GitHub Actions** for Bedatty Engineering. Layout is **by domain** (`terraform`, `config`, `hub`, …) — no extra `composites` layer; each action is `composite/<domain>/<action>/`.

## Layout

| Domain | Path | Role |
|--------|------|------|
| Terraform | `composite/terraform/<action>/` | Actions for Terraform reusable workflows |
| Config | `composite/config/` | Reserved for config/bootstrap-style actions |
| Hub | `composite/hub/<action>/` | Non-Terraform, non-config actions |
| Terraform workflows | `.github/workflows/terraform/` | `plan.yml`, `apply.yml` |
| Hub CI | `.github/workflows/hub/ci.yml` | Lint & checks for this repo |
| Docs | `docs/terraform/`, `docs/hub/` | Per-area documentation |

## Quick start

- **Terraform:** [docs/terraform/usage.md](docs/terraform/usage.md)  
- **Structure:** [docs/hub/architecture.md](docs/hub/architecture.md)

## Credits

Maintained by [@bedatty](https://github.com/bedatty).

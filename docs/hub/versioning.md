# Versioning this repository

- Tag releases (`v1.2.0`) from `main` with your normal release process.
- **Consumers should pin** reusable workflows (`…/terraform/plan.yml@ref`) and actions (`…/composite/terraform/<name>@ref`) to a **tag or SHA**, not floating `@main`, for reproducible CI.
- Breaking changes to `inputs` or paths → **major**; additive inputs → **minor**; fixes → **patch**.

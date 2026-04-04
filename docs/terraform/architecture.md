# Terraform — architecture

- **Workflows:** `.github/workflows/terraform/plan.yml` and `apply.yml` orchestrate jobs only; they `uses:` actions under `composite/terraform/<name>/`.
- **Actions:** each subfolder of `composite/terraform/` is one responsibility (detect stacks, mask secrets, Makefile wrappers, CLI plan/apply/destroy, PR comment, failure issue).

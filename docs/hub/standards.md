# Hub standards

- **English** for workflow names, comments, and shared docs.
- **Secrets** must not leak into logs; Terraform-related masking is implemented in `composite/terraform/mask-secrets`.
- **Permissions:** default `contents: read`; add `pull-requests: write` / `issues: write` only when comments or issues are created.
- **Composites:** keep steps small; prefer maintained third-party actions over custom scripts when possible.

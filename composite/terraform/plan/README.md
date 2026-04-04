# Terraform plan (directory)

Runs `terraform init`, `validate`, and `plan`. Install Terraform first (e.g. `composite/terraform/setup`). Plan output is teed to `plan_file` (default `plan-output.txt`).

```yaml
- uses: Bedatty-Engineering/modules-hub/composite/terraform/setup@main
  with:
    terraform_version: "1.7.5"
- uses: Bedatty-Engineering/modules-hub/composite/terraform/plan@main
  with:
    working_directory: stacks/my-stack
```

Set `TF_VAR_*` and provider auth on the job before these steps.

# Detect changed stacks

Runs `git diff` against PR bases or `HEAD~1..HEAD` on pushes, maps paths under `stacks_dir` / `modules_dir` to stack names, and outputs a JSON array for matrix jobs.

Requires `jq` (available on `ubuntu-latest`). For `range_mode: push`, checkout with `fetch-depth: 2` or more.

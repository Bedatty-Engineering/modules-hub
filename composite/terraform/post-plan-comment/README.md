# Post plan comment

Uses `github-script` to comment on the PR. Requires `pull-requests: write` and a `GITHUB_TOKEN` with comment scope (default `secrets.GITHUB_TOKEN` on `pull_request`).

Only meaningful when the calling workflow runs on `pull_request`.

<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>Post plan comment</h1></td>
</tr></table>

Uses `github-script` to comment on the PR. Requires `pull-requests: write` and a `GITHUB_TOKEN` with comment scope (default `secrets.GITHUB_TOKEN` on `pull_request`).

Only meaningful when the calling workflow runs on `pull_request`.

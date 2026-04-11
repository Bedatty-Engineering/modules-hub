<table><tr>
<td><img src="https://github.com/Bedatty-Engineering.png" alt="Bedatty Engineering" width="80" /></td>
<td><h1>setup-gpg</h1></td>
</tr></table>

Composite action that imports a GPG private key, pre-caches the passphrase in
`gpg-agent`, and configures git to sign all commits and tags automatically.

No third-party dependencies — implemented entirely with native `gpg` and `git`
commands available on GitHub-hosted runners.

## Usage

```yaml
- name: Setup GPG signing
  uses: <org>/modules-hub/composite/config/setup-gpg@v1
  with:
    gpg_private_key: ${{ secrets.GPG_PRIVATE_KEY }}
    gpg_passphrase: ${{ secrets.GPG_PASSPHRASE }}
    git_identity_token: ${{ secrets.RELEASE_TOKEN }}
```

Omit `git_identity_token` when you already set `user.name` / `user.email` elsewhere.

## Inputs

| Name | Required | Description |
|---|---|---|
| `gpg_private_key` | yes | Armored GPG private key. Export with `gpg --armor --export-secret-keys <KEY_ID>` and store the full block as a secret. |
| `gpg_passphrase` | no | Passphrase for the key. Leave empty if the key was created without one. |
| `git_identity_token` | no | If set (e.g. same PAT used for checkout/release), sets `git config user.name` and `user.email` from `gh api user` on the runner (`gh` is preinstalled on GitHub-hosted runners). |

## Outputs

| Name | Description |
|---|---|
| `key_id` | Long key ID of the imported secret key (e.g. `ABCD1234EFGH5678`). |

## Secrets setup

1. **Export your key locally:**

   ```bash
   gpg --list-secret-keys --keyid-format=long   # find your KEY_ID
   gpg --armor --export-secret-keys <KEY_ID>
   ```

2. **Create the repository secrets** under **Settings → Secrets and variables → Actions:**

   | Secret | Value |
   |---|---|
   | `GPG_PRIVATE_KEY` | Full output of the export command above, including the `-----BEGIN/END-----` lines |
   | `GPG_PASSPHRASE` | Passphrase used when the key was created (omit the secret if no passphrase) |

3. **Add the signing key to GitHub** so the "Verified" badge appears on commits:
   **Settings → SSH and GPG keys → New GPG key** → paste the public key
   (`gpg --armor --export <KEY_ID>`).

## How it works

1. Imports the private key into the runner's GPG keyring.
2. Configures `gpg-agent` with `allow-loopback-pinentry` so the passphrase can
   be supplied non-interactively.
3. Pre-caches the passphrase via a dummy sign operation, preventing any
   interactive prompt during subsequent git operations.
4. Sets `user.signingkey`, `commit.gpgsign true`, and `tag.gpgsign true` in
   the local git config so every commit and tag created in the same job is
   automatically signed.
5. Optionally, when `git_identity_token` is set, sets `user.name` and `user.email`
   from the GitHub account associated with that token.

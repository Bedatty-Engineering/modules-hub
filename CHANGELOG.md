## [1.4.2](https://github.com/Bedatty-Engineering/modules-hub/compare/v1.4.1...v1.4.2) (2026-06-09)

### Bug Fixes

* **hub:** add platform check toggles to validate reusable ([#77](https://github.com/Bedatty-Engineering/modules-hub/issues/77)) ([6454c70](https://github.com/Bedatty-Engineering/modules-hub/commit/6454c70626e1aac7feb28b530300e1406976876e))

### Authors

- @bedatty

## [1.4.1](https://github.com/Bedatty-Engineering/modules-hub/compare/v1.4.0...v1.4.1) (2026-06-05)

### Bug Fixes

* **config:** pin reusable workflow composites to v1 ([#73](https://github.com/Bedatty-Engineering/modules-hub/issues/73)) ([f84f881](https://github.com/Bedatty-Engineering/modules-hub/commit/f84f881cfa2eb3f676b58c86466fdc836a190abc))
* **release:** trigger self release on push ([3910e0d](https://github.com/Bedatty-Engineering/modules-hub/commit/3910e0dafe04604cbaa12996881258f013971856))

### Authors

- @bedatty

## [1.4.0](https://github.com/Bedatty-Engineering/modules-hub/compare/v1.3.1...v1.4.0) (2026-05-30)

### Features

* **config:** fold CodeQL into PR validation entrypoint ([e0bce6a](https://github.com/Bedatty-Engineering/modules-hub/commit/e0bce6adace4f1a702f9371417bbcd8876273a4e))
* **config:** gate actionlint and CodeQL on changed file types ([47db3a2](https://github.com/Bedatty-Engineering/modules-hub/commit/47db3a292ac533d168642522c77cac3b223dd252))
* **config:** gate jobs on PR hygiene to fail-fast and economize ([fea0ca2](https://github.com/Bedatty-Engineering/modules-hub/commit/fea0ca279a4d0e999c52de8f817a2e89121d2734))
* **config:** support REPOSITORY_OPERATOR PAT for PR write actions ([5f0a12a](https://github.com/Bedatty-Engineering/modules-hub/commit/5f0a12ae5b4fe5f99a67cce068de9bf266ac2fc7))
* **hub:** add findings section divider and warning/error emojis in pr-summary ([10e9de3](https://github.com/Bedatty-Engineering/modules-hub/commit/10e9de3003e61d493fad90fc964762268fc17581))
* **hub:** add pr-assignee composite and wire into validate workflow ([8ae6287](https://github.com/Bedatty-Engineering/modules-hub/commit/8ae6287be95ea764ce98810cbaa2fde1f51e5564))
* **hub:** add pr-assignee composite to validate workflow ([#62](https://github.com/Bedatty-Engineering/modules-hub/issues/62)) ([e58d19a](https://github.com/Bedatty-Engineering/modules-hub/commit/e58d19acbaf8998fa729f2349c6fca20a9a378b4))
* **hub:** surface CodeQL findings in PR summary toggle ([082799b](https://github.com/Bedatty-Engineering/modules-hub/commit/082799b737c86e4ccef01ccc3ec0667b29fc2350))
* **hub:** surface error messages in pr-summary dropdown on failure ([38fbfc3](https://github.com/Bedatty-Engineering/modules-hub/commit/38fbfc378d4247f28bcefe2d51a14f1d232c1ec6))
* **hub:** surface yamllint findings in PR summary; fix CodeQL on.push warning ([3f26795](https://github.com/Bedatty-Engineering/modules-hub/commit/3f26795f3febf1b1340d8699c67c6ee010bde55b))

### Bug Fixes

* **config:** correct tj-actions output names in validate-modules-hub changed-files ([6e0cfe1](https://github.com/Bedatty-Engineering/modules-hub/commit/6e0cfe1f7635fe6c26eb8935397aa93ccd0434c6))
* **config:** grant issues: write to caller for pr-assignee composite ([999e098](https://github.com/Bedatty-Engineering/modules-hub/commit/999e0980d7913d6b56eee64473469222c96e2665))
* **config:** strip inline comments before SHA pinning check in pinned-actions ([c20277b](https://github.com/Bedatty-Engineering/modules-hub/commit/c20277b767100863f7c0041a8233cb3731e7cc58))
* **deps:** replace label github-actions with ci in dependabot.yml ([3305095](https://github.com/Bedatty-Engineering/modules-hub/commit/330509552214cf7eeea66ee1f005ba3c3b99513f))
* **deps:** replace label github-actions with ci in dependabot.yml ([56a5655](https://github.com/Bedatty-Engineering/modules-hub/commit/56a5655d56d676fd1356129dbaae6af138d28b3f))
* **deps:** replace label npm with javascript in dependabot.yml ([499d835](https://github.com/Bedatty-Engineering/modules-hub/commit/499d83574bb5f179f39dd032635b6ffef268dbd7))
* **hub:** fix all remaining line-length warnings across composites and validate ([c917b37](https://github.com/Bedatty-Engineering/modules-hub/commit/c917b37f058814f94238f5e1d92b694818f39078))
* **hub:** fix last two line-length warnings in pr-summary and actionlint ([aa848f4](https://github.com/Bedatty-Engineering/modules-hub/commit/aa848f43c38f201dfa560e444a3b340b40009502))
* **hub:** include advisory checks in pr-summary overall outcome ([4990334](https://github.com/Bedatty-Engineering/modules-hub/commit/4990334dd7cc7d4084c2b936e879c166e5bf965f))
* **hub:** replace broken heredoc with variable concat in actionlint format template ([75ee9fa](https://github.com/Bedatty-Engineering/modules-hub/commit/75ee9fa9b32d132ea5e728eb6b93472a67facfd1))
* **hub:** restore code block in findings; keep emojis in toggle summary only ([64efca2](https://github.com/Bedatty-Engineering/modules-hub/commit/64efca291603204c924f93dff984c494e2f2fe23))
* **hub:** suppress CodeQL on.push bootstrap advisory from PR findings ([3078047](https://github.com/Bedatty-Engineering/modules-hub/commit/30780471603fe41b74cdd0140a316237a18343fd))
* **hub:** update setup-node to v6.4.0; raise yamllint limit to 120; refactor trap ([dc0c608](https://github.com/Bedatty-Engineering/modules-hub/commit/dc0c608a4a3ea099fc5929d4d15e1a61095bed2f))
* **hub:** use inline code for path in findings to preserve copyability with emojis ([553304b](https://github.com/Bedatty-Engineering/modules-hub/commit/553304b0c45f04bba28d252ae08745e27357ffc0))
* **hub:** use printf to write actionlint format template avoiding parse error ([bab2096](https://github.com/Bedatty-Engineering/modules-hub/commit/bab2096ebb709e2f6a76be26e94f0df086e712a3))
* **hub:** YAML parse errors in pr-size, pr-labels, pr-summary ([b783afe](https://github.com/Bedatty-Engineering/modules-hub/commit/b783afe7108dc7677286659c395cdf842b8a3c6f))

### Authors

- @bedatty

## [1.3.1](https://github.com/Bedatty-Engineering/modules-hub/compare/v1.3.0...v1.3.1) (2026-05-15)

### Bug Fixes

* **hub:** pr-title regex parse error in bash 5.x ([1e5d154](https://github.com/Bedatty-Engineering/modules-hub/commit/1e5d1544cc3274d8069bab1ad485d5868238afa3)), closes [#57](https://github.com/Bedatty-Engineering/modules-hub/issues/57)

### Authors

- @bedatty

## [1.3.0](https://github.com/Bedatty-Engineering/modules-hub/compare/v1.2.1...v1.3.0) (2026-05-14)

### Features

* **config:** integrate pr-* composites into validate workflow ([#55](https://github.com/Bedatty-Engineering/modules-hub/issues/55)) ([5befe46](https://github.com/Bedatty-Engineering/modules-hub/commit/5befe4668e6db7b6b4e890e971cdc550858ab481)), closes [#54](https://github.com/Bedatty-Engineering/modules-hub/issues/54)
* **hub:** add pr-* composites for PR-hygiene validation ([#54](https://github.com/Bedatty-Engineering/modules-hub/issues/54)) ([8d66d16](https://github.com/Bedatty-Engineering/modules-hub/commit/8d66d16a1016299665f0f047e5c92765d315fed8))

### Bug Fixes

* **config:** split validate into generic and modules-hub reusables ([6b77afe](https://github.com/Bedatty-Engineering/modules-hub/commit/6b77afe63e249286e4fd5bd7373197253496cedb))

### Authors

- @bedatty

## [1.2.1](https://github.com/Bedatty-Engineering/modules-hub/compare/v1.2.0...v1.2.1) (2026-05-13)

### Bug Fixes

* **config:** suppress unpinned-tag for first-party composites ([#51](https://github.com/Bedatty-Engineering/modules-hub/issues/51)) ([49c7cab](https://github.com/Bedatty-Engineering/modules-hub/commit/49c7cab79b84bd161be5089ba3dbd7e9e25d94b2)), closes [#44](https://github.com/Bedatty-Engineering/modules-hub/issues/44)

### Authors

- @bedatty

## [1.2.0](https://github.com/Bedatty-Engineering/modules-hub/compare/v1.1.0...v1.2.0) (2026-05-12)

### Features

* **config:** enable stg branch for validate/release pipeline ([#36](https://github.com/Bedatty-Engineering/modules-hub/issues/36)) ([3439614](https://github.com/Bedatty-Engineering/modules-hub/commit/3439614d2e5c84efb2ba86c3966ee86bb351fb60)), closes [#30](https://github.com/Bedatty-Engineering/modules-hub/issues/30) [#33](https://github.com/Bedatty-Engineering/modules-hub/issues/33) [#34](https://github.com/Bedatty-Engineering/modules-hub/issues/34)

### Bug Fixes

* **config:** extract release workflow steps into composites ([#33](https://github.com/Bedatty-Engineering/modules-hub/issues/33)) ([dce031a](https://github.com/Bedatty-Engineering/modules-hub/commit/dce031a2f66eb648400d7cd6f2a56d1c3402495c))
* **config:** make GPG_PASSPHRASE secret optional in release workflow ([#34](https://github.com/Bedatty-Engineering/modules-hub/issues/34)) ([de8f7b6](https://github.com/Bedatty-Engineering/modules-hub/commit/de8f7b6e48041420983c0cab6636b05339843c78))
* **config:** skip changelog/git plugins on pre-release branches ([c21e114](https://github.com/Bedatty-Engineering/modules-hub/commit/c21e114f877a0aff79fa838d2855b12e81cc8f92))
* **release:** add Contributors section and env-gated plugins ([d3c684a](https://github.com/Bedatty-Engineering/modules-hub/commit/d3c684a2fd27b4c9c54ecd21f3391b2691e3ab85)), closes [#44](https://github.com/Bedatty-Engineering/modules-hub/issues/44)
* **release:** add Contributors section and env-gated plugins ([2f51269](https://github.com/Bedatty-Engineering/modules-hub/commit/2f5126951e28fa5fed9a55b28a57a4d2bfd93cf6)), closes [#44](https://github.com/Bedatty-Engineering/modules-hub/issues/44)

### Contributors

- @bedatty

## [1.1.0](https://github.com/Bedatty-Engineering/modules-hub/compare/v1.0.2...v1.1.0) (2026-04-24)

### Features

* **config:** enable stg branch for validate/release pipeline ([7b74916](https://github.com/Bedatty-Engineering/modules-hub/commit/7b749164bd1bdc4282eee86b82cb6387da426fbd))

### Bug Fixes

* **config:** export GITHUB_REF in shell to bypass runner injection ([bf23fce](https://github.com/Bedatty-Engineering/modules-hub/commit/bf23fce242ba16cf79c180c167fc449ca98739e0))
* **release:** dev-stg-main promotion with floating vN tag ([#30](https://github.com/Bedatty-Engineering/modules-hub/issues/30)) ([84f2a69](https://github.com/Bedatty-Engineering/modules-hub/commit/84f2a69d08c05111c7d576d926c60a0ec9fb29d0))

## [1.0.2](https://github.com/Bedatty-Engineering/modules-hub/compare/v1.0.1...v1.0.2) (2026-04-24)

### Bug Fixes

* **release:** override GITHUB_REF so semantic-release sees target branch ([138595d](https://github.com/Bedatty-Engineering/modules-hub/commit/138595d15a51139bc8443304ae4ad657783a1aa3))

## [1.0.1](https://github.com/Bedatty-Engineering/modules-hub/compare/v1.0.0...v1.0.1) (2026-04-23)

### Bug Fixes

* **config:** point validate composites to [@dev](https://github.com/dev) ([#14](https://github.com/Bedatty-Engineering/modules-hub/issues/14)) ([d0df62f](https://github.com/Bedatty-Engineering/modules-hub/commit/d0df62f92fcb6bb503e39ab52b70ba7c3905d7cb))
* **modules:** release and license ([dc10316](https://github.com/Bedatty-Engineering/modules-hub/commit/dc1031683cc611c121036e141b907e0cedfed7a3))
* **modules:** workflows config ([4d04ba1](https://github.com/Bedatty-Engineering/modules-hub/commit/4d04ba1f541f056c09d67610374fcdf403bd0da1))
* **modules:** workflows config ([cd2db06](https://github.com/Bedatty-Engineering/modules-hub/commit/cd2db06944101661ac640fded5b2dfd68b872e1c))
* **modules:** workflows config ([#11](https://github.com/Bedatty-Engineering/modules-hub/issues/11)) ([3977d90](https://github.com/Bedatty-Engineering/modules-hub/commit/3977d90663449a92fe7a2645c7f41fc8dcdbdf86)), closes [#4](https://github.com/Bedatty-Engineering/modules-hub/issues/4) [#2](https://github.com/Bedatty-Engineering/modules-hub/issues/2) [#7](https://github.com/Bedatty-Engineering/modules-hub/issues/7)
* **release:** materialize all release branches locally ([5fd8aaf](https://github.com/Bedatty-Engineering/modules-hub/commit/5fd8aafc0140419e560fc326e9985de2a88fb8c4))
* **release:** skip current branch when materializing release refs ([b805573](https://github.com/Bedatty-Engineering/modules-hub/commit/b8055737880ab4359193cf553884521b729c5acf))
* **release:** stop release loop and use token owner as author ([#15](https://github.com/Bedatty-Engineering/modules-hub/issues/15)) ([0e4aa6b](https://github.com/Bedatty-Engineering/modules-hub/commit/0e4aa6b936b49ac06bfd66981876bf832b4edb07))
* **repo:** update config repo ([#13](https://github.com/Bedatty-Engineering/modules-hub/issues/13)) ([de29eee](https://github.com/Bedatty-Engineering/modules-hub/commit/de29eee83a3e6c3bcc9f00376c6007925fd01114)), closes [#4](https://github.com/Bedatty-Engineering/modules-hub/issues/4) [#2](https://github.com/Bedatty-Engineering/modules-hub/issues/2) [#7](https://github.com/Bedatty-Engineering/modules-hub/issues/7)
* **setup-gpg:** disable tag.gpgsign to prevent editor hang ([2e1cf82](https://github.com/Bedatty-Engineering/modules-hub/commit/2e1cf82974d3912f234ee76a03776a9e7d9f195c))

# 1.0.0 (2026-04-06)


### Features

* **modules:** semantic release ([ca10a11](https://github.com/Bedatty-Engineering/modules-hub/commit/ca10a11fec6143a7cce204d758cd1d2e3d156f77))
* **repo:** initial commit ([633ab1a](https://github.com/Bedatty-Engineering/modules-hub/commit/633ab1a4455b872c9a64ea2a59176cc5753d913b))

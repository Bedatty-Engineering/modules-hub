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

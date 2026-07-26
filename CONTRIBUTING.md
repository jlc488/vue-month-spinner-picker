# Contributing

Thanks for your interest in contributing! Bug reports, feature requests, and pull requests are all welcome.

## Reporting issues

- Use the [issue tracker](https://github.com/jlc488/vue-month-spinner-picker/issues).
- For bugs, include a minimal reproduction — a fork of the [StackBlitz playground](https://stackblitz.com/github/jlc488/vue-month-spinner-picker/tree/main/examples/basic) is perfect.
- Please state the library version, Vue version, and browser/OS.

## Development setup

```bash
git clone https://github.com/jlc488/vue-month-spinner-picker.git
cd vue-month-spinner-picker
npm ci
```

| Command | What it does |
|---|---|
| `npm run dev:demo` | Run the demo app locally with hot reload |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run the full test suite once |
| `npm run build` | Build the library (ESM + CJS) |
| `npm run build:types` | Emit TypeScript declarations |

## Pull requests

1. Fork the repo and create a branch from `main`.
2. Make your change. Please add or update tests — every bug fix needs a regression test.
3. Make sure `npm run test:run`, `npm run build`, and `npm run build:types` all pass locally. CI runs the same checks on every PR.
4. Use a descriptive commit message (`fix:`, `feat:`, `docs:`, `test:`, `chore:` prefixes preferred).
5. Open a PR against `main` describing what changed and why.

## Code style

- Match the existing code style (Vue 3 `<script setup>` + TypeScript, Composition API).
- Keep the library dependency-free — new runtime dependencies will not be accepted.
- Public API changes should update the README (both `README.md` and `README.ko.md`), types, and CHANGELOG.

## Releasing (maintainers)

Releases are automated by [`.github/workflows/release.yml`](.github/workflows/release.yml).
There is nothing to run by hand — no `npm publish`, no `gh release create`.

### The whole procedure

```bash
# 1. On a branch: bump "version" in package.json and add the
#    "## [1.3.0] - YYYY-MM-DD" section to CHANGELOG.md. Open a PR, merge it.

# 2. On main, after the merge:
git checkout main && git pull
git tag v1.3.0
git push origin v1.3.0
```

That tag push runs everything:

1. Fails fast if the tag does not match `package.json`'s version, so npm and
   GitHub cannot drift apart.
2. Runs the full test suite and all three builds.
3. Publishes to npm via **Trusted Publishing (OIDC)** — there is no `NPM_TOKEN`
   secret and no OTP prompt. Skipped if that version is already on npm, so
   re-running is safe.
4. Creates the GitHub Release using the matching `## [x.y.z]` section of
   `CHANGELOG.md` as the release notes.

Watch it with `gh run watch` or `gh run list --workflow=release.yml`.

### Two ways this bites

**The tag has to sit on a commit that contains `release.yml`.** A tag-push
workflow runs the workflow file *as it exists at the tagged commit*. Tag an older
commit from before this file was added and nothing happens at all — no run, no
error, no notification. Always tag from an up-to-date `main`.

If a tag is already pushed to the wrong commit, don't move it. Re-run against
the existing tag instead — the workflow file is read from `main` while the code
is checked out from the tag:

```bash
gh workflow run release.yml --ref main -f tag=v1.3.0
```

The same command re-runs any release that failed partway through, since the
publish step skips versions already on npm.

**The npm trust relationship is bound to the filename.** It is configured on
npmjs.com against this repository *and* the workflow filename `release.yml`.
Renaming or moving the file breaks publishing until the trusted publisher config
is updated to match.

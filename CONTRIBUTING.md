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

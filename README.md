# Urxprt Playwright E2E Suite

This repository contains end-to-end tests for the Urxprt application using Playwright.

## Repository structure

- `tests/` — Playwright test files, including `Module_1` test suites.
- `pages/` — Page object models for reusable page interactions.
- `helpers.js` — Shared helper functions for form actions, dropdowns, file uploads, etc.
- `testData/` — Test data files used by the suite (for example, upload fixtures).
- `playwright.config.js` — Playwright configuration, reporter settings, global setup, and browser projects.

## Prerequisites

- Node.js 18+ installed
- Git installed
- Recommended: use a local terminal from the repository root

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers (if not already installed):

```bash
npx playwright install
```

## Running tests

Run all tests:

```bash
npx playwright test
```

Run a specific file:

```bash
npx playwright test tests/Module_1/PTJ.spec.js
```

Run a single test name:

```bash
npx playwright test --grep "Applying for post by 'Expert' user"
```

## Notes

- The suite uses relative paths for test fixtures, so it is portable across clones and different machines.
- Playwright is configured in `playwright.config.js` with a `testDir` of `./tests`, a default timeout of `60000ms`, and an HTML reporter.
- Global setup is enabled via `tests/globalSetup.js`.

## Helpful commands

```bash
# Show Playwright help
npx playwright test --help

# Open last HTML report
npx playwright show-report
```

## Suggested package scripts

You can add these to `package.json` for convenience:

```json
"scripts": {
  "test": "npx playwright test",
  "test:headed": "npx playwright test --headed",
  "test:report": "npx playwright show-report"
}
```

## Contributing

- Keep tests independent and avoid committing `test.only`.
- Use relative fixture paths from the repo root.
- Update page objects in `pages/` when UI selectors change.

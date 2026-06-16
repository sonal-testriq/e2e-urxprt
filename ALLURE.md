Allure reporting

Setup

1. Install dependencies (already added to `package.json`):

```bash
npm install
```

Run tests and generate report

```bash
# run playwright tests (this loads the Allure reporter)
npm run test

# generate an Allure HTML report from results
npm run allure:generate

# open the generated report in the browser
npm run allure:open
```

Notes

- Playwright is configured to output results to `allure-results` (see `playwright.config.js`).
- If you prefer the native Allure CLI, you can install via Homebrew: `brew install allure` on macOS.
- Allure files are ignored in `.gitignore` (`allure-results/`, `allure-report/`).

// fixtures/auth.fixture.js
import { test as base } from "@playwright/test";

/**
 * Extend base test with pre-authenticated browser contexts.
 * Each fixture is lazy — only created if the test uses it.
 */
export const test = base.extend({
  // Authenticated context for a regular user
  userContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "./tests/.auth/user.json",
    });
    await use(context);
    await context.close();
  },

  // Authenticated context for an expert
  expertContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "./tests/.auth/expert.json",
    });
    await use(context);
    await context.close();
  },

  // Authenticated context for a company
  companyContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "./tests/.auth/company.json",
    });
    await use(context);
    await context.close();
  },

  // Shortcut: ready-to-use pages (most common need)
  userPage: async ({ userContext }, use) => {
    const page = await userContext.newPage();
    await use(page);
    await page.close();
  },

  expertPage: async ({ expertContext }, use) => {
    const page = await expertContext.newPage();
    await use(page);
    await page.close();
  },

  companyPage: async ({ companyContext }, use) => {
    const page = await companyContext.newPage();
    await use(page);
    await page.close();
  },
});

export { expect } from "@playwright/test";

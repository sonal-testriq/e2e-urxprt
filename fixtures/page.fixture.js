// fixtures/pages.fixture.js
import { test as authTest } from "./auth.fixture.js";
import PTJPage from "../pages/part-time-job.page.js";
import HomePage from "../pages/home.page.js";

export const test = authTest.extend({
  // Expert's Job Post page object — authenticated + page object in one
  expertPTJPage: async ({ expertPage }, use) => {
    await use(new PTJPage(expertPage));
  },

  // Company's Job Post page (company posts jobs differently)
  expertHomePage: async ({ expertPage }, use) => {
    await use(new HomePage(expertPage));
  },

  // Expert's Job Post page object — authenticated + page object in one
  userPTJPage: async ({ userPage }, use) => {
    await use(new PTJPage(userPage));
  },

  // Company's Job Post page (company posts jobs differently)
  userHomePage: async ({ userPage }, use) => {
    await use(new HomePage(userPage));
  },
});

export { expect } from "@playwright/test";

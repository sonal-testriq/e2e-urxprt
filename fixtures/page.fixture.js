// fixtures/pages.fixture.js
import { test as authTest } from "./auth.fixture.js";
import PTJPage from "../pages/PTJPage.js";
import PBPPage from "../pages/PBPPage.js";
import WBOPage from "../pages/WBOPage.js";
import BSMPage from "../pages/BSMPage.js";
import MASPage from "../pages/MASPage.js";
import FTJPage from "../pages/FTJPage.js";
import HomePage from "../pages/home_page.js";
import TAIPage from "../pages/TAIPage.js";
import OTSPage from "../pages/OTSPage.js";
import BSAPage from "../pages/BSAPage.js";
import MASPage from "../pages/MASPage.js";
import hireCompanyAndExpertPage from "../pages/hireCompanyAndExpertPage.js";

import { BasePage } from "../pages/base_page.js";

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
  userBSMPage: async ({ userPage }, use) => {
    await use(new BSMPage(userPage));
  },
  userTAIPage: async ({ userPage }, use) => {
    await use(new TAIPage(userPage));
  },
  userMASPage: async ({ userPage }, use) => {
    await use(new MASPage(userPage));
  },
  expertBSMPage: async ({ expertPage }, use) => {
    await use(new BSMPage(expertPage));
  },
  expertTAIPage: async ({ expertPage }, use) => {
    await use(new TAIPage(expertPage));
  },
  expertMASPage: async ({ expertPage }, use) => {
    await use(new MASPage(expertPage));
  },
  companyMASPage: async ({ companyPage }, use) => {
    await use(new MASPage(companyPage));
  },
  companyBSMPage: async ({ companyPage }, use) => {
    await use(new BSMPage(companyPage));
  },
  companyTAIPage: async ({ companyPage }, use) => {
    await use(new TAIPage(companyPage));
  },

  companyPTJPage: async ({ companyPage }, use) => {
    await use(new PTJPage(companyPage));
  },

  // Company's Job Post page (company posts jobs differently)
  companyHomePage: async ({ companyPage }, use) => {
    await use(new HomePage(companyPage));
  },

  companyFTJPage: async ({ companyPage }, use) => {
    await use(new FTJPage(companyPage));
  },

  // User's PBP page object
  userPBPPage: async ({ userPage }, use) => {
    await use(new PBPPage(userPage));
  },

  // User's Hire page object
  userHirePage: async ({ userPage }, use) => {
    await use(new hireCompanyAndExpertPage(userPage));
  },

  // Expert's Hire page object
  expertHirePage: async ({ expertPage }, use) => {
    await use(new hireCompanyAndExpertPage(expertPage));
  },

  // Company's Hire page object
  companyHirePage: async ({ companyPage }, use) => {
    await use(new hireCompanyAndExpertPage(companyPage));
  },

  // User's FTJ page object
  userFTJPage: async ({ userPage }, use) => {
    await use(new FTJPage(userPage));
  },

  // Expert's FTJ page object
  expertFTJPage: async ({ expertPage }, use) => {
    await use(new FTJPage(expertPage));
  },

  // User's WBO page object
  userWBOPage: async ({ userPage }, use) => {
    await use(new WBOPage(userPage));
  },

  // User's WBO page object
  expertWBOPage: async ({ expertPage }, use) => {
    await use(new WBOPage(expertPage));
  },

  // User's WBO page object
  companyWBOPage: async ({ companyPage }, use) => {
    await use(new WBOPage(companyPage));
  },

  // Expert's PBP page object
  expertPBPPage: async ({ expertPage }, use) => {
    await use(new PBPPage(expertPage));
  },

  // Company's PBP page object
  companyPBPPage: async ({ companyPage }, use) => {
    await use(new PBPPage(companyPage));
  },

  // User's OTS page object
  userOTSPage: async ({ userPage }, use) => {
    await use(new OTSPage(userPage));
  },

  // User's BSA page object
  userBSAPage: async ({ userPage }, use) => {
    await use(new BSAPage(userPage));
  },

  // User's MAS page object
  userMASPage: async ({ userPage }, use) => {
    await use(new MASPage(userPage));
  },

  // Expert's OTS page object
  expertOTSPage: async ({ expertPage }, use) => {
    await use(new OTSPage(expertPage));
  },

  // Expert's BSA page object
  expertBSAPage: async ({ expertPage }, use) => {
    await use(new BSAPage(expertPage));
  },

  // Expert's MAS page object
  expertMASPage: async ({ expertPage }, use) => {
    await use(new MASPage(expertPage));
  },

  // Company's OTS page object
  companyOTSPage: async ({ companyPage }, use) => {
    await use(new OTSPage(companyPage));
  },

  // Company's BSA page object
  companyBSAPage: async ({ companyPage }, use) => {
    await use(new BSAPage(companyPage));
  },

  // Company's MAS page object
  companyMASPage: async ({ companyPage }, use) => {
    await use(new MASPage(companyPage));
  },
});

export { expect } from "@playwright/test";

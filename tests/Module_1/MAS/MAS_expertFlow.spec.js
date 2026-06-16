import { test, expect } from "../../../fixtures/page.fixture.js";
import MASPage from "../../../pages/MASPage.js";
import { assert } from "node:console";
import { describe } from "node:test";
import credentials from "../../../testData/credentials.json";
import fs from "fs";
import path from "path";
import { pageRoutes, BSMProductName, MASPostName } from "../../../testData/constants.js";
import { BasePage } from "../../../pages/base_page.js";
import { setEngine } from "node:crypto";

test.describe.serial("MAS Flow", () => {
  test("TC_001: Adding a company by user at MAS", async ({
    userPage,
    userHomePage,
    userMASPage
  }) => {
    await userHomePage.gotoMASViaCard();
    await userMASPage.addACompany();
    await expect(userPage.getByText("Add Company")).toBeVisible();
    await expect(userPage).toHaveURL("https://urxprt.com/en/dashboard/myotsproducts");
    await userMASPage.clickAddCompanyPlan();
    await userMASPage.createMASCompany(MASPostName);
    await userMASPage.publishCompany();
    await userMASPage.verifyMASCreated();
  });

  test("TC_002: Verify whether newly created MAS appears at the product listing page as 'Your Post'", async ({
    userPage,
    userHomePage,
    userMASPage,
  }) => {
    await userHomePage.gotoMASViaCard();
    await userMASPage.verifyMASPostVisible(MASPostName);
    await userMASPage.verifyYourPostTag();
  });

  test("TC_003: Verify whether newly created post appears at company's product listing page", async ({
    expertPage,
    expertHomePage,
    expertMASPage,
  }) => {
    await expertHomePage.gotoMASViaCard();
    await expertMASPage.verifyCompanyListed(MASPostName);
  });

  test("TC_004: Verify if company can apply on new created post", async ({
    expertPage,
    expertHomePage,
    expertMASPage,
  }) => {
    await expertHomePage.gotoMASViaCard();
    await expertMASPage.openMASCompany(MASPostName);
    await expertMASPage.clickInterestedButton();
    await expertMASPage.acceptMASContract();
    await expertMASPage.verifyInterestSubmitted();
  });

  test("TC_005: Verify if user receives notification when expert applies on MAS post", async ({
    userPage,
    userHomePage,
    userMASPage,
  }) => {
    await userPage.goto(pageRoutes.account);
    await userHomePage.hoverOverNotifivationIcon();
    await userMASPage.openNotification(`You have a new interested party in your MAS for ${MASPostName}.`);
    await userMASPage.verifyReceivedOrdersPage();
  });

  test("TC_006: Verify if user can see the company's details who applied on MAS post", async ({
    userPage,
    userHomePage,
    userMASPage
  }) => {
    await userPage.goto(pageRoutes.account);
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    await userMASPage.openActiveMASOrders();
    await userMASPage.openMASRequests(MASPostName);
    await userMASPage.verifyInterestedCompany("Shivakumar GP");
  });

});

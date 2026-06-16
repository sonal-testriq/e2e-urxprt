import { test, expect } from "../../../fixtures/page.fixture.js";
import TAIPage from "../../../pages/TAIPage.js";
import { assert } from "node:console";
import { describe } from "node:test";
import credentials from "../../../testData/credentials.json";
import fs from "fs";
import path from "path";
import { pageRoutes, TAIProductName } from "../../../testData/constants.js";
import { BasePage } from "../../../pages/base_page.js";
import { setEngine } from "node:crypto";

test.describe.serial("TAI Flow", () => {
  test("TC_001: Adding a product by user at TAI", async ({
    userPage,
    userHomePage,
    userTAIPage,
  }) => {
    await userHomePage.gotoTAIViaCard();
    await userTAIPage.clickOnAddAProductButton();
    await userPage.waitForTimeout(500);
    await expect(userPage).toHaveURL(
      "https://urxprt.com/en/dashboard/myotsproducts",
    );
    await userTAIPage.clickAddProductPlan();
    await userTAIPage.fillInput("Product name", TAIProductName);
    await userTAIPage.selectDropdown("Industry *", "Business");
    await userTAIPage.selectDropdown("Category *", "Managing and Consultant");
    await userTAIPage.selectDropdown("SubCategory", "Project Management");
    const uploadedFile = "testData/sampleImg.jpg";
    await userTAIPage.uploadFile(uploadedFile);
    await userTAIPage.fillRichTextEditor("Description", "This is a test description for automation");
    await userPage.waitForTimeout(500);
    await userTAIPage.goToTypeAndPricingTab();
    await userTAIPage.setCheckbox("Rental only", true);
    await userTAIPage.fillInputWithPlaceholder("Enter Price in $", "10");
    await userTAIPage.selectDropdown("Price per", "Days");
    await userTAIPage.goToReviewAndAddStep();

    // ---------- PUBLISH ----------
    await userTAIPage.publishProduct();

    // ---------- VERIFY POST PUBLISHED ----------
    await userPage.waitForLoadState("networkidle");
    await userPage.waitForTimeout(500);
    await expect(userPage.getByText("TAI Service Created Successfully")).toBeVisible();
  });

  test("TC_002: Verify whether newly created TAI appears at the product listing page as 'Your Post'", async ({
    userPage,
    userHomePage,
    userTAIPage,
  }) => {
    await userHomePage.gotoTAIViaCard();
    await userTAIPage.verifyTAIPostVisible(TAIProductName);
    await userTAIPage.verifyYourPostTag();
  });

  test("TC_003: Verify whether newly created post appears at expert's product listing page", async ({
    expertPage,
    expertHomePage,
    expertTAIPage,
  }) => {
    await expertHomePage.gotoTAIViaCard();
    await expertTAIPage.verifyProductListed(TAIProductName);
  });

  test("TC_004: Verify if expert can apply on new created post", async ({
    expertPage,
    expertHomePage,
    expertTAIPage,
  }) => {
    const currentDate = new Date().toISOString().split("T")[0];
    await expertHomePage.gotoTAIViaCard();
    const newPage = await expertTAIPage.openTAIPost(TAIProductName);
    await expertTAIPage.clickSendRentalRequest(newPage);
    await expertTAIPage.fillRentalRequest(newPage, currentDate);
    await expertTAIPage.selectStartTime(newPage, "6", "15", "PM");
    await expertTAIPage.selectEndTime(newPage, "6", "30", "PM");
    await expertTAIPage.submitRentalRequest(newPage);
    await expertTAIPage.acceptRentalContract(newPage);
    await expertTAIPage.verifySuccessMessageIsDisplayed("TAI request has been sent", newPage);
  });

  test("TC_005: Accepting TAI request by the 'User'", async ({
    userPage,
    userHomePage,
    userTAIPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    await userTAIPage.openTAIRequests();
    await userTAIPage.acceptTAIRequest(TAIProductName);
    await userTAIPage.acceptRentalTerms();
  });

  test("TC_006: Paying for product by expert(Buyer)  ", async ({
    expertPage,
    expertHomePage,
    expertTAIPage,
  }) => {
    await expertPage.goto("/en/dashboard/myorders", {waitUntil: "networkidle"});
    await expertTAIPage.openPurchasedActiveTAIOrder(TAIProductName);
    await expertTAIPage.clickPayNow();
    await expertTAIPage.verifyPaymentPage();
    await expertHomePage.proceedToPayment();
    await expertHomePage.enterCardDetails("5555555555554444", "12 / 30", "Test User", "123");
    await expertHomePage.completePayment();
    await expertTAIPage.verifyTAIPaymentSuccess();
    await expertTAIPage.clickOkayAfterPayment();
    await expertTAIPage.verifyReceivedOrderPage();
  });

  test("TC_007: Updating product status by user(seller)", async ({
    userPage,
    userHomePage,
    userTAIPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    await userTAIPage.openActiveTAIReceivedOrders();
    await userTAIPage.openReceivedTAIOrder(TAIProductName);
    await userTAIPage.updateStatus();
    await userTAIPage.verifyUpdatedSuccessfully();
  });

  test("TC_008: Marking product 'Deleivered' by expert(Buyer)", async ({
    expertPage,
    expertHomePage,
    expertTAIPage,
  }) => {
    await expertPage.goto(`/en/dashboard/myorders`, { waitUntil: "networkidle" });
    await expertTAIPage.openPurchasedActiveTAIOrder(TAIProductName);
    await expertTAIPage.clickMarkDelivered();
    await expertTAIPage.verifyUpdatedSuccessfully();
    await expertTAIPage.verifyDeliveredStep();
  });

  test("TC_009: Completing transaction by user(Seller) by verifying OTP", async ({
    userPage,
    userHomePage,
    userTAIPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    await userTAIPage.openActiveTAIReceivedOrders();
    await userTAIPage.openReceivedTAIOrder(
      TAIProductName
    );
    await userTAIPage.enterOTP("123456");
    await userTAIPage.submitOTP();
    await userTAIPage.verifyUpdatedSuccessfully();
    await userTAIPage.verifyTransactionCompletedStep();
  });

  test("TC_010: Asserting completion of last step of Completing transaction at expert's(buyer) window", async ({
    expertPage,
    expertHomePage,
    expertTAIPage,
  }) => {
    await expertPage.goto(`/en/dashboard/myorders`, { waitUntil: "networkidle" });
    await expertTAIPage.openCompletedTAIOrder(TAIProductName);
    await expertTAIPage.verifyTransactionCompletedStep();
  });

  test("TC_011: Asserting completion of last step of Completing transaction at user's(seller) window and relisting of product", async ({
    userPage,
    userHomePage,
    userTAIPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    await userTAIPage.openCompletedTAIReceivedOrders();
    await userTAIPage.verifyCompletedTAIProduct(TAIProductName);
  });
});

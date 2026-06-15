import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, BSMProductName } from "../../../testData/constants.js";
import { BasePage } from "../../../pages/base_page.js";

test.describe.serial("BSM Flow", () => {
  test("TC_001: Adding a product by user at BSM", async ({
    userPage,
    userHomePage,
    userBSMPage,
  }) => {
    await userHomePage.gotoBSMViaCard();
    await userBSMPage.clickOnAddAProductButton();
    await expect(userPage).toHaveURL("https://urxprt.com/en/dashboard/myotsproducts");
    await userBSMPage.clickAddProductPlan();
    await userBSMPage.fillInput("Product title", BSMProductName);
    const richTextEditor = userPage.locator(".ql-editor");
    await richTextEditor.click();
    await richTextEditor.fill("This is a test description for automation");
    await userBSMPage.selectDropdown("Industry *", "Business");
    await userBSMPage.selectDropdown("Category *", "Managing and Consultant");
    await userBSMPage.selectDropdown("Sub Category", "Project Management");
    await userBSMPage.fillInput("Price * *", "50");
    await userBSMPage.clickNextButtonOnProductDetailTab();
    await userPage.waitForTimeout(500);
    await userBSMPage.verifyUserIsOnProductInfoTab();
    await userBSMPage.insertImage("testData/sampleImg.jpg");
    await userPage.waitForTimeout(500);
    await userBSMPage.selectDropdown("Country", "India");
    await userBSMPage.selectRadioOption("Brand new");
    await userBSMPage.selectRadioOption("Not included");
    await userBSMPage.clickNextButtonOnProductInfoTab();
    await userPage.waitForTimeout(500);
    await userBSMPage.addAndPublishPost();
    await userPage.waitForLoadState("networkidle");
    await userPage.waitForTimeout(500);
    await expect(userPage.getByText("BSM Service Created Successfully")).toBeVisible();
  });

  test("TC_002: Send request for buying product by company", async ({
    companyPage,
    companyHomePage,
    companyBSMPage,
  }) => {
    await companyPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await companyHomePage.goToBSMViaHeader();
    const newPage = await companyBSMPage.goToBSMPost(BSMProductName);
    await newPage.waitForLoadState();
    await companyBSMPage.clickOnSendRequest(newPage);
    expect(newPage.url()).toContain("https://urxprt.com/en/salecontract/");
    await companyBSMPage.acceptOfferForPost(newPage);
    await companyBSMPage.verifySuccessMessageIsDisplayed("BSM request has been sent", newPage);
  });

  test("TC_003: Accepting BSM request by the 'User'", async ({
    userPage,
    userHomePage,
    userBSMPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    await userBSMPage.verifyUserIsOnBSMRequestPage();
    await userBSMPage.clickOnAcceptButtonOnBSMRequestPost(BSMProductName);
    await userPage.waitForTimeout(1000);
    expect(userPage.url()).toContain("https://urxprt.com/en/salecontract/");
    await userBSMPage.acceptOffer();
  });
  
  test("TC_004: Paying for product by company(Buyer)  ", async ({
    companyPage,
    companyHomePage,
    companyBSMPage,
  }) => {
    await companyPage.goto("/en/dashboard/myorders", { waitUntil: "networkidle" });
    await companyBSMPage.openPurchasedBSMOrder(BSMProductName);
    await companyBSMPage.clickPayNow();
    await companyBSMPage.verifyPaymentPage();
    await companyHomePage.proceedToPayment();
    await companyHomePage.enterCardDetails("4111111111111111", "12 / 30", "Test User", "123");
    await companyHomePage.completePayment();
    await companyBSMPage.verifyBSMPaymentSuccess();
    await companyBSMPage.clickOkayAfterPayment();
    await expect(companyPage).toHaveURL(
      /.*\/receivedorders\/productforsaledetails\//
    );
    await companyBSMPage.clickAddAddress();
    await companyBSMPage.submitAddress("Mumbai, Maharashtra");
  });

  test("TC_005: Updating product to 'Out for Delivery' by user(seller)", async ({
    userPage,
    userHomePage,
    userBSMPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    await userBSMPage.openActiveBSMReceivedOrders();
    await userBSMPage.openReceivedBSMOrder(BSMProductName);
    await userBSMPage.updateOutForDelivery();
    await expect(userPage.getByText("Updated Successfully")).toBeVisible();
  });

  test("TC_006: Marking product 'Deleivered' by company(Buyer)", async ({
    companyPage,
    companyBSMPage,
  }) => {
    await companyPage.goto("/en/dashboard/myorders", { waitUntil: "networkidle" });
    await companyBSMPage.openPurchasedActiveBSMOrder(BSMProductName);
    await companyBSMPage.clickMarkDelivered();
    await companyBSMPage.verifyUpdatedSuccessfully();
    await companyBSMPage.verifyItemDeliveredStep();
  });

  test("TC_007: Completing transaction by user(Seller) by verifying OTP", async ({
    userPage,
    userHomePage,
    userBSMPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    await userBSMPage.openActiveBSMReceivedOrders();
    await userBSMPage.openReceivedBSMOrder(BSMProductName);
    await userBSMPage.enterOTP("123456");
    await userBSMPage.submitOTP();
    await userBSMPage.verifyUpdatedSuccessfully();
    await userBSMPage.verifyTransactionCompletedStep();
  });

  test("TC_008: Asserting completion of last step of Completing transaction at company's(buyer) window", async ({
    companyPage,
    companyBSMPage,
  }) => {
    await companyPage.goto("/en/dashboard/myorders", { waitUntil: "networkidle" });
    await companyBSMPage.openCompletedPurchasedBSMOrder(BSMProductName);
    await companyBSMPage.verifyTransactionCompletedStep();
  });

  test("TC_009: Asserting completion of last step of Completing transaction at user's(seller) window and relisting of product", async ({
    userPage,
    userHomePage,
    userBSMPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    await userBSMPage.openCompletedBSMReceivedOrders();
    await userBSMPage.relistProduct(BSMProductName);
    await userBSMPage.verifyRelistedProduct(BSMProductName);
  });
});

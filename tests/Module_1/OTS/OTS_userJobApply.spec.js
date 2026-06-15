import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, OTS_ServiceName } from "../../../testData/constants.js";

test.describe.serial("OTS Tests for Expert Role", () => {
  test("TC_OTS_001: Verify Expert user is able to add a service", async ({
    expertPage,
    expertHomePage,
    expertOTSPage,
  }) => {
    await expertHomePage.gotoOSMViaCard();
    await expertOTSPage.clickOnCreateAPostButton();
    await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
    await expertOTSPage.clickOnAddButtonOnAllServicesPage();
    await expertPage.waitForTimeout(800);
    await expertOTSPage.fillInput("Service Title ", OTS_ServiceName);
    await expertPage.locator('input[type="file"]').setInputFiles('testData/sampleImg.jpg');
    await expect(expertPage.locator("//img[@alt='Delete']")).toBeVisible();
    await expertOTSPage.fillRichTextEditor("Description", "This is a sample description for the OTS service.");
    await expertOTSPage.selectMultiDropdown("Industry *", ["E Commerce"]);
    await expertOTSPage.selectMultiDropdown("Category *", ["Supply Chain"]);
    await expertOTSPage.fillInput("No of Days", "1");
    await expertOTSPage.fillRichTextEditor("Requirements", "This is a sample requirements for the OTS service.");
    await expertPage.waitForTimeout(800);
    await expertOTSPage.clickOnNextButtonOnServiceDetailsTab();
    await expertPage.waitForTimeout(800);
    await expertOTSPage.clickOnNextButtonOnWorkSampleTab();
    await expertPage.waitForTimeout(800);
    await expertOTSPage.fillInput("Price in $ *", "10");
    await expertOTSPage.selectPaymentTerms("One time");
    await expertOTSPage.fillRichTextEditor("Additional Notes / Terms", "This is a sample requirements for the OTS service.");
    await expertPage.waitForTimeout(800);
    await expertOTSPage.saveAndPublishService();
    await expertOTSPage.verifySuccessMessageIsDisplayed("OTS service created successfully");
  })

  test("TC_OTS_002: Verify User is able to view the added service in OTS", async ({
    userPage,
    userHomePage,
    userOTSPage,
  }) => {
    await userHomePage.gotoOSMViaCard();
    await userOTSPage.searchFor(OTS_ServiceName);
    await userOTSPage.waitForFilteredResults();
    await userPage.waitForTimeout(500);
    const count = await userOTSPage.getPostCount();
    expect(count).toEqual(1);
    const isPresent = await userOTSPage.isPostNamePresent(OTS_ServiceName);
    expect(isPresent).toBeTruthy();
  })

  test("TC_OTS_003: Verify User is able to send Purchase Request on created service", async ({
    userPage,
    userHomePage,
    userOTSPage,
  }) => {
    await userHomePage.gotoOSMViaCard();
    await userOTSPage.searchFor(OTS_ServiceName);
    await userOTSPage.waitForFilteredResults();
    await userPage.waitForTimeout(500);
    const count = await userOTSPage.getPostCount();
    expect(count).toEqual(1);
    const newPage = await userOTSPage.goToTheFilteredPostetails();
    await userOTSPage.clickOnSendPurchaseButton(newPage);
    await userOTSPage.acceptOffer(newPage);
    await userOTSPage.verifySuccessfulPurchaseRequest("OTS service request has been sent", newPage);
    await userOTSPage.makePaymentForPost(newPage);
    await expect(newPage.getByText("OTS Payment Completed").first()).toBeVisible();
  })

  test("TC_OTS_004: Verify Expert is able to Accept Purchase Request on created service", async ({
    expertPage,
    expertHomePage,
    expertOTSPage,
  }) => {
    await expertHomePage.gotoDashboardPage();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
    await expertPage.waitForLoadState("networkidle");
    await expertHomePage.navigateToRecievedOrders();
    await expertPage.waitForLoadState("networkidle");
    const isPresent = await expertOTSPage.isRequestPresent(OTS_ServiceName);
    expect(isPresent).toBeTruthy();
    await expertOTSPage.clickOnAcceptButtonOfService(OTS_ServiceName);
    await expertOTSPage.acceptAndStartOTS();
    await expertOTSPage.verifySuccessMessageIsDisplayed("Updated Successfully");
  })

  test("TC_OTS_005: Verify the accepted service is present under Active Orders", async ({
    expertPage,
    expertHomePage,
    expertOTSPage,
  }) => {
    await expertHomePage.gotoDashboardPage();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
    await expertPage.waitForLoadState("networkidle");
    await expertHomePage.navigateToRecievedOrders();
    await expertOTSPage.clickOnActiveReceivedOrdersTab()
    await expertPage.waitForLoadState("networkidle");
    await expertOTSPage.goToDesiredActiveRecievedOrder("OTS");
    await expertPage.waitForTimeout(1200);
    const isPresent = await expertOTSPage.isActiveRequestPresent(OTS_ServiceName);
    expect(isPresent).toBeTruthy();
  })

  test("TC_OTS_006: Verify Expert user is able to submit the work for payment", async ({
    expertPage,
    expertHomePage,
    expertOTSPage,
  }) => {
    await expertHomePage.gotoDashboardPage();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
    await expertPage.waitForLoadState("networkidle");
    await expertHomePage.navigateToRecievedOrders();
    await expertOTSPage.clickOnActiveReceivedOrdersTab()
    await expertPage.waitForLoadState("networkidle");
    await expertOTSPage.goToDesiredActiveRecievedOrder("OTS");
    await expertPage.waitForTimeout(1200);
    await expertOTSPage.goToActiveRequestReview(OTS_ServiceName);
    await expertPage.waitForLoadState("networkidle");
    await expertOTSPage.clickOnSubmitWorkForPayment();
    await expertHomePage.fillInputWithPlaceholder("Enter description here", "This is a test submission for automation");
    await expertOTSPage.insertImage('testData/sampleImg.jpg');
    await expertOTSPage.submitWorkForPayment();
    await expertPage.waitForTimeout(1200);
    await expertOTSPage.verifySuccessMessageIsDisplayed("Work submitted for payment successfully");
  })

  test("TC_OTS_007: Verify Expert user is able to view the submitted work for payment", async ({
    expertPage,
    expertHomePage,
    expertOTSPage,
  }) => {
    await expertHomePage.gotoDashboardPage();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
    await expertPage.waitForLoadState("networkidle");
    await expertHomePage.navigateToRecievedOrders();
    await expertOTSPage.clickOnActiveReceivedOrdersTab()
    await expertPage.waitForLoadState("networkidle");
    await expertOTSPage.goToDesiredActiveRecievedOrder("OTS");
    await expertPage.waitForTimeout(1200);
    await expertOTSPage.goToActiveRequestReview(OTS_ServiceName);
    await expertPage.waitForLoadState("networkidle");
    await expertOTSPage.view_submission_button.click();
    await expect(expertOTSPage.submission_overview_tab).toBeVisible();
    await expertOTSPage.submission_overview_closeBtn.click();
    await expect(expertOTSPage.submission_overview_tab).toBeHidden();
  })  

  test("TC_OTS_008: Verify user is able yto approve the service", async ({
    userPage,
    userHomePage,
    userOTSPage,
  }) => {
    await userPage.goto(`/en/dashboard`, { waitUntil: "networkidle" });
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.goToActivePurchaseOrder();
    await userPage.waitForTimeout(1200);
    const isPresent = await userOTSPage.isActiveRequestPresent(OTS_ServiceName);
    expect(isPresent).toBeTruthy();
    await userOTSPage.goToActiveRequestReview(OTS_ServiceName);
    await userPage.waitForLoadState("networkidle");
    await userOTSPage.approveSubmission();
    const completeStatus = await userPage.locator("//a/span[contains(text(),'Completed')]");
    await expect(completeStatus).toBeVisible();
    await userOTSPage.goToMilestoneTab();
    const projectCompleteStatus = userPage.locator("//h3[contains(text(),'Project Completed')]");
    await expect(projectCompleteStatus).toBeVisible();
  })

  test("TC_OTS_009: Verify the aaproved service is present under Completed Orders", async ({
    expertPage,
    expertHomePage,
    expertOTSPage,
  }) => {
    await expertHomePage.gotoDashboardPage();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
    await expertPage.waitForLoadState("networkidle");
    await expertHomePage.navigateToRecievedOrders();
    await expertOTSPage.clickOnCompletedReceivedOrdersTab()
    await expertPage.waitForLoadState("networkidle");
    await expertOTSPage.goToDesiredActiveRecievedOrder("OTS");
    await expertPage.waitForTimeout(1200);
    const isPresent = await expertOTSPage.isActiveRequestPresent(OTS_ServiceName);
    expect(isPresent).toBeTruthy();
  })

  test("TC_OTS_010: Verify Expert user is able to delete the create service", async ({
    expertPage,
    expertHomePage,
    expertOTSPage,
  }) => {
    await expertHomePage.gotoOSMViaCard();
    await expertOTSPage.clickOnCreateAPostButton();
    await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
    await expertHomePage.selectServices("OTS");
    await expertOTSPage.clickOnDeleteButton(OTS_ServiceName)
    await expertOTSPage.verifyConfirmationPopupIsPresent("Confirm Delete")
    await expertOTSPage.clickOnConfirmButton();
    await expertOTSPage.verifySuccessMessageIsDisplayed("Your OTS service has been deleted");
  })

})

import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, OTS_ServiceName } from "../../../testData/constants.js";

test.describe.serial("OTS Tests for Company Role", () => {
  test("TC_OTS_001: Verify Company user is able to add a service", async ({
    companyPage,
    companyHomePage,
    companyOTSPage,
  }) => {
    await companyHomePage.gotoOSMViaCard();
    await companyOTSPage.clickOnCreateAPostButton();
    await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
    await companyOTSPage.clickOnAddButtonOnAllServicesPage();
    await companyPage.waitForTimeout(800);
    await companyOTSPage.fillInput("Service Title ", OTS_ServiceName);
    await companyPage.locator('input[type="file"]').setInputFiles('testData/sampleImg.jpg');
    await expect(companyPage.locator("//img[@alt='Delete']")).toBeVisible();
    await companyOTSPage.fillRichTextEditor("Description", "This is a sample description for the OTS service.");
    await companyOTSPage.selectMultiDropdown("Industry *", ["E Commerce"]);
    await companyOTSPage.selectMultiDropdown("Category *", ["Supply Chain"]);
    await companyOTSPage.fillInput("No of Days", "1");
    await companyOTSPage.fillRichTextEditor("Requirements", "This is a sample requirements for the OTS service.");
    await companyPage.waitForTimeout(800);
    await companyOTSPage.clickOnNextButtonOnServiceDetailsTab();
    await companyPage.waitForTimeout(800);
    await companyOTSPage.clickOnNextButtonOnWorkSampleTab();
    await companyPage.waitForTimeout(800);
    await companyOTSPage.fillInput("Price in $ *", "10");
    await companyOTSPage.selectPaymentTerms("One time");
    await companyOTSPage.fillRichTextEditor("Additional Notes / Terms", "This is a sample requirements for the OTS service.");
    await companyPage.waitForTimeout(800);
    await companyOTSPage.saveAndPublishService();
    await companyOTSPage.verifySuccessMessageIsDisplayed("OTS service created successfully");
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

  test("TC_OTS_004: Verify Company is able to Accept Purchase Request on created service", async ({
    companyPage,
    companyHomePage,
    companyOTSPage,
  }) => {
    await companyHomePage.gotoDashboardPage();
    await expect(companyPage).toHaveURL("https://urxprt.com/en/dashboard");
    await companyPage.waitForLoadState("networkidle");
    await companyHomePage.navigateToRecievedOrders();
    await companyPage.waitForLoadState("networkidle");
    const isPresent = await companyOTSPage.isRequestPresent(OTS_ServiceName);
    expect(isPresent).toBeTruthy();
    await companyOTSPage.clickOnAcceptButtonOfService(OTS_ServiceName);
    await companyOTSPage.acceptAndStartOTS();
    await companyOTSPage.verifySuccessMessageIsDisplayed("Updated Successfully");
  })

  test("TC_OTS_005: Verify the accepted service is present under Active Orders", async ({
    companyPage,
    companyHomePage,
    companyOTSPage,
  }) => {
    await companyHomePage.gotoDashboardPage();
    await expect(companyPage).toHaveURL("https://urxprt.com/en/dashboard");
    await companyPage.waitForLoadState("networkidle");
    await companyHomePage.navigateToRecievedOrders();
    await companyOTSPage.clickOnActiveReceivedOrdersTab()
    await companyPage.waitForLoadState("networkidle");
    await companyOTSPage.goToDesiredActiveRecievedOrder("OTS");
    await companyPage.waitForTimeout(1200);
    const isPresent = await companyOTSPage.isActiveRequestPresent(OTS_ServiceName);
    expect(isPresent).toBeTruthy();
  })

  test("TC_OTS_006: Verify Company user is able to submit the work for payment", async ({
    companyPage,
    companyHomePage,
    companyOTSPage,
  }) => {
    await companyHomePage.gotoDashboardPage();
    await expect(companyPage).toHaveURL("https://urxprt.com/en/dashboard");
    await companyPage.waitForLoadState("networkidle");
    await companyHomePage.navigateToRecievedOrders();
    await companyOTSPage.clickOnActiveReceivedOrdersTab()
    await companyPage.waitForLoadState("networkidle");
    await companyOTSPage.goToDesiredActiveRecievedOrder("OTS");
    await companyPage.waitForTimeout(1200);
    await companyOTSPage.goToActiveRequestReview(OTS_ServiceName);
    await companyPage.waitForLoadState("networkidle");
    await companyOTSPage.clickOnSubmitWorkForPayment();
    await companyHomePage.fillInputWithPlaceholder("Enter description here", "This is a test submission for automation");
    await companyOTSPage.insertImage('testData/sampleImg.jpg');
    await companyOTSPage.submitWorkForPayment();
    await companyPage.waitForTimeout(1200);
    await companyOTSPage.verifySuccessMessageIsDisplayed("Work submitted for payment successfully");
  })

  test("TC_OTS_007: Verify Company user is able to view the submitted work for payment", async ({
    companyPage,
    companyHomePage,
    companyOTSPage,
  }) => {
    await companyHomePage.gotoDashboardPage();
    await expect(companyPage).toHaveURL("https://urxprt.com/en/dashboard");
    await companyPage.waitForLoadState("networkidle");
    await companyHomePage.navigateToRecievedOrders();
    await companyOTSPage.clickOnActiveReceivedOrdersTab()
    await companyPage.waitForLoadState("networkidle");
    await companyOTSPage.goToDesiredActiveRecievedOrder("OTS");
    await companyPage.waitForTimeout(1200);
    await companyOTSPage.goToActiveRequestReview(OTS_ServiceName);
    await companyPage.waitForLoadState("networkidle");
    await companyOTSPage.view_submission_button.click();
    await expect(companyOTSPage.submission_overview_tab).toBeVisible();
    await companyOTSPage.submission_overview_closeBtn.click();
    await expect(companyOTSPage.submission_overview_tab).toBeHidden();
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
    companyPage,
    companyHomePage,
    companyOTSPage,
  }) => {
    await companyHomePage.gotoDashboardPage();
    await expect(companyPage).toHaveURL("https://urxprt.com/en/dashboard");
    await companyPage.waitForLoadState("networkidle");
    await companyHomePage.navigateToRecievedOrders();
    await companyOTSPage.clickOnCompletedReceivedOrdersTab()
    await companyPage.waitForLoadState("networkidle");
    await companyOTSPage.goToDesiredActiveRecievedOrder("OTS");
    await companyPage.waitForTimeout(1200);
    const isPresent = await companyOTSPage.isActiveRequestPresent(OTS_ServiceName);
    expect(isPresent).toBeTruthy();
  })

  test("TC_OTS_010: Verify Company user is able to delete the create service", async ({
    companyPage,
    companyHomePage,
    companyOTSPage,
  }) => {
    await companyHomePage.gotoOSMViaCard();
    await companyOTSPage.clickOnCreateAPostButton();
    await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
    await companyHomePage.selectServices("OTS");
    await companyOTSPage.clickOnDeleteButton(OTS_ServiceName)
    await companyOTSPage.verifyConfirmationPopupIsPresent("Confirm Delete")
    await companyOTSPage.clickOnConfirmButton();
    await companyOTSPage.verifySuccessMessageIsDisplayed("Your OTS service has been deleted");
  })

})

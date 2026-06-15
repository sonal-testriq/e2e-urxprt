import { test, expect } from "../../../fixtures/page.fixture";
import { pageRoutes, OTS_ServiceName } from "../../../testData/constants.js";

test("TC_OTS_001: OTS page is accessible after login", async ({
  companyPage,
  companyHomePage,
}) => {
  await companyHomePage.gotoOSMViaCard();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchpackaged");
  await companyHomePage.gotoHomepage();
  await companyHomePage.goToOTSViaHeader();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchpackaged");
});

test("TC_OTS_002: Search filters return expected results", async ({
  companyPage,
  companyHomePage,
  companyOTSPage
}) => {
  await companyHomePage.gotoOSMViaCard();
  const randomText = "Car service";
  await companyOTSPage.searchFor(randomText);
  const post_names = await companyOTSPage.postNames;
  await post_names.first().waitFor();
  await companyPage.waitForTimeout(1200);
  const count = await post_names.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_OTS_003: Navigate to create post page from homepage and dashboard", async ({
  companyPage,
  companyHomePage,
  companyOTSPage,
}) => {
  await companyHomePage.gotoOSMViaCard();
  await companyOTSPage.clickOnCreateAPostButton();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.navigateToAddOTSViaDropdown();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.gotoDashboardPage();
  await companyOTSPage.goToAllServicesTab();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_OTS_004: View filtered post details and verify recently reviewed posts", async ({
  companyPage,
  companyHomePage,
  companyOTSPage,
}) => {
  await companyHomePage.gotoOSMViaCard();
  await companyOTSPage.waitForPosts();
  const randomText = "Amazon@15";
  await companyOTSPage.searchFor(randomText);
  await companyOTSPage.waitForFilteredResults();
  const newPage = await companyOTSPage.goToTheFilteredPostetails();
  await companyOTSPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await companyPage.reload();
  await companyOTSPage.goToRecentlyReviewedPage();
  await companyOTSPage.waitForReviewedPostToAppear();
  await companyOTSPage.searchFor(randomText);
  await companyOTSPage.waitForFilteredResults();
  const count = await companyOTSPage.getPostCount();
  expect(count).toEqual(1);
  const isPresent = await companyOTSPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_OTS_005: Save a filtered post and verify saved posts page", async ({
  companyPage,
  companyHomePage,
  companyOTSPage,
}) => {
  await companyHomePage.gotoOSMViaCard();
  await companyOTSPage.waitForPosts();
  const randomText = "Amazon@15";
  await companyOTSPage.searchFor(randomText);
  await companyOTSPage.waitForFilteredResults();
  const newPage1 = await companyOTSPage.goToTheFilteredPostetails();
  await companyOTSPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await companyPage.reload();
  await companyOTSPage.goToSavedPostsPage();
  await companyOTSPage.waitForSavedPostToAppear();
  const count = await companyOTSPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await companyOTSPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await companyOTSPage.goToTheFilteredPostetails();
  await companyOTSPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await companyPage.reload();
  await companyOTSPage.goToSavedPostsPage();
  await companyOTSPage.verifyThatTheTabHasNoPosts();
});

test("TC_OTS_006: Apply multiple filters and verify counts update correctly", async ({
  companyPage,
  companyHomePage,
  companyOTSPage,
}) => {
  await companyHomePage.gotoOSMViaCard();
  await companyOTSPage.waitForPosts();
  const originalPageCount = await companyOTSPage.getTheTotalPageNumber();
  const beforeFilter = (await companyOTSPage.postNames.allTextContents())
    .map((t) => t.trim())
    .filter(Boolean);
  await companyOTSPage.chooseIndustryFilter();
  await expect(async () => {
    const after = await companyOTSPage.postNames.allTextContents();
    expect(after).not.toEqual(beforeFilter);
  }).toPass();
  const countAfterIndustrySelect = await companyOTSPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
  const postCount = await companyOTSPage.getPostCount();
  await companyOTSPage.chooseCategoryFilter();
  await companyPage.waitForTimeout(1200);
  const updatedPostCount = await companyOTSPage.getPostCount();
  expect(updatedPostCount).toBeLessThan(postCount);
});

test.describe.serial("OTS Tests for Company Role", () => {
  test("TC_OTS_007: Verify Company user is able to add a service", async ({
    companyPage,
    companyHomePage,
    companyOTSPage,
  }) => {
    await companyHomePage.gotoOSMViaCard();
    await companyOTSPage.clickOnCreateAPostButton();
    await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
    await companyOTSPage.clickOnAddButtonOnAllServicesPage();
    await companyPage.waitForTimeout(500);
    await companyOTSPage.fillInput("Service Title ", OTS_ServiceName);
    await companyPage.locator('input[type="file"]').setInputFiles('testData/sampleImg.jpg');
    await expect(companyPage.locator("//img[@alt='Delete']")).toBeVisible();
    await companyOTSPage.fillRichTextEditor("Description", "This is a sample description for the OTS service.");
    await companyOTSPage.selectMultiDropdown("Industry *", ["E Commerce"]);
    await companyOTSPage.selectMultiDropdown("Category *", ["Supply Chain"]);
    await companyOTSPage.fillInput("No of Days", "10");
    await companyOTSPage.fillRichTextEditor("Requirements", "This is a sample requirements for the OTS service.");
    await companyPage.waitForTimeout(500);
    await companyOTSPage.clickOnNextButtonOnServiceDetailsTab();
    await companyPage.waitForTimeout(500);
    await companyOTSPage.clickOnNextButtonOnWorkSampleTab();
    await companyPage.waitForTimeout(500);
    await companyOTSPage.fillInput("Price in $ *", "10");
    await companyOTSPage.selectPaymentTerms("One time");
    await companyOTSPage.fillRichTextEditor("Additional Notes / Terms", "This is a sample requirements for the OTS service.");
    await companyPage.waitForTimeout(500);
    await companyOTSPage.saveAndPublishService();
    await companyOTSPage.verifySuccessMessageIsDisplayed("OTS service created successfully");
  })

  test("TC_OTS_008: Verify Company user is able to view created service in All Services", async ({
    companyPage,
    companyHomePage,
    companyOTSPage,
  }) => {
    await companyHomePage.gotoOSMViaCard();
    await companyOTSPage.clickOnCreateAPostButton();
    await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
    await companyHomePage.selectServices("OTS");
    await companyOTSPage.isServicePresent(OTS_ServiceName)
  })

  test("TC_OTS_009: Verify Company user is able to edit the create service", async ({
    companyPage,
    companyHomePage,
    companyOTSPage,
  }) => {
    await companyHomePage.gotoOSMViaCard();
    await companyOTSPage.clickOnCreateAPostButton();
    await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
    await companyHomePage.selectServices("OTS");
    await companyOTSPage.clickOnEditButton(OTS_ServiceName)
    await companyPage.waitForTimeout(500);
    await companyOTSPage.fillInput("Service Title ", OTS_ServiceName + " Updated");
    await companyOTSPage.clickOnNextButtonOnServiceDetailsTab();
    await companyOTSPage.clickOnNextButtonOnWorkSampleTab();
    await companyOTSPage.saveAndPublishService();
    await companyOTSPage.verifySuccessMessageIsDisplayed("OTS service updated successfully");
    await companyOTSPage.isServicePresent(OTS_ServiceName + " Updated")
    await companyOTSPage.clickOnEditButton(OTS_ServiceName + " Updated")
    await companyPage.waitForTimeout(500);
    await companyOTSPage.fillInput("Service Title ", OTS_ServiceName);
    await companyOTSPage.clickOnNextButtonOnServiceDetailsTab();
    await companyOTSPage.clickOnNextButtonOnWorkSampleTab();
    await companyOTSPage.saveAndPublishService();
    await companyOTSPage.verifySuccessMessageIsDisplayed("OTS service updated successfully");
    await companyOTSPage.isServicePresent(OTS_ServiceName)
  })

  test("TC_OTS_010: Verify Company user is able to cancel the edit", async ({
    companyPage,
    companyHomePage,
    companyOTSPage,
  }) => {
    await companyHomePage.gotoOSMViaCard();
    await companyOTSPage.clickOnCreateAPostButton();
    await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
    await companyHomePage.selectServices("OTS");
    await companyOTSPage.clickOnEditButton(OTS_ServiceName)
    await companyPage.waitForTimeout(500);
    await companyOTSPage.closeAddServicesTab();
    await companyOTSPage.verifyConfirmationPopupIsPresent("You have unsaved changes. Are you sure you want to cancel?")
    await companyOTSPage.clickOnYesButton();
  })

  test("TC_OTS_011: Verify Company user is able to delete the create service", async ({
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


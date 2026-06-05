import { test, expect } from "../../../fixtures/page.fixture";
import { pageRoutes, OTS_ServiceName } from "../../../testData/constants.js";

test("TC_OTS_001: OTS page is accessible after login", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoOSMViaCard();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchpackaged");

  await expertHomePage.gotoHomepage();
  await expertHomePage.goToOTSViaHeader();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchpackaged");
});

test("TC_OTS_002: Search filters return expected results", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoOSMViaCard();
  const randomText = "Car service";
  const search_box = expertPage.getByRole("textbox", { name: "Search OTS" });
  const search_button = expertPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();
  const postNames = await expertPage.locator("//div[@class='packaged-img']//h6");
  await postNames.first().waitFor();
  await expertPage.waitForTimeout(1200);
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_OTS_003: Navigate to create post page from homepage and dashboard", async ({
  expertPage,
  expertHomePage,
  expertOTSPage,
}) => {
  await expertHomePage.gotoOSMViaCard();
  await expertOTSPage.clickOnCreateAPostButton();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.navigateToAddOTSViaDropdown();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.gotoDashboardPage();
  await expertOTSPage.goToAllServicesTab();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_OTS_004: View filtered post details and verify recently reviewed posts", async ({
  expertPage,
  expertHomePage,
  expertOTSPage,
}) => {
  await expertHomePage.gotoOSMViaCard();
  await expertOTSPage.waitForPosts();
  const randomText = "Amazon@15";
  await expertOTSPage.searchFor(randomText);
  await expertOTSPage.waitForFilteredResults();
  const newPage = await expertOTSPage.goToTheFilteredPostetails();
  await expertOTSPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await expertPage.reload();
  await expertOTSPage.goToRecentlyReviewedPage();
  await expertOTSPage.waitForReviewedPostToAppear();
  await expertOTSPage.searchFor(randomText);
  await expertOTSPage.waitForFilteredResults();
  const count = await expertOTSPage.getPostCount();
  expect(count).toEqual(1);
  const isPresent = await expertOTSPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_OTS_005: Save a filtered post and verify saved posts page", async ({
  expertPage,
  expertHomePage,
  expertOTSPage,
}) => {
  await expertHomePage.gotoOSMViaCard();
  await expertOTSPage.waitForPosts();
  const randomText = "Amazon@15";
  await expertOTSPage.searchFor(randomText);
  await expertOTSPage.waitForFilteredResults();
  const newPage1 = await expertOTSPage.goToTheFilteredPostetails();
  await expertOTSPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await expertPage.reload();
  await expertOTSPage.goToSavedPostsPage();
  await expertOTSPage.waitForSavedPostToAppear();
  const count = await expertOTSPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await expertOTSPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await expertOTSPage.goToTheFilteredPostetails();
  await expertOTSPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await expertPage.reload();
  await expertOTSPage.goToSavedPostsPage();
  await expertOTSPage.verifyThatTheTabHasNoPosts();
});

test("TC_OTS_006: Apply multiple filters and verify counts update correctly", async ({
  expertPage,
  expertHomePage,
  expertOTSPage,
}) => {
  await expertHomePage.gotoOSMViaCard();
  await expertOTSPage.waitForPosts();
  const originalPageCount = await expertOTSPage.getTheTotalPageNumber();
  const beforeFilter = (await expertOTSPage.postNames.allTextContents())
    .map((t) => t.trim())
    .filter(Boolean);
  await expertOTSPage.chooseIndustryFilter();
  await expect(async () => {
    const after = await expertOTSPage.postNames.allTextContents();
    expect(after).not.toEqual(beforeFilter);
  }).toPass();
  const countAfterIndustrySelect = await expertOTSPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
  const postCount = await expertOTSPage.getPostCount();
  await expertOTSPage.chooseCategoryFilter();
  await expertPage.waitForTimeout(1200);
  const updatedPostCount = await expertOTSPage.getPostCount();
  expect(updatedPostCount).toBeLessThan(postCount);
});

test.describe.serial("OTS Tests for Expert Role", () => {
  test("TC_OTS_007: Verify Expert user is able to add a service", async ({
    expertPage,
    expertHomePage,
    expertOTSPage,
  }) => {
    await expertHomePage.gotoOSMViaCard();
    await expertOTSPage.clickOnCreateAPostButton();
    await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
    await expertOTSPage.clickOnAddButtonOnAllServicesPage();
    await expertPage.waitForTimeout(500);
    await expertOTSPage.fillInput("Service Title ", OTS_ServiceName);
    await expertPage.locator('input[type="file"]').setInputFiles('testData/sampleImg.jpg');
    await expect(expertPage.locator("//img[@alt='Delete']")).toBeVisible();
    await expertOTSPage.fillRichTextEditor("Description", "This is a sample description for the OTS service.");
    await expertOTSPage.selectMultiDropdown("Industry *", ["E Commerce"]);
    await expertOTSPage.selectMultiDropdown("Category *", ["Supply Chain"]);
    await expertOTSPage.fillInput("No of Days", "10");
    await expertOTSPage.fillRichTextEditor("Requirements", "This is a sample requirements for the OTS service.");
    await expertPage.waitForTimeout(500);
    await expertOTSPage.clickOnNextButtonOnServiceDetailsTab();
    await expertPage.waitForTimeout(500);
    await expertOTSPage.clickOnNextButtonOnWorkSampleTab();
    await expertPage.waitForTimeout(500);
    await expertOTSPage.fillInput("Price in $ *", "10");
    await expertOTSPage.selectPaymentTerms("One time");
    await expertOTSPage.fillRichTextEditor("Additional Notes / Terms", "This is a sample requirements for the OTS service.");
    await expertPage.waitForTimeout(500);
    await expertOTSPage.saveAndPublishService();
    await expertOTSPage.verifySuccessMessageIsDisplayed("OTS service created successfully");
  })

  test("TC_OTS_008: Verify Expert user is able to view created service in All Services", async ({
    expertPage,
    expertHomePage,
    expertOTSPage,
  }) => {
    await expertHomePage.gotoOSMViaCard();
    await expertOTSPage.clickOnCreateAPostButton();
    await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
    await expertHomePage.selectServices("OTS");
    await expertOTSPage.isServicePresent(OTS_ServiceName)
  })

  test("TC_OTS_009: Verify Expert user is able to edit the create service", async ({
    expertPage,
    expertHomePage,
    expertOTSPage,
  }) => {
    await expertHomePage.gotoOSMViaCard();
    await expertOTSPage.clickOnCreateAPostButton();
    await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
    await expertHomePage.selectServices("OTS");
    await expertOTSPage.clickOnEditButton(OTS_ServiceName)
    await expertPage.waitForTimeout(500);
    await expertOTSPage.fillInput("Service Title ", OTS_ServiceName + " Updated");
    await expertOTSPage.clickOnNextButtonOnServiceDetailsTab();
    await expertOTSPage.clickOnNextButtonOnWorkSampleTab();
    await expertOTSPage.saveAndPublishService();
    await expertOTSPage.verifySuccessMessageIsDisplayed("OTS service updated successfully");
    await expertOTSPage.isServicePresent(OTS_ServiceName + " Updated")
    await expertOTSPage.clickOnEditButton(OTS_ServiceName + " Updated")
    await expertPage.waitForTimeout(500);
    await expertOTSPage.fillInput("Service Title ", OTS_ServiceName);
    await expertOTSPage.clickOnNextButtonOnServiceDetailsTab();
    await expertOTSPage.clickOnNextButtonOnWorkSampleTab();
    await expertOTSPage.saveAndPublishService();
    await expertOTSPage.verifySuccessMessageIsDisplayed("OTS service updated successfully");
    await expertOTSPage.isServicePresent(OTS_ServiceName)
  })

  test("TC_OTS_010: Verify Expert user is able to cancel the edit", async ({
    expertPage,
    expertHomePage,
    expertOTSPage,
  }) => {
    await expertHomePage.gotoOSMViaCard();
    await expertOTSPage.clickOnCreateAPostButton();
    await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
    await expertHomePage.selectServices("OTS");
    await expertOTSPage.clickOnEditButton(OTS_ServiceName)
    await expertPage.waitForTimeout(500);
    await expertOTSPage.closeAddServicesTab();
    await expertOTSPage.verifyConfirmationPopupIsPresent("You have unsaved changes. Are you sure you want to cancel?")
    await expertOTSPage.clickOnYesButton();
  })

  test("TC_OTS_011: Verify Expert user is able to delete the create service", async ({
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

import { test, expect } from "../../../fixtures/page.fixture";
import { pageRoutes, OTS_ServiceName } from "../../../testData/constants.js";

test("TC_OTS_001: OTS page is accessible after login", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoOSMViaCard();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchpackaged");

  await userHomePage.gotoHomepage();
  await userHomePage.goToOTSViaHeader();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchpackaged");
});

test("TC_OTS_002: Search filters return expected results", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoOSMViaCard();
  const randomText = "Car service";
  const search_box = userPage.getByRole("textbox", { name: "Search OTS" });
  const search_button = userPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();
  const postNames = await userPage.locator("//div[@class='packaged-img']//h6");
  await postNames.first().waitFor();
  await userPage.waitForTimeout(1200);
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_OTS_003: Navigate to create post page from homepage and dashboard", async ({
  userPage,
  userHomePage,
  userOTSPage,
}) => {
  await userHomePage.gotoOSMViaCard();
  await userOTSPage.clickOnCreateAPostButton();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
  await userHomePage.gotoHomepage();
  await userHomePage.navigateToAddOTSViaDropdown();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
  await userOTSPage.verifyJoinAsExpertOrCompanyPopUpAppearsForUserAccount();
  await userOTSPage.closePopUp();
  await userHomePage.gotoHomepage();
  await userHomePage.gotoDashboardPage();
  await userOTSPage.goToAllServicesTab();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_OTS_004: View filtered post details and verify recently reviewed posts", async ({
  userPage,
  userHomePage,
  userOTSPage,
}) => {
  await userHomePage.gotoOSMViaCard();
  await userOTSPage.waitForPosts();
  const randomText = "Amazon@15";
  await userOTSPage.searchFor(randomText);
  await userOTSPage.waitForFilteredResults();
  const newPage = await userOTSPage.goToTheFilteredPostetails();
  await userOTSPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await userPage.reload();
  await userOTSPage.goToRecentlyReviewedPage();
  await userOTSPage.waitForReviewedPostToAppear();
  const count = await userOTSPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await userOTSPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_OTS_005: Save a filtered post and verify saved posts page", async ({
  userPage,
  userHomePage,
  userOTSPage,
}) => {
  await userHomePage.gotoOSMViaCard();
  await userOTSPage.waitForPosts();
  const randomText = "Amazon@15";
  await userOTSPage.searchFor(randomText);
  await userOTSPage.waitForFilteredResults();
  const newPage1 = await userOTSPage.goToTheFilteredPostetails();
  await userOTSPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await userPage.reload();
  await userOTSPage.goToSavedPostsPage();
  await userOTSPage.waitForSavedPostToAppear();
  const count = await userOTSPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await userOTSPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await userOTSPage.goToTheFilteredPostetails();
  await userOTSPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await userPage.reload();
  await userOTSPage.goToSavedPostsPage();
  await userOTSPage.verifyThatTheTabHasNoPosts();
});

test("TC_OTS_006: Apply multiple filters and verify counts update correctly", async ({
  userPage,
  userHomePage,
  userOTSPage,
}) => {
  await userHomePage.gotoOSMViaCard();
  await userOTSPage.waitForPosts();
  const originalPageCount = await userOTSPage.getTheTotalPageNumber();
  const beforeFilter = (await userOTSPage.postNames.allTextContents())
    .map((t) => t.trim())
    .filter(Boolean);
  await userOTSPage.chooseIndustryFilter();
  await expect(async () => {
    const after = await userOTSPage.postNames.allTextContents();
    expect(after).not.toEqual(beforeFilter);
  }).toPass();
  const countAfterIndustrySelect = await userOTSPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
  const postCount = await userOTSPage.getPostCount();
  await userOTSPage.chooseCategoryFilter();
  await userPage.waitForTimeout(1200);
  const updatedPostCount = await userOTSPage.getPostCount();
  expect(updatedPostCount).toBeLessThan(postCount);
});

test("TC_OTS_007: Verify User is not able to Add One time service and it should display", async ({
  userPage,
  userHomePage,
  userOTSPage,
}) => {
  await userHomePage.gotoOSMViaCard();
  await userOTSPage.clickOnCreateAPostButton();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
  await userOTSPage.clickOnAddButtonOnAllServicesPage();
  await userOTSPage.verifyJoinAsExpertOrCompanyPopUpAppearsForUserAccount();
  await userOTSPage.closePopUp();
});

test("TC_OTS_008: Verify Expert user is not able to add a service with empty or invalid input", async ({
    expertPage,
    expertHomePage,
    expertOTSPage,
  }) => {
    await expertHomePage.gotoOSMViaCard();
    await expertOTSPage.clickOnCreateAPostButton();
    await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
    await expertOTSPage.clickOnAddButtonOnAllServicesPage();
    await expertPage.waitForTimeout(500);
    await expertOTSPage.clickOnNextButtonOnServiceDetailsTab();
    const expectedErrors = [
      "This is required",
      "Industry is required",
      "Category is required",
      "Duration is required"
    ];
    await expertPage.locator(".error").first().waitFor();
    const errorMessages = await expertPage.locator(".error").allTextContents();
    for (const expected of expectedErrors) {
      expect(errorMessages).toContain(expected);
    }
})

test("TC_OTS_009: Verify Expert user is able to optionally add more work sample and remove it", async ({
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
  await expertOTSPage.fillInput("No of Days", "1");
  await expertOTSPage.fillRichTextEditor("Requirements", "This is a sample requirements for the OTS service.");
  await expertPage.waitForTimeout(500);
  await expertOTSPage.clickOnNextButtonOnServiceDetailsTab();
  await expertOTSPage.clickOnAddMoreSample();
  await expertOTSPage.verifyProjectTitleAndProjectURLIsVisible();
  await expertOTSPage.clickOnRemoveSample();
  await expertOTSPage.verifyProjectTitleAndProjectURLIsNotVisible();
})

test("TC_OTS_010: Verify Expert user is not able to save and publish service with empty Pricing and Terms", async ({
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
  await expertPage.waitForTimeout(500);
  await expertOTSPage.clickOnNextButtonOnServiceDetailsTab();
  await expertPage.waitForTimeout(500);
  await expertOTSPage.clickOnNextButtonOnWorkSampleTab();
  await expertPage.waitForTimeout(500);
  await expertOTSPage.saveAndPublishService();
  const expectedErrors = [
    "Price is required",
    "This is required",
  ];
  await expertPage.locator(".error").first().waitFor();
  const errorMessages = await expertPage.locator(".error").allTextContents();
  for (const expected of expectedErrors) {
    expect(errorMessages).toContain(expected);
  }
})



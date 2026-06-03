import { test, expect } from "../../../fixtures/page.fixture";

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


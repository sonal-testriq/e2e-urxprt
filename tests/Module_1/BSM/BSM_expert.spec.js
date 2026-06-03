import { test, expect } from "../../../fixtures/page.fixture.js";

test("TC_BSM_001: BSM page is accessible after login", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoBSMViaCard();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchbuyproducts");

  await expertHomePage.gotoHomepage();
  await expertHomePage.goToBSMViaHeader();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchbuyproducts");
});

test("TC_BSM_002: Search filters return expected results", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoBSMViaCard();
  const randomText = "Cricket kit";
  const search_box = expertPage.getByRole("textbox", { name: "Search BSM" });
  const search_button = expertPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();
  const postNames = await expertPage.locator("//div[@class='packaged-img']//h6");
  await postNames.first().waitFor();
  await expertPage.waitForTimeout(1200);
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_BSM_003: Navigate to create post page from homepage and dashboard", async ({
  expertPage,
  expertHomePage,
  expertBSMPage,
}) => {
  await expertHomePage.gotoBSMViaCard();
  await expertBSMPage.clickOnAddAProductButton();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.navigateToAddBSMViaDropdown();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.gotoDashboardPage();
  await expertBSMPage.goToAllServicesTab();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_BSM_004: View filtered post details and verify recently reviewed posts", async ({
  expertPage,
  expertHomePage,
  expertBSMPage,
}) => {
  await expertHomePage.gotoBSMViaCard();
  await expertBSMPage.waitForPosts();
  const randomText = "Cricket kit";
  await expertBSMPage.searchFor(randomText);
  await expertBSMPage.waitForFilteredResults();
  const newPage = await expertBSMPage.goToTheFilteredPostetails();
  await expertBSMPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await expertPage.reload();
  await expertBSMPage.goToRecentlyReviewedPage();
  await expertBSMPage.waitForReviewedPostToAppear();
  const count = await expertBSMPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await expertBSMPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_OTS_005: Save a filtered post and verify saved posts page", async ({
  expertPage,
  expertHomePage,
  expertBSMPage,
}) => {
  await expertHomePage.gotoBSMViaCard();
  await expertBSMPage.waitForPosts();
  const randomText = "Cricket kit";
  await expertBSMPage.searchFor(randomText);
  await expertBSMPage.waitForFilteredResults();
  const newPage1 = await expertBSMPage.goToTheFilteredPostetails();
  await expertBSMPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await expertPage.reload();
  await expertBSMPage.goToSavedPostsPage();
  await expertBSMPage.waitForSavedPostToAppear();
  const count = await expertBSMPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await expertBSMPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await expertBSMPage.goToTheFilteredPostetails();
  await expertBSMPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await expertPage.reload();
  await expertBSMPage.goToSavedPostsPage();
  await expertBSMPage.verifyThatTheTabHasNoPosts();
});

test("TC_BSM_006: Apply multiple filters and verify counts update correctly", async ({
  expertPage,
  expertHomePage,
  expertBSMPage,
}) => {
  await expertHomePage.gotoBSMViaCard();
  await expertBSMPage.waitForPosts();
  const originalPageCount = await expertBSMPage.getTheTotalPageNumber();
  await expertBSMPage.chooseCountryFilter();
  const countAfterCountrySelect = await expertBSMPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterCountrySelect);
  const beforeIndustryFilterPostCount = await expertBSMPage.getPostCount();
  await expertBSMPage.chooseIndustryFilter();
  await expertPage.waitForTimeout(1200);
  const afterIndustryFilterPostCount = await expertBSMPage.getPostCount();
  expect(afterIndustryFilterPostCount).toBeLessThan(beforeIndustryFilterPostCount);
  await expertBSMPage.chooseCategoryFilter();
  await expertBSMPage.chooseSubCategoryFilter();
  await expertPage.waitForTimeout(1200);
  const afterCategoryFilterPostCount = await expertBSMPage.getPostCount();
  expect(afterCategoryFilterPostCount).toBeLessThan(afterIndustryFilterPostCount);
});
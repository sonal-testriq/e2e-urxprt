import { test, expect } from "../../../fixtures/page.fixture.js";

test("TC_BSM_001: BSM page is accessible after login", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoBSMViaCard();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchbuyproducts");
  await userHomePage.gotoHomepage();
  await userHomePage.goToBSMViaHeader();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchbuyproducts");
});

test("TC_BSM_002: Search filters return expected results", async ({
  userPage,
  userHomePage,
  userBSMPage
}) => {
  await userHomePage.gotoBSMViaCard();
  const randomText = "Cricket kit";
  await userBSMPage.searchFor(randomText);
  const post_name = await userBSMPage.postNames;
  await post_name.first().waitFor();
  await userPage.waitForTimeout(500);
  const count = await post_name.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_BSM_003: Navigate to create post page from homepage and dashboard", async ({
  userPage,
  userHomePage,
  userBSMPage,
}) => {
  await userHomePage.gotoBSMViaCard();
  await userBSMPage.clickOnAddAProductButton();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
  await userHomePage.gotoHomepage();
  await userHomePage.navigateToAddBSMViaDropdown();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
  await userHomePage.gotoHomepage();
  await userHomePage.gotoDashboardPage();
  await userBSMPage.goToAllServicesTab();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_BSM_004: View filtered post details and verify recently reviewed posts", async ({
  userPage,
  userHomePage,
  userBSMPage,
}) => {
  await userHomePage.gotoBSMViaCard();
  await userBSMPage.waitForPosts();
  const randomText = "Cricket kit";
  await userBSMPage.searchFor(randomText);
  await userBSMPage.waitForFilteredResults();
  const newPage = await userBSMPage.goToTheFilteredPostetails();
  await userBSMPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await userPage.reload();
  await userBSMPage.goToRecentlyReviewedPage();
  await userBSMPage.waitForReviewedPostToAppear();
  const count = await userBSMPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await userBSMPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_OTS_005: Save a filtered post and verify saved posts page", async ({
  userPage,
  userHomePage,
  userBSMPage,
}) => {
  await userHomePage.gotoBSMViaCard();
  await userBSMPage.waitForPosts();
  const randomText = "Cricket kit";
  await userBSMPage.searchFor(randomText);
  await userBSMPage.waitForFilteredResults();
  const newPage1 = await userBSMPage.goToTheFilteredPostetails();
  await userBSMPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await userPage.reload();
  await userBSMPage.goToSavedPostsPage();
  await userBSMPage.waitForSavedPostToAppear();
  const count = await userBSMPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await userBSMPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await userBSMPage.goToTheFilteredPostetails();
  await userBSMPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await userPage.reload();
  await userBSMPage.goToSavedPostsPage();
  await userBSMPage.verifyThatTheTabHasNoPosts();
});

test("TC_BSM_006: Apply multiple filters and verify counts update correctly", async ({
  userPage,
  userHomePage,
  userBSMPage,
}) => {
  await userHomePage.gotoBSMViaCard();
  await userBSMPage.waitForPosts();
  const originalPageCount = await userBSMPage.getTheTotalPageNumber();
  await userBSMPage.chooseCountryFilter();
  const countAfterCountrySelect = await userBSMPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterCountrySelect);
  const beforeIndustryFilterPostCount = await userBSMPage.getPostCount();
  await userBSMPage.chooseIndustryFilter();
  await userPage.waitForTimeout(1200);
  const afterIndustryFilterPostCount = await userBSMPage.getPostCount();
  expect(afterIndustryFilterPostCount).toBeLessThan(beforeIndustryFilterPostCount);
  await userBSMPage.chooseCategoryFilter();
  await userBSMPage.chooseSubCategoryFilter();
  await userPage.waitForTimeout(1200);
  const afterCategoryFilterPostCount = await userBSMPage.getPostCount();
  expect(afterCategoryFilterPostCount).toBeLessThan(afterIndustryFilterPostCount);
});
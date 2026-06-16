import { test, expect } from "../../../fixtures/page.fixture.js";

test("TC_TAI_001: TAI page is accessible after login", async ({
  companyPage,
  companyHomePage,
}) => {
  await companyHomePage.gotoTAIViaCard();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchrentproducts");
  await companyHomePage.gotoHomepage();
  await companyHomePage.goToTAIViaHeader();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchrentproducts");
});

test("TC_TAI_002: Search filters return expected results", async ({
  companyPage,
  companyHomePage,
  companyTAIPage
}) => {
  await companyHomePage.gotoTAIViaCard();
  const randomText = "Wallpaper";
  await companyTAIPage.searchFor(randomText);
  const post_names = await companyTAIPage.postNames;
  await post_names.first().waitFor();
  await companyPage.waitForTimeout(500);
  const count = await post_names.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_TAI_003: Navigate to create post page from homepage and dashboard", async ({
  companyPage,
  companyHomePage,
  companyTAIPage,
}) => {
  await companyHomePage.gotoTAIViaCard();
  await companyTAIPage.addAProduct();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.navigateToAddTAIViaDropdown();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.gotoDashboardPage();
  await companyTAIPage.goToAllServicesTab();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_TAI_004: View filtered post details and verify recently reviewed posts", async ({
  companyPage,
  companyHomePage,
  companyTAIPage,
}) => {
  await companyHomePage.gotoTAIViaCard();
  await companyTAIPage.waitForPosts();
  const randomText = "Wallpaper";
  await companyTAIPage.searchFor(randomText);
  await companyTAIPage.waitForFilteredResults();
  const newPage = await companyTAIPage.goToTheFilteredPostetails();
  await companyTAIPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await companyPage.reload();
  await companyTAIPage.goToRecentlyReviewedPage();
  await companyTAIPage.waitForReviewedPostToAppear();
  const count = await companyTAIPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await companyTAIPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_TAI_005: Save a filtered post and verify saved posts page", async ({
  companyPage,
  companyHomePage,
  companyTAIPage,
}) => {
  await companyHomePage.gotoTAIViaCard();
  await companyTAIPage.waitForPosts();
  const randomText = "Wallpaper";
  await companyTAIPage.searchFor(randomText);
  await companyTAIPage.waitForFilteredResults();
  const newPage1 = await companyTAIPage.goToTheFilteredPostetails();
  await companyTAIPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await companyPage.reload();
  await companyTAIPage.goToSavedPostsPage();
  await companyTAIPage.waitForSavedPostToAppear();
  const count = await companyTAIPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await companyTAIPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await companyTAIPage.goToTheFilteredPostetails();
  await companyTAIPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await companyPage.reload();
  await companyTAIPage.goToSavedPostsPage();
  await companyTAIPage.verifyThatTheTabHasNoPosts();
});

test("TC_TAI_006: Apply multiple filters and verify counts update correctly", async ({
  companyPage,
  companyHomePage,
  companyTAIPage,
}) => {
  await companyHomePage.gotoTAIViaCard();
  await companyTAIPage.waitForPosts();
  const originalPageCount = await companyTAIPage.getTheTotalPageNumber();
  await companyTAIPage.chooseRentalType();
  const countAfterRentalSelect = await companyTAIPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterRentalSelect);
  await companyTAIPage.chooseIndustryFilter();
  await companyPage.waitForTimeout(1200);
  const afterIndustryFilterPostCount = await companyTAIPage.getPostCount();
  await companyTAIPage.chooseCategoryFilter();
  await companyPage.waitForTimeout(1200);
  const afterCategoryFilterPostCount = await companyTAIPage.getPostCount();
  expect(afterCategoryFilterPostCount).toBeLessThan(afterIndustryFilterPostCount);
  await companyTAIPage.chooseSubCategoryFilter();
  await companyPage.waitForTimeout(1200);
  const afterSubCategoryFilterPostCount = await companyTAIPage.getPostCount();
  expect(afterSubCategoryFilterPostCount).toBeLessThan(afterCategoryFilterPostCount);
});
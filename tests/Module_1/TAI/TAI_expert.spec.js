import { test, expect } from "../../../fixtures/page.fixture.js";

test("TC_TAI_001: TAI page is accessible after login", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoTAIViaCard();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchrentproducts");
  await expertHomePage.gotoHomepage();
  await expertHomePage.goToTAIViaHeader();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchrentproducts");
});

test("TC_TAI_002: Search filters return expected results", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoTAIViaCard();
  const randomText = "Wallpaper";
  const search_box = expertPage.getByRole("textbox", { name: "Search TAI" });
  const search_button = expertPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();
  const postNames = await expertPage.locator("//div[@class='packaged-img']//h6");
  await postNames.first().waitFor();
  await expertPage.waitForTimeout(1200);
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_TAI_003: Navigate to create post page from homepage and dashboard", async ({
  expertPage,
  expertHomePage,
  expertTAIPage,
}) => {
  await expertHomePage.gotoTAIViaCard();
  await expertTAIPage.addAProduct();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.navigateToAddTAIViaDropdown();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.gotoDashboardPage();
  await expertTAIPage.goToAllServicesTab();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_TAI_004: View filtered post details and verify recently reviewed posts", async ({
  expertPage,
  expertHomePage,
  expertTAIPage,
}) => {
  await expertHomePage.gotoTAIViaCard();
  await expertTAIPage.waitForPosts();
  const randomText = "Wallpaper";
  await expertTAIPage.searchFor(randomText);
  await expertTAIPage.waitForFilteredResults();
  const newPage = await expertTAIPage.goToTheFilteredPostetails();
  await expertTAIPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await expertPage.reload();
  await expertTAIPage.goToRecentlyReviewedPage();
  await expertTAIPage.waitForReviewedPostToAppear();
  const count = await expertTAIPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await expertTAIPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_TAI_005: Save a filtered post and verify saved posts page", async ({
  expertPage,
  expertHomePage,
  expertTAIPage,
}) => {
  await expertHomePage.gotoTAIViaCard();
  await expertTAIPage.waitForPosts();
  const randomText = "Wallpaper";
  await expertTAIPage.searchFor(randomText);
  await expertTAIPage.waitForFilteredResults();
  const newPage1 = await expertTAIPage.goToTheFilteredPostetails();
  await expertTAIPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await expertPage.reload();
  await expertTAIPage.goToSavedPostsPage();
  await expertTAIPage.waitForSavedPostToAppear();
  const count = await expertTAIPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await expertTAIPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await expertTAIPage.goToTheFilteredPostetails();
  await expertTAIPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await expertPage.reload();
  await expertTAIPage.goToSavedPostsPage();
  await expertTAIPage.verifyThatTheTabHasNoPosts();
});

test("TC_TAI_006: Apply multiple filters and verify counts update correctly", async ({
  expertPage,
  expertHomePage,
  expertTAIPage,
}) => {
  await expertHomePage.gotoTAIViaCard();
  await expertTAIPage.waitForPosts();
  const originalPageCount = await expertTAIPage.getTheTotalPageNumber();
  await expertTAIPage.chooseRentalType();
  const countAfterRentalSelect = await expertTAIPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterRentalSelect);
  await expertTAIPage.chooseIndustryFilter();
  await expertPage.waitForTimeout(1200);
  const afterIndustryFilterPostCount = await expertTAIPage.getPostCount();
  await expertTAIPage.chooseCategoryFilter();
  await expertPage.waitForTimeout(1200);
  const afterCategoryFilterPostCount = await expertTAIPage.getPostCount();
  expect(afterCategoryFilterPostCount).toBeLessThan(afterIndustryFilterPostCount);
  await expertTAIPage.chooseSubCategoryFilter();
  await expertPage.waitForTimeout(1200);
  const afterSubCategoryFilterPostCount = await expertTAIPage.getPostCount();
  expect(afterSubCategoryFilterPostCount).toBeLessThan(afterCategoryFilterPostCount);
});
import { test, expect } from "../../../fixtures/page.fixture.js";

test("TC_TAI_001: TAI page is accessible after login", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoTAIViaCard();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchrentproducts");
  await userHomePage.gotoHomepage();
  await userHomePage.goToTAIViaHeader();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchrentproducts");
});

test("TC_TAI_002: Search filters return expected results", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoTAIViaCard();
  const randomText = "Wallpaper";
  const search_box = userPage.getByRole("textbox", { name: "Search TAI" });
  const search_button = userPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();
  const postNames = await userPage.locator("//div[@class='packaged-img']//h6");
  await postNames.first().waitFor();
  await userPage.waitForTimeout(1200);
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_TAI_003: Navigate to create post page from homepage and dashboard", async ({
  userPage,
  userHomePage,
  userTAIPage,
}) => {
  await userHomePage.gotoTAIViaCard();
  await userTAIPage.addAProduct();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
  await userHomePage.gotoHomepage();
  await userHomePage.navigateToAddTAIViaDropdown();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
  await userHomePage.gotoHomepage();
  await userHomePage.gotoDashboardPage();
  await userTAIPage.goToAllServicesTab();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_TAI_004: View filtered post details and verify recently reviewed posts", async ({
  userPage,
  userHomePage,
  userTAIPage,
}) => {
  await userHomePage.gotoTAIViaCard();
  await userTAIPage.waitForPosts();
  const randomText = "Wallpaper";
  await userTAIPage.searchFor(randomText);
  await userTAIPage.waitForFilteredResults();
  const newPage = await userTAIPage.goToTheFilteredPostetails();
  await userTAIPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await userPage.reload();
  await userTAIPage.goToRecentlyReviewedPage();
  await userTAIPage.waitForReviewedPostToAppear();
  const count = await userTAIPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await userTAIPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_TAI_005: Save a filtered post and verify saved posts page", async ({
  userPage,
  userHomePage,
  userTAIPage,
}) => {
  await userHomePage.gotoTAIViaCard();
  await userTAIPage.waitForPosts();
  const randomText = "Wallpaper";
  await userTAIPage.searchFor(randomText);
  await userTAIPage.waitForFilteredResults();
  const newPage1 = await userTAIPage.goToTheFilteredPostetails();
  await userTAIPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await userPage.reload();
  await userTAIPage.goToSavedPostsPage();
  await userTAIPage.waitForSavedPostToAppear();
  const count = await userTAIPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await userTAIPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await userTAIPage.goToTheFilteredPostetails();
  await userTAIPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await userPage.reload();
  await userTAIPage.goToSavedPostsPage();
  await userTAIPage.verifyThatTheTabHasNoPosts();
});

test("TC_TAI_006: Apply multiple filters and verify counts update correctly", async ({
  userPage,
  userHomePage,
  userTAIPage,
}) => {
  await userHomePage.gotoTAIViaCard();
  await userTAIPage.waitForPosts();
  const originalPageCount = await userTAIPage.getTheTotalPageNumber();
  await userTAIPage.chooseRentalType();
  const countAfterRentalSelect = await userTAIPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterRentalSelect);
  await userTAIPage.chooseIndustryFilter();
  await userPage.waitForTimeout(1200);
  const afterIndustryFilterPostCount = await userTAIPage.getPostCount();
  await userTAIPage.chooseCategoryFilter();
  await userPage.waitForTimeout(1200);
  const afterCategoryFilterPostCount = await userTAIPage.getPostCount();
  expect(afterCategoryFilterPostCount).toBeLessThan(afterIndustryFilterPostCount);
  await userTAIPage.chooseSubCategoryFilter();
  await userPage.waitForTimeout(1200);
  const afterSubCategoryFilterPostCount = await userTAIPage.getPostCount();
  expect(afterSubCategoryFilterPostCount).toBeLessThan(afterCategoryFilterPostCount);
});
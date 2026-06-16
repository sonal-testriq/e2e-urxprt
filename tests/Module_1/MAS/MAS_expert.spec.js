import { test, expect } from "../../../fixtures/page.fixture.js";

test("TC_MAS_001: MSA page is accessible after login", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoMASViaCard();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchmergersacquisitions");
  await expertHomePage.gotoHomepage();
  await expertHomePage.goToMASViaHeader();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchmergersacquisitions");
});

test("TC_MAS_002: Search filters return expected results", async ({
  expertPage,
  expertHomePage,
  expertMASPage
}) => {
  await expertHomePage.gotoMASViaCard();
  const randomText = "ABC Company";
  await expertMASPage.searchFor(randomText);
  const post_names = await expertMASPage.postNames;
  await post_names.first().waitFor();
  await expertPage.waitForTimeout(500);
  const count = await post_names.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_MAS_003: Navigate to create post page from homepage and dashboard", async ({
  expertPage,
  expertHomePage,
  expertMASPage,
}) => {
  await expertHomePage.gotoMASViaCard();
  await expertMASPage.addACompany();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.navigateToAddMASViaDropdown();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.gotoDashboardPage();
  await expertMASPage.goToAllServicesTab();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_MAS_004: View filtered post details and verify recently reviewed posts", async ({
  expertPage,
  expertHomePage,
  expertMASPage,
}) => {
  await expertHomePage.gotoMASViaCard();
  await expertMASPage.waitForPosts();
  const randomText = "ABC Company";
  await expertMASPage.searchFor(randomText);
  await expertMASPage.waitForFilteredResults();
  await expertMASPage.clickOnViewMoreButton();
  await expertMASPage.verifyPostDetailsIsVisible();
  await expertMASPage.closeInformationTab();
  await expertPage.reload();
  await expertMASPage.goToRecentlyReviewedPage();
  await expertMASPage.waitForReviewedPostToAppear();
  const count = await expertMASPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await expertMASPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_MAS_005: Save a filtered post and verify saved posts page", async ({
  expertPage,
  expertHomePage,
  expertMASPage,
}) => {
  await expertHomePage.gotoMASViaCard();
  await expertMASPage.waitForPosts();
  const randomText = "ABC Company";
  await expertMASPage.searchFor(randomText);
  await expertMASPage.waitForFilteredResults();
  await expertMASPage.clickOnViewMoreButton();
  await expertMASPage.verifyPostDetailsIsVisible();
  await expertMASPage.clickOnHeartButton();
  await expertMASPage.closeInformationTab();
  await expertPage.reload();
  await expertMASPage.goToSavedPostsPage();
  await expertMASPage.waitForSavedPostToAppear();
  const count = await expertMASPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await expertMASPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  await expertMASPage.searchFor(randomText);
  await expertMASPage.waitForFilteredResults();
  await expertMASPage.clickOnViewMoreButton();
  await expertMASPage.verifyPostDetailsIsVisible();
  await expertMASPage.clickOnHeartButton();
  await expertMASPage.closeInformationTab();
  await expertPage.reload();
  await expertMASPage.goToSavedPostsPage();
  await expertMASPage.verifyThatTheTabHasNoPosts();
});

test("TC_MAS_006: Apply multiple filters and verify counts update correctly", async ({
  expertPage,
  expertHomePage,
  expertMASPage,
}) => {
  await expertHomePage.gotoMASViaCard();
  await expertMASPage.waitForPosts();
  const originalPageCount = await expertMASPage.getTheTotalPageNumber();
  await expertMASPage.chooseCountryFilter();
  const countAfterCountrySelect = await expertMASPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterCountrySelect);
  await expertMASPage.enterCityName("Mumbai");
  await expertMASPage.waitForPosts();
  const countAfterCitySelect = await expertMASPage.getTheTotalPageNumber();
  expect(countAfterCitySelect).not.toEqual(countAfterCountrySelect);
  const beforeIndustryFilterPostCount = await expertMASPage.getPostCount();
  await expertMASPage.chooseIndustryFilter();
  await expertPage.waitForTimeout(1200);
  const afterIndustryFilterPostCount = await expertMASPage.getPostCount();
  expect(afterIndustryFilterPostCount).toBeLessThan(beforeIndustryFilterPostCount);
});

import { test, expect } from "../../../fixtures/page.fixture.js";

test("TC_MAS_001: MSA page is accessible after login", async ({
  companyPage,
  companyHomePage,
}) => {
  await companyHomePage.gotoMASViaCard();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchmergersacquisitions");
  await companyHomePage.gotoHomepage();
  await companyHomePage.goToMASViaHeader();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchmergersacquisitions");
});

test("TC_MAS_002: Search filters return expected results", async ({
  companyPage,
  companyHomePage,
  companyMASPage
}) => {
  await companyHomePage.gotoMASViaCard();
  const randomText = "ABC Company";
  await companyMASPage.searchFor(randomText);
  const post_names = await companyMASPage.postNames;
  await post_names.first().waitFor();
  await companyPage.waitForTimeout(500);
  const count = await post_names.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_MAS_003: Navigate to create post page from homepage and dashboard", async ({
  companyPage,
  companyHomePage,
  companyMASPage,
}) => {
  await companyHomePage.gotoMASViaCard();
  await companyMASPage.addACompany();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.navigateToAddMASViaDropdown();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.gotoDashboardPage();
  await companyMASPage.goToAllServicesTab();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_MAS_004: View filtered post details and verify recently reviewed posts", async ({
  companyPage,
  companyHomePage,
  companyMASPage,
}) => {
  await companyHomePage.gotoMASViaCard();
  await companyMASPage.waitForPosts();
  const randomText = "ABC Company";
  await companyMASPage.searchFor(randomText);
  await companyMASPage.waitForFilteredResults();
  await companyMASPage.clickOnViewMoreButton();
  await companyMASPage.verifyPostDetailsIsVisible();
  await companyMASPage.closeInformationTab();
  await companyPage.reload();
  await companyMASPage.goToRecentlyReviewedPage();
  await companyMASPage.waitForReviewedPostToAppear();
  const count = await companyMASPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await companyMASPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_MAS_005: Save a filtered post and verify saved posts page", async ({
  companyPage,
  companyHomePage,
  companyMASPage,
}) => {
  await companyHomePage.gotoMASViaCard();
  await companyMASPage.waitForPosts();
  const randomText = "ABC Company";
  await companyMASPage.searchFor(randomText);
  await companyMASPage.waitForFilteredResults();
  await companyMASPage.clickOnViewMoreButton();
  await companyMASPage.verifyPostDetailsIsVisible();
  await companyMASPage.clickOnHeartButton();
  await companyMASPage.closeInformationTab();
  await companyPage.reload();
  await companyMASPage.goToSavedPostsPage();
  await companyMASPage.waitForSavedPostToAppear();
  const count = await companyMASPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await companyMASPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  await companyMASPage.searchFor(randomText);
  await companyMASPage.waitForFilteredResults();
  await companyMASPage.clickOnViewMoreButton();
  await companyMASPage.verifyPostDetailsIsVisible();
  await companyMASPage.clickOnHeartButton();
  await companyMASPage.closeInformationTab();
  await companyPage.reload();
  await companyMASPage.goToSavedPostsPage();
  await companyMASPage.verifyThatTheTabHasNoPosts();
});

test("TC_MAS_006: Apply multiple filters and verify counts update correctly", async ({
  companyPage,
  companyHomePage,
  companyMASPage,
}) => {
  await companyHomePage.gotoMASViaCard();
  await companyMASPage.waitForPosts();
  const originalPageCount = await companyMASPage.getTheTotalPageNumber();
  await companyMASPage.chooseCountryFilter();
  const countAfterCountrySelect = await companyMASPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterCountrySelect);
  await companyMASPage.enterCityName("Mumbai");
  await companyMASPage.waitForPosts();
  const countAfterCitySelect = await companyMASPage.getTheTotalPageNumber();
  expect(countAfterCitySelect).not.toEqual(countAfterCountrySelect);
  const beforeIndustryFilterPostCount = await companyMASPage.getPostCount();
  await companyMASPage.chooseIndustryFilter();
  await companyPage.waitForTimeout(1200);
  const afterIndustryFilterPostCount = await companyMASPage.getPostCount();
  expect(afterIndustryFilterPostCount).toBeLessThan(beforeIndustryFilterPostCount);
});

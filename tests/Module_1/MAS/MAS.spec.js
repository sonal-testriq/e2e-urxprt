import { test, expect } from "../../../fixtures/page.fixture.js";

test("TC_MAS_001: MSA page is accessible after login", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoMASViaCard();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchmergersacquisitions");
  await userHomePage.gotoHomepage();
  await userHomePage.goToMASViaHeader();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchmergersacquisitions");
});

test("TC_MAS_002: Search filters return expected results", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoMASViaCard();
  const randomText = "ABC Company";
  const search_box = userPage.getByRole("textbox", { name: "Search MAS" });
  const search_button = userPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();
  const postNames = await userPage.locator("//div[@class='packaged-img']//h3");
  await postNames.first().waitFor();
  await userPage.waitForTimeout(1200);
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_MAS_003: Navigate to create post page from homepage and dashboard", async ({
  userPage,
  userHomePage,
  userMASPage,
}) => {
  await userHomePage.gotoMASViaCard();
  await userMASPage.addACompany();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
  await userHomePage.gotoHomepage();
  await userHomePage.navigateToAddMASViaDropdown();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
  await userHomePage.gotoHomepage();
  await userHomePage.gotoDashboardPage();
  await userMASPage.goToAllServicesTab();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_MAS_004: View filtered post details and verify recently reviewed posts", async ({
  userPage,
  userHomePage,
  userMASPage,
}) => {
  await userHomePage.gotoMASViaCard();
  await userMASPage.waitForPosts();
  const randomText = "ABC Company";
  await userMASPage.searchFor(randomText);
  await userMASPage.waitForFilteredResults();
  await userMASPage.clickOnViewMoreButton();
  await userMASPage.verifyPostDetailsIsVisible();
  await userMASPage.closeInformationTab();
  await userPage.reload();
  await userMASPage.goToRecentlyReviewedPage();
  await userMASPage.waitForReviewedPostToAppear();
  const count = await userMASPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await userMASPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_MAS_005: Save a filtered post and verify saved posts page", async ({
  userPage,
  userHomePage,
  userMASPage,
}) => {
  await userHomePage.gotoMASViaCard();
  await userMASPage.waitForPosts();
  const randomText = "ABC Company";
  await userMASPage.searchFor(randomText);
  await userMASPage.waitForFilteredResults();
  await userMASPage.clickOnViewMoreButton();
  await userMASPage.verifyPostDetailsIsVisible();
  await userMASPage.clickOnHeartButton();
  await userMASPage.closeInformationTab();
  await userPage.reload();
  await userMASPage.goToSavedPostsPage();
  await userMASPage.waitForSavedPostToAppear();
  const count = await userMASPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await userMASPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  await userMASPage.searchFor(randomText);
  await userMASPage.waitForFilteredResults();
  await userMASPage.clickOnViewMoreButton();
  await userMASPage.verifyPostDetailsIsVisible();
  await userMASPage.clickOnHeartButton();
  await userMASPage.closeInformationTab();
  await userPage.reload();
  await userMASPage.goToSavedPostsPage();
  await userMASPage.verifyThatTheTabHasNoPosts();
});

test("TC_MAS_006: Apply multiple filters and verify counts update correctly", async ({
  userPage,
  userHomePage,
  userMASPage,
}) => {
  await userHomePage.gotoMASViaCard();
  await userMASPage.waitForPosts();
  const originalPageCount = await userMASPage.getTheTotalPageNumber();
  await userMASPage.chooseCountryFilter();
  const countAfterCountrySelect = await userMASPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterCountrySelect);
  await userMASPage.enterCityName("Mumbai");
  await userMASPage.waitForPosts();
  const countAfterCitySelect = await userMASPage.getTheTotalPageNumber();
  expect(countAfterCitySelect).not.toEqual(countAfterCountrySelect);
  const beforeIndustryFilterPostCount = await userMASPage.getPostCount();
  await userMASPage.chooseIndustryFilter();
  await userPage.waitForTimeout(1200);
  const afterIndustryFilterPostCount = await userMASPage.getPostCount();
  expect(afterIndustryFilterPostCount).toBeLessThan(beforeIndustryFilterPostCount);
});

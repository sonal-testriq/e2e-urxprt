import { test, expect } from "../../../fixtures/page.fixture.js";

test("TC_BSM_001: BSM page is accessible after login", async ({
  companyPage,
  companyHomePage,
}) => {
  await companyHomePage.gotoBSMViaCard();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchbuyproducts");

  await companyHomePage.gotoHomepage();
  await companyHomePage.goToBSMViaHeader();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchbuyproducts");
});

test("TC_BSM_002: Search filters return expected results", async ({
  companyPage,
  companyHomePage,
}) => {
  await companyHomePage.gotoBSMViaCard();
  const randomText = "Cricket kit";
  const search_box = companyPage.getByRole("textbox", { name: "Search BSM" });
  const search_button = companyPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();
  const postNames = await companyPage.locator("//div[@class='packaged-img']//h6");
  await postNames.first().waitFor();
  await companyPage.waitForTimeout(1200);
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_BSM_003: Navigate to create post page from homepage and dashboard", async ({
  companyPage,
  companyHomePage,
  companyBSMPage,
}) => {
  await companyHomePage.gotoBSMViaCard();
  await companyBSMPage.clickOnAddAProductButton();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.navigateToAddBSMViaDropdown();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.gotoDashboardPage();
  await companyBSMPage.goToAllServicesTab();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_BSM_004: View filtered post details and verify recently reviewed posts", async ({
  companyPage,
  companyHomePage,
  companyBSMPage,
}) => {
  await companyHomePage.gotoBSMViaCard();
  await companyBSMPage.waitForPosts();
  const randomText = "Cricket kit";
  await companyBSMPage.searchFor(randomText);
  await companyBSMPage.waitForFilteredResults();
  const newPage = await companyBSMPage.goToTheFilteredPostetails();
  await companyBSMPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await companyPage.reload();
  await companyBSMPage.goToRecentlyReviewedPage();
  await companyBSMPage.waitForReviewedPostToAppear();
  const count = await companyBSMPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await companyBSMPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_OTS_005: Save a filtered post and verify saved posts page", async ({
  companyPage,
  companyHomePage,
  companyBSMPage,
}) => {
  await companyHomePage.gotoBSMViaCard();
  await companyBSMPage.waitForPosts();
  const randomText = "Cricket kit";
  await companyBSMPage.searchFor(randomText);
  await companyBSMPage.waitForFilteredResults();
  const newPage1 = await companyBSMPage.goToTheFilteredPostetails();
  await companyBSMPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await companyPage.reload();
  await companyBSMPage.goToSavedPostsPage();
  await companyBSMPage.waitForSavedPostToAppear();
  const count = await companyBSMPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await companyBSMPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await companyBSMPage.goToTheFilteredPostetails();
  await companyBSMPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await companyPage.reload();
  await companyBSMPage.goToSavedPostsPage();
  await companyBSMPage.verifyThatTheTabHasNoPosts();
});

test("TC_BSM_006: Apply multiple filters and verify counts update correctly", async ({
  companyPage,
  companyHomePage,
  companyBSMPage,
}) => {
  await companyHomePage.gotoBSMViaCard();
  await companyBSMPage.waitForPosts();
  const originalPageCount = await companyBSMPage.getTheTotalPageNumber();
  await companyBSMPage.chooseCountryFilter();
  const countAfterCountrySelect = await companyBSMPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterCountrySelect);
  const beforeIndustryFilterPostCount = await companyBSMPage.getPostCount();
  await companyBSMPage.chooseIndustryFilter();
  await companyPage.waitForTimeout(1200);
  const afterIndustryFilterPostCount = await companyBSMPage.getPostCount();
  expect(afterIndustryFilterPostCount).toBeLessThan(beforeIndustryFilterPostCount);
  await companyBSMPage.chooseCategoryFilter();
  await companyBSMPage.chooseSubCategoryFilter();
  await companyPage.waitForTimeout(1200);
  const afterCategoryFilterPostCount = await companyBSMPage.getPostCount();
  expect(afterCategoryFilterPostCount).toBeLessThan(afterIndustryFilterPostCount);
});
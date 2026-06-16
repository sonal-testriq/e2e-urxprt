import { test, expect } from "../../../fixtures/page.fixture.js";

test("TC_BSA_001: BSA page is accessible after login", async ({
  companyPage,
  companyHomePage
}) => {
  await companyHomePage.gotoBSAViaCard();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchauction");
  await companyHomePage.gotoHomepage();
  await companyHomePage.goToBSAViaHeader();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchauction");
});

test("TC_BSA_002: Search filters return expected results", async ({
  companyPage,
  companyHomePage,
  companyBSAPage
}) => {
  await companyHomePage.gotoBSAViaCard();
  const randomText = "test";
  await companyBSAPage.searchFor(randomText);
  const post_names = await companyBSAPage.postNames;
  await post_names.first().waitFor();
  await companyPage.waitForTimeout(500);
  const count = await post_names.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_BSA_003: Navigate to create post page from homepage and dashboard", async ({
  companyPage,
  companyHomePage,
  companyBSAPage,
}) => {
  await companyHomePage.gotoBSAViaCard();
  await companyBSAPage.addAProduct();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.navigateToAddBSAViaDropdown();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.gotoDashboardPage();
  await companyBSAPage.goToAllServicesTab();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_BSA_004: View filtered post details and verify recently reviewed posts", async ({
  companyPage,
  companyHomePage,
  companyBSAPage,
}) => {
  await companyHomePage.gotoBSAViaCard();
  await companyBSAPage.waitForPosts();
  const randomText = "111";
  await companyBSAPage.searchFor(randomText);
  await companyBSAPage.waitForFilteredResults();
  const newPage = await companyBSAPage.goToTheFilteredPostetails();
  await companyBSAPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await companyPage.reload();
  await companyBSAPage.goToRecentlyReviewedPage();
  await companyBSAPage.waitForReviewedPostToAppear();
  const count = await companyBSAPage.getPostCount();
  expect(count).toBe(1);
  const isPresent = await companyBSAPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_BSA_005: Save a filtered post and verify saved posts page", async ({
  companyPage,
  companyHomePage,
  companyBSAPage
}) => {
  await companyHomePage.gotoBSAViaCard();
  await companyBSAPage.waitForPosts();
  const randomText = "111";
  await companyBSAPage.searchFor(randomText);
  await companyBSAPage.waitForFilteredResults();
  const newPage1 = await companyBSAPage.goToTheFilteredPostetails();
  await companyBSAPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await companyPage.reload();
  await companyBSAPage.goToSavedPostsPage();
  await companyBSAPage.waitForSavedPostToAppear();
  const count = await companyBSAPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await companyBSAPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await companyBSAPage.goToTheFilteredPostetails();
  await companyBSAPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await companyPage.reload();
  await companyBSAPage.goToSavedPostsPage();
  await companyBSAPage.verifyThatTheTabHasNoPosts();
});

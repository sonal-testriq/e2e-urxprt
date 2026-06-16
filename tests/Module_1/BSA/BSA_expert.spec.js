import { test, expect } from "../../../fixtures/page.fixture.js";

test("TC_BSA_001: BSA page is accessible after login", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoBSAViaCard();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchauction");
  await expertHomePage.gotoHomepage();
  await expertHomePage.goToBSAViaHeader();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchauction");
});

test("TC_BSA_002: Search filters return expected results", async ({
  expertPage,
  expertHomePage,
  expertBSAPage
}) => {
  await expertHomePage.gotoBSAViaCard();
  const randomText = "test";
  await expertBSAPage.searchFor(randomText);
  const post_names = await expertBSAPage.postNames.first();
  await post_names.first().waitFor();
  await expertPage.waitForTimeout(500);
  const count = await post_names.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_BSA_003: Navigate to create post page from homepage and dashboard", async ({
  expertPage,
  expertHomePage,
  expertBSAPage,
}) => {
  await expertHomePage.gotoBSAViaCard();
  await expertBSAPage.addAProduct();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.navigateToAddBSAViaDropdown();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.gotoDashboardPage();
  await expertBSAPage.goToAllServicesTab();
  await expect(expertPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_BSA_004: View filtered post details and verify recently reviewed posts", async ({
  expertPage,
  expertHomePage,
  expertBSAPage,
}) => {
  await expertHomePage.gotoBSAViaCard();
  await expertBSAPage.waitForPosts();
  const randomText = "111";
  await expertBSAPage.searchFor(randomText);
  await expertBSAPage.waitForFilteredResults();
  const newPage = await expertBSAPage.goToTheFilteredPostetails();
  await expertBSAPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await expertPage.reload();
  await expertBSAPage.goToRecentlyReviewedPage();
  await expertBSAPage.waitForReviewedPostToAppear();
  const count = await expertBSAPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await expertBSAPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_BSA_005: Save a filtered post and verify saved posts page", async ({
  expertPage,
  expertHomePage,
  expertBSAPage,
}) => {
  await expertHomePage.gotoBSAViaCard();
  await expertBSAPage.waitForPosts();
  const randomText = "111";
  await expertBSAPage.searchFor(randomText);
  await expertBSAPage.waitForFilteredResults();
  const newPage1 = await expertBSAPage.goToTheFilteredPostetails();
  await expertBSAPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await expertPage.reload();
  await expertBSAPage.goToSavedPostsPage();
  await expertBSAPage.waitForSavedPostToAppear();
  const count = await expertBSAPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await expertBSAPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await expertBSAPage.goToTheFilteredPostetails();
  await expertBSAPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await expertPage.reload();
  await expertBSAPage.goToSavedPostsPage();
  await expertBSAPage.verifyThatTheTabHasNoPosts();
});

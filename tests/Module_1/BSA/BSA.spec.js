import { test, expect } from "../../../fixtures/page.fixture.js";

test("TC_BSA_001: BSA page is accessible after login", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoBSAViaCard();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchauction");
  await userHomePage.gotoHomepage();
  await userHomePage.goToBSAViaHeader();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchauction");
});

test("TC_BSA_002: Search filters return expected results", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoBSAViaCard();
  const randomText = "test";
  const search_box = userPage.getByRole("textbox", { name: "Search BSA" });
  const search_button = userPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();
  const postNames = await userPage.locator("//div[@class='auction-det']//h6").first();
  await postNames.first().waitFor();
  await userPage.waitForTimeout(1200);
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_BSA_003: Navigate to create post page from homepage and dashboard", async ({
  userPage,
  userHomePage,
  userBSAPage,
}) => {
  await userHomePage.gotoBSAViaCard();
  await userBSAPage.addAProduct();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
  await userHomePage.gotoHomepage();
  await userHomePage.navigateToAddBSAViaDropdown();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
  await userHomePage.gotoHomepage();
  await userHomePage.gotoDashboardPage();
  await userBSAPage.goToAllServicesTab();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_BSA_004: View filtered post details and verify recently reviewed posts", async ({
  userPage,
  userHomePage,
  userBSAPage,
}) => {
  await userHomePage.gotoBSAViaCard();
  await userBSAPage.waitForPosts();
  const randomText = "test";
  await userBSAPage.searchFor(randomText);
  await userBSAPage.waitForFilteredResults();
  const newPage = await userBSAPage.goToTheFilteredPostetails();
  await userBSAPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await userPage.reload();
  await userBSAPage.goToRecentlyReviewedPage();
  await userBSAPage.waitForReviewedPostToAppear();
  const count = await userBSAPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await userBSAPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_BSA_005: Save a filtered post and verify saved posts page", async ({
  userPage,
  userHomePage,
  userBSAPage,
}) => {
  await userHomePage.gotoBSAViaCard();
  await userBSAPage.waitForPosts();
  const randomText = "test";
  await userBSAPage.searchFor(randomText);
  await userBSAPage.waitForFilteredResults();
  const newPage1 = await userBSAPage.goToTheFilteredPostetails();
  await userBSAPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await userPage.reload();
  await userBSAPage.goToSavedPostsPage();
  await userBSAPage.waitForSavedPostToAppear();
  const count = await userBSAPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await userBSAPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await userBSAPage.goToTheFilteredPostetails();
  await userBSAPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await userPage.reload();
  await userBSAPage.goToSavedPostsPage();
  await userBSAPage.verifyThatTheTabHasNoPosts();
});

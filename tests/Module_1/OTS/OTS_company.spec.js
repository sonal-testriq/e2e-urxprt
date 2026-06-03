import { test, expect } from "../../../fixtures/page.fixture";

test("TC_OTS_001: OTS page is accessible after login", async ({
  companyPage,
  companyHomePage,
}) => {
  await companyHomePage.gotoOSMViaCard();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchpackaged");

  await companyHomePage.gotoHomepage();
  await companyHomePage.goToOTSViaHeader();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchpackaged");
});

test("TC_OTS_002: Search filters return expected results", async ({
  companyPage,
  companyHomePage,
}) => {
  await companyHomePage.gotoOSMViaCard();
  const randomText = "Car service";
  const search_box = companyPage.getByRole("textbox", { name: "Search OTS" });
  const search_button = companyPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();
  const postNames = await companyPage.locator("//div[@class='packaged-img']//h6");
  await postNames.first().waitFor();
  await companyPage.waitForTimeout(1200);
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_OTS_003: Navigate to create post page from homepage and dashboard", async ({
  companyPage,
  companyHomePage,
  companyOTSPage,
}) => {
  await companyHomePage.gotoOSMViaCard();
  await companyOTSPage.clickOnCreateAPostButton();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.navigateToAddOTSViaDropdown();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.gotoDashboardPage();
  await companyOTSPage.goToAllServicesTab();
  await expect(companyPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_OTS_004: View filtered post details and verify recently reviewed posts", async ({
  companyPage,
  companyHomePage,
  companyOTSPage,
}) => {
  await companyHomePage.gotoOSMViaCard();
  await companyOTSPage.waitForPosts();
  const randomText = "Amazon@15";
  await companyOTSPage.searchFor(randomText);
  await companyOTSPage.waitForFilteredResults();
  const newPage = await companyOTSPage.goToTheFilteredPostetails();
  await companyOTSPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await companyPage.reload();
  await companyOTSPage.goToRecentlyReviewedPage();
  await companyOTSPage.waitForReviewedPostToAppear();
  await companyOTSPage.searchFor(randomText);
  await companyOTSPage.waitForFilteredResults();
  const count = await companyOTSPage.getPostCount();
  expect(count).toEqual(1);
  const isPresent = await companyOTSPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_OTS_005: Save a filtered post and verify saved posts page", async ({
  companyPage,
  companyHomePage,
  companyOTSPage,
}) => {
  await companyHomePage.gotoOSMViaCard();
  await companyOTSPage.waitForPosts();
  const randomText = "Amazon@15";
  await companyOTSPage.searchFor(randomText);
  await companyOTSPage.waitForFilteredResults();
  const newPage1 = await companyOTSPage.goToTheFilteredPostetails();
  await companyOTSPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await companyPage.reload();
  await companyOTSPage.goToSavedPostsPage();
  await companyOTSPage.waitForSavedPostToAppear();
  const count = await companyOTSPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await companyOTSPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await companyOTSPage.goToTheFilteredPostetails();
  await companyOTSPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await companyPage.reload();
  await companyOTSPage.goToSavedPostsPage();
  await companyOTSPage.verifyThatTheTabHasNoPosts();
});

test("TC_OTS_006: Apply multiple filters and verify counts update correctly", async ({
  companyPage,
  companyHomePage,
  companyOTSPage,
}) => {
  await companyHomePage.gotoOSMViaCard();
  await companyOTSPage.waitForPosts();
  const originalPageCount = await companyOTSPage.getTheTotalPageNumber();
  const beforeFilter = (await companyOTSPage.postNames.allTextContents())
    .map((t) => t.trim())
    .filter(Boolean);
  await companyOTSPage.chooseIndustryFilter();
  await expect(async () => {
    const after = await companyOTSPage.postNames.allTextContents();
    expect(after).not.toEqual(beforeFilter);
  }).toPass();
  const countAfterIndustrySelect = await companyOTSPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
  const postCount = await companyOTSPage.getPostCount();
  await companyOTSPage.chooseCategoryFilter();
  await companyPage.waitForTimeout(1200);
  const updatedPostCount = await companyOTSPage.getPostCount();
  expect(updatedPostCount).toBeLessThan(postCount);
});


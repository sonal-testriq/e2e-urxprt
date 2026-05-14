import { test, expect } from "../../fixtures/page.fixture.js";
import Homepage from "../../pages/HomePage";
import PBPPage from "../../pages/PBPPage";

test("PBP account page is accessible after login", async ({
  userHomePage,
  userPBPPage,
  userPage,
}) => {
  // navigate to PBP page from account page and verify URL
  await userHomePage.gotoPBPViaCard();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchall?type=1");

  // navigate to PBP page via dropdown from homepage and verify URL
  await userHomePage.gotoHomepage();
  await userHomePage.goToPBPViaHeader();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchall?type=1");
});

test("Search filters return expected results", async ({ page }) => {
  const baseUrl = "https://urxprt.com/en";
  await page.goto(`${baseUrl}/account`);
  const homepage = new Homepage(page);
  const pbpPage = new PBPPage(page);
  await homepage.navigateToPBPFromHomepage();
  await pbpPage.waitForPosts();
  const randomText = "Test 1038";
  await pbpPage.searchFor(randomText);
  await pbpPage.waitForFilteredResults();
  const updatedCount = await pbpPage.getPostCount();
  expect(updatedCount).toBeLessThanOrEqual(1);
});

test("Navigate to create post page from homepage and dashboard", async ({
  page,
}) => {
  const baseUrl = "https://urxprt.com/en";
  await page.goto(`${baseUrl}/account`);
  const homepage = new Homepage(page);
  const pbpPage = new PBPPage(page);
  await homepage.navigateToPBPFromHomepage();
  await pbpPage.clickOnCreateAPostButton();
  await expect(page).toHaveURL(/.*\/createpost/);
  await homepage.gotohomepage();
  await homepage.navigateToCreateAPBPPostViaDropdown();
  await expect(page).toHaveURL(/.*\/createpost/);
  await homepage.gotohomepage();
  await homepage.goToDashboardPage();
  await pbpPage.clickOnCreateAPostButton();
  await expect(page).toHaveURL(/.*\/createpost/);
});

test("View filtered post details and verify recently reviewed posts", async ({
  page,
}) => {
  const baseUrl = "https://urxprt.com/en";
  await page.goto(`${baseUrl}/account`);
  const homepage = new Homepage(page);
  const pbpPage = new PBPPage(page);
  await homepage.navigateToPBPFromHomepage();
  await pbpPage.waitForPosts();
  const randomText = "Test 1038";
  await pbpPage.searchFor(randomText);
  await pbpPage.waitForFilteredResults();
  const newPage = await pbpPage.goToTheFilteredPostetails();
  await pbpPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await page.reload();
  await pbpPage.goToRecentlyReviewedPage();
  await pbpPage.waitForReviewedPostToAppear();
  const count = await pbpPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await pbpPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("Save a filtered post and verify saved posts page", async ({ page }) => {
  const baseUrl = "https://urxprt.com/en";
  await page.goto(`${baseUrl}/account`);
  const homepage = new Homepage(page);
  const pbpPage = new PBPPage(page);
  await homepage.navigateToPBPFromHomepage();
  await pbpPage.waitForPosts();
  const randomText = "Test 1038";
  await pbpPage.searchFor(randomText);
  await pbpPage.waitForFilteredResults();
  await pbpPage.clickOnFirstPostsHeartButton();
  await pbpPage.goToSavedPostsPage();
  await pbpPage.waitForSavedPostToAppear();
  const count = await pbpPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await pbpPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  await pbpPage.clickOnFirstPostsHeartButton();
  await pbpPage.verifyThatTheTabHasNoPosts();
});

test("Apply multiple filters and verify counts update correctly", async ({
  page,
}) => {
  const baseUrl = "https://urxprt.com/en";
  await page.goto(`${baseUrl}/account`);
  const homepage = new Homepage(page);
  const pbpPage = new PBPPage(page);
  await homepage.navigateToPBPFromHomepage();
  await pbpPage.waitForPosts();
  const originalPageCount = await pbpPage.getTheTotalPageNumber();
  const beforeFilter = (await pbpPage.postNames.allTextContents())
    .map((t) => t.trim())
    .filter(Boolean);
  await pbpPage.chooseOldPostFilter();
  await expect(async () => {
    const after = await pbpPage.postNames.allTextContents();
    expect(after).not.toEqual(beforeFilter);
  }).toPass();
  await pbpPage.chooseEnergyFromIndustryFilter();
  const countAfterIndustrySelect = await pbpPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
  await pbpPage.chooseOilFromCategoryFilter();
  const countAfterCategorySelect = await pbpPage.getUpdatedPageNumber();
  expect(countAfterCategorySelect).not.toEqual(countAfterIndustrySelect);
  await pbpPage.chooseDrillingFromSubCategory();
  const countAfterSubCategorySelection = await pbpPage.getUpdatedPageNumber();
  expect(countAfterSubCategorySelection).not.toEqual(countAfterCategorySelect);
  await pbpPage.removeFilter();
  const countAfterClearingFilter = await pbpPage.getUpdatedPageNumber();
  expect(countAfterClearingFilter).toEqual(originalPageCount);
});

test("Verify Join as Expert/Company popup opens from a post detail", async ({
  page,
}) => {
  const baseUrl = "https://urxprt.com/en";
  await page.goto(`${baseUrl}/account`);
  const homepage = new Homepage(page);
  const pbpPage = new PBPPage(page);
  await homepage.navigateToPBPFromHomepage();
  await pbpPage.waitForPosts();
  const randomText = "Test 1038";
  await pbpPage.searchFor(randomText);
  await pbpPage.waitForFilteredResults();
  const newPage = await pbpPage.goToTheFilteredPostetails();
  await pbpPage.verifyPostDetailsIsVisible(newPage);
  await pbpPage.clickOnApplyButton(newPage);
  await pbpPage.verifyJoinAsExpertOrCompanyPopUpAppearsForUserAccount(newPage);
  await pbpPage.verifyJoinAsExpertAndJoinAsCompanyButtonIsClickable(newPage);
  await pbpPage.closePopUp(newPage);
  await newPage.close();
  await page.reload();
});

test("Validate create post form errors and umbrella checkbox behavior", async ({
  page,
}) => {
  const baseUrl = "https://urxprt.com/en";
  await page.goto(`${baseUrl}/account`);
  const homepage = new Homepage(page);
  const pbpPage = new PBPPage(page);
  await homepage.navigateToPBPFromHomepage();
  await pbpPage.clickOnCreateAPostButton();
  await expect(page).toHaveURL(/.*\/createpost/);
  await pbpPage.clickOnNextButton();
  await pbpPage.verifyElementsVisible([
    pbpPage.required_error.first(),
    pbpPage.required_industry_error,
    pbpPage.required_category_error,
    pbpPage.required_error.nth(1),
  ]);
  await pbpPage.clickOnUmbrellaCheckbox();
  await pbpPage.verifyUmbrellaSelectAndCreateNewOptionIsVisible();
  await pbpPage.clickOnUmbrellaCheckbox();
  await pbpPage.verifyUmbrellaSelectAndCreateNewOptionIsHidden();
});

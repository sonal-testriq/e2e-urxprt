import { test, expect } from "../../fixtures/page.fixture.js";

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

test("Search filters return expected results", async ({
  userPage,
  userHomePage,
  userPBPPage,
}) => {
  await userHomePage.gotoPBPViaCard();
  const randomText = "IOS app";
  const search_box = userPage.getByRole("textbox", { name: "Search PBP" });
  const search_button = userPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();

  await userPage.waitForLoadState("networkidle"); // wait for search results to load

  const postNames = await userPage.locator("//div[@class='filter-detail']//h5");
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("Navigate to create post page from homepage and dashboard", async ({
  userPage,
  userHomePage,
  userPBPPage,
}) => {
  await userHomePage.gotoPBPViaCard();
  await userPBPPage.clickOnCreateAPostButton();
  await expect(userPage).toHaveURL(/.*\/createpost/);
  await userHomePage.gotoHomepage();
  await userHomePage.navigateToCreateAPBPPostViaDropdown();
  await expect(userPage).toHaveURL(/.*\/createpost/);
  await userHomePage.gotoHomepage();
  await userHomePage.gotoDashboardPage();
  await userPBPPage.clickOnCreateAPostButton();
  await expect(userPage).toHaveURL(/.*\/createpost/);
});

test("View filtered post details and verify recently reviewed posts", async ({
  userPage,
  userHomePage,
  userPBPPage,
}) => {
  await userHomePage.gotoPBPViaCard();
  await userPBPPage.waitForPosts();
  const randomText = "Test 1038";
  await userPBPPage.searchFor(randomText);
  await userPBPPage.waitForFilteredResults();
  const newPage = await userPBPPage.goToTheFilteredPostetails();
  await userPBPPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await userPage.reload();
  await userPBPPage.goToRecentlyReviewedPage();
  await userPBPPage.waitForReviewedPostToAppear();
  const count = await userPBPPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await userPBPPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("Save a filtered post and verify saved posts page", async ({
  userPage,
  userHomePage,
  userPBPPage,
}) => {
  await userHomePage.gotoPBPViaCard();
  await userPBPPage.waitForPosts();
  const randomText = "Test 1038";
  await userPBPPage.searchFor(randomText);
  await userPBPPage.waitForFilteredResults();
  await userPBPPage.clickOnFirstPostsHeartButton();
  await userPBPPage.goToSavedPostsPage();
  await userPBPPage.waitForSavedPostToAppear();
  const count = await userPBPPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await userPBPPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  await userPBPPage.clickOnFirstPostsHeartButton();
  await userPBPPage.verifyThatTheTabHasNoPosts();
});

test("Apply multiple filters and verify counts update correctly", async ({
  userPage,
  userHomePage,
  userPBPPage,
}) => {
  await userHomePage.gotoPBPViaCard();
  await userPBPPage.waitForPosts();
  const originalPageCount = await userPBPPage.getTheTotalPageNumber();
  const beforeFilter = (await userPBPPage.postNames.allTextContents())
    .map((t) => t.trim())
    .filter(Boolean);
  await userPBPPage.chooseOldPostFilter();
  await expect(async () => {
    const after = await userPBPPage.postNames.allTextContents();
    expect(after).not.toEqual(beforeFilter);
  }).toPass();
  await userPBPPage.chooseEnergyFromIndustryFilter();
  const countAfterIndustrySelect = await userPBPPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
  await userPBPPage.chooseOilFromCategoryFilter();
  const countAfterCategorySelect = await userPBPPage.getUpdatedPageNumber();
  expect(countAfterCategorySelect).not.toEqual(countAfterIndustrySelect);
  await userPBPPage.chooseDrillingFromSubCategory();
  const countAfterSubCategorySelection =
    await userPBPPage.getUpdatedPageNumber();
  expect(countAfterSubCategorySelection).not.toEqual(countAfterCategorySelect);
  await userPBPPage.removeFilter();
  const countAfterClearingFilter = await userPBPPage.getUpdatedPageNumber();
  expect(countAfterClearingFilter).toEqual(originalPageCount);
});

test("Verify Join as Expert/Company popup opens from a post detail", async ({
  userPage,
  userHomePage,
  userPBPPage,
}) => {
  await userHomePage.gotoPBPViaCard();
  await userPBPPage.waitForPosts();
  const randomText = "Test 1038";
  await userPBPPage.searchFor(randomText);
  await userPBPPage.waitForFilteredResults();
  const newPage = await userPBPPage.goToTheFilteredPostetails();
  await userPBPPage.verifyPostDetailsIsVisible(newPage);
  await userPBPPage.clickOnApplyButton(newPage);
  await userPBPPage.verifyJoinAsExpertOrCompanyPopUpAppearsForUserAccount(
    newPage,
  );
  await userPBPPage.verifyJoinAsExpertAndJoinAsCompanyButtonIsClickable(
    newPage,
  );
  await userPBPPage.closePopUp(newPage);
  await newPage.close();
  await userPage.reload();
});

test("Validate create post form errors and umbrella checkbox behavior", async ({
  userPage,
  userHomePage,
  userPBPPage,
}) => {
  await userHomePage.gotoPBPViaCard();
  await userPBPPage.clickOnCreateAPostButton();
  await expect(userPage).toHaveURL(/.*\/createpost/);
  await userPBPPage.clickOnNextButton();
  await userPBPPage.verifyElementsVisible([
    userPBPPage.required_error.first(),
    userPBPPage.required_industry_error,
    userPBPPage.required_category_error,
    userPBPPage.required_error.nth(1),
  ]);
  await userPBPPage.clickOnUmbrellaCheckbox();
  await userPBPPage.verifyUmbrellaSelectAndCreateNewOptionIsVisible();
  await userPBPPage.clickOnUmbrellaCheckbox();
  await userPBPPage.verifyUmbrellaSelectAndCreateNewOptionIsHidden();
});

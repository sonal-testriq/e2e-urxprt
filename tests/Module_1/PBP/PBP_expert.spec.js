import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, PBPPostName } from "../../../testData/constants.js";

test("TC_PBP_001: PBP account page is accessible after login", async ({
  expertHomePage,
  expertPage,
}) => {
  // navigate to PBP page from account page and verify URL
  await expertHomePage.gotoPBPViaCard();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchall?type=1");

  // navigate to PBP page via dropdown from homepage and verify URL
  await expertHomePage.gotoHomepage();
  await expertHomePage.goToPBPViaHeader();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchall?type=1");
});

test("TC_PBP_002: Search filters return expected results", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoPBPViaCard();
  const randomText = "IOS app";
  const search_box = expertPage.getByRole("textbox", { name: "Search PBP" });
  const search_button = expertPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();

  await expertPage.waitForLoadState("networkidle"); // wait for search results to load

  const postNames = await expertPage.locator("//div[@class='filter-detail']//h5");
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_PBP_003: Navigate to create post page from homepage and dashboard", async ({
  expertPage,
  expertHomePage,
  expertPBPPage,
}) => {
  await expertHomePage.gotoPBPViaCard();
  await expertPBPPage.clickOnCreateAPostButton();
  await expect(expertPage).toHaveURL(/.*\/createpost/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.navigateToCreateAPBPPostViaDropdown();
  await expect(expertPage).toHaveURL(/.*\/createpost/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.gotoDashboardPage();
  await expertPBPPage.clickOnCreateAPostButton();
  await expect(expertPage).toHaveURL(/.*\/createpost/);
});

test("TC_PBP_004: View filtered post details and verify recently reviewed posts", async ({
  expertPage,
  expertHomePage,
  expertPBPPage,
}) => {
  await expertHomePage.gotoPBPViaCard();
  await expertPBPPage.waitForPosts();
  const randomText = "Test 1038";
  await expertPBPPage.searchFor(randomText);
  await expertPBPPage.waitForFilteredResults();
  const newPage = await expertPBPPage.goToTheFilteredPostetails();
  await expertPBPPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await expertPage.reload();
  await expertPBPPage.goToRecentlyReviewedPage();
  await expertPBPPage.waitForReviewedPostToAppear();
  const count = await expertPBPPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await expertPBPPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_PBP_005: Save a filtered post and verify saved posts page", async ({
  expertHomePage,
  expertPBPPage,
}) => {
  await expertHomePage.gotoPBPViaCard();
  await expertPBPPage.waitForPosts();
  const randomText = "Test 1038";
  await expertPBPPage.searchFor(randomText);
  await expertPBPPage.waitForFilteredResults();
  await expertPBPPage.clickOnFirstPostsHeartButton();
  await expertPBPPage.goToSavedPostsPage();
  await expertPBPPage.waitForSavedPostToAppear();
  const count = await expertPBPPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await expertPBPPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  await expertPBPPage.clickOnFirstPostsHeartButton();
  await expertPBPPage.verifyThatTheTabHasNoPosts();
});

test("TC_PBP_006: Apply multiple filters and verify counts update correctly", async ({
  expertHomePage,
  expertPBPPage,
}) => {
  await expertHomePage.gotoPBPViaCard();
  await expertPBPPage.waitForPosts();
  const originalPageCount = await expertPBPPage.getTheTotalPageNumber();
  const beforeFilter = (await expertPBPPage.postNames.allTextContents())
    .map((t) => t.trim())
    .filter(Boolean);
  await expertPBPPage.chooseOldPostFilter();
  await expect(async () => {
    const after = await expertPBPPage.postNames.allTextContents();
    expect(after).not.toEqual(beforeFilter);
  }).toPass();
  await expertPBPPage.chooseEnergyFromIndustryFilter();
  const countAfterIndustrySelect = await expertPBPPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
  await expertPBPPage.chooseOilFromCategoryFilter();
  const countAfterCategorySelect = await expertPBPPage.getUpdatedPageNumber();
  expect(countAfterCategorySelect).not.toEqual(countAfterIndustrySelect);
  await expertPBPPage.chooseDrillingFromSubCategory();
  const countAfterSubCategorySelection =
    await expertPBPPage.getUpdatedPageNumber();
  expect(countAfterSubCategorySelection).not.toEqual(countAfterCategorySelect);
  await expertPBPPage.removeFilter();
  const countAfterClearingFilter = await expertPBPPage.getUpdatedPageNumber();
  expect(countAfterClearingFilter).toEqual(originalPageCount);
});

test("TC_PBP_007: Verify Join as Expert/Company popup opens from a post detail", async ({
  expertPage,
  expertHomePage,
  expertPBPPage,
}) => {
  await expertHomePage.gotoPBPViaCard();
  await expertPBPPage.waitForPosts();
  const randomText = "Test 1038";
  await expertPBPPage.searchFor(randomText);
  await expertPBPPage.waitForFilteredResults();
  const newPage = await expertPBPPage.goToTheFilteredPostetails();
  await expertPBPPage.verifyPostDetailsIsVisible(newPage);
  await expertPBPPage.clickOnApplyButton(newPage);
  await expertPBPPage.verifyJoinAsExpertOrCompanyPopUpAppearsForUserAccount(
    newPage,
  );
  await expertPBPPage.verifyJoinAsExpertAndJoinAsCompanyButtonIsClickable(
    newPage,
  );
  await expertPBPPage.closePopUp(newPage);
  await newPage.close();
  await expertPage.reload();
});

test("TC_PBP_008: Validate create post form errors and umbrella checkbox behavior", async ({
  expertPage,
  expertHomePage,
  expertPBPPage,
}) => {
  await expertHomePage.gotoPBPViaCard();
  await expertPBPPage.clickOnCreateAPostButton();
  await expect(expertPage).toHaveURL(/.*\/createpost/);
  await expertPBPPage.clickOnNextButton();
  await expertPBPPage.verifyElementsVisible([
    expertPBPPage.required_error.first(),
    expertPBPPage.required_industry_error,
    expertPBPPage.required_category_error,
    expertPBPPage.required_error.nth(1),
  ]);
  await expertPBPPage.clickOnUmbrellaCheckbox();
  await expertPBPPage.verifyUmbrellaSelectAndCreateNewOptionIsVisible();
  await expertPBPPage.clickOnUmbrellaCheckbox();
  await expertPBPPage.verifyUmbrellaSelectAndCreateNewOptionIsHidden();
});

test.describe("TC_PBP_Post: Post Operations", () => {
  test.describe.configure({ mode: 'serial' });
  test("TC_PBP_001: Verify create post from PBP page", async ({
  expertPage,
  expertHomePage,
  expertPBPPage,
  }) => {
    await expertHomePage.gotoPBPViaCard();
    await expertPBPPage.clickOnCreateAPostButton();
    await expect(expertPage).toHaveURL(/.*\/createpost/);
    await expertPBPPage.fillInput("Write a title for your post ", PBPPostName);
    await expertPBPPage.selectDropdown("Select Industries *", "Business");
    await expertPBPPage.selectDropdown(
      "Select Category *",
      "Managing and Consultant",
    );
    await expertPBPPage.selectDropdown(
      "Select Sub Category",
      "Project Management",
    );
    await expertPBPPage.fillRichTextEditor(
      "Project Description *",
      "This is a test description for automation",
    );
    await expertPage.waitForTimeout(2000); // wait for validation to trigger
    const nextButton = expertPage.getByRole("button", { name: "Next" });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
    await expertPBPPage.selectMultiDropdown("Select competencies", [
      "Branding",
      "Campaigns",
    ]);
    await nextButton.click();
    await expect(expertPBPPage.required_competencies_error).toBeVisible();
    const skill = expertPage.locator("p.select-deactive-skill", { hasText: "CRM +", exact: true,});
    await skill.click();
    await nextButton.click();
    await nextButton.click();
    await expect(expertPBPPage.maximum_project_budget_error).toBeVisible();
    await expect(expertPBPPage.duration_required_error).toBeVisible();
    await expertPBPPage.fillInputWithPlaceholder("Enter Budget in $", "10");
    await expertPBPPage.fillInputWithPlaceholder("Enter number of days", "10");
    await nextButton.click();
    await expertPBPPage.expected_deliverables_input.fill("This is test deliverable");
    await expertPBPPage.selectDropdown(
      "Preferred Language of Work Submission *",
      "English",
    );
    await expertPage.waitForTimeout(1000);
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
    await expect(
      expertPage.getByText("Post & Browse Projects (PBP) Summary"),
    ).toBeVisible();  
    const postJobButton = expertPage.getByRole("button", { name: "Post Project" });
    postJobButton.click();
    await expect(
      expertPage.getByText("Congratulations! Your post is now live."),
    ).toBeVisible();
  });

  test("TC_PBP_002: Search filters return newly created post in results", async ({
      expertPage,
      expertHomePage,
    }) => {
      await expertHomePage.gotoPBPViaCard();
      // await expertHomePage.searchOnPBPPage('Frontend Developer');
      const search_box = expertPage.getByRole("textbox", { name: "Search PBP" });
      const search_button = expertPage.getByRole("button", { name: "Search" });
      //   await expertPage.waitForTimeout(2000);
      await search_box.fill(PBPPostName);
      await search_button.click();
      await expertPage.waitForLoadState("networkidle"); // wait for search results to load
      const postNames = await expertPage.locator(
        "//div[@class='filter-detail']//h5",
      );
      await postNames.first().waitFor();
      const count = await postNames.count();
      expect(count).toBe(1);
  });

  test("TC_PBP_003: Verify newly created post are displayed in My Orders under Posted Posts", async ({
  expertHomePage,
  }) => {
    await expertHomePage.gotoPBPViaCard();
    await expertHomePage.navigateToMyOrdersViaPreview();
    await expertHomePage.openPBPPostFromMyOrders();
    await expect(expertHomePage.postNamesOnMyOrders.first()).toHaveText(PBPPostName);
  })

  test("TC_PBP_004: Verify newly created post are editable", async ({
  expertPage,
  expertHomePage,
  expertPBPPage,
  }) => {
    await expertHomePage.gotoPBPViaCard();
    await expertHomePage.navigateToMyOrdersViaPreview();
    await expertHomePage.openPBPPostFromMyOrders();
    await expect(expertHomePage.postNamesOnMyOrders.first()).toBeVisible();
    await expertPBPPage.goToEditProjectDetailsPage();
    await expertHomePage.clickOnEditButton("Project Title");
    await expertPBPPage.fillInput("Enter Title", PBPPostName+" Edited");
    await expertPBPPage.clickOnSaveNButton();
    const postProjectButton = expertPage.getByRole("button", { name: "Post Project" });
    postProjectButton.click();
    await expect(
      expertPage.getByText("PBP updated sucessfully"),
    ).toBeVisible();
    await expertHomePage.navigateToMyOrdersViaPreview();
    await expertHomePage.openPBPPostFromMyOrders();
    await expect(expertHomePage.postNamesOnMyOrders.first()).toHaveText(PBPPostName+" Edited");
  })

  test("TC_PBP_005: Verify newly created post can be cancelled", async ({
  expertPage,
  expertHomePage,
  expertPBPPage,
  }) => {
    await expertHomePage.gotoPBPViaCard();
    await expertHomePage.navigateToMyOrdersViaPreview();
    await expertHomePage.openPBPPostFromMyOrders();
    await expect(expertHomePage.postNamesOnMyOrders.first()).toBeVisible();
    await expertPBPPage.view_details_button.first().click();
    await expertPBPPage.cancelCreatedPBPPost();
    await expect(
      expertPage.getByText("Your post has been successfully cancelled"),
    ).toBeVisible();
  })

  test("TC_PBP_006: Search filters return newly created post in results", async ({
      expertPage,
      expertHomePage,
    }) => {
      await expertHomePage.gotoPBPViaCard();
      const search_box = expertPage.getByRole("textbox", { name: "Search PBP" });
      const search_button = expertPage.getByRole("button", { name: "Search" });
      await search_box.fill(PBPPostName);
      await search_button.click();
      await expertPage.waitForLoadState("networkidle"); 
      const postNames = await expertPage.locator(
        "//div[@class='filter-detail']//h5",
      );
      await expect(postNames.first()).not.toBeVisible();
      const count = await postNames.count();
      expect(count).toBe(0);
  });
});


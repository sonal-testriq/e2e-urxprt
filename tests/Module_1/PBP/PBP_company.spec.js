import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, PBPPostName } from "../../../testData/constants.js";

test("TC_PBP_001: PBP account page is accessible after login", async ({
  companyHomePage,
  companyPage,
}) => {
  // navigate to PBP page from account page and verify URL
  await companyHomePage.gotoPBPViaCard();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchall?type=1");

  // navigate to PBP page via dropdown from homepage and verify URL
  await companyHomePage.gotoHomepage();
  await companyHomePage.goToPBPViaHeader();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchall?type=1");
});

test("TC_PBP_002: Search filters return expected results", async ({
  companyPage,
  companyHomePage,
}) => {
  await companyHomePage.gotoPBPViaCard();
  const randomText = "IOS app";
  const search_box = companyPage.getByRole("textbox", { name: "Search PBP" });
  const search_button = companyPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();

  await companyPage.waitForLoadState("networkidle"); // wait for search results to load

  const postNames = await companyPage.locator("//div[@class='filter-detail']//h5");
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_PBP_003: Navigate to create post page from homepage and dashboard", async ({
  companyPage,
  companyHomePage,
  companyPBPPage,
}) => {
  await companyHomePage.gotoPBPViaCard();
  await companyPBPPage.clickOnCreateAPostButton();
  await expect(companyPage).toHaveURL(/.*\/createpost/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.navigateToCreateAPBPPostViaDropdown();
  await expect(companyPage).toHaveURL(/.*\/createpost/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.gotoDashboardPage();
  await companyPBPPage.clickOnCreateAPostButton();
  await expect(companyPage).toHaveURL(/.*\/createpost/);
});

test("TC_PBP_004: View filtered post details and verify recently reviewed posts", async ({
  companyPage,
  companyHomePage,
  companyPBPPage,
}) => {
  await companyHomePage.gotoPBPViaCard();
  await companyPBPPage.waitForPosts();
  const randomText = "Test 1038";
  await companyPBPPage.searchFor(randomText);
  await companyPBPPage.waitForFilteredResults();
  const newPage = await companyPBPPage.goToTheFilteredPostetails();
  await companyPBPPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await companyPage.reload();
  await companyPBPPage.goToRecentlyReviewedPage();
  await companyPBPPage.waitForReviewedPostToAppear();
  const count = await companyPBPPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await companyPBPPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_PBP_005: Save a filtered post and verify saved posts page", async ({
  companyHomePage,
  companyPBPPage,
}) => {
  await companyHomePage.gotoPBPViaCard();
  await companyPBPPage.waitForPosts();
  const randomText = "Test 1038";
  await companyPBPPage.searchFor(randomText);
  await companyPBPPage.waitForFilteredResults();
  await companyPBPPage.clickOnFirstPostsHeartButton();
  await companyPBPPage.goToSavedPostsPage();
  await companyPBPPage.waitForSavedPostToAppear();
  const count = await companyPBPPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await companyPBPPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  await companyPBPPage.clickOnFirstPostsHeartButton();
  await companyPBPPage.verifyThatTheTabHasNoPosts();
});

test("TC_PBP_006: Apply multiple filters and verify counts update correctly", async ({
  companyHomePage,
  companyPBPPage,
}) => {
  await companyHomePage.gotoPBPViaCard();
  await companyPBPPage.waitForPosts();
  const originalPageCount = await companyPBPPage.getTheTotalPageNumber();
  const beforeFilter = (await companyPBPPage.postNames.allTextContents())
    .map((t) => t.trim())
    .filter(Boolean);
  await companyPBPPage.chooseOldPostFilter();
  await expect(async () => {
    const after = await companyPBPPage.postNames.allTextContents();
    expect(after).not.toEqual(beforeFilter);
  }).toPass();
  await companyPBPPage.chooseEnergyFromIndustryFilter();
  const countAfterIndustrySelect = await companyPBPPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
  await companyPBPPage.chooseOilFromCategoryFilter();
  const countAfterCategorySelect = await companyPBPPage.getUpdatedPageNumber();
  expect(countAfterCategorySelect).not.toEqual(countAfterIndustrySelect);
  await companyPBPPage.chooseDrillingFromSubCategory();
  const countAfterSubCategorySelection =
    await companyPBPPage.getUpdatedPageNumber();
  expect(countAfterSubCategorySelection).not.toEqual(countAfterCategorySelect);
  await companyPBPPage.removeFilter();
  const countAfterClearingFilter = await companyPBPPage.getUpdatedPageNumber();
  expect(countAfterClearingFilter).toEqual(originalPageCount);
});

test("TC_PBP_007: Verify Join as Expert/Company popup opens from a post detail", async ({
  companyPage,
  companyHomePage,
  companyPBPPage,
}) => {
  await companyHomePage.gotoPBPViaCard();
  await companyPBPPage.waitForPosts();
  const randomText = "Test 1038";
  await companyPBPPage.searchFor(randomText);
  await companyPBPPage.waitForFilteredResults();
  const newPage = await companyPBPPage.goToTheFilteredPostetails();
  await companyPBPPage.verifyPostDetailsIsVisible(newPage);
  await companyPBPPage.clickOnApplyButton(newPage);
  await companyPBPPage.verifyJoinAsExpertOrCompanyPopUpAppearsForUserAccount(
    newPage,
  );
  await companyPBPPage.verifyJoinAsExpertAndJoinAsCompanyButtonIsClickable(
    newPage,
  );
  await companyPBPPage.closePopUp(newPage);
  await newPage.close();
  await companyPage.reload();
});

test("TC_PBP_008: Validate create post form errors and umbrella checkbox behavior", async ({
  companyPage,
  companyHomePage,
  companyPBPPage,
}) => {
  await companyHomePage.gotoPBPViaCard();
  await companyPBPPage.clickOnCreateAPostButton();
  await expect(companyPage).toHaveURL(/.*\/createpost/);
  await companyPBPPage.clickOnNextButton();
  await companyPBPPage.verifyElementsVisible([
    companyPBPPage.required_error.first(),
    companyPBPPage.required_industry_error,
    companyPBPPage.required_category_error,
  ]);
  await companyPBPPage.clickOnUmbrellaCheckbox();
  await companyPBPPage.verifyUmbrellaSelectAndCreateNewOptionIsVisible();
  await companyPBPPage.clickOnUmbrellaCheckbox();
  await companyPBPPage.verifyUmbrellaSelectAndCreateNewOptionIsHidden();
});

test.describe("TC_PBP_Post: Post Operations", () => {
  test.describe.configure({ mode: 'serial' });
  test("TC_PBP_001: Verify create post from PBP page", async ({
  companyPage,
  companyHomePage,
  companyPBPPage,
  }) => {
    await companyHomePage.gotoPBPViaCard();
    await companyPBPPage.clickOnCreateAPostButton();
    await expect(companyPage).toHaveURL(/.*\/createpost/);
    await companyPBPPage.fillInput("Write a title for your post ", PBPPostName);
    await companyPBPPage.selectDropdown("Select Industries *", "Business");
    await companyPBPPage.selectDropdown(
      "Select Category *",
      "Managing and Consultant",
    );
    await companyPBPPage.selectDropdown(
      "Select Sub Category",
      "Project Management",
    );
    await companyPBPPage.fillRichTextEditor(
      "Project Description *",
      "This is a test description for automation",
    );
    await companyPage.waitForTimeout(2000); // wait for validation to trigger
    const nextButton = companyPage.getByRole("button", { name: "Next" });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
    await companyPBPPage.selectMultiDropdown("Select competencies", [
      "Branding",
      "Campaigns",
    ]);
    await nextButton.click();
    await expect(companyPBPPage.required_competencies_error).toBeVisible();
    const skill = companyPage.locator("p.select-deactive-skill", { hasText: "CRM +", exact: true,});
    await skill.click();
    await nextButton.click();
    await nextButton.click();
    await expect(companyPBPPage.maximum_project_budget_error).toBeVisible();
    await expect(companyPBPPage.duration_required_error).toBeVisible();
    await companyPBPPage.fillInputWithPlaceholder("Enter Budget in $", "10");
    await companyPBPPage.fillInputWithPlaceholder("Enter number of days", "10");
    await nextButton.click();
    await companyPBPPage.expected_deliverables_input.fill("This is test deliverable");
    await companyPBPPage.selectDropdown(
      "Preferred Language of Work Submission *",
      "English",
    );
    await companyPage.waitForTimeout(1000);
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
    await expect(
      companyPage.getByText("Post & Browse Projects (PBP) Summary"),
    ).toBeVisible();  
    const postJobButton = companyPage.getByRole("button", { name: "Post Project" });
    postJobButton.click();
    await expect(
      companyPage.getByText("Congratulations! Your post is now live."),
    ).toBeVisible();
  });

  test("TC_PBP_002: Search filters return newly created post in results", async ({
      companyPage,
      companyHomePage,
    }) => {
      await companyHomePage.gotoPBPViaCard();
      // await companyHomePage.searchOnPBPPage('Frontend Developer');
      const search_box = companyPage.getByRole("textbox", { name: "Search PBP" });
      const search_button = companyPage.getByRole("button", { name: "Search" });
      //   await companyPage.waitForTimeout(2000);
      await search_box.fill(PBPPostName);
      await search_button.click();
      await companyPage.waitForLoadState("networkidle"); // wait for search results to load
      const postNames = await companyPage.locator(
        "//div[@class='filter-detail']//h5",
      );
      await postNames.first().waitFor();
      const count = await postNames.count();
      expect(count).toBe(1);
  });

  test("TC_PBP_003: Verify newly created post are displayed in My Orders under Posted Posts", async ({
  companyHomePage,
  }) => {
    await companyHomePage.gotoPBPViaCard();
    await companyHomePage.navigateToMyOrdersViaPreview();
    await companyHomePage.openPBPPostFromMyOrders();
    await expect(companyHomePage.postNamesOnMyOrders.first()).toHaveText(PBPPostName);
  })

  test("TC_PBP_004: Verify newly created post are editable", async ({
  companyPage,
  companyHomePage,
  companyPBPPage,
  }) => {
    await companyHomePage.gotoPBPViaCard();
    await companyHomePage.navigateToMyOrdersViaPreview();
    await companyHomePage.openPBPPostFromMyOrders();
    await expect(companyHomePage.postNamesOnMyOrders.first()).toBeVisible();
    await companyPBPPage.goToEditProjectDetailsPage();
    await companyHomePage.clickOnEditButton("Project Title");
    await companyPBPPage.fillInput("Enter Title", PBPPostName+" Edited");
    await companyPBPPage.clickOnSaveNButton();
    const postProjectButton = companyPage.getByRole("button", { name: "Post Project" });
    postProjectButton.click();
    await expect(
      companyPage.getByText("PBP updated sucessfully"),
    ).toBeVisible();
    await companyHomePage.navigateToMyOrdersViaPreview();
    await companyHomePage.openPBPPostFromMyOrders();
    await expect(companyHomePage.postNamesOnMyOrders.first()).toHaveText(PBPPostName+" Edited");
  })

  test("TC_PBP_005: Verify newly created post can be cancelled", async ({
  companyPage,
  companyHomePage,
  companyPBPPage,
  }) => {
    await companyHomePage.gotoPBPViaCard();
    await companyHomePage.navigateToMyOrdersViaPreview();
    await companyHomePage.openPBPPostFromMyOrders();
    await expect(companyHomePage.postNamesOnMyOrders.first()).toBeVisible();
    await companyPBPPage.view_details_button.first().click();
    await companyPBPPage.cancelCreatedPBPPost();
    await expect(
      companyPage.getByText("Your post has been successfully cancelled"),
    ).toBeVisible();
  })

  test("TC_PBP_006: Search filters return newly created post in results", async ({
      companyPage,
      companyHomePage,
    }) => {
      await companyHomePage.gotoPBPViaCard();
      const search_box = companyPage.getByRole("textbox", { name: "Search PBP" });
      const search_button = companyPage.getByRole("button", { name: "Search" });
      await search_box.fill(PBPPostName);
      await search_button.click();
      await companyPage.waitForLoadState("networkidle"); 
      const postNames = await companyPage.locator(
        "//div[@class='filter-detail']//h5",
      );
      await expect(postNames.first()).not.toBeVisible();
      const count = await postNames.count();
      expect(count).toBe(0);
  });
});


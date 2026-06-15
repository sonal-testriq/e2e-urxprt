import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, PTJPost_Name } from "../../../testData/constants.js";


test("TC_PTJ_001: PTJ account page is accessible after login", async ({
  userHomePage,
  userPage,
}) => {
  await userHomePage.gotoPTJViaCard();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
  await userHomePage.gotoHomepage();
  await userHomePage.goToPTJViaHeader();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
});

test("TC_PTJ_002: Search filters return expected PTJ results", async ({
  userPage,
  userHomePage,
  userPTJPage
}) => {
  await userHomePage.gotoPTJViaCard();
  const randomText = "UI design";
  await userPTJPage.searchFor(randomText)
  await userPage.waitForLoadState("networkidle");
  const post_name = await userPTJPage.postNames;
  await post_name.first().waitFor();
  const count = await post_name.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_PTJ_003: Open PTJ create post page from header and dashboard", async ({
  userPage,
  userHomePage,
  userPTJPage
}) => {
  await userHomePage.gotoPTJViaCard();
  await userPTJPage.clickOnCreateAPostButton();
  await expect(userPage).toHaveURL(/.*\/createpost/);
  await userHomePage.gotoHomepage();
  await userHomePage.goToPTJViaHeader();
  await userPTJPage.clickOnCreateAPostButton();
  await expect(userPage).toHaveURL(/.*\/createpost/);
  await userHomePage.gotoHomepage();
  await userHomePage.goToPTJViaDashboard();
  await userPTJPage.clickOnCreateAPostButton();
  await expect(userPage).toHaveURL(/.*\/createpost/);
});

test("TC_PTJ_004: View filtered PTJ post details and verify recently viewed posts", async ({
  userPage,
  userHomePage,
  userPTJPage
}) => {
  await userHomePage.gotoPTJViaCard();
  await userPTJPage.searchFor("UI design");
  await userPage.waitForLoadState("networkidle");
  await userPTJPage.waitForPosts();
  await userPage.waitForTimeout(500);
  const count = await userPTJPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const newPage = await userPTJPage.openFirstFilteredPost();
  await userPTJPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await userPage.reload();
  await userPTJPage.goToRecentlyReviewedPage();
  await userPTJPage.verifyRecentlyViewedPost("UI design");
});

test("TC_PTJ_005: Save a filtered PTJ post and verify saved posts page", async ({
  userPage,
  userHomePage,
  userPTJPage
}) => {
  await userHomePage.gotoPTJViaCard();
  await userPTJPage.searchFor("UI design");
  await userPage.waitForLoadState("networkidle");
  await userPTJPage.waitForPosts();
  await userPage.waitForTimeout(500);
  const count = await userPTJPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  await userPTJPage.saveFirstPost();
  await userPTJPage.goToSavedPostsPage();
  await userPTJPage.verifySavedPost("UI design");
  await userPTJPage.saveFirstPost();
});

test("TC_PTJ_006: Apply PTJ filters and verify result counts update correctly", async ({
  userPage,
  userHomePage,
  userPTJPage,
}) => {
  await userHomePage.gotoPTJViaCard();
  const post_names = await userPTJPage.postNames;
  await post_names.first().waitFor();
  await userPage.waitForLoadState("networkidle");
  const originalPageCount = await userPTJPage.getTheTotalPageNumber();
  const beforeFilter = (await userPTJPage.postNames.allTextContents())
    .map((t) => t.trim())
    .filter(Boolean);
  await userPTJPage.chooseOldPostFilter();
  await expect(async () => {
    const after = await userPTJPage.postNames.allTextContents();
    expect(after).not.toEqual(beforeFilter);
  }).toPass();
  await userPTJPage.chooseECommerceFromIndustryFilter();
  const countAfterIndustrySelect = await userPTJPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
  const totalPostBeforeCategoryApply = await userPTJPage.getTotalPostsCount();
  await userPTJPage.chooseSupplyChainFromCategoryFilter();
  await userPage.waitForTimeout(500);
  const totalPostAfterCategoryApply = await userPTJPage.getTotalPostsCount();
  expect(totalPostAfterCategoryApply).not.toEqual(totalPostBeforeCategoryApply);
  await userPTJPage.removeFilter();
  const countAfterClearingFilter = await userPTJPage.getUpdatedPageNumber();
  expect(countAfterClearingFilter).toEqual(originalPageCount);
});

test.describe("PTJ Flow", () => {
  test.describe.configure({ mode: 'serial' });
  test("TC_PTJ_007: Create a PTJ post with form validation steps", async ({
    userPage,
    userHomePage,
    userPTJPage,
  }) => {
    await userHomePage.gotoPTJViaCard();
    await userPTJPage.clickOnCreateAPostButton();
    await expect(userPage).toHaveURL(/.*\/createpost/);
    // STEP 1
    await userPTJPage.selectRadioOption("Part Time Job (PTJ)");
    await userPTJPage.selectRadioOption("Hourly");
    await userPTJPage.fillInput("Job Title", PTJPost_Name);
    await userPTJPage.selectDropdown("Select Industries *", "Business");
    await userPTJPage.selectDropdown("Select Category *", "Managing and Consultant");
    await userPTJPage.selectDropdown("Select Sub Category", "Project Management");
    await userPTJPage.selectRadioOption("Physical");
    await userPTJPage.selectDropdown("Country", "India");
    await userPTJPage.fillInput("City", "Mumbai");
    await userPTJPage.fillRichTextEditor("Job Description *", "This is a test description for automation");
    await userPage.waitForTimeout(1000); 
    await userPTJPage.clickNext();
    // STEP 2
    await userPTJPage.selectMultiDropdown("Select competencies", ["Branding", "Campaigns"]);
    expect(await userPage.getByText("Add Required competencies for this job")).toBeVisible();
    // add custom competency
    const addManuallyButton = userPage.getByRole("button", { name: /Add manually/i });
    await addManuallyButton.click();
    await userPTJPage.fillInputWithPlaceholder("Type a competency", "Dummy Competency");
    const addCompetencyButton = userPage.getByRole("button", { name: "Add", exact: true });
    await addCompetencyButton.click();
    const skill = userPage.locator("p.select-deactive-skill", { hasText: "CRM +", exact: true });
    await skill.click();
    await userPTJPage.clickNext();
    // Step 3
    await userPTJPage.fillInputWithPlaceholder("Enter From Price", "10");
    await userPTJPage.fillInputWithPlaceholder("Enter To Price", "15");
    await userPTJPage.selectDropdown( "Preferred Language of Work Submission *", "English" );
    await userPTJPage.clickNext();  
    await userPTJPage.verifyPTJSummary();
    await userPTJPage.postJob();
    await userPTJPage.verifyPostCreated();
  });

  test("TC_PTJ_008: Search filters return newly created PTJ post", async ({
      userPage,
      userHomePage,
      userPTJPage
    }) => {
      await userHomePage.gotoPTJViaCard();
      await userPTJPage.searchFor(PTJPost_Name);
      await userPage.waitForLoadState("networkidle"); // wait for search results to load
      const post_names = await userPTJPage.postNames;
      await post_names.first().waitFor();
      await userPage.waitForTimeout(500);
      const count = await post_names.count();
      expect(count).toBe(1);
  });

  test("TC_PTJ_009: Verify newly created PTJ post appears in My Orders under Posted Posts", async ({
  userHomePage,
  }) => {
    await userHomePage.gotoPBPViaCard();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openPTJPostFromMyOrders();
    await expect(userHomePage.post_job_name_in_part_time_job.first()).toHaveText(PTJPost_Name);
  })

  test("TC_PTJ_010: Verify newly created PTJ post is editable and updates correctly", async ({
  userPage,
  userHomePage,
  userPTJPage,
  }) => {
    await userHomePage.gotoPTJViaCard();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openPTJPostFromMyOrders();
    await expect(userHomePage.post_job_name_in_part_time_job.first()).toBeVisible();
    await userPTJPage.goToEditProjectDetailsPage();
    await userHomePage.clickOnEditButton("Project Title");
    await userPTJPage.fillInput("Enter Title", PTJPost_Name+" Edited");
    await userPTJPage.clickOnSaveNButton();
    const postProjectButton = userPage.getByRole("button", { name: "Post Job" });
    postProjectButton.click();
    await expect(userPage.getByText("PTJ updated sucessfully")).toBeVisible();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openPTJPostFromMyOrders();
    await expect(userHomePage.post_job_name_in_part_time_job.first()).toHaveText(PTJPost_Name+" Edited");
  })

  test("TC_PTJ_011: Verify newly created PTJ post can be cancelled", async ({
  userPage,
  userHomePage,
  userPTJPage,
  }) => {
    await userHomePage.gotoPTJViaCard();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openPTJPostFromMyOrders();
    await expect(userHomePage.post_job_name_in_part_time_job.first()).toBeVisible();
    await userPTJPage.view_details_button.first().click();
    await userPTJPage.cancelCreatedPBPPost();
    await expect(userPage.getByText("Your post has been successfully cancelled")).toBeVisible();
  })

  test("TC_PTJ_012: Verify cancelled PTJ post is removed from search results", async ({
      userPage,
      userHomePage,
      userPTJPage
    }) => {
      await userHomePage.gotoPTJViaCard();
      await userPTJPage.searchFor(PTJPost_Name);
      await userPage.waitForLoadState("networkidle"); 
      const post_names = await userPTJPage.postNames;
      await expect(post_names.first()).not.toBeVisible();
      const count = await post_names.count();
      expect(count).toBe(0);
  });
});

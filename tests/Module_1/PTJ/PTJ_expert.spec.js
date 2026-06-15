import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, PTJPost_Name } from "../../../testData/constants.js";


test("TC_PTJ_001: PTJ account page is accessible after login", async ({
  expertHomePage,
  expertPage,
}) => {
  await expertHomePage.gotoPTJViaCard();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
  await expertHomePage.gotoHomepage();
  await expertHomePage.goToPTJViaHeader();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
});

test("TC_PTJ_002: Search filters return expected PTJ results", async ({
  expertPage,
  expertHomePage,
  expertPTJPage
}) => {
  await expertHomePage.gotoPTJViaCard();
  const randomText = "UI design";
  await expertPTJPage.searchFor(randomText)
  await expertPage.waitForLoadState("networkidle");
  const post_name = await expertPTJPage.postNames;
  await post_name.first().waitFor();
  const count = await post_name.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_PTJ_003: Open PTJ create post page from header and dashboard", async ({
  expertPage,
  expertHomePage,
  expertPTJPage
}) => {
  await expertHomePage.gotoPTJViaCard();
  await expertPTJPage.clickOnCreateAPostButton();
  await expect(expertPage).toHaveURL(/.*\/createpost/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.goToPTJViaHeader();
  await expertPTJPage.clickOnCreateAPostButton();
  await expect(expertPage).toHaveURL(/.*\/createpost/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.goToPTJViaDashboard();
  await expertPTJPage.clickOnCreateAPostButton();
  await expect(expertPage).toHaveURL(/.*\/createpost/);
});

test("TC_PTJ_004: View filtered PTJ post details and verify recently viewed posts", async ({
  expertPage,
  expertHomePage,
  expertPTJPage
}) => {
  await expertHomePage.gotoPTJViaCard();
  await expertPTJPage.searchFor("UI design");
  await expertPage.waitForLoadState("networkidle");
  await expertPTJPage.waitForPosts();
  await expertPage.waitForTimeout(500);
  const count = await expertPTJPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const newPage = await expertPTJPage.openFirstFilteredPost();
  await expertPTJPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await expertPage.reload();
  await expertPTJPage.goToRecentlyReviewedPage();
  await expertPTJPage.verifyRecentlyViewedPost("UI design");
});

test("TC_PTJ_005: Save a filtered PTJ post and verify saved posts page", async ({
  expertPage,
  expertHomePage,
  expertPTJPage
}) => {
  await expertHomePage.gotoPTJViaCard();
  await expertPTJPage.searchFor("UI design");
  await expertPage.waitForLoadState("networkidle");
  await expertPTJPage.waitForPosts();
  await expertPage.waitForTimeout(500);
  const count = await expertPTJPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  await expertPTJPage.saveFirstPost();
  await expertPTJPage.goToSavedPostsPage();
  await expertPTJPage.verifySavedPost("UI design");
  await expertPTJPage.saveFirstPost();
});

test("TC_PTJ_006: Apply PTJ filters and verify result counts update correctly", async ({
  expertPage,
  expertHomePage,
  expertPTJPage,
}) => {
  await expertHomePage.gotoPTJViaCard();
  const post_names = await expertPTJPage.postNames;
  await post_names.first().waitFor();
  await expertPage.waitForLoadState("networkidle");
  const originalPageCount = await expertPTJPage.getTheTotalPageNumber();
  const beforeFilter = (await expertPTJPage.postNames.allTextContents())
    .map((t) => t.trim())
    .filter(Boolean);
  await expertPTJPage.chooseOldPostFilter();
  await expect(async () => {
    const after = await expertPTJPage.postNames.allTextContents();
    expect(after).not.toEqual(beforeFilter);
  }).toPass();
  await expertPTJPage.chooseECommerceFromIndustryFilter();
  const countAfterIndustrySelect = await expertPTJPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
  const totalPostBeforeCategoryApply = await expertPTJPage.getTotalPostsCount();
  await expertPTJPage.chooseSupplyChainFromCategoryFilter();
  await expertPage.waitForTimeout(500);
  const totalPostAfterCategoryApply = await expertPTJPage.getTotalPostsCount();
  expect(totalPostAfterCategoryApply).not.toEqual(totalPostBeforeCategoryApply);
  await expertPTJPage.removeFilter();
  const countAfterClearingFilter = await expertPTJPage.getUpdatedPageNumber();
  expect(countAfterClearingFilter).toEqual(originalPageCount);
});

test.describe("PTJ Flow", () => {
  test.describe.configure({ mode: 'serial' });
  test("TC_PTJ_007: Create a PTJ post with form validation steps", async ({
    expertPage,
    expertHomePage,
    expertPTJPage,
  }) => {
    await expertHomePage.gotoPTJViaCard();
    await expertPTJPage.clickOnCreateAPostButton();
    await expect(expertPage).toHaveURL(/.*\/createpost/);
    // STEP 1
    await expertPTJPage.selectRadioOption("Part Time Job (PTJ)");
    await expertPTJPage.selectRadioOption("Hourly");
    await expertPTJPage.fillInput("Job Title", PTJPost_Name);
    await expertPTJPage.selectDropdown("Select Industries *", "Business");
    await expertPTJPage.selectDropdown("Select Category *", "Managing and Consultant");
    await expertPTJPage.selectDropdown("Select Sub Category", "Project Management");
    await expertPTJPage.selectRadioOption("Physical");
    await expertPTJPage.selectDropdown("Country", "India");
    await expertPTJPage.fillInput("City", "Mumbai");
    await expertPTJPage.fillRichTextEditor("Job Description *", "This is a test description for automation");
    await expertPage.waitForTimeout(1000); 
    await expertPTJPage.clickNext();
    // STEP 2
    await expertPTJPage.selectMultiDropdown("Select competencies", ["Branding", "Campaigns"]);
    expect(await expertPage.getByText("Add Required competencies for this job")).toBeVisible();
    // add custom competency
    const addManuallyButton = expertPage.getByRole("button", { name: /Add manually/i });
    await addManuallyButton.click();
    await expertPTJPage.fillInputWithPlaceholder("Type a competency", "Dummy Competency");
    const addCompetencyButton = expertPage.getByRole("button", { name: "Add", exact: true });
    await addCompetencyButton.click();
    const skill = expertPage.locator("p.select-deactive-skill", { hasText: "CRM +", exact: true });
    await skill.click();
    await expertPTJPage.clickNext();
    // Step 3
    await expertPTJPage.fillInputWithPlaceholder("Enter From Price", "10");
    await expertPTJPage.fillInputWithPlaceholder("Enter To Price", "15");
    await expertPTJPage.selectDropdown( "Preferred Language of Work Submission *", "English" );
    await expertPTJPage.clickNext();  
    await expertPTJPage.verifyPTJSummary();
    await expertPTJPage.postJob();
    await expertPTJPage.verifyPostCreated();
  });

  test("TC_PTJ_008: Search filters return newly created PTJ post", async ({
      expertPage,
      expertHomePage,
      expertPTJPage
    }) => {
      await expertHomePage.gotoPTJViaCard();
      await expertPTJPage.searchFor(PTJPost_Name);
      await expertPage.waitForLoadState("networkidle"); // wait for search results to load
      const post_names = await expertPTJPage.postNames;
      await post_names.first().waitFor();
      await expertPage.waitForTimeout(500);
      const count = await post_names.count();
      expect(count).toBe(1);
  });

  test("TC_PTJ_009: Verify newly created PTJ post appears in My Orders under Posted Posts", async ({
  expertHomePage,
  }) => {
    await expertHomePage.gotoPBPViaCard();
    await expertHomePage.navigateToMyOrdersViaPreview();
    await expertHomePage.openPTJPostFromMyOrders();
    await expect(expertHomePage.post_job_name_in_part_time_job.first()).toHaveText(PTJPost_Name);
  })

  test("TC_PTJ_010: Verify newly created PTJ post is editable and updates correctly", async ({
  expertPage,
  expertHomePage,
  expertPTJPage,
  }) => {
    await expertHomePage.gotoPTJViaCard();
    await expertHomePage.navigateToMyOrdersViaPreview();
    await expertHomePage.openPTJPostFromMyOrders();
    await expect(expertHomePage.post_job_name_in_part_time_job.first()).toBeVisible();
    await expertPTJPage.goToEditProjectDetailsPage();
    await expertHomePage.clickOnEditButton("Project Title");
    await expertPTJPage.fillInput("Enter Title", PTJPost_Name+" Edited");
    await expertPTJPage.clickOnSaveNButton();
    const postProjectButton = await expertPage.getByRole("button", { name: "Post Job" });
    await postProjectButton.click();
    await expect(expertPage.getByText("PTJ updated sucessfully")).toBeVisible();
    await expertHomePage.navigateToMyOrdersViaPreview();
    await expertHomePage.openPTJPostFromMyOrders();
    await expect(expertHomePage.post_job_name_in_part_time_job.first()).toHaveText(PTJPost_Name+" Edited");
  })

  test("TC_PTJ_011: Verify newly created PTJ post can be cancelled", async ({
  expertPage,
  expertHomePage,
  expertPTJPage,
  }) => {
    await expertHomePage.gotoPTJViaCard();
    await expertHomePage.navigateToMyOrdersViaPreview();
    await expertHomePage.openPTJPostFromMyOrders();
    await expect(expertHomePage.post_job_name_in_part_time_job.first()).toBeVisible();
    await expertPTJPage.view_details_button.first().click();
    await expertPTJPage.cancelCreatedPBPPost();
    await expect(expertPage.getByText("Your post has been successfully cancelled")).toBeVisible();
  })

  test("TC_PTJ_012: Verify cancelled PTJ post is removed from search results", async ({
      expertPage,
      expertHomePage,
      expertPTJPage
    }) => {
      await expertHomePage.gotoPTJViaCard();
      await expertPTJPage.searchFor(PTJPost_Name);
      await expertPage.waitForLoadState("networkidle"); 
      const post_names = await expertPTJPage.postNames;
      await expect(post_names.first()).not.toBeVisible();
      const count = await post_names.count();
      expect(count).toBe(0);
  });
});

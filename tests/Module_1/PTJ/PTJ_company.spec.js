import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, PTJPost_Name } from "../../../testData/constants.js";


// test("TC_PTJ_001: PTJ account page is accessible after login", async ({
//   companyHomePage,
//   companyPage,
// }) => {
//   await companyHomePage.gotoPTJViaCard();
//   await expect(companyPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
//   await companyHomePage.gotoHomepage();
//   await companyHomePage.goToPTJViaHeader();
//   await expect(companyPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
// });

// test("TC_PTJ_002: Search filters return expected PTJ results", async ({
//   companyPage,
//   companyHomePage,
//   companyPTJPage
// }) => {
//   await companyHomePage.gotoPTJViaCard();
//   const randomText = "UI design";
//   await companyPTJPage.searchFor(randomText)
//   await companyPage.waitForLoadState("networkidle");
//   const post_name = await companyPTJPage.postNames;
//   await post_name.first().waitFor();
//   const count = await post_name.count();
//   expect(count).toBeGreaterThanOrEqual(1);
// });

// test("TC_PTJ_003: Open PTJ create post page from header and dashboard", async ({
//   companyPage,
//   companyHomePage,
//   companyPTJPage
// }) => {
//   await companyHomePage.gotoPTJViaCard();
//   await companyPTJPage.clickOnCreateAPostButton();
//   await expect(companyPage).toHaveURL(/.*\/createpost/);
//   await companyHomePage.gotoHomepage();
//   await companyHomePage.goToPTJViaHeader();
//   await companyPTJPage.clickOnCreateAPostButton();
//   await expect(companyPage).toHaveURL(/.*\/createpost/);
//   await companyHomePage.gotoHomepage();
//   await companyHomePage.goToPTJViaDashboard();
//   await companyPTJPage.clickOnCreateAPostButton();
//   await expect(companyPage).toHaveURL(/.*\/createpost/);
// });

// test("TC_PTJ_004: View filtered PTJ post details and verify recently viewed posts", async ({
//   companyPage,
//   companyHomePage,
//   companyPTJPage
// }) => {
//   await companyHomePage.gotoPTJViaCard();
//   await companyPTJPage.searchFor("UI design");
//   await companyPage.waitForLoadState("networkidle");
//   await companyPTJPage.waitForPosts();
//   await companyPage.waitForTimeout(500);
//   const count = await companyPTJPage.getPostCount();
//   expect(count).toBeGreaterThanOrEqual(1);
//   const newPage = await companyPTJPage.openFirstFilteredPost();
//   await companyPTJPage.verifyPostDetailsIsVisible(newPage);
//   await newPage.close();
//   await companyPage.reload();
//   await companyPTJPage.goToRecentlyReviewedPage();
//   await companyPTJPage.verifyRecentlyViewedPost("UI design");
// });

// test("TC_PTJ_005: Save a filtered PTJ post and verify saved posts page", async ({
//   companyPage,
//   companyHomePage,
//   companyPTJPage
// }) => {
//   await companyHomePage.gotoPTJViaCard();
//   await companyPTJPage.searchFor("UI design");
//   await companyPage.waitForLoadState("networkidle");
//   await companyPTJPage.waitForPosts();
//   await companyPage.waitForTimeout(500);
//   const count = await companyPTJPage.getPostCount();
//   expect(count).toBeGreaterThanOrEqual(1);
//   await companyPTJPage.saveFirstPost();
//   await companyPTJPage.goToSavedPostsPage();
//   await companyPTJPage.verifySavedPost("UI design");
//   await companyPTJPage.saveFirstPost();
// });

// test("TC_PTJ_006: Apply PTJ filters and verify result counts update correctly", async ({
//   companyPage,
//   companyHomePage,
//   companyPTJPage,
// }) => {
//   await companyHomePage.gotoPTJViaCard();
//   const post_names = await companyPTJPage.postNames;
//   await post_names.first().waitFor();
//   await companyPage.waitForLoadState("networkidle");
//   const originalPageCount = await companyPTJPage.getTheTotalPageNumber();
//   const beforeFilter = (await companyPTJPage.postNames.allTextContents())
//     .map((t) => t.trim())
//     .filter(Boolean);
//   await companyPTJPage.chooseOldPostFilter();
//   await expect(async () => {
//     const after = await companyPTJPage.postNames.allTextContents();
//     expect(after).not.toEqual(beforeFilter);
//   }).toPass();
//   await companyPTJPage.chooseECommerceFromIndustryFilter();
//   const countAfterIndustrySelect = await companyPTJPage.getUpdatedPageNumber();
//   expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
//   const totalPostBeforeCategoryApply = await companyPTJPage.getTotalPostsCount();
//   await companyPTJPage.chooseSupplyChainFromCategoryFilter();
//   await companyPage.waitForTimeout(500);
//   const totalPostAfterCategoryApply = await companyPTJPage.getTotalPostsCount();
//   expect(totalPostAfterCategoryApply).not.toEqual(totalPostBeforeCategoryApply);
//   await companyPTJPage.removeFilter();
//   const countAfterClearingFilter = await companyPTJPage.getUpdatedPageNumber();
//   expect(countAfterClearingFilter).toEqual(originalPageCount);
// });

test.describe("PTJ Flow", () => {
  test.describe.configure({ mode: 'serial' });
  test("TC_PTJ_007: Create a PTJ post with form validation steps", async ({
    companyPage,
    companyHomePage,
    companyPTJPage,
  }) => {
    await companyHomePage.gotoPTJViaCard();
    await companyPTJPage.clickOnCreateAPostButton();
    await expect(companyPage).toHaveURL(/.*\/createpost/);
    // STEP 1
    await companyPTJPage.selectRadioOption("Part Time Job (PTJ)");
    await companyPTJPage.selectRadioOption("Hourly");
    await companyPTJPage.fillInput("Job Title", PTJPost_Name);
    await companyPTJPage.selectDropdown("Select Industries *", "Business");
    await companyPTJPage.selectDropdown("Select Category *", "Managing and Consultant");
    await companyPTJPage.selectDropdown("Select Sub Category", "Project Management");
    await companyPTJPage.selectRadioOption("Physical");
    await companyPTJPage.selectDropdown("Country", "India");
    await companyPTJPage.fillInput("City", "Mumbai");
    await companyPTJPage.fillRichTextEditor("Job Description *", "This is a test description for automation");
    await companyPage.waitForTimeout(1000); 
    await companyPTJPage.clickNext();
    // STEP 2
    await companyPTJPage.selectMultiDropdown("Select competencies", ["Branding", "Campaigns"]);
    expect(await companyPage.getByText("Add Required competencies for this job")).toBeVisible();
    // add custom competency
    const addManuallyButton = companyPage.getByRole("button", { name: /Add manually/i });
    await addManuallyButton.click();
    await companyPTJPage.fillInputWithPlaceholder("Type a competency", "Dummy Competency");
    const addCompetencyButton = companyPage.getByRole("button", { name: "Add", exact: true });
    await addCompetencyButton.click();
    const skill = companyPage.locator("p.select-deactive-skill", { hasText: "CRM +", exact: true });
    await skill.click();
    await companyPTJPage.clickNext();
    // Step 3
    await companyPTJPage.fillInputWithPlaceholder("Enter From Price", "10");
    await companyPTJPage.fillInputWithPlaceholder("Enter To Price", "15");
    await companyPTJPage.selectDropdown( "Preferred Language of Work Submission *", "English" );
    await companyPTJPage.clickNext();  
    await companyPTJPage.verifyPTJSummary();
    await companyPTJPage.postJob();
    await companyPTJPage.verifyPostCreated();
  });

  test("TC_PTJ_008: Search filters return newly created PTJ post", async ({
      companyPage,
      companyHomePage,
      companyPTJPage
    }) => {
      await companyHomePage.gotoPTJViaCard();
      await companyPTJPage.searchFor(PTJPost_Name);
      await companyPage.waitForLoadState("networkidle"); // wait for search results to load
      const post_names = await companyPTJPage.postNames;
      await post_names.first().waitFor();
      await companyPage.waitForTimeout(500);
      const count = await post_names.count();
      expect(count).toBe(1);
  });

  test("TC_PTJ_009: Verify newly created PTJ post appears in My Orders under Posted Posts", async ({
  companyHomePage,
  }) => {
    await companyHomePage.gotoPBPViaCard();
    await companyHomePage.navigateToMyOrdersViaPreview();
    await companyHomePage.openPTJPostFromMyOrders();
    await expect(companyHomePage.post_job_name_in_part_time_job.first()).toHaveText(PTJPost_Name);
  })

  test("TC_PTJ_010: Verify newly created PTJ post is editable and updates correctly", async ({
  companyPage,
  companyHomePage,
  companyPTJPage,
  }) => {
    await companyHomePage.gotoPTJViaCard();
    await companyHomePage.navigateToMyOrdersViaPreview();
    await companyHomePage.openPTJPostFromMyOrders();
    await expect(companyHomePage.post_job_name_in_part_time_job.first()).toBeVisible();
    await companyPTJPage.goToEditProjectDetailsPage();
    await companyHomePage.clickOnEditButton("Project Title");
    await companyPTJPage.fillInput("Enter Title", PTJPost_Name+" Edited");
    await companyPTJPage.clickOnSaveNButton();
    const postProjectButton = await companyPage.getByRole("button", { name: "Post Job" });
    await postProjectButton.click();
    await expect(companyPage.getByText("PTJ updated sucessfully")).toBeVisible();
    await companyHomePage.navigateToMyOrdersViaPreview();
    await companyHomePage.openPTJPostFromMyOrders();
    await expect(companyHomePage.post_job_name_in_part_time_job.first()).toHaveText(PTJPost_Name+" Edited");
  })

  test("TC_PTJ_011: Verify newly created PTJ post can be cancelled", async ({
  companyPage,
  companyHomePage,
  companyPTJPage,
  }) => {
    await companyHomePage.gotoPTJViaCard();
    await companyHomePage.navigateToMyOrdersViaPreview();
    await companyHomePage.openPTJPostFromMyOrders();
    await expect(companyHomePage.post_job_name_in_part_time_job.first()).toBeVisible();
    await companyPTJPage.view_details_button.first().click();
    await companyPTJPage.cancelCreatedPBPPost();
    await expect(companyPage.getByText("Your post has been successfully cancelled")).toBeVisible();
  })

  test("TC_PTJ_012: Verify cancelled PTJ post is removed from search results", async ({
      companyPage,
      companyHomePage,
      companyPTJPage
    }) => {
      await companyHomePage.gotoPTJViaCard();
      await companyPTJPage.searchFor(PTJPost_Name);
      await companyPage.waitForLoadState("networkidle"); 
      const post_names = await companyPTJPage.postNames;
      await expect(post_names.first()).not.toBeVisible();
      const count = await post_names.count();
      expect(count).toBe(0);
  });
});

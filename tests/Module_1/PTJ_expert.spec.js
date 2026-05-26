import { test, expect } from "../../fixtures/page.fixture.js";
import { pageRoutes, PTJPost_Name } from "../../testData/constants.js";


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
}) => {
  await expertHomePage.gotoPTJViaCard();
  const randomText = "Testing";
  const search_box = expertPage.getByRole("textbox", { name: "Search PTJ" });
  const search_button = expertPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();
  await expertPage.waitForLoadState("networkidle");
  const postNames = await expertPage.locator("//div[@class='filter-detail']//h5");
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_PTJ_003: Open PTJ create post page from header and dashboard", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoPTJViaCard();
  const create_a_post_button = expertPage.locator(
    "//button[contains(text(),'Create a post')]",
  );
  await create_a_post_button.click();
  await expect(expertPage).toHaveURL(/.*\/createpost/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.goToPTJViaHeader();
  await create_a_post_button.click();
  await expect(expertPage).toHaveURL(/.*\/createpost/);
  await expertHomePage.gotoHomepage();
  await expertHomePage.goToPTJViaDashboard();
  await create_a_post_button.click();
  await expect(expertPage).toHaveURL(/.*\/createpost/);
});

test("TC_PTJ_004: View filtered PTJ post details and verify recently viewed posts", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoPTJViaCard();
  const search_box = expertPage.getByRole("textbox", { name: "Search PTJ" });
  const search_button = expertPage.getByRole("button", { name: "Search" });
  await search_box.fill("UI design");
  await search_button.click();
  const postNames = await expertPage.locator(
    "//div[@class='filter-detail']//h5",
  );
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
  const [newPage] = await Promise.all([
    expertPage.context().waitForEvent("page"),
    postNames.click(),
  ]);
  await newPage.waitForLoadState();
  return newPage;
  await newPage.close();
  await expertPage.reload();
  const recently_viewed_tab = expertPage.locator(
    "//a[contains(text(),'Recently viewed')]",
  );
  await recently_viewed_tab.click();
  const recently_reviewed_post = expertPage.locator(
    "//div[@class='filter-detail']//h5",
  );
  await recently_reviewed_post.first().waitFor();
  const reviewedCount = await recently_reviewed_post.count();
  expect(reviewedCount).toBeGreaterThanOrEqual(1);
  const isPresent = await recently_reviewed_post.first().textContent();
  expect(isPresent).toContain("UI designer");
});

test("TC_PTJ_005: Save a filtered PTJ post and verify saved posts page", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoPTJViaCard();
  // Search for a specific post
  const search_box = expertPage.getByRole("textbox", { name: "Search PTJ" });
  const search_button = expertPage.getByRole("button", { name: "Search" });
  await search_box.fill("UI design");
  await search_button.click();
  const postNames = await expertPage.locator(
    "//div[@class='filter-detail']//h5",
  );
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);

  // Save the post and verify it appears in saved posts page
  const heart_button = expertPage.locator("//button[@class='btn heart-btn']");
  await expertPage.waitForLoadState("networkidle");
  await heart_button.first().waitFor();
  await heart_button.first().click();

  const saved_posts_tab = expertPage.locator(
    "//a[contains(text(),'Saved posts')]",
  );
  await saved_posts_tab.click();
  const saved_post = expertPage.locator("//div[@class='filter-detail']//h5");
  await expect(saved_post.first()).toBeVisible();
  await expect(saved_post).toContainText("UI design");
});

test("TC_PTJ_006: Apply PTJ filters and verify result counts update correctly", async ({
  expertPage,
  expertHomePage,
  expertPTJPage,
}) => {
  await expertHomePage.gotoPTJViaCard();
  const postNames = await expertPage.locator(
    "//div[@class='filter-detail']//h5",
  );
  await postNames.first().waitFor();
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
  await expertPTJPage.chooseEnergyFromIndustryFilter();
  const countAfterIndustrySelect = await expertPTJPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
  await expertPTJPage.chooseOilFromCategoryFilter();
  const countAfterCategorySelect = await expertPTJPage.getUpdatedPageNumber();
  expect(countAfterCategorySelect).not.toEqual(countAfterIndustrySelect);
  await expertPTJPage.chooseDrillingFromSubCategory();
  const countAfterSubCategorySelection =
    await expertPTJPage.getUpdatedPageNumber();
  expect(countAfterSubCategorySelection).not.toEqual(
    countAfterCategorySelect,
  );
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
    const create_a_post_button = expertPage.locator(
      "//button[contains(text(),'Create a post')]",
    );
    await create_a_post_button.click();
    await expect(expertPage).toHaveURL(/.*\/createpost/);

    // STEP 1
    await expertPTJPage.selectRadioOption("Part Time Job (PTJ)");
    await expertPTJPage.selectRadioOption("Hourly");
    await expertPTJPage.fillInput("Job Title", PTJPost_Name);
    await expertPTJPage.selectDropdown("Select Industries *", "Business");
    await expertPTJPage.selectDropdown(
      "Select Category *",
      "Managing and Consultant",
    );
    await expertPTJPage.selectDropdown(
      "Select Sub Category",
      "Project Management",
    );
    await expertPTJPage.selectRadioOption("Physical");
    await expertPTJPage.selectDropdown("Country", "India");
    await expertPTJPage.fillInput("City", "Mumbai");
    await expertPTJPage.fillRichTextEditor(
      "Job Description *",
      "This is a test description for automation",
    );

    await expertPage.waitForTimeout(2000); // wait for validation to trigger
    const nextButton = expertPage.getByRole("button", { name: "Next" });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // STEP 2
    await expertPTJPage.selectMultiDropdown("Select competencies", [
      "Branding",
      "Campaigns",
    ]);

    expect(
      await expertPage.getByText("Add Required competencies for this job"),
    ).toBeVisible();
    // add custom competency
    const addManuallyButton = expertPage.getByRole("button", {
      name: /Add manually/i,
    });

    await addManuallyButton.click();
    await expertPTJPage.fillInputWithPlaceholder(
      "Type a competency",
      "Dummy Competency",
    );
    const addCompetencyButton = expertPage.getByRole("button", {
      name: "Add",
      exact: true,
    });
    await addCompetencyButton.click();

    const skill = expertPage.locator("p.select-deactive-skill", {
      hasText: "CRM +",
      exact: true,
    });
    await skill.click();

    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Step 3
    await expertPTJPage.fillInputWithPlaceholder("Enter From Price", "10");
    await expertPTJPage.fillInputWithPlaceholder("Enter To Price", "15");
    await expertPTJPage.selectDropdown(
      "Preferred Language of Work Submission *",
      "English",
    );

    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    await expect(
      expertPage.getByText("Part time job (PTJ) Summary"),
    ).toBeVisible();
    const postJobButton = expertPage.getByRole("button", { name: "Post Job" });
    postJobButton.click();

    await expect(
      expertPage.getByText("Congratulations! Your post is now live."),
    ).toBeVisible();
  });

  test("TC_PTJ_008: Search filters return newly created PTJ post", async ({
      expertPage,
      expertHomePage,
    }) => {
      await expertHomePage.gotoPTJViaCard();
      // await expertHomePage.searchOnPBPPage('Frontend Developer');
      const search_box = expertPage.getByRole("textbox", { name: "Search PTJ" });
      const search_button = expertPage.getByRole("button", { name: "Search" });
      //   await expertPage.waitForTimeout(2000);
      await search_box.fill(PTJPost_Name);
      await search_button.click();
      await expertPage.waitForLoadState("networkidle"); // wait for search results to load
      const postNames = await expertPage.locator(
        "//div[@class='filter-detail']//h5",
      );
      await postNames.first().waitFor();
      const count = await postNames.count();
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
  expertPBPPage,
  }) => {
    await expertHomePage.gotoPTJViaCard();
    await expertHomePage.navigateToMyOrdersViaPreview();
    await expertHomePage.openPTJPostFromMyOrders();
    await expect(expertHomePage.post_job_name_in_part_time_job.first()).toBeVisible();
    await expertPBPPage.goToEditProjectDetailsPage();
    await expertHomePage.clickOnEditButton("Project Title");
    await expertPBPPage.fillInput("Enter Title", PTJPost_Name+" Edited");
    await expertPBPPage.clickOnSaveNButton();
    const postProjectButton = expertPage.getByRole("button", { name: "Post Job" });
    postProjectButton.click();
    await expect(
      expertPage.getByText("PTJ updated sucessfully"),
    ).toBeVisible();
    await expertHomePage.navigateToMyOrdersViaPreview();
    await expertHomePage.openPTJPostFromMyOrders();
    await expect(expertHomePage.post_job_name_in_part_time_job.first()).toHaveText(PTJPost_Name+" Edited");
  })

  test("TC_PTJ_011: Verify newly created PTJ post can be cancelled", async ({
  expertPage,
  expertHomePage,
  expertPBPPage,
  }) => {
    await expertHomePage.gotoPTJViaCard();
    await expertHomePage.navigateToMyOrdersViaPreview();
    await expertHomePage.openPTJPostFromMyOrders();
    await expect(expertHomePage.post_job_name_in_part_time_job.first()).toBeVisible();
    await expertPBPPage.view_details_button.first().click();
    await expertPBPPage.cancelCreatedPBPPost();
    await expect(
      expertPage.getByText("Your post has been successfully cancelled"),
    ).toBeVisible();
  })

  test("TC_PTJ_012: Verify cancelled PTJ post is removed from search results", async ({
      expertPage,
      expertHomePage,
    }) => {
      await expertHomePage.gotoPTJViaCard();
      const search_box = expertPage.getByRole("textbox", { name: "Search PTJ" });
      const search_button = expertPage.getByRole("button", { name: "Search" });
      await search_box.fill(PTJPost_Name);
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

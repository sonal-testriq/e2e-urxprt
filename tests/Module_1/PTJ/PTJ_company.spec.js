import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, PTJPost_Name } from "../../../testData/constants.js";


test("TC_PTJ_001: PTJ account page is accessible after login", async ({
  companyHomePage,
  companyPage,
}) => {
  await companyHomePage.gotoPTJViaCard();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
  await companyHomePage.gotoHomepage();
  await companyHomePage.goToPTJViaHeader();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
});

test("TC_PTJ_002: Search filters return expected PTJ results", async ({
  companyPage,
  companyHomePage,
}) => {
  await companyHomePage.gotoPTJViaCard();
  const randomText = "Testing";
  const search_box = companyPage.getByRole("textbox", { name: "Search PTJ" });
  const search_button = companyPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();
  await companyPage.waitForLoadState("networkidle");
  const postNames = await companyPage.locator("//div[@class='filter-detail']//h5");
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_PTJ_003: Open PTJ create post page from header and dashboard", async ({
  companyPage,
  companyHomePage,
}) => {
  await companyHomePage.gotoPTJViaCard();
  const create_a_post_button = companyPage.locator(
    "//button[contains(text(),'Create a post')]",
  );
  await create_a_post_button.click();
  await expect(companyPage).toHaveURL(/.*\/createpost/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.goToPTJViaHeader();
  await create_a_post_button.click();
  await expect(companyPage).toHaveURL(/.*\/createpost/);
  await companyHomePage.gotoHomepage();
  await companyHomePage.goToPTJViaDashboard();
  await create_a_post_button.click();
  await expect(companyPage).toHaveURL(/.*\/createpost/);
});

test("TC_PTJ_004: View filtered PTJ post details and verify recently viewed posts", async ({
  companyPage,
  companyHomePage,
}) => {
  await companyHomePage.gotoPTJViaCard();
  const search_box = companyPage.getByRole("textbox", { name: "Search PTJ" });
  const search_button = companyPage.getByRole("button", { name: "Search" });
  await search_box.fill("UI design");
  await search_button.click();
  const postNames = await companyPage.locator(
    "//div[@class='filter-detail']//h5",
  );
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
  const [newPage] = await Promise.all([
    companyPage.context().waitForEvent("page"),
    postNames.click(),
  ]);
  await newPage.waitForLoadState();
  return newPage;
  await newPage.close();
  await companyPage.reload();
  const recently_viewed_tab = companyPage.locator(
    "//a[contains(text(),'Recently viewed')]",
  );
  await recently_viewed_tab.click();
  const recently_reviewed_post = companyPage.locator(
    "//div[@class='filter-detail']//h5",
  );
  await recently_reviewed_post.first().waitFor();
  const reviewedCount = await recently_reviewed_post.count();
  expect(reviewedCount).toBeGreaterThanOrEqual(1);
  const isPresent = await recently_reviewed_post.first().textContent();
  expect(isPresent).toContain("UI designer");
});

test("TC_PTJ_005: Save a filtered PTJ post and verify saved posts page", async ({
  companyPage,
  companyHomePage,
}) => {
  await companyHomePage.gotoPTJViaCard();
  // Search for a specific post
  const search_box = companyPage.getByRole("textbox", { name: "Search PTJ" });
  const search_button = companyPage.getByRole("button", { name: "Search" });
  await search_box.fill("UI design");
  await search_button.click();
  const postNames = await companyPage.locator(
    "//div[@class='filter-detail']//h5",
  );
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);

  // Save the post and verify it appears in saved posts page
  const heart_button = companyPage.locator("//button[@class='btn heart-btn']");
  await companyPage.waitForLoadState("networkidle");
  await heart_button.first().waitFor();
  await heart_button.first().click();

  const saved_posts_tab = companyPage.locator(
    "//a[contains(text(),'Saved posts')]",
  );
  await saved_posts_tab.click();
  const saved_post = companyPage.locator("//div[@class='filter-detail']//h5");
  await expect(saved_post.first()).toBeVisible();
  await expect(saved_post).toContainText("UI design");
});

test("TC_PTJ_006: Apply PTJ filters and verify result counts update correctly", async ({
  companyPage,
  companyHomePage,
  companyPTJPage,
}) => {
  await companyHomePage.gotoPTJViaCard();
  const postNames = await companyPage.locator(
    "//div[@class='filter-detail']//h5",
  );
  await postNames.first().waitFor();
  await companyPage.waitForLoadState("networkidle");
  const originalPageCount = await companyPTJPage.getTheTotalPageNumber();
  const beforeFilter = (await companyPTJPage.postNames.allTextContents())
    .map((t) => t.trim())
    .filter(Boolean);
  await companyPTJPage.chooseOldPostFilter();
  await expect(async () => {
    const after = await companyPTJPage.postNames.allTextContents();
    expect(after).not.toEqual(beforeFilter);
  }).toPass();
  await companyPTJPage.chooseEnergyFromIndustryFilter();
  const countAfterIndustrySelect = await companyPTJPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
  await companyPTJPage.chooseOilFromCategoryFilter();
  const countAfterCategorySelect = await companyPTJPage.getUpdatedPageNumber();
  expect(countAfterCategorySelect).not.toEqual(countAfterIndustrySelect);
  await companyPTJPage.chooseDrillingFromSubCategory();
  const countAfterSubCategorySelection =
    await companyPTJPage.getUpdatedPageNumber();
  expect(countAfterSubCategorySelection).not.toEqual(
    countAfterCategorySelect,
  );
  await companyPTJPage.removeFilter();
  const countAfterClearingFilter = await companyPTJPage.getUpdatedPageNumber();
  expect(countAfterClearingFilter).toEqual(originalPageCount);
});

test.describe("PTJ Flow", () => {
  test.describe.configure({ mode: 'serial' });
  test("TC_PTJ_007: Create a PTJ post with form validation steps", async ({
    companyPage,
    companyHomePage,
    companyPTJPage,
  }) => {
    await companyHomePage.gotoPTJViaCard();
    const create_a_post_button = companyPage.locator(
      "//button[contains(text(),'Create a post')]",
    );
    await create_a_post_button.click();
    await expect(companyPage).toHaveURL(/.*\/createpost/);

    // STEP 1
    await companyPTJPage.selectRadioOption("Part Time Job (PTJ)");
    await companyPTJPage.selectRadioOption("Hourly");
    await companyPTJPage.fillInput("Job Title", PTJPost_Name);
    await companyPTJPage.selectDropdown("Select Industries *", "Business");
    await companyPTJPage.selectDropdown(
      "Select Category *",
      "Managing and Consultant",
    );
    await companyPTJPage.selectDropdown(
      "Select Sub Category",
      "Project Management",
    );
    await companyPTJPage.selectRadioOption("Physical");
    await companyPTJPage.selectDropdown("Country", "India");
    await companyPTJPage.fillInput("City", "Mumbai");
    await companyPTJPage.fillRichTextEditor(
      "Job Description *",
      "This is a test description for automation",
    );

    await companyPage.waitForTimeout(2000); // wait for validation to trigger
    const nextButton = companyPage.getByRole("button", { name: "Next" });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // STEP 2
    await companyPTJPage.selectMultiDropdown("Select competencies", [
      "Branding",
      "Campaigns",
    ]);

    expect(
      await companyPage.getByText("Add Required competencies for this job"),
    ).toBeVisible();
    // add custom competency
    const addManuallyButton = companyPage.getByRole("button", {
      name: /Add manually/i,
    });

    await addManuallyButton.click();
    await companyPTJPage.fillInputWithPlaceholder(
      "Type a competency",
      "Dummy Competency",
    );
    const addCompetencyButton = companyPage.getByRole("button", {
      name: "Add",
      exact: true,
    });
    await addCompetencyButton.click();

    const skill = companyPage.locator("p.select-deactive-skill", {
      hasText: "CRM +",
      exact: true,
    });
    await skill.click();

    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Step 3
    await companyPTJPage.fillInputWithPlaceholder("Enter From Price", "10");
    await companyPTJPage.fillInputWithPlaceholder("Enter To Price", "15");
    await companyPTJPage.selectDropdown(
      "Preferred Language of Work Submission *",
      "English",
    );

    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    await expect(
      companyPage.getByText("Part time job (PTJ) Summary"),
    ).toBeVisible();
    const postJobButton = companyPage.getByRole("button", { name: "Post Job" });
    postJobButton.click();

    await expect(
      companyPage.getByText("Congratulations! Your post is now live."),
    ).toBeVisible();
  });

  test("TC_PTJ_008: Search filters return newly created PTJ post", async ({
      companyPage,
      companyHomePage,
    }) => {
      await companyHomePage.gotoPTJViaCard();
      // await companyHomePage.searchOnPBPPage('Frontend Developer');
      const search_box = companyPage.getByRole("textbox", { name: "Search PTJ" });
      const search_button = companyPage.getByRole("button", { name: "Search" });
      //   await companyPage.waitForTimeout(2000);
      await search_box.fill(PTJPost_Name);
      await search_button.click();
      await companyPage.waitForLoadState("networkidle"); // wait for search results to load
      const postNames = await companyPage.locator(
        "//div[@class='filter-detail']//h5",
      );
      await postNames.first().waitFor();
      const count = await postNames.count();
      expect(count).toBe(1);
  });

  test("TC_PTJ_009: Verify newly created PTJ post appears in My Orders under Posted Posts", async ({
  companyHomePage,
  }) => {
    await companyHomePage.gotoPTJViaCard();
    await companyHomePage.navigateToMyOrdersViaPreview();
    await companyHomePage.openPTJPostFromMyOrders();
    await expect(companyHomePage.post_job_name_in_part_time_job.first()).toHaveText(PTJPost_Name);
  })

  test("TC_PTJ_010: Verify newly created PTJ post is editable and updates correctly", async ({
  companyPage,
  companyHomePage,
  companyPBPPage,
  }) => {
    await companyHomePage.gotoPTJViaCard();
    await companyHomePage.navigateToMyOrdersViaPreview();
    await companyHomePage.openPTJPostFromMyOrders();
    await expect(companyHomePage.post_job_name_in_part_time_job.first()).toBeVisible();
    await companyPBPPage.goToEditProjectDetailsPage();
    await companyHomePage.clickOnEditButton("Project Title");
    await companyPBPPage.fillInput("Enter Title", PTJPost_Name+" Edited");
    await companyPBPPage.clickOnSaveNButton();
    const postProjectButton = companyPage.getByRole("button", { name: "Post Job" });
    postProjectButton.click();
    await expect(
      companyPage.getByText("PTJ updated sucessfully"),
    ).toBeVisible();
    await companyHomePage.navigateToMyOrdersViaPreview();
    await companyHomePage.openPTJPostFromMyOrders();
    await expect(companyHomePage.post_job_name_in_part_time_job.first()).toHaveText(PTJPost_Name+" Edited");
  })

  test("TC_PTJ_011: Verify newly created PTJ post can be cancelled", async ({
  companyPage,
  companyHomePage,
  companyPBPPage,
  }) => {
    await companyHomePage.gotoPTJViaCard();
    await companyHomePage.navigateToMyOrdersViaPreview();
    await companyHomePage.openPTJPostFromMyOrders();
    await expect(companyHomePage.post_job_name_in_part_time_job.first()).toBeVisible();
    await companyPBPPage.view_details_button.first().click();
    await companyPBPPage.cancelCreatedPBPPost();
    await expect(
      companyPage.getByText("Your post has been successfully cancelled"),
    ).toBeVisible();
  })

  test("TC_PTJ_012: Verify cancelled PTJ post is removed from search results", async ({
      companyPage,
      companyHomePage,
    }) => {
      await companyHomePage.gotoPTJViaCard();
      const search_box = companyPage.getByRole("textbox", { name: "Search PTJ" });
      const search_button = companyPage.getByRole("button", { name: "Search" });
      await search_box.fill(PTJPost_Name);
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

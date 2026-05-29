import { test, expect } from "../../fixtures/page.fixture.js";
import { pageRoutes, PTJPost_Name } from "../../testData/constants.js";


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
}) => {
  await userHomePage.gotoPTJViaCard();
  const randomText = "Testing";
  const search_box = userPage.getByRole("textbox", { name: "Search PTJ" });
  const search_button = userPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();
  await userPage.waitForLoadState("networkidle");
  const postNames = await userPage.locator("//div[@class='filter-detail']//h5");
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_PTJ_003: Open PTJ create post page from header and dashboard", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoPTJViaCard();
  const create_a_post_button = userPage.locator(
    "//button[contains(text(),'Create a post')]",
  );
  await create_a_post_button.click();
  await expect(userPage).toHaveURL(/.*\/createpost/);
  await userHomePage.gotoHomepage();
  await userHomePage.goToPTJViaHeader();
  await create_a_post_button.click();
  await expect(userPage).toHaveURL(/.*\/createpost/);
  await userHomePage.gotoHomepage();
  await userHomePage.goToPTJViaDashboard();
  await create_a_post_button.click();
  await expect(userPage).toHaveURL(/.*\/createpost/);
});

test("TC_PTJ_004: View filtered PTJ post details and verify recently viewed posts", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoPTJViaCard();
  const search_box = userPage.getByRole("textbox", { name: "Search PTJ" });
  const search_button = userPage.getByRole("button", { name: "Search" });
  await search_box.fill("UI design");
  await search_button.click();
  const postNames = await userPage.locator(
    "//div[@class='filter-detail']//h5",
  );
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
  const [newPage] = await Promise.all([
    userPage.context().waitForEvent("page"),
    postNames.click(),
  ]);
  await newPage.waitForLoadState();
  return newPage;
  await newPage.close();
  await userPage.reload();
  const recently_viewed_tab = userPage.locator(
    "//a[contains(text(),'Recently viewed')]",
  );
  await recently_viewed_tab.click();
  const recently_reviewed_post = userPage.locator(
    "//div[@class='filter-detail']//h5",
  );
  await recently_reviewed_post.first().waitFor();
  const reviewedCount = await recently_reviewed_post.count();
  expect(reviewedCount).toBeGreaterThanOrEqual(1);
  const isPresent = await recently_reviewed_post.first().textContent();
  expect(isPresent).toContain("UI designer");
});

test("TC_PTJ_005: Save a filtered PTJ post and verify saved posts page", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoPTJViaCard();
  // Search for a specific post
  const search_box = userPage.getByRole("textbox", { name: "Search PTJ" });
  const search_button = userPage.getByRole("button", { name: "Search" });
  await search_box.fill("UI design");
  await search_button.click();
  const postNames = await userPage.locator(
    "//div[@class='filter-detail']//h5",
  );
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);

  // Save the post and verify it appears in saved posts page
  const heart_button = userPage.locator("//button[@class='btn heart-btn']");
  await userPage.waitForLoadState("networkidle");
  await heart_button.first().waitFor();
  await heart_button.first().click();

  const saved_posts_tab = userPage.locator(
    "//a[contains(text(),'Saved posts')]",
  );
  await saved_posts_tab.click();
  const saved_post = userPage.locator("//div[@class='filter-detail']//h5");
  await expect(saved_post.first()).toBeVisible();
  await expect(saved_post).toContainText("UI design");
});

test("TC_PTJ_006: Apply PTJ filters and verify result counts update correctly", async ({
  userPage,
  userHomePage,
  userPTJPage,
}) => {
  await userHomePage.gotoPTJViaCard();
  const postNames = await userPage.locator(
    "//div[@class='filter-detail']//h5",
  );
  await postNames.first().waitFor();
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
  await userPTJPage.chooseEnergyFromIndustryFilter();
  const countAfterIndustrySelect = await userPTJPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterIndustrySelect);
  await userPTJPage.chooseOilFromCategoryFilter();
  const countAfterCategorySelect = await userPTJPage.getUpdatedPageNumber();
  expect(countAfterCategorySelect).not.toEqual(countAfterIndustrySelect);
  await userPTJPage.chooseDrillingFromSubCategory();
  const countAfterSubCategorySelection =
    await userPTJPage.getUpdatedPageNumber();
  expect(countAfterSubCategorySelection).not.toEqual(
    countAfterCategorySelect,
  );
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
    const create_a_post_button = userPage.locator(
      "//button[contains(text(),'Create a post')]",
    );
    await create_a_post_button.click();
    await expect(userPage).toHaveURL(/.*\/createpost/);

    // STEP 1
    await userPTJPage.selectRadioOption("Part Time Job (PTJ)");
    await userPTJPage.selectRadioOption("Hourly");
    await userPTJPage.fillInput("Job Title", PTJPost_Name);
    await userPTJPage.selectDropdown("Select Industries *", "Business");
    await userPTJPage.selectDropdown(
      "Select Category *",
      "Managing and Consultant",
    );
    await userPTJPage.selectDropdown(
      "Select Sub Category",
      "Project Management",
    );
    await userPTJPage.selectRadioOption("Physical");
    await userPTJPage.selectDropdown("Country", "India");
    await userPTJPage.fillInput("City", "Mumbai");
    await userPTJPage.fillRichTextEditor(
      "Job Description *",
      "This is a test description for automation",
    );

    await userPage.waitForTimeout(2000); // wait for validation to trigger
    const nextButton = userPage.getByRole("button", { name: "Next" });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // STEP 2
    await userPTJPage.selectMultiDropdown("Select competencies", [
      "Branding",
      "Campaigns",
    ]);

    expect(
      await userPage.getByText("Add Required competencies for this job"),
    ).toBeVisible();
    // add custom competency
    const addManuallyButton = userPage.getByRole("button", {
      name: /Add manually/i,
    });

    await addManuallyButton.click();
    await userPTJPage.fillInputWithPlaceholder(
      "Type a competency",
      "Dummy Competency",
    );
    const addCompetencyButton = userPage.getByRole("button", {
      name: "Add",
      exact: true,
    });
    await addCompetencyButton.click();

    const skill = userPage.locator("p.select-deactive-skill", {
      hasText: "CRM +",
      exact: true,
    });
    await skill.click();

    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Step 3
    await userPTJPage.fillInputWithPlaceholder("Enter From Price", "10");
    await userPTJPage.fillInputWithPlaceholder("Enter To Price", "15");
    await userPTJPage.selectDropdown(
      "Preferred Language of Work Submission *",
      "English",
    );

    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    await expect(
      userPage.getByText("Part time job (PTJ) Summary"),
    ).toBeVisible();
    const postJobButton = userPage.getByRole("button", { name: "Post Job" });
    postJobButton.click();

    await expect(
      userPage.getByText("Congratulations! Your post is now live."),
    ).toBeVisible();
  });

  test("TC_PTJ_008: Search filters return newly created PTJ post", async ({
      userPage,
      userHomePage,
    }) => {
      await userHomePage.gotoPTJViaCard();
      // await userHomePage.searchOnPBPPage('Frontend Developer');
      const search_box = userPage.getByRole("textbox", { name: "Search PTJ" });
      const search_button = userPage.getByRole("button", { name: "Search" });
      //   await userPage.waitForTimeout(2000);
      await search_box.fill(PTJPost_Name);
      await search_button.click();
      await userPage.waitForLoadState("networkidle"); // wait for search results to load
      const postNames = await userPage.locator(
        "//div[@class='filter-detail']//h5",
      );
      await postNames.first().waitFor();
      const count = await postNames.count();
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
  userPBPPage,
  }) => {
    await userHomePage.gotoPTJViaCard();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openPTJPostFromMyOrders();
    await expect(userHomePage.post_job_name_in_part_time_job.first()).toBeVisible();
    await userPBPPage.goToEditProjectDetailsPage();
    await userHomePage.clickOnEditButton("Project Title");
    await userPBPPage.fillInput("Enter Title", PTJPost_Name+" Edited");
    await userPBPPage.clickOnSaveNButton();
    const postProjectButton = userPage.getByRole("button", { name: "Post Job" });
    postProjectButton.click();
    await expect(
      userPage.getByText("PTJ updated sucessfully"),
    ).toBeVisible();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openPTJPostFromMyOrders();
    await expect(userHomePage.post_job_name_in_part_time_job.first()).toHaveText(PTJPost_Name+" Edited");
  })

  test("TC_PTJ_011: Verify newly created PTJ post can be cancelled", async ({
  userPage,
  userHomePage,
  userPBPPage,
  }) => {
    await userHomePage.gotoPTJViaCard();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openPTJPostFromMyOrders();
    await expect(userHomePage.post_job_name_in_part_time_job.first()).toBeVisible();
    await userPBPPage.view_details_button.first().click();
    await userPBPPage.cancelCreatedPBPPost();
    await expect(
      userPage.getByText("Your post has been successfully cancelled"),
    ).toBeVisible();
  })

  test("TC_PTJ_012: Verify cancelled PTJ post is removed from search results", async ({
      userPage,
      userHomePage,
    }) => {
      await userHomePage.gotoPTJViaCard();
      const search_box = userPage.getByRole("textbox", { name: "Search PTJ" });
      const search_button = userPage.getByRole("button", { name: "Search" });
      await search_box.fill(PTJPost_Name);
      await search_button.click();
      await userPage.waitForLoadState("networkidle"); 
      const postNames = await userPage.locator(
        "//div[@class='filter-detail']//h5",
      );
      await expect(postNames.first()).not.toBeVisible();
      const count = await postNames.count();
      expect(count).toBe(0);
  });
});

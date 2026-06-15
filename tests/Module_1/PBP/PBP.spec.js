import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, PBPPostName } from "../../../testData/constants.js";

test("TC_PBP_001: PBP account page is accessible after login", async ({
  userHomePage,
  userPage,
}) => {
  await userHomePage.gotoPBPViaCard();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchall?type=1");
  await userHomePage.gotoHomepage();
  await userHomePage.goToPBPViaHeader();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchall?type=1");
});

test("TC_PBP_002: Search filters return expected results", async ({
  userPage,
  userHomePage,
  userPBPPage,
}) => {
  await userHomePage.gotoPBPViaCard();
  const randomText = "IOS app";
  await userPBPPage.searchFor(randomText);
  await userPage.waitForLoadState("networkidle");
  const post_names = await userPBPPage.postNames;
  await post_names.first().waitFor();
  await userPage.waitForTimeout(500);
  const count = await post_names.count();
  expect(count).toEqual(1);
});

test("TC_PBP_003: Navigate to create post page from homepage and dashboard", async ({
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

test("TC_PBP_004: View filtered post details and verify recently reviewed posts", async ({
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

test("TC_PBP_005: Save a filtered post and verify saved posts page", async ({
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

test("TC_PBP_006: Apply multiple filters and verify counts update correctly", async ({
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
  await userPBPPage.chooseBusinessFromIndustryFilter();
  await userPage.waitForTimeout(500);
  const countAfterBusinessSelect = await userPBPPage.getUpdatedPageNumber();
  expect(originalPageCount).not.toEqual(countAfterBusinessSelect);
  const postCountBeforeCategorySelect = await userPBPPage.getTotalPostsCount();
  await userPBPPage.chooseMACFromCategoryFilter();
  await userPage.waitForTimeout(500);
  const postCountAfterCategorySelect  = await userPBPPage.getTotalPostsCount();
  expect(postCountAfterCategorySelect).not.toEqual(postCountBeforeCategorySelect);
});

test("TC_PBP_007: Verify Join as Expert/Company popup opens from a post detail", async ({
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

test("TC_PBP_008: Validate create post form errors and umbrella checkbox behavior", async ({
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

test.describe("TC_PBP_Post: Post Operations", () => {
  test.describe.configure({ mode: 'serial' });
  test("TC_PBP_001: Verify create post from PBP page", async ({
  userPage,
  userHomePage,
  userPBPPage,
  }) => {
    await userHomePage.gotoPBPViaCard();
    await userPBPPage.clickOnCreateAPostButton();
    await expect(userPage).toHaveURL(/.*\/createpost/);
    await userPBPPage.fillInput("Write a title for your post ", PBPPostName);
    await userPBPPage.selectDropdown("Select Industries *", "Business");
    await userPBPPage.selectDropdown("Select Category *","Managing and Consultant");
    await userPBPPage.selectDropdown("Select Sub Category","Project Management");
    await userPBPPage.fillRichTextEditor("Project Description *","This is a test description for automation");
    await userPage.waitForTimeout(500);
    const nextButton = userPage.getByRole("button", { name: "Next" });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
    await userPBPPage.selectMultiDropdown("Select competencies", ["Branding","Campaigns"]);
    await nextButton.click();
    await expect(userPBPPage.required_competencies_error).toBeVisible();
    const skill = userPage.locator("p.select-deactive-skill", { hasText: "CRM +", exact: true,});
    await skill.click();
    await nextButton.click();
    await nextButton.click();
    await expect(userPBPPage.maximum_project_budget_error).toBeVisible();
    await expect(userPBPPage.duration_required_error).toBeVisible();
    await userPBPPage.fillInputWithPlaceholder("Enter Budget in $", "10");
    await userPBPPage.fillInputWithPlaceholder("Enter number of days", "10");
    await nextButton.click();
    await userPBPPage.expected_deliverables_input.fill("This is test deliverable");
    await userPBPPage.selectDropdown("Preferred Language of Work Submission *","English");
    await userPage.waitForTimeout(500);
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
    await expect(userPage.getByText("Post & Browse Projects (PBP) Summary"),).toBeVisible();  
    const postJobButton = userPage.getByRole("button", { name: "Post Project" });
    postJobButton.click();
    await expect(userPage.getByText("Congratulations! Your post is now live.")).toBeVisible();
  });

  test("TC_PBP_002: Search filters return newly created post in results", async ({
      userPage,
      userHomePage,
      userPBPPage
    }) => {
      await userHomePage.gotoPBPViaCard();
      await userPBPPage.searchFor(PBPPostName);
      await userPage.waitForLoadState("networkidle");
      const post_names = await userPBPPage.postNames;
      await post_names.first().waitFor();
      await userPage.waitForTimeout(500);
      const count = await post_names.count();
      expect(count).toEqual(1);
  });

  test("TC_PBP_003: Verify newly created post are displayed in My Orders under Posted Posts", async ({
    userHomePage,
  }) => {
    await userHomePage.gotoPBPViaCard();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openPBPPostFromMyOrders();
    await expect(userHomePage.postNamesOnMyOrders.first()).toHaveText(PBPPostName);
  })

  test("TC_PBP_004: Verify newly created post are editable", async ({
    userPage,
    userHomePage,
    userPBPPage,
  }) => {
    await userHomePage.gotoPBPViaCard();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openPBPPostFromMyOrders();
    await expect(userHomePage.postNamesOnMyOrders.first()).toBeVisible();
    await userPBPPage.goToEditProjectDetailsPage();
    await userHomePage.clickOnEditButton("Project Title");
    await userPBPPage.fillInput("Enter Title", PBPPostName + " Edited");
    await userPBPPage.clickOnSaveNButton();
    const postProjectButton = userPage.getByRole("button", { name: "Post Project" });
    postProjectButton.click();
    await expect(userPage.getByText("PBP updated sucessfully"),).toBeVisible();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openPBPPostFromMyOrders();
    await expect(userHomePage.postNamesOnMyOrders.first()).toHaveText(PBPPostName + " Edited");
  })

  test("TC_PBP_005: Verify newly created post can be cancelled", async ({
    userPage,
    userHomePage,
    userPBPPage,
  }) => {
    await userHomePage.gotoPBPViaCard();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openPBPPostFromMyOrders();
    await expect(userHomePage.postNamesOnMyOrders.first()).toBeVisible();
    await userPBPPage.view_details_button.first().click();
    await userPBPPage.cancelCreatedPBPPost();
    await expect(userPage.getByText("Your post has been successfully cancelled")).toBeVisible();
  })

  test("TC_PBP_006: Search filters return newly created post in results", async ({
    userPage,
    userHomePage,
    userPBPPage
  }) => {
    await userHomePage.gotoPBPViaCard();
    await userPBPPage.searchFor(PBPPostName);
    await userPage.waitForLoadState("networkidle");
    const post_names = await userPBPPage.postNames;
    await post_names.first().waitFor();
    await userPage.waitForTimeout(500);
    const count = await post_names.count();
    expect(count).toBe(0);
  });

  test("TC_PBP_007: Verify Join as Expert/Company popup opens from a post detail", async ({
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
    await userPBPPage.verifyJoinAsExpertOrCompanyPopUpAppearsForUserAccount(newPage);
    await userPBPPage.verifyJoinAsExpertAndJoinAsCompanyButtonIsClickable(newPage);
    await userPBPPage.closePopUp(newPage);
    await newPage.close();
    await userPage.reload();
  });
});

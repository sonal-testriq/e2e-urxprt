import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, WBOPostName } from "../../../testData/constants.js";

test("TC_WBO_001: WBO account page is accessible after login", async ({
  userHomePage,
  userPage,
}) => {
  await userHomePage.gotoWBOViaCard();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchall?type=2");
  await userHomePage.gotoHomepage();
  await userHomePage.goToWBOViaHeader();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchall?type=2");
});

test("TC_WBO_002: Search filters return expected results", async ({
  userPage,
  userHomePage, 
  userWBOPage
}) => {
  await userHomePage.gotoWBOViaCard();
  await userWBOPage.searchFor("Design a Modern Fintech Landing Page")
  await userPage.waitForLoadState("networkidle");
  const post_names = await userWBOPage.postNames;
  await post_names.first().waitFor();
  await userPage.waitForTimeout(500);
  const count = await post_names.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_WBO_003: Navigate to create post page from homepage and dashboard", async ({
  userPage,
  userHomePage,
  userWBOPage,
}) => {
  await userHomePage.gotoWBOViaCard();
  await userWBOPage.clickOnCreateAPostButton();
  await expect(userPage).toHaveURL(/.*\/createpost/);
  await userHomePage.gotoHomepage();
  await userHomePage.navigateToCreateAPBPPostViaDropdown();
  await expect(userPage).toHaveURL(/.*\/createpost/);
  await userHomePage.gotoHomepage();
  await userHomePage.gotoDashboardPage();
  await userWBOPage.clickOnCreateAPostButton();
  await expect(userPage).toHaveURL(/.*\/createpost/);
});

test("TC_WBO_004: View filtered post details and verify recently reviewed posts", async ({
  userPage,
  userHomePage,
  userWBOPage,
}) => {
  await userHomePage.gotoWBOViaCard();
  await userWBOPage.waitForPosts();
  const randomText = "Design a Modern Fintech Landing Page";
  await userWBOPage.searchFor(randomText);
  await userWBOPage.waitForFilteredResults();
  const newPage = await userWBOPage.goToTheFilteredPostetails();
  await userWBOPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await userPage.reload();
  await userWBOPage.goToRecentlyReviewedPage();
  await userWBOPage.waitForReviewedPostToAppear();
  const count = await userWBOPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await userWBOPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_WBO_005: Save a filtered post and verify saved posts page", async ({
  userHomePage,
  userWBOPage,
}) => {
  await userHomePage.gotoWBOViaCard();
  await userWBOPage.waitForPosts();
  const randomText = "Design a Modern Fintech Landing Page";
  await userWBOPage.searchFor(randomText);
  await userWBOPage.waitForFilteredResults();
  await userWBOPage.clickOnFirstPostsHeartButton();
  await userWBOPage.goToSavedPostsPage();
  await userWBOPage.waitForSavedPostToAppear();
  const count = await userWBOPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await userWBOPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  await userWBOPage.clickOnFirstPostsHeartButton();
  await userWBOPage.verifyThatTheTabHasNoPosts();
});

test("TC_WBO_006: Apply multiple filters and verify counts update correctly", async ({
  userPage,
  userHomePage,
  userWBOPage,
}) => {
  await userHomePage.gotoWBOViaCard();
  await userWBOPage.waitForPosts();
  const originalPostsCount = await userWBOPage.getTotalPostsCount();
  const beforeFilter = (await userWBOPage.postNames.allTextContents())
  .map(t => t.trim())
  .filter(Boolean);
  await userWBOPage.chooseOldPostFilter();
  await expect(async () => {
    const afterFilter = (await userWBOPage.postNames.allTextContents())
      .map(t => t.trim())
      .filter(Boolean);
    expect(afterFilter).not.toEqual(beforeFilter);
  }).toPass();
  const postCountBeforeIndustryFilter = await userWBOPage.getTotalPostsCount();
  await userWBOPage.chooseBusinessFinancialInstitutionFromIndustryFilter();
  await userPage.waitForTimeout(500);
  const postCountAfterIndustryFilter = await userWBOPage.getTotalPostsCount();
  expect(postCountAfterIndustryFilter).not.toEqual(postCountBeforeIndustryFilter);
  await userWBOPage.chooseWealthManagementFromCategoryFilter();
  await userWBOPage.chooseTaxPreparationFromSubCategory();
  await userPage.waitForTimeout(500);
  const postCountAfterCategoryFilter = await userWBOPage.getTotalPostsCount();
  expect(postCountAfterCategoryFilter).not.toEqual(postCountAfterIndustryFilter);
});

test("TC_WBO_007: Validate create post form errors and umbrella checkbox behavior", async ({
  userPage,
  userHomePage,
  userWBOPage,
}) => {
  await userHomePage.gotoWBOViaCard();
  await userWBOPage.clickOnCreateAPostButton();
  await expect(userPage).toHaveURL(/.*\/createpost/);
  await userWBOPage.clickOnNextButton();
  await userWBOPage.verifyElementsVisible([
    userWBOPage.required_error.first(),
    userWBOPage.required_industry_error,
    userWBOPage.required_category_error,
    userWBOPage.required_error.nth(1),
    userWBOPage.required_error.nth(2),
    userWBOPage.required_error.nth(3),
  ]);
});

test.describe("TC_WBO_Post: Post Operations", () => {
  test.describe.configure({ mode: 'serial' });
  test("TC_WBO_001: Verify create post from WBO page shows in Pending Payment Contest", async ({
  userPage,
  userHomePage,
  userWBOPage,
  }) => {
    await userHomePage.gotoWBOViaCard();
    await userWBOPage.clickOnCreateAPostButton();
    await expect(userPage).toHaveURL(/.*\/createpost/);
    await userWBOPage.fillInput("Write a title for your post this ", WBOPostName);
    await userWBOPage.selectDropdown("Select Industries *", "Business");
    await userWBOPage.selectDropdown(
      "Select Category *",
      "Managing and Consultant",
    );
    await userWBOPage.selectDropdown(
      "Select Sub Category",
      "Project Management",
    );
    await userWBOPage.fillInput(
      "Prize money *",
      "10",
    );
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${
      String(today.getMonth() + 1).padStart(2, "0")}-${
      String(today.getDate()).padStart(2, "0")
    }`;
    await userWBOPage.fillInput(
      "Last date of entry *",
      formattedDate,
    );
    await userWBOPage.fillRichTextEditor(
      "Win business Opportunities (WBO) Description *",
      "This is a test description for automation",
    );
    await userPage.waitForTimeout(2000); // wait for validation to trigger
    const nextButton = userPage.getByRole("button", { name: "Next" });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
    await userWBOPage.selectMultiDropdown("Select competencies", [
      "Branding",
      "Campaigns",
    ]);
    await nextButton.click();
    await expect(userWBOPage.required_competencies_error).toBeVisible();
    const skill = userPage.locator("p.select-deactive-skill", { hasText: "CRM +", exact: true,});
    await skill.click();
    await nextButton.click();
    await nextButton.click();
    await userWBOPage.expected_deliverables_input.fill("This is test deliverable");
    await userWBOPage.selectDropdown(
      "Preferred Language of Work Submission *",
      "English",
    );
    await userPage.waitForTimeout(1000);
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
    await expect(
      userPage.getByText("Win business Opportunities (WBO) Summary"),
    ).toBeVisible();  
    const postContestButton = userPage.getByRole("button", { name: "Post Contest" });
    await postContestButton.click();
    await expect(userPage.locator("//h6[contains(text(),'Order summary')]")).toBeVisible();
  });

  test("TC_WBO_002: Verify newly created post shows in Pending Payment Contest", async ({
  userHomePage,
  }) => {
    await userHomePage.gotoWBOViaCard();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openWBOPostFromMyOrders();
    await expect(userHomePage.post_contest_name_in_pending_payment_contest.first()).toHaveText(WBOPostName);
  });

  test("TC_WBO_003: Verify successful payment process", async ({  
  userPage,  
  userHomePage,
  userWBOPage,
  }) => {
    await userHomePage.gotoWBOViaCard();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openWBOPostFromMyOrders();
    await expect(userHomePage.post_contest_name_in_pending_payment_contest.first()).toBeVisible();
    await userWBOPage.goToOrderSummaryPage();
    await userWBOPage.clickOnMakePayment();
    await userWBOPage.clickOnSaveAndMakePayment();
    await userPage.waitForTimeout(5000);
    await userWBOPage.fillCardDetails();
    await userWBOPage.clickOnPayNow();
    await userWBOPage.completePayment();
    await userPage.waitForTimeout(3000);
    await expect(userPage.getByText("WBO Payment Completed").first()).toBeVisible();
  })

  test("TC_WBO_004: Verify Payment Done Post is displayed under", async ({
  userHomePage,
  }) => {
    await userHomePage.gotoWBOViaCard();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openWBOPostFromMyOrders();
    await expect(userHomePage.post_contest_name_in_all_active_wbo.first()).toHaveText(WBOPostName);
  });

  test("TC_WBO_005: Search filters return newly created post in results", async ({
      userPage,
      userHomePage,
      userWBOPage
    }) => {
      await userHomePage.gotoWBOViaCard();
      await userWBOPage.searchFor(WBOPostName)
      await userPage.waitForLoadState("networkidle");
      const post_names = await userWBOPage.postNames;
      await post_names.first().waitFor();
      await userPage.waitForTimeout
      const count = await post_names.count();
      expect(count).toBe(1);
  });

  test("TC_WBO_006: Verify newly created post are editable", async ({
  userPage,
  userHomePage,
  userWBOPage,
  }) => {
    await userHomePage.gotoWBOViaCard();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openWBOPostFromMyOrders();
    await expect(userHomePage.post_contest_name_in_all_active_wbo.first()).toBeVisible();
    await userWBOPage.goToEditProjectDetailsPage();
    await userHomePage.clickOnEditButton("Contest Title");
    await userWBOPage.fillInput("Enter Title", WBOPostName+" Edited");
    await userWBOPage.clickOnSaveNButton();
    const postProjectButton = userPage.getByRole("button", { name: "Post Contest" });
    postProjectButton.click();
    await expect(
      userPage.getByText("WBO updated sucessfully"),
    ).toBeVisible();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openWBOPostFromMyOrders();
    await expect(userHomePage.post_contest_name_in_all_active_wbo.first()).toHaveText(WBOPostName+" Edited");
  })

  test("TC_WBO_007: Verify newly created post can be cancelled", async ({
  userPage,
  userHomePage,
  userWBOPage,
  }) => {
    await userHomePage.gotoWBOViaCard();
    await userHomePage.navigateToMyOrdersViaPreview();
    await userHomePage.openWBOPostFromMyOrders();
    await expect(userHomePage.post_contest_name_in_all_active_wbo.first()).toBeVisible();
    await userWBOPage.view_details_button.first().click();
    await userWBOPage.cancelCreatedWBOPost();
    await expect(
      userPage.getByText("Your post has been successfully cancelled"),
    ).toBeVisible();
  })

  test("TC_WBO_008: Search filters return newly created post in results", async ({
      userPage,
      userHomePage,
      userWBOPage
    }) => {
      await userHomePage.gotoWBOViaCard();
      await userWBOPage.searchFor(WBOPostName)
      await userPage.waitForLoadState("networkidle");
      await expect(userWBOPage.no_post_on_page).toBeVisible();
  });
});


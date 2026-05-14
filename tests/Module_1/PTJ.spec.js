import { test, expect } from "../../fixtures/page.fixture.js";
import PTJPage from "../../pages/part-time-job.page";
import { assert } from "node:console";
import { only } from "node:test";
import {
  selectDropdown,
  selectRadioOption,
  fillInput,
  fillRichTextEditor,
  selectMultiDropdown,
  fillInputWithPlaceholder,
  uploadFile,
} from "../../helpers";
import credentials from "../../testData/credentials.json";
import fs from "fs";
import path from "path";
import { pageRoutes } from "../../testData/constants";

test("PTJ account page is accessible after login", async ({
  userHomePage,
  userPage,
}) => {
  // navigate to PTJ page from account page and verify URL
  await userHomePage.gotoPTJViaCard();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchall?type=3");

  // navigate to PTJ page via dropdown from homepage and verify URL
  await userHomePage.gotoHomepage();
  await userHomePage.goToPTJViaHeader();

  await expect(userPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
});

test("Search filters return expected results", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoPTJViaCard();

  // await userHomePage.searchOnPTJPage('Frontend Developer');
  const search_box = userPage.getByRole("textbox", { name: "Search PTJ" });
  const search_button = userPage.getByRole("button", { name: "Search" });
  //   await userPage.waitForTimeout(2000);
  await search_box.fill("Test Post for Automation");
  await search_button.click();

  await userPage.waitForLoadState("networkidle"); // wait for search results to load

  const postNames = await userPage.locator("//div[@class='filter-detail']//h5");
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThan(1);
});

test("Navigate to create post page from homepage and dashboard", async ({
  userPage,
  userHomePage,
}) => {
  // Navigate to create post page via PTJ link on homepage

  await userHomePage.gotoPTJViaCard();
  const create_a_post_button = userPage.locator(
    "//button[contains(text(),'Create a post')]",
  );
  await create_a_post_button.click();
  await expect(userPage).toHaveURL(/.*\/createpost/);
  await userHomePage.gotoHomepage();

  // Navigate to create post page via dropdown
  await userHomePage.goToPTJViaHeader();
  await create_a_post_button.click();
  await expect(userPage).toHaveURL(/.*\/createpost/);
  await userHomePage.gotoHomepage();

  // Navigate to create post page via dashboard
  await userHomePage.goToPTJViaDashboard();
  await create_a_post_button.click();
  await expect(userPage).toHaveURL(/.*\/createpost/);
});

test("View filtered post details and verify recently reviewed posts", async ({
  userPage,
  userHomePage,
}) => {
  // login and navigated to PTJ page from homepage
  await userHomePage.gotoPTJViaCard();

  // Search for a specific post
  const search_box = userPage.getByRole("textbox", { name: "Search PTJ" });
  const search_button = userPage.getByRole("button", { name: "Search" });
  await search_box.fill("UI designer");
  await search_button.click();
  const postNames = await userPage.locator("//div[@class='filter-detail']//h5");
  await postNames.first().waitFor();
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);

  //verify post details available and go to recently reviewed page
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

test("Save a filtered post and verify saved posts page", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoPTJViaCard();
  // Search for a specific post
  const search_box = userPage.getByRole("textbox", { name: "Search PTJ" });
  const search_button = userPage.getByRole("button", { name: "Search" });
  await search_box.fill("UI designer");

  await search_button.click();
  const postNames = await userPage.locator("//div[@class='filter-detail']//h5");
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
  await expect(saved_post).toContainText("UI designer");
});

test("Apply multiple filters and verify counts update correctly", async ({
  userPage,
  userHomePage,
  userPTJPage,
}) => {
  await userHomePage.gotoPTJViaCard();
  const postNames = await userPage.locator("//div[@class='filter-detail']//h5");
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
  expect(countAfterSubCategorySelection).not.toEqual(countAfterCategorySelect);
  await userPTJPage.removeFilter();
  const countAfterClearingFilter = await userPTJPage.getUpdatedPageNumber();
  expect(countAfterClearingFilter).toEqual(originalPageCount);
});

test("Verify create a post form validations", async ({
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
  await selectRadioOption(userPage, "Part Time Job (PTJ)");
  await selectRadioOption(userPage, "Weekly");
  await fillInput(userPage, "Job Title", "Test Post for Automation");
  await selectDropdown(userPage, "Select Industries *", "Business");
  await selectDropdown(
    userPage,
    "Select Category *",
    "Managing and Consultant",
  );
  await selectDropdown(userPage, "Select Sub Category", "Project Management");
  await selectRadioOption(userPage, "Physical");
  await selectDropdown(userPage, "Country", "India");
  await fillInput(userPage, "City", "Mumbai");
  await fillRichTextEditor(
    userPage,
    "Job Description *",
    "This is a test description for automation",
  );

  await userPage.waitForTimeout(2000); // wait for validation to trigger
  const nextButton = userPage.getByRole("button", { name: "Next" });
  await expect(nextButton).toBeEnabled();
  await nextButton.click();

  // STEP 2
  await selectMultiDropdown(userPage, "Select competencies", [
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
  await fillInputWithPlaceholder(
    userPage,
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
  await fillInputWithPlaceholder(userPage, "Enter From Price", "1000");
  await fillInputWithPlaceholder(userPage, "Enter To Price", "5000");
  await selectDropdown(
    userPage,
    "Preferred Language of Work Submission *",
    "English",
  );

  await expect(nextButton).toBeEnabled();
  await nextButton.click();

  await expect(userPage.getByText("Part time job (PTJ) Summary")).toBeVisible();
  const postJobButton = userPage.getByRole("button", { name: "Post Job" });
  postJobButton.click();

  await expect(
    userPage.getByText("Congratulations! Your post is now live."),
  ).toBeVisible();
});

test("Verify newly created post exist on the part time jobs listing", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoPTJViaCard();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
  const postCard = userPage.locator(".filter-detail", {
    hasText: "Test Post for Automation",
  });

  await expect(postCard.getByText("Your post")).toBeVisible();
});

test("Applying for post by 'Expert' user", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoPTJViaCard();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
  const postCard = expertPage.locator(".filter-detail", {
    hasText: "UI designer",
  });
  await expect(postCard).toBeVisible();
  await postCard.click();
  const [newPage] = await Promise.all([
    expertPage.context().waitForEvent("page"),
    postCard.click(),
  ]);

  await newPage.waitForLoadState();

  await newPage
    .getByRole("button", {
      name: /Apply for job/i,
    })
    .click();

  const applyButton = newPage.locator('button:has-text("Apply for job")');
  await applyButton.click();

  await fillInputWithPlaceholder(
    newPage,
    "Enter your message",
    "This is a test cover letter for automation",
  );
  await fillInputWithPlaceholder(newPage, "Enter price in $", "3000");
  await uploadFile(
    newPage,
    "Attach files",
    "testData/Cover-Letter-Samples.pdf",
  );
  const sendOfferButton = newPage.locator("//button[@type='submit']");
  await sendOfferButton.click();
  await expect(
    newPage.getByText(
      "Congratulations! Your Proposal has been submitted successfully.",
    ),
  ).toBeVisible();
});

test("Verify applied post appears in 'Manage Work' page for 'Expert' user", async ({
  expertPage,
  expertHomePage,
}) => {
  await expertHomePage.gotoDashboardPage();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");

  const manageWorkTab = expertPage.locator("a", {
    hasText: "Part time Job (PTJ)",
  });
  await manageWorkTab.click();
  const appliedPost = expertPage.locator(
    ".post-back.recent-back.recent-first",
    {
      hasText: "Test Post for Automation",
    },
  );
  await expect(appliedPost).toBeVisible();
});

test("Verify applied post appears in 'My Orders' page for 'User' after expert applies", async ({
  userPage,
  userHomePage,
}) => {
  await userPage.goto(`/en/dashboard`, { waitUntil: "networkidle" });
  const manageOrderTab = userPage.locator("a", {
    hasText: "My Orders",
  });
  await manageOrderTab.click();
  const orderTabs = userPage
    .locator("#MyOrderPostedorders")
    .locator(".order-tabs");

  const PTJTab = orderTabs.locator("a", {
    hasText: "Part time Job (PTJ)",
    exact: false,
  });
  await PTJTab.click();
  const tabContent = userPage.locator(".tab-content");
  const PostedPTJ = tabContent.locator("h4", {
    hasText: "Posted Part time Job (PTJ)",
  });
  await expect(PostedPTJ).toBeVisible();
  const orderCard = userPage.locator("h3", {
    hasText: "Test Post for Automation",
  });
  await expect(orderCard).toBeVisible();
  await orderCard.click();
  const postNavTabs = userPage.locator(".nav-tabs");
  const proposalsTab = postNavTabs.locator("a", {
    hasText: "All Proposals",
    exact: false,
  });
  await proposalsTab.click();
  const shivakumarCard = userPage.locator(".all-proposal", {
    has: userPage.locator("h5", { hasText: "Sonal Mewada" }),
  });
  await userPage.waitForTimeout(2000);
  await shivakumarCard.getByRole("button", { name: "Send Offer" }).click();
  // await sendOfferToExpertButton.scrollIntoViewIfNeeded();
  // await expect(sendOfferToExpertButton).toBeVisible();
  // await sendOfferToExpertButton.click();
  // await fillInput(userPage, "First name", "Shiva");
  // await fillInput(userPage, "Last name", "Kumar");

  await userPage.locator("label[for='agree']").click();

  const scrollToBottomBtn = userPage
    .locator(".popup-contract-container")
    .locator("button", {
      name: "Scroll to Bottom",
      exact: true,
    });
  await userPage.waitForTimeout(2000);
  await scrollToBottomBtn.click();
  await userPage
    .locator(".popup-contract-container")
    .locator("input[id='agree']")
    .click();
  await userPage.waitForLoadState("networkidle");
  await userPage.waitForTimeout(2000);

  const acceptOfferButton = userPage.locator("button", {
    hasText: "Accept",
  });
  await acceptOfferButton.click();
});

// Making payment for sent offer
test.only("Making payment for sent offer", async ({ userPage }) => {
  await userPage.goto(`/en/dashboard/myorders`, { waitUntil: "networkidle" });
  const orderTabs = userPage
    .locator("#MyOrderPostedorders")
    .locator(".order-tabs");

  const PTJTab = orderTabs.locator("a", {
    hasText: "Part time Job (PTJ)",
    exact: false,
  });
  await PTJTab.click();
  const tabContent = userPage.locator(".tab-content");
  const PostedPTJ = tabContent.locator("h4", {
    hasText: "Posted Part time Job (PTJ)",
  });
  await expect(PostedPTJ).toBeVisible();
  const orderCard = userPage.locator("h3", {
    hasText: "Test Post for Automation",
  });
  await expect(orderCard).toBeVisible();
  await orderCard.click();
  const postNavTabs = userPage.locator(".nav-tabs");
  const proposalsTab = postNavTabs.locator("a", {
    hasText: "All Proposals",
    exact: false,
  });
  await proposalsTab.click();
  const shivakumarCard = userPage.locator(".all-proposal", {
    has: userPage.locator("h5", { hasText: "Shivakumar GP" }),
  });
  const PaymentButton = shivakumarCard.locator("button", {
    hasText: "Pay",
    exact: true,
  });
  await expect(PaymentButton).toBeVisible();
  await PaymentButton.click();
  const makePayment = userPage.locator("button", { hasText: "Make Payment" });
  await expect(makePayment).toBeVisible();
  await makePayment.click();
  const saveAndMakePayment = userPage.locator("button", {
    hasText: "Save and make payment",
  });
  await saveAndMakePayment.click();
  await userPage.waitForTimeout(5000);

  await expect(userPage.locator('iframe[title="Card Number"]')).toBeVisible();

  await userPage
    .frameLocator('iframe[title="Card Number"]')
    .locator('input[name="card.number"]')
    .fill("5555555555554444");

  await userPage.locator('input[placeholder="MM / YY"]').fill("12 / 30");

  await userPage.locator('input[placeholder="Card holder"]').fill("Test User");

  await userPage
    .frameLocator('iframe[title="Security Code CVV"]')
    .locator('input[name="card.cvv"]')
    .fill("123");

  await userPage
    .getByRole("button", {
      name: "Pay now",
    })
    .click();
});

// test("Verify whether expert gets notification about offer and expert can accept offer from manage work page", async ({ browser }) => {
//   const expertContext = await browser.newContext({
//     storageState: "./tests/.auth/expert.json",
//   });
//   const expertPage = await expertContext.newPage();
//     const baseUrl = "https://urxprt.com/en";
//   await expertPage.goto(`${baseUrl}`, { waitUntil: "networkidle" });
//   // const notificationIcon = expertPage.getByRole(//span[normalize-space()='0']

import { test, expect } from "../../fixtures/page.fixture.js";
import PTJPage from "../../pages/part-time-job.page.js";
import { assert } from "node:console";
import { describe } from "node:test";
import credentials from "../../testData/credentials.json";
import fs from "fs";
import path from "path";
import { pageRoutes, PTJPostName } from "../../testData/constants.js";

import { BasePage } from "../../pages/base_page.js";
test.describe.serial("PTJ Flow", () => {
  test("Create a post form validations", async ({
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
    await userPTJPage.fillInput("Job Title", PTJPostName);
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

  test("Search filters return newly created post in results", async ({
    userPage,
    userHomePage,
  }) => {
    await userHomePage.gotoPTJViaCard();

    // await userHomePage.searchOnPTJPage('Frontend Developer');
    const search_box = userPage.getByRole("textbox", { name: "Search PTJ" });
    const search_button = userPage.getByRole("button", { name: "Search" });
    //   await userPage.waitForTimeout(2000);
    await search_box.fill(PTJPostName);
    await search_button.click();

    await userPage.waitForLoadState("networkidle"); // wait for search results to load

    const postNames = await userPage.locator(
      "//div[@class='filter-detail']//h5",
    );
    await postNames.first().waitFor();
    const count = await postNames.count();
    expect(count).toBe(1);
  });

  test("Verify newly created post exist on the part time jobs listing", async ({
    userPage,
    userHomePage,
  }) => {
    await userHomePage.gotoPTJViaCard();
    await expect(userPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
    const postCard = userPage.locator(".filter-detail", {
      hasText: PTJPostName,
    });

    await expect(postCard.getByText("Your post")).toBeVisible();
  });

  test("Applying for post by 'Expert' user", async ({
    expertPage,
    expertHomePage,
  }) => {
    await expertHomePage.gotoPTJViaCard();
    await expect(expertPage).toHaveURL(
      "https://urxprt.com/en/searchall?type=3",
    );
    const postCard = expertPage.locator(".filter-detail", {
      hasText: PTJPostName,
    });
    await expect(postCard).toBeVisible();
    await postCard.click();
    const [newPage] = await Promise.all([
      expertPage.context().waitForEvent("page"),
      postCard.click(),
    ]);

    await newPage.waitForLoadState();

    const newPageObject = new BasePage(newPage);

    const applyButton = newPage.getByRole("button", {
      name: "Apply for job",
      exact: true,
    });
    await applyButton.click();
    await newPage.waitForLoadState("networkidle");
    await newPageObject.fillInputWithPlaceholder(
      "Enter your message",
      "This is a test cover letter for automation",
    );
    await newPageObject.fillInputWithPlaceholder("Enter price in $", "8");
    await newPageObject.uploadFile(
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
        hasText: PTJPostName,
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
      hasText: PTJPostName,
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
    await userPage.waitForTimeout(5000);
  });

  // Making payment for sent offer
  test("Making payment for sent offer", async ({ userPage }) => {
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
      hasText: PTJPostName,
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

    await userPage
      .locator('input[placeholder="Card holder"]')
      .fill("Test User");

    await userPage
      .frameLocator('iframe[title="Security Code CVV"]')
      .locator('input[name="card.cvv"]')
      .fill("123");

    // Click payment submit and wait for redirect
    await Promise.all([
      userPage.waitForURL("**oppwa.com/**"),
      await userPage
        .getByRole("button", {
          name: "Pay now",
        })
        .click(),
    ]);
    await userPage.waitForLoadState("networkidle");

    const payBtn = await userPage.locator('input[value="Pay"]');
    await payBtn.click();
    await userPage.waitForTimeout(3000);
    await expect(
      userPage.getByText("PTJ Payment Completed").first(),
    ).toBeVisible();
  });

  test("Verify whether expert gets notification about offer and expert can accept offer from manage work page", async ({
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
        hasText: PTJPostName,
      },
    );
    await expect(appliedPost).toBeVisible();
    appliedPost.getByRole("button", { name: "View Details" }).click();

    const postNavTabs = expertPage.locator(".nav-tabs");
    const offersTab = postNavTabs.locator("a", {
      hasText: "Offers",
      exact: true,
    });
    await offersTab.click();

    // await expertPage.waitForTimeout(30000);
    await expertPage.getByRole("button", { name: "Accept offer" }).click();
    // await expertPage.getByRole("button", { name: "Accept Offer" });
    // await expertPage.getByRole("button", { name: "Accept Offer" });
    await expertPage.waitForTimeout(1000);

    await expertPage.locator("label[for='agree']").click();

    const scrollToBottomBtn = expertPage
      .locator(".popup-contract-container")
      .locator("button", {
        name: "Scroll to Bottom",
        exact: true,
      });
    await expertPage.waitForTimeout(2000);
    await scrollToBottomBtn.click();
    await expertPage
      .locator(".popup-contract-container")
      .locator("input[id='agree']")
      .click();
    await expertPage.waitForLoadState("networkidle");
    await expertPage.waitForTimeout(2000);

    const acceptOfferButton = expertPage.locator("button", {
      hasText: "Accept & Start Job",
    });
    await acceptOfferButton.click();
    await expertPage.waitForTimeout(5000);
    await expect(
      expertPage.getByText("The Offer Has Been Accepted"),
    ).toBeVisible();
  });

  test("Verify applied job appears at 'Active job' tabs", async ({
    expertHomePage,
    expertPage,
  }) => {
    await expertHomePage.gotoDashboardPage();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");

    const manageWorkTab = expertPage.locator("a", {
      hasText: "Part time Job (PTJ)",
    });
    await manageWorkTab.click();
    const activePost = expertPage.locator("a:has-text('Active jobs')");
    await activePost.click();
    await expect(activePost).toBeVisible();
    await expertPage.waitForLoadState("networkidle");
    await expertPage.waitForTimeout(2000);
    const postCard = expertPage.locator("div.post-back.recent-back").filter({
      hasText: PTJPostName,
    });
    await expect(postCard).toBeVisible();
    await postCard.click();
    await expertPage.waitForTimeout(2000);
  });

  test("Verify 'Log time' button navigates to timesheet", async ({
    expertPage,
    expertHomePage,
  }) => {
    await expertHomePage.gotoDashboardPage();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");

    const manageWorkTab = expertPage.locator("a", {
      hasText: "Part time Job (PTJ)",
    });
    await manageWorkTab.click();
    const activePost = expertPage.locator("a:has-text('Active jobs')");
    await activePost.click();
    await expect(activePost).toBeVisible();
    await expertPage.waitForLoadState("networkidle");
    await expertPage.waitForTimeout(2000);
    const postCard = expertPage.locator("div.post-back.recent-back").filter({
      hasText: PTJPostName,
    });
    await expect(postCard).toBeVisible();
    await postCard.click();
    await expertPage.waitForTimeout(2000);
    const logTimeButton = expertPage.getByRole("button", {
      name: "+ Log time",
    });

    await logTimeButton.click();
    await expertPage.waitForTimeout(2000);
    const postNavTabs = expertPage.locator(".nav-tabs");
    const timesheetTab = postNavTabs.locator("a:has-text('Timesheet')");
    await expect(timesheetTab).toBeVisible();
  });

  test("Logging time for job", async ({ expertPage, expertHomePage }) => {
    await expertPage.goto(`/en/dashboard/managework/jobs/`, {
      waitUntil: "networkidle",
    });
    const activePost = expertPage.locator("a:has-text('Active jobs')");
    await activePost.click();
    await expect(activePost).toBeVisible();
    await expertPage.waitForLoadState("networkidle");

    const postCard = expertPage.locator("div.post-back.recent-back").filter({
      hasText: PTJPostName,
    });
    await expect(postCard).toBeVisible();
    await postCard.click();

    const logTimeButton = expertPage.getByRole("button", {
      name: "+ Log time",
    });
    await logTimeButton.click();

    const timeLogMessage = await expertPage.getByPlaceholder(
      "What have you worked on?",
    );
    await timeLogMessage.fill("This is my first work logging");

    // ---------- START TIME ----------
    await expertPage
      .locator(".form-group")
      .filter({ hasText: "Start Time" })
      .locator(".rs-picker-toggle-wrapper")
      .click();

    const startPopup = expertPage.locator(".rs-picker-popup-date").last();
    await expect(startPopup).toBeVisible();

    const startHour = startPopup.locator('[data-key="hours-10"]');
    await startHour.scrollIntoViewIfNeeded();
    await startHour.click();

    const startMinute = startPopup.locator('[data-key="minutes-30"]');
    await startMinute.scrollIntoViewIfNeeded();
    await startMinute.click();

    await startPopup.getByRole("option", { name: "AM" }).click();
    await startPopup.getByRole("button", { name: "OK" }).click();

    // Wait for start popup to fully close before opening end picker
    await expect(startPopup).toBeHidden();

    // ---------- END TIME ----------
    await expertPage
      .locator(".form-group")
      .filter({ hasText: "End Time" })
      .locator(".rs-picker-toggle-wrapper")
      .click();

    const endPopup = expertPage.locator(".rs-picker-popup-date").last();
    await expect(endPopup).toBeVisible();

    const endHour = endPopup.locator('[data-key="hours-4"]');
    await endHour.scrollIntoViewIfNeeded();
    await endHour.click();

    const endMinute = endPopup.locator('[data-key="minutes-30"]');
    await endMinute.scrollIntoViewIfNeeded();
    await endMinute.click();

    await endPopup.getByRole("option", { name: "PM" }).click();
    await endPopup.getByRole("button", { name: "OK" }).click();

    await expect(endPopup).toBeHidden();

    await expertPage.locator("#date").fill("2026-05-18");
    const totalHours = expertPage
      .locator(".form-group")
      .filter({ hasText: "Total hours" })
      .locator("h6");

    await expect(totalHours).toHaveText("6:00");

    const logTimeBtn = expertPage.getByRole("button", { name: "Log time" });
    await logTimeBtn.click();
    await expertPage.waitForTimeout(2000);
  });

  test("to verify whether pending sheet has logged time in sheet ", async ({
    expertPage,
    expertHomePage,
  }) => {
    await expertPage.goto(`/en/dashboard/managework/jobs/`, {
      waitUntil: "networkidle",
    });
    const activePost = expertPage.locator("a:has-text('Active jobs')");
    await activePost.click();
    await expect(activePost).toBeVisible();
    await expertPage.waitForLoadState("networkidle");

    const postCard = expertPage.locator("div.post-back.recent-back").filter({
      hasText: PTJPostName,
    });
    await expect(postCard).toBeVisible();
    await postCard.click();
    const logTimeButton = expertPage.getByRole("button", {
      name: "+ Log time",
    });
    await logTimeButton.click();

    // Verify "Pending Sheets" tab is active
    const pendingSheetTab = expertPage.locator("button, a", {
      hasText: "Pending Sheets",
    });
    await expect(pendingSheetTab).toHaveClass(/active/);
    const dateUpdated = expertPage.locator("h6", { hasText: "18 May 2026" });
    await expect(dateUpdated).toBeVisible();
    const totalHours = dateUpdated.locator("span", {
      hasText: "Total : 06:00:00",
    });
    await expect(totalHours).toBeVisible;
    // Target the specific row by description text
    const logRow = expertPage.locator("div.mockup-row", {
      hasText: "This is my first work logging",
    });
    await expect(logRow).toBeVisible();

    // Verify description
    await expect(logRow.locator("div.col-md-3 p").first()).toHaveText(
      "This is my first work logging",
    );

    // Verify start and end time (both are inside the same col-md-3 mockup-center div)
    const timeCell = logRow.locator("div.mockup-center");
    await expect(timeCell.locator("p").nth(0)).toHaveText("10:30 AM");
    await expect(timeCell.locator("p").nth(1)).toHaveText("4:30 PM");

    // Verify total worked hours
    await expect(logRow.locator("div.mockup-right h5")).toHaveText("06:00:00");

    // Verify status
    await expect(logRow.locator("p.pending")).toHaveText("Pending");
  });
});

import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, PTJPost_Name } from "../../../testData/constants.js";

import { BasePage } from "../../../pages/base_page.js";
test.describe.serial("PTJ Flow", () => {
  test("TC_001: Create a post form validations", async ({
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
    await userPTJPage.selectDropdown("Preferred Language of Work Submission *", "English");
    await userPTJPage.clickNext();
    await userPTJPage.verifyPTJSummary();
    await userPTJPage.postJob();
    await expect(userPage.getByText("Congratulations! Your post is now live.")).toBeVisible();
  });

  test("TC_002: Search filters return newly created post in results", async ({
    userPage,
    userHomePage,
    userPTJPage
  }) => {
    await userHomePage.gotoPTJViaCard();
    await userPTJPage.searchFor(PTJPost_Name)
    await userPage.waitForLoadState("networkidle"); // wait for search results to load
    const post_names = await userPTJPage.postNames;
    await post_names.first().waitFor();
    await userPage.waitForTimeout(500);
    const count = await post_names.count();
    expect(count).toBe(1);
  });

  test("TC_003: Verify newly created post exist on the part time jobs listing", async ({
    userPage,
    userHomePage,
  }) => {
    await userHomePage.gotoPTJViaCard();
    await expect(userPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
    const postCard = userPage.locator(".filter-detail", { hasText: PTJPost_Name });
    await expect(postCard.getByText("Your post")).toBeVisible();
  });

  test("TC_004: Applying for post by 'company' user", async ({
    expertPage,
    expertHomePage,
    expertPTJPage
  }) => {
    await expertHomePage.gotoPTJViaCard();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/searchall?type=3");
    const newPage = await expertPTJPage.openPost(PTJPost_Name);
    await expertPTJPage.applyForJob(newPage);
    await expertPTJPage.submitProposal(newPage);
    await expertPTJPage.verifyProposalSubmitted(newPage);
  });

  test("TC_005: Verify applied post appears in 'Manage Work' page for 'Company' user", async ({
    expertPage,
    expertHomePage,
  }) => {
    await expertHomePage.gotoDashboardPage();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
    const manageWorkTab = expertPage.locator("a", { hasText: "Part time Job (PTJ)" });
    await manageWorkTab.click();
    const appliedPost = expertPage.locator(".post-back.recent-back.recent-first", { hasText: PTJPost_Name });
    await expect(appliedPost).toBeVisible();
  });

  test("TC_006: Verify applied post appears in 'My Orders' page for 'User' after company applies", async ({
    userPage,
    userHomePage,
    userPTJPage
  }) => {
    await userHomePage.gotoMyOrdersPTJ();
    await userHomePage.openPTJOrder(PTJPost_Name);
    await userPTJPage.openAllProposalsTab();
    await userPTJPage.sendOfferToCompany("Shivakumar GP");
    await userPTJPage.acceptOfferContract();
    await userPage.waitForTimeout(1200);
    await userPTJPage.verifySuccessMessageIsDisplayed("Offer sent successfully")
  });

  test("TC_007: Making payment for sent offer", async ({ 
    userPage, 
    userHomePage, 
    userPTJPage 
  }) => {
    await userPage.goto("/en/dashboard/myorders", { waitUntil: "networkidle" });
    await userHomePage.openPTJPostFromMyOrders();
    await userPTJPage.openProposalForPayment(PTJPost_Name, "Shivakumar GP");
    await userPTJPage.makeProposalPayment();
    await userPTJPage.fillCardDetails();
    await userPTJPage.submitPayment();
    await userPage.waitForTimeout(3000);
    await expect(
      userPage.getByText("PTJ Payment Completed").first(),
    ).toBeVisible();
  });

  test("TC_008: Verify whether company gets notification about offer and company can accept offer from manage work page", async ({
    expertPage,
    expertHomePage,
    expertPTJPage
  }) => {
    await expertHomePage.gotoDashboardPage();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
    await expertPage.locator("a", { hasText: "Part time Job (PTJ)" }).click();
    await expertPTJPage.openManageWorkPost(PTJPost_Name);
    await expertPTJPage.openOffersTab();
    await expertPTJPage.clickAcceptOffer();
    await expertPTJPage.acceptStartJobContract()
    await expertPage.waitForTimeout(5000);
    await expect(
      expertPage.getByText("The Offer Has Been Accepted"),
    ).toBeVisible();
  });

  test("TC_009: Verify applied job appears at 'Active job' tabs", async ({
    expertHomePage,
    expertPage,
    expertPTJPage
  }) => {
    await expertHomePage.openPTJManageWork();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard/managework/jobs");
    await expertPTJPage.openActiveJobsTab();
    await expertPTJPage.verifyActiveJob(PTJPost_Name);
    await expertPTJPage.openActiveJob(PTJPost_Name);
    await expertPage.waitForTimeout(2000);
  });

  test("TC_010: Verify 'Log time' button navigates to timesheet", async ({
    expertPage,
    expertHomePage,
    expertPTJPage
  }) => {
    await expertHomePage.openPTJManageWork();
    await expertPTJPage.openActiveJobsTab();
    await expertPTJPage.openActiveJob(PTJPost_Name);
    await expertPTJPage.clickLogTime();
    await expertPage.waitForTimeout(2000);
    const postNavTabs = expertPage.locator(".nav-tabs");
    const timesheetTab = postNavTabs.locator("a:has-text('Timesheet')");
    await expect(timesheetTab).toBeVisible();
  });

  test("TC_011: Logging time for job", async ({ 
    expertPage, 
    expertHomePage,
    expertPTJPage 
  }) => {
    await expertPage.goto("/en/dashboard/managework/jobs/", {
      waitUntil: "networkidle",
    });
    await expertPTJPage.openActiveJobsTab();
    await expertPTJPage.openActiveJob(PTJPost_Name);
    await expertPTJPage.clickLogTime();
    await expertPTJPage.enterWorkLogDescription(
      "This is my first work logging"
    );
    await expertPTJPage.selectStartTime("10", "30", "AM");
    await expertPTJPage.selectEndTime("4", "30", "PM");
    const current_date = await expertHomePage.getCurrentDate();
    await expertPTJPage.selectWorkDate(current_date);
    await expertPTJPage.verifyTotalHours("6:00");
    await expertPTJPage.clickLogTimeButton();
    await expertPage.waitForTimeout(2000);
  });

  test("TC_012: to verify whether pending sheet has logged time in sheet ", async ({
    expertPage,
    expertHomePage,
    expertPTJPage
  }) => {
    await expertPage.goto("/en/dashboard/managework/jobs/", {
      waitUntil: "networkidle",
    });
    await expertPTJPage.openActiveJobsTab();
    await expertPTJPage.openActiveJob(PTJPost_Name);
    await expertPTJPage.clickLogTime();
    await expertPTJPage.verifyPendingSheetsTab();
    const currentDate = await expertHomePage.getCurrentDate_DMY();
    const dateLocator =
      await expertPTJPage.verifyLoggedDate(
        currentDate
      );
    await expertPTJPage.verifyLoggedHours(
      dateLocator,
      "Total : 06:00:00"
    );
    await expertPTJPage.verifyLogEntry(
      "This is my first work logging",
      "10:30 AM",
      "4:30 PM",
      "06:00:00",
      "Pending"
    );
  });
});

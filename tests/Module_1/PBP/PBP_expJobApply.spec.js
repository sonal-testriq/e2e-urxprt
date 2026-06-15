import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, PBPPostName } from "../../../testData/constants.js";
import { BasePage } from "../../../pages/base_page.js";

test.describe.serial("PBP Flow", () => {
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
      await userPage.waitForTimeout(1000);
      await expect(nextButton).toBeEnabled();
      await nextButton.click();
      await expect(userPage.getByText("Post & Browse Projects (PBP) Summary")).toBeVisible();  
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

    test("TC_PBP_004: Verify Expert User not able to submit proposal", async ({
      expertPage,
      expertHomePage,
      expertPBPPage
    }) => {
      await expertHomePage.gotoPBPViaCard();
      await expect(expertPage).toHaveURL(
        "https://urxprt.com/en/searchall?type=1"
      );
      const newPage = await expertPBPPage.openPost(PBPPostName);
      await expertPBPPage.clickApplyNow(newPage);
      await expertPBPPage.submitProposal(newPage);
      const expectedErrors = [
        "This is required",
        "Proposed price is required",
        "Project duration is required",
        "Select at least one milestone",
      ];
      const actualErrors = await expertPBPPage.getProposalErrors(newPage);
      for (const error of actualErrors) {
        expect(expectedErrors).toContain(error);
      }
    });

    test("TC_PBP_005: Verify Expert User is able to submit proposal", async ({
      expertPage,
      expertHomePage,
      expertPBPPage,
    }) => {
      await expertHomePage.gotoPBPViaCard();
      await expect(expertPage).toHaveURL(
        "https://urxprt.com/en/searchall?type=1"
      );
      const newPage = await expertPBPPage.openPost(PBPPostName);
      const newPageObject = new BasePage(newPage);
      await expertPBPPage.clickApplyNow(newPage);
      await expertPBPPage.fillProposalDetails(
        newPageObject,
        "This is a test cover letter for automation",
        "100",
        "10"
      );
      await expertPBPPage.clickAddUpdate(newPage);
      await expect(newPage.getByRole("heading", { name: "Add / Update Milestones" })).toBeVisible();
      await expertPBPPage.fillMilestone(
        newPage,
        newPageObject,
        "Test Milestone",
        "Weeks",
        "10",
        "10",
        "10%"
      );
      await expertPBPPage.saveMilestone(newPage);
      await expertPBPPage.submitProposal(newPage);
      await expect(newPage.locator(".error")).toHaveText(
        "Total milestone duration cannot exceed total project duration."
      );
      await expertPBPPage.updateProjectDuration(
        newPageObject,
        "100"
      );
      await expertPBPPage.submitProposal(newPage);
      await expect(
        newPage.getByText(
          "Congratulations! Your Proposal has been submitted successfully."
        )
      ).toBeVisible();
    });

    test("TC_PBP_006: Verify applied post appears in 'Manage Work' page for 'Expert' user", async ({
      expertPage,
      expertHomePage,
      expertPBPPage,
    }) => {
      await expertHomePage.gotoDashboardPage();
      await expect(expertPage).toHaveURL(
        "https://urxprt.com/en/dashboard"
      );
      await expertPage.waitForLoadState("networkidle");
      await expertPBPPage.goToPBPManageWork();
      await expertPBPPage.verifyAppliedPost(PBPPostName);
    });

    test("TC_PBP_007: Verify applied post appears in 'My Orders' page for 'User' after expert applies", async ({
      userPage,
      userPBPPage,
    }) => {
      await userPage.goto("/en/dashboard",{ waitUntil: "networkidle"});
      await userPBPPage.goToPostedPBPOrders();
      await userPBPPage.verifyPostedPBPPage();
      await userPBPPage.verifyOrderCard(PBPPostName);
      await userPBPPage.openPostDetails(PBPPostName);
      await userPBPPage.openProposalTab();
      await userPage.waitForTimeout(1000);
      await userPBPPage.sendOffer();
      await userPBPPage.acceptContract();
      await userPage.waitForTimeout(1000);
    });

    test("TC_PBP_008: Making payment for sent offer", async ({
      userPBPPage,
    }) => {
      await userPBPPage.goToMyOrderPBPTab();
      await userPBPPage.verifyPostedPBPPage();
      await userPBPPage.verifyOrderCard(PBPPostName);
      await userPBPPage.openPostDetails(PBPPostName);
      await userPBPPage.openProposalTab();
      await userPBPPage.clickPaymentButton();
      await userPBPPage.proceedForPayment();
      await userPBPPage.fillCardDetails();
      await userPBPPage.clickPayNow();
      await userPBPPage.completePayment();
      await userPBPPage.verifyPaymentSuccess();
    });

    test("TC_PBP_009: Verify whether expert gets notification about offer and expert can accept offer from manage work page", async ({
      expertPage,
      expertHomePage,
      expertPBPPage,
    }) => {
      await expertHomePage.gotoDashboardPage();
      await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
      await expertPage.waitForLoadState("networkidle");
      await expertPBPPage.goToPBPManageWork();
      await expertPBPPage.verifyAppliedPost(PBPPostName);
      await expertPBPPage.viewDetailsOfPBPPost(PBPPostName);
      await expertPBPPage.openOffersTab();
      await expertPBPPage.acceptOffer();
      await expertPBPPage.acceptOfferAgreement();
      await expertPage.waitForTimeout(1000);
      await expertPBPPage.verifyOfferAccepted();
    });

    test("TC_PBP_010: Verify applied job appears at 'Active job' tabs", async ({
      expertHomePage,
      expertPage,
      expertPBPPage,
    }) => {
      await expertHomePage.gotoDashboardPage();
      await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
      await expertPage.waitForLoadState("networkidle");
      await expertPBPPage.goToActivePBPPostInPBPManageWork();
      await expertPage.waitForLoadState("networkidle");
      await expertPage.waitForTimeout(2000);
      await expertPBPPage.verifyPostIsPresentInPBPManageWork(PBPPostName);
    });

    test("TC_PBP_011: Verify without submitting the work, User is able to review In Progress work and View Sumbission is not available", async ({
      userPBPPage,
    }) => {
      await userPBPPage.goToMyOrderPBPTab();
      await userPBPPage.verifyPostIsPresentInActivePBPPost(PBPPostName);
      await userPBPPage.viewDetailsOfPBPPost(PBPPostName);
      await userPBPPage.openMilestoneTab();
      await userPBPPage.verifyWorkInProgress();
      await userPBPPage.verifySubmissionButtonNotVisible();
    });

    test("TC_PBP_012: Verify Expert is able to submit work for payment", async ({
      expertHomePage,
      expertPage,
      expertPBPPage,
    }) => {
      await expertHomePage.gotoDashboardPage();
      await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
      await expertPage.waitForLoadState("networkidle");
      await expertPBPPage.goToActivePBPPostInPBPManageWork();
      await expertPage.waitForLoadState("networkidle");
      await expertPage.waitForTimeout(1000);
      await expertPBPPage.verifyPostIsPresentInPBPManageWork(PBPPostName);
      await expertPBPPage.viewDetailsOfPBPPost(PBPPostName);
      await expertPBPPage.clickSubmitWorkForPayment();
      await expertPBPPage.verifySubmitWorkPopup();
      await expertPBPPage.fillInputWithPlaceholder("Enter description here", "This is a test submission for automation");
      await expertPBPPage.uploadWork("testData/sampleImg.jpg");
      await expertPBPPage.submitWork();
      await expertPage.waitForTimeout(1000);
      await expertPBPPage.verifyWorkSubmissionSuccess();
    });

    test("TC_PBP_013: Verify Expert is able to view its submitted work", async ({
      expertHomePage,
      expertPage,
      expertPBPPage
    }) => {
      await expertHomePage.gotoDashboardPage();
      await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
      await expertPage.waitForLoadState("networkidle");
      await expertPBPPage.goToActivePBPPostInPBPManageWork();
      await expertPage.waitForLoadState("networkidle");
      await expertPage.waitForTimeout(1000);
      await expertPBPPage.verifyPostIsPresentInPBPManageWork(PBPPostName);
      await expertPBPPage.viewDetailsOfPBPPost(PBPPostName);
      await expertPBPPage.openSubmissionTab();
      await expect(expertPBPPage.overview_submission_tab).toBeVisible();
      await expertPBPPage.closeSubmissionTab();
      await expect(expertPBPPage.overview_submission_tab).toBeHidden();
    });
      
    test("TC_PBP_014: Verify user is able to review work, view submission, and Approve Submission", async ({ 
      userPBPPage 
    }) => {
      await userPBPPage.goToMyOrderPBPTab();
      await userPBPPage.verifyPostIsPresentInActivePBPPost(PBPPostName);
      await userPBPPage.viewDetailsOfPBPPost(PBPPostName);
      await userPBPPage.view_milestone.click();
      await userPBPPage.submit_work.click();
      await expect(userPBPPage.submission_tab).toBeVisible();
      await userPBPPage.approveSubmission()
      await userPBPPage.verifyUserIsAbleToSeeStatusAsComplete();
      await userPBPPage.goToMilestoneTab();
      await expect(userPBPPage.project_complete_status).toBeVisible();
    })
});
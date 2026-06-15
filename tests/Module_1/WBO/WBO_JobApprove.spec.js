import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes } from "../../../testData/constants.js";


let wboName = "";
test.describe.serial("WBO Job Approval Flow", () => {
    test.beforeAll(async ({ 
      userHomePage, 
      userWBOPage 
    }) => {
      await userHomePage.gotoMyOrdersWBO();
      wboName = await userWBOPage.getDelayedPostName(2);
    })

    test.beforeEach(async () => {
        test.skip(!wboName, 'No matching delayed post found');
    });

    test("TC_WBO_001: Verify user is able to view Award Content on both 'Expert' and 'Company' entries", async ({
        userPage,
        userHomePage,
        userWBOPage
      }) => {
        await userHomePage.gotoMyOrdersWBO();
        await expect(
          userPage.getByRole("heading", { name: wboName, exact: true })
        ).toBeVisible();
        await userWBOPage.openWBOOrder(wboName);
        await userWBOPage.openEntriesTab();

        await userWBOPage.selectEntryOfUser("GP");
        await userWBOPage.verifyCommentPopup();
        await userWBOPage.verifyAwardContestButton();
        await userWBOPage.closeCommentPopup();
        await userWBOPage.verifyCommentPopupClosed();

        await userWBOPage.selectEntryOfUser("Padaiyachi");
        await userWBOPage.verifyCommentPopup();
        await userWBOPage.verifyAwardContestButton();
        await userWBOPage.closeCommentPopup();
        await userWBOPage.verifyCommentPopupClosed();
    });

    test("TC_WBO_002: Verify user is able to Award Content to 'Expert' entries", async ({
        userPage,
        userHomePage,
        userWBOPage
      }) => {
        await userHomePage.gotoMyOrdersWBO();
        await expect(
          userPage.getByRole("heading", { name: wboName, exact: true })
        ).toBeVisible();
        await userWBOPage.openWBOOrder(wboName);
        await userWBOPage.openEntriesTab();

        await userWBOPage.selectEntryOfUser("GP");
        await userWBOPage.verifyCommentPopup();
        await userWBOPage.clickAwardContest();

        await userWBOPage.acceptAwardContract();
        await userWBOPage.verifyWinnerSelected();
    });

    test("TC_WBO_003: Verify awarded comments appears in 'Notification' for 'Expert' user", async ({
        expertPage,
        expertHomePage,
      }) => {
        await expertPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
        await expertHomePage.hoverOverNotifivationIcon(); 
        const notificationMsg = await expertPage.locator("//h6[normalize-space()='Congratulations! You have been awarded: " + wboName + "']").first();
        await expect(notificationMsg).toBeVisible();
        await notificationMsg.click();
        const congratulationsMsg = await expertPage.locator("//h6[contains(text(),'You Won, Upload Documents')]");
        await expect(congratulationsMsg).toBeVisible();
    });

    test("TC_WBO_004: Verify Expert user is able to submit the files for award", async ({
        expertPage,
        expertHomePage,
        expertWBOPage
      }) => {
        await expertHomePage.gotoDashboardPage();
        await expect(expertPage).toHaveURL(
          "https://urxprt.com/en/dashboard"
        );
        await expertPage.waitForLoadState("networkidle");
        await expertPage.getByText("Win business Opportunities (WBO)", { exact: true }).click();
        await expertWBOPage.openManageWorkPost(wboName);
        await expertWBOPage.openHandoverTab();
        await expertWBOPage.uploadHandoverFile("testData/sampleImg.jpg");
        await expertWBOPage.verifyUploadedFile(expertPage);
        await expertWBOPage.clickSubmitFiles();
        await expertWBOPage.verifyAwaitingReviewMessage();
    });
    
    test("TC_WBO_005: Verify user is able to see successfully handed file comments in 'Notification'", async ({
        userPage,
        userHomePage,
      }) => {
        await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
        await userHomePage.hoverOverNotifivationIcon(); 
        const notificationMsg = await userPage.locator("//h6[normalize-space()='Files for " + wboName + " have been successfully handed over to the WBO owner.']").first();
        await expect(notificationMsg).toBeVisible();
        await notificationMsg.click();
        const congratulationsMsg = await userPage.locator("//h6[contains(text(),'Review the Submitted Documents')]");
        await expect(congratulationsMsg).toBeVisible();
    });

    test("TC_WBO_006: Verify User user is able to Approve the submitted files", async ({
        userPage,
        userHomePage,
        userWBOPage
      }) => {
        await userHomePage.gotoMyOrdersWBO();
        await expect(userPage.getByRole("heading", { name: wboName, exact: true })).toBeVisible();
        await userWBOPage.openWBOOrder(wboName);
        await userWBOPage.openHandoverTab();
        await userWBOPage.clickApproveSubmission();
        await userWBOPage.verifyAcceptDocumentsPopup();
        await userWBOPage.confirmSubmissionApproval();
        await userWBOPage.verifySubmissionAccepted();
    });

    test("TC_WBO_007: Verify submitted proposal approve notification is visible for 'Expert' user", async ({
      expertPage,
      expertHomePage,
    }) => {
      await expertPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
      await expertHomePage.hoverOverNotifivationIcon(); 
      const notificationMsg = await expertPage.locator("//h6[normalize-space()='The files for the proposal " + wboName + " have been approved, and the payment has been successfully received.']").first();
      await expect(notificationMsg).toBeVisible();
    });

});


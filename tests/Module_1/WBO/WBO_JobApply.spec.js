import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, WBOPostName } from "../../../testData/constants.js";
import { BasePage } from "../../../pages/base_page.js";

test.describe.serial("WBO Flow", () => {
    test("TC_WBO_001: Verify create post from WBO page", async ({
      userPage,
      userHomePage,
      userWBOPage,
      }) => {
        await userHomePage.gotoWBOViaCard();
        await userWBOPage.clickOnCreateAPostButton();
        await expect(userPage).toHaveURL(/.*\/createpost/);
        await userWBOPage.fillInput("Write a title for your post this ", WBOPostName);
        await userWBOPage.selectDropdown("Select Industries *", "Business");
        await userWBOPage.selectDropdown("Select Category *", "Managing and Consultant");
        await userWBOPage.selectDropdown("Select Sub Category", "Project Management");
        await userWBOPage.fillInput("Prize money *", "10");
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${
          String(today.getMonth() + 1).padStart(2, "0")}-${
          String(today.getDate()).padStart(2, "0")
        }`;
        await userWBOPage.fillInput("Last date of entry *", formattedDate);
        await userWBOPage.fillRichTextEditor("Win business Opportunities (WBO) Description *", "This is a test description for automation");
        await userPage.waitForTimeout(1000);
        await userWBOPage.clickNext();
        await userWBOPage.selectMultiDropdown("Select competencies", ["Branding", "Campaigns"]);
        await userWBOPage.clickNext();
        await expect(userWBOPage.required_competencies_error).toBeVisible();
        await userWBOPage.selectCRMSkill();
        await userWBOPage.clickNext();
        await userWBOPage.clickNext();
        await userWBOPage.expected_deliverables_input.fill("This is test deliverable");
        await userWBOPage.selectDropdown("Preferred Language of Work Submission *", "English");
        await userPage.waitForTimeout(1000);
        await userWBOPage.clickNext();
        await expect(userPage.getByText("Win business Opportunities (WBO) Summary")).toBeVisible();  
        await userWBOPage.clickPostContest();
        await userHomePage.proceedToPayment();
        await userHomePage.enterCardDetails("5555555555554444", "12 / 30", "Test User", "123");
        await userHomePage.completePayment();
        await userPage.waitForTimeout(1000);
        await expect(userPage.getByText("WBO Payment Completed").first()).toBeVisible();
    });

    test("TC_WBO_002: Search filters return newly created post in results", async ({
      userPage,
      userHomePage,
      userWBOPage
    }) => {
      await userHomePage.gotoWBOViaCard();
      await userWBOPage.searchFor(WBOPostName);
      await userPage.waitForLoadState("networkidle");
      const post_names = await userWBOPage.postNames;
      await post_names.first().waitFor();
      const count = await post_names.count();
      expect(count).toBe(1);
    });

    test("TC_WBO_003: Verify newly created post are displayed in My Orders under Posted Posts", async ({
    userHomePage,
    }) => {
        await userHomePage.gotoWBOViaCard();
        await userHomePage.navigateToMyOrdersViaPreview();
        await userHomePage.openWBOPostFromMyOrders();
        await expect(userHomePage.post_contest_name_in_all_active_wbo.first()).toHaveText(WBOPostName);
    })

    test("TC_WBO_004: Verify Expert User not able to submit entry", async ({
        expertPage,
        expertHomePage,
        expertWBOPage
      }) => {
        await expertHomePage.gotoWBOViaCard();
        await expect(expertPage).toHaveURL(
          "https://urxprt.com/en/searchall?type=2"
        );
        const newPage = await expertWBOPage.openPost(WBOPostName);
        await expertWBOPage.clickSubmitEntry(newPage);
        await newPage.waitForLoadState("networkidle");
        await expertWBOPage.clickSubmitEntry(newPage);
        await expertWBOPage.verifyEntryValidationErrors(newPage);
    });

    test("TC_WBO_005: Verify Expert User is able to submit entry", async ({
      expertPage,
      expertHomePage,
      expertWBOPage
    }) => {
      await expertHomePage.gotoWBOViaCard();
      await expect(expertPage).toHaveURL(
          "https://urxprt.com/en/searchall?type=2",
      );
      const newPage = await expertWBOPage.openPost(WBOPostName);
      await expertWBOPage.clickSubmitEntry(newPage);
      await newPage.waitForLoadState("networkidle");
      await expertWBOPage.uploadEntryFile(
        newPage,
        "testData/sampleImg.jpg"
      );
      await expertWBOPage.verifyUploadedFile(newPage);
      await expertWBOPage.fillEntryDetails(
        newPage,
        "This is a test title for automation",
        "This is a test description for automation"
      );
      await expertWBOPage.acceptEntryDeclaration(newPage);
      await expertWBOPage.clickSubmitEntry(newPage);
      await expertWBOPage.acceptContract_expert(newPage);
      await expect(newPage.getByText("Congratulations! Your Entry has been submitted successfully.")).toBeVisible();
    });

    test("TC_WBO_006: Verify submitted entry appears in 'Manage Work' page for 'Expert' user", async ({
      expertPage,
      expertHomePage,
    }) => {
      await expertHomePage.gotoDashboardPage();
      await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
      await expertPage.waitForLoadState("networkidle");
      const manageWorkTab = expertPage.getByText('Win business Opportunities (WBO)', { exact: true });
      await manageWorkTab.click();
      const appliedPost = expertPage.locator(".post-back", { hasText: WBOPostName });
      await expect(appliedPost).toBeVisible();
    });

    test("TC_WBO_007: Verify submitted entry appears in 'My Orders' page for 'User' after expert submits", async ({
      userPage,
      userHomePage,
      userWBOPage
    }) => {
      await userHomePage.gotoMyOrdersWBO();
      await expect(userPage.locator("h4", { hasText: "All Active Win business Opportunities (WBO)" })).toBeVisible();
      await expect(userPage.locator("h3", { hasText: WBOPostName })).toBeVisible();
      await userWBOPage.openWBOOrder(WBOPostName);
      await userWBOPage.openEntriesTab();
      await userWBOPage.verifyExpertEntry("Shivakumar GP");
    });

    test("TC_WBO_008: Verify Company User is able to submit entry", async ({
      companyPage,
      companyHomePage,
      companyWBOPage
    }) => {
      await companyHomePage.gotoWBOViaCard();
      await expect(companyPage).toHaveURL(
          "https://urxprt.com/en/searchall?type=2",
      );
      const newPage = await companyWBOPage.openPost(WBOPostName);
      await companyWBOPage.clickSubmitEntry(newPage);
      await newPage.waitForLoadState("networkidle");
      await companyWBOPage.uploadEntryFile(
        newPage,
        "testData/sampleImg.jpg"
      );
      await companyWBOPage.verifyUploadedFile(newPage);
      await companyWBOPage.fillEntryDetails(
        newPage,
        "This is a test title for automation",
        "This is a test description for automation"
      );
      await companyWBOPage.acceptEntryDeclaration(newPage);
      await companyWBOPage.clickSubmitEntry(newPage);
      await companyWBOPage.acceptContract_expert(newPage);
      await expect(newPage.getByText("Congratulations! Your Entry has been submitted successfully.")).toBeVisible();
    });

    test("TC_WBO_009: Verify submitted entry appears in 'Manage Work' page for 'Company' user", async ({
        companyPage,
        companyHomePage,
      }) => {
        await companyHomePage.gotoDashboardPage();
        await expect(companyPage).toHaveURL("https://urxprt.com/en/dashboard");
        await companyPage.waitForLoadState("networkidle");
        const manageWorkTab = companyPage.getByText('Win business Opportunities (WBO)', { exact: true });
        await manageWorkTab.click();
        const appliedPost = companyPage.locator(".post-back", { hasText: WBOPostName });
        await expect(appliedPost).toBeVisible();
    });

    test("TC_WBO_010: Verify submitted entry appears in 'My Orders' page for 'User' after company submits", async ({
        userPage,
        userHomePage,
        userWBOPage
      }) => {
        await userHomePage.gotoMyOrdersWBO();
        await expect(userPage.locator("h4", { hasText: "All Active Win business Opportunities (WBO)" })).toBeVisible();
        await expect(userPage.locator("h3", { hasText: WBOPostName })).toBeVisible();
        await userWBOPage.openWBOOrder(WBOPostName);
        await userWBOPage.openEntriesTab();
        await userWBOPage.verifyCompanyEntry("Shivakumar Padaiyachi");
    });

    test("TC_WBO_011: Verify user is able to view and add comments on both 'Expert' and 'Company' entries", async ({
        userHomePage,
        userWBOPage,
      }) => {
        const comment = "This is a test comment";
        await userHomePage.gotoMyOrdersWBO();
        await userWBOPage.openWBOOrder(WBOPostName);
        await userWBOPage.openEntriesTab();

        await userWBOPage.selectEntryOfUser("GP");
        await userWBOPage.verifyCommentPopup();
        await userWBOPage.submitComment(comment);
        await userWBOPage.verifyComment(comment);
        await userWBOPage.closeCommentPopup();
        await userWBOPage.verifyCommentPopupClosed();

        await userWBOPage.selectEntryOfUser("Padaiyachi");
        await userWBOPage.verifyCommentPopup();
        await userWBOPage.submitComment(comment);
        await userWBOPage.verifyComment(comment);
        await userWBOPage.closeCommentPopup();
        await userWBOPage.verifyCommentPopupClosed();
    });

    test("TC_WBO_012: Verify comments appears in 'Notification' for 'Expert' user", async ({
        expertPage,
        expertHomePage,
      }) => {
        await expertPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
        await expertHomePage.hoverOverNotifivationIcon(); 
        const notificationMsg = await expertPage.locator("//h6[normalize-space()='New comment on your WBO entry: " + WBOPostName + "']").first();
        await expect(notificationMsg).toBeVisible();
    });

    test("TC_WBO_013: Verify comments appears in 'Notification' for 'Company' user", async ({
        companyPage,
        companyHomePage,
      }) => {
        await companyPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
        await companyHomePage.hoverOverNotifivationIcon(); 
        const notificationMsg = await companyPage.locator("//h6[normalize-space()='New comment on your WBO entry: " + WBOPostName + "']").first();
        await expect(notificationMsg).toBeVisible();
    });

});
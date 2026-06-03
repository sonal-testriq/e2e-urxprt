import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes } from "../../../testData/constants.js";
const fs = require('fs');


let wboName = "";
test.describe.serial("WBO Job Approval Flow", () => {
    test.beforeAll(async ({ userPage, userWBOPage }) => {
      await userPage.goto(`/en/dashboard`, { waitUntil: "networkidle" });
        const manageOrderTab = userPage.locator("a", {
          hasText: "My Orders",
        });
        await manageOrderTab.click();
        const orderTabs = userPage
          .locator("#MyOrderPostedorders")
          .locator(".order-tabs");
    
        const WBOTab = orderTabs.locator("a", {
          hasText: "Win business Opportunities (WBO)",
          exact: false,
        });
        await WBOTab.click();
        const tabContent = userPage.locator(".tab-content");
        const PostedWBO = tabContent.locator("h4", {
          hasText: "All Active Win business Opportunities (WBO)",
        });
        await expect(PostedWBO).toBeVisible();
        wboName = await userWBOPage.getDelayedPostName(2);
    })

    test.beforeEach(async () => {
        test.skip(!wboName, 'No matching delayed post found');
    });

    test("TC_WBO_001: Verify user is able to view Award Content on both 'Expert' and 'Company' entries", async ({
        userPage,
        userWBOPage,
      }) => {
        await userPage.goto(`/en/dashboard`, { waitUntil: "networkidle" });
        const manageOrderTab = userPage.locator("a", {
          hasText: "My Orders",
        });
        await manageOrderTab.click();
        const orderTabs = userPage
          .locator("#MyOrderPostedorders")
          .locator(".order-tabs");
    
        const WBOTab = orderTabs.locator("a", {
          hasText: "Win business Opportunities (WBO)",
          exact: false,
        });
        await WBOTab.click();
        const tabContent = userPage.locator(".tab-content");
        const PostedWBO = tabContent.locator("h4", {
          hasText: "All Active Win business Opportunities (WBO)",
        });
        await expect(PostedWBO).toBeVisible();
        console.log("WBO Name: " + wboName);
        const orderCard = userPage.getByRole('heading', {
          name: wboName,
          exact: true
        });
        await expect(orderCard).toBeVisible();
        await userPage.locator("//h3[text()='" + wboName + "']/parent::div/following-sibling::button").click();
        const postNavTabs = userPage.locator(".nav-tabs");
        const entriesTab = postNavTabs.locator("a", {
          hasText: "Entries",
          exact: false,
        });
        await entriesTab.click();
        await userWBOPage.selectEntryOfUser("GP");
        await expect(userPage.locator(".rent-product")).toBeVisible();
        await userPage.waitForTimeout(2000);
        const awardContestBtn = await userPage.locator("//button[contains(.,'Award Contest')]");
        await expect(awardContestBtn).toBeVisible();
        await expect(awardContestBtn).toBeEnabled();
        const closeButton = userPage.locator(".rent-product .btn img");
        await closeButton.click();
        await expect(userPage.locator(".rent-product")).not.toBeVisible();
        await userWBOPage.selectEntryOfUser("Padaiyachi");
        await expect(userPage.locator(".rent-product")).toBeVisible();
        await userPage.waitForTimeout(2000);
        await expect(awardContestBtn).toBeVisible();
        await expect(awardContestBtn).toBeEnabled();  
        await closeButton.click();
        await expect(userPage.locator(".rent-product")).not.toBeVisible();
    });

    test("TC_WBO_002: Verify user is able to Award Content to 'Expert' entries", async ({
        userPage,
        userWBOPage,
      }) => {
        await userPage.goto(`/en/dashboard`, { waitUntil: "networkidle" });
        const manageOrderTab = userPage.locator("a", {
          hasText: "My Orders",
        });
        await manageOrderTab.click();
        const orderTabs = userPage
          .locator("#MyOrderPostedorders")
          .locator(".order-tabs");
    
        const WBOTab = orderTabs.locator("a", {
          hasText: "Win business Opportunities (WBO)",
          exact: false,
        });
        await WBOTab.click();
        const tabContent = userPage.locator(".tab-content");
        const PostedWBO = tabContent.locator("h4", {
          hasText: "All Active Win business Opportunities (WBO)",
        });
        await expect(PostedWBO).toBeVisible();
        const orderCard = userPage.getByRole('heading', {
          name: wboName,
          exact: true
        });
        await expect(orderCard).toBeVisible();
        await userPage.locator("//h3[text()='" + wboName + "']/parent::div/following-sibling::button").click();
        const postNavTabs = userPage.locator(".nav-tabs");
        const entriesTab = postNavTabs.locator("a", {
          hasText: "Entries",
          exact: false,
        });
        await entriesTab.click();
        await userWBOPage.selectEntryOfUser("GP");
        await expect(userPage.locator(".rent-product")).toBeVisible();
        await userPage.waitForTimeout(2000);
        const awardContestBtn = await userPage.locator("//button[contains(.,'Award Contest')]");
        await expect(awardContestBtn).toBeVisible();
        await awardContestBtn.click();
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
          hasText: "Accept and Award Winner",
        });
        await acceptOfferButton.click();
        const winnerChoosenMsg = await userPage.locator("//h6[contains(text(),'Winner has been chosen. Waiting for Submission')]");
        await expect(winnerChoosenMsg).toBeVisible();
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
      }) => {
        await expertHomePage.gotoDashboardPage();
        await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
        await expertPage.waitForLoadState("networkidle");
        const manageWorkTab = expertPage.getByText('Win business Opportunities (WBO)', { exact: true });
        await manageWorkTab.click();
        const appliedPost = expertPage.locator('.post-back').filter({
            has: expertPage.locator(`h3:text-is("${wboName}")`)
        });
        await expect(appliedPost).toBeVisible();
        await expertPage.locator("//h3[text()='" + wboName + "']/parent::div/following-sibling::button").click();
        const postNavTabs = expertPage.locator(".nav-tabs");
        const handoverTab = postNavTabs.locator("a", {
          hasText: "Handover",
          exact: true,
        });
        await handoverTab.click();
        await expertPage.locator('input[type="file"]').setInputFiles('testData/sampleImg.jpg');
        await expect(expertPage.locator("//img[@alt='Delete']")).toBeVisible();
        const submitWorkButton = expertPage.getByRole("button", {
          name: "Submit files",
          exact: true,
        });
        await submitWorkButton.click();
        const awaitingMessage = await expertPage.locator("//h6[contains(text(),'Awaiting Review of Submitted Documents')]");
        await expect(awaitingMessage).toBeVisible();
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
      }) => {
        await userPage.goto(`/en/dashboard`, { waitUntil: "networkidle" });
        const manageOrderTab = userPage.locator("a", {
          hasText: "My Orders",
        });
        await manageOrderTab.click();
        const orderTabs = userPage
          .locator("#MyOrderPostedorders")
          .locator(".order-tabs");
    
        const WBOTab = orderTabs.locator("a", {
          hasText: "Win business Opportunities (WBO)",
          exact: false,
        });
        await WBOTab.click();
        const tabContent = userPage.locator(".tab-content");
        const PostedWBO = tabContent.locator("h4", {
          hasText: "All Active Win business Opportunities (WBO)",
        });
        await expect(PostedWBO).toBeVisible();
        const orderCard = userPage.getByRole('heading', {
          name: wboName,
          exact: true
        });
        await expect(orderCard).toBeVisible();
        await userPage.locator("//h3[text()='" + wboName + "']/parent::div/following-sibling::button").click();
        const postNavTabs = userPage.locator(".nav-tabs");
        const handoverTab = postNavTabs.locator("a", {
          hasText: "Handover",
          exact: true,
        });
        await handoverTab.click();
        const approveButton = await userPage.locator("//button[contains(text(),'Approve Submission')]");
        await expect(approveButton).toBeVisible();
        await approveButton.click();
        const confirmationMessage = await userPage.locator("//h6[contains(text(),'Accept Documents and Files')]");
        await expect(confirmationMessage).toBeVisible();
        await userPage.locator("//button[contains(text(),'YES')]").click();
        const acceptedMessage = await userPage.locator("//h6[contains(text(),'Submission Accepted - Congratulations')]");
        await expect(acceptedMessage).toBeVisible();
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


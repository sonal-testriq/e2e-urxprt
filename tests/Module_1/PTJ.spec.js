import { test, expect } from "../../fixtures/page.fixture.js";
import PTJPage from "../../pages/part-time-job.page";
import { assert } from "node:console";
import { describe } from "node:test";
import credentials from "../../testData/credentials.json";
import fs from "fs";
import path from "path";
import { pageRoutes, PTJPostName } from "../../testData/constants.js";

import { BasePage } from "../../pages/base_page.js";

test.describe.serial("PTJ Flow", () => {
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
    const postNames = await userPage.locator(
      "//div[@class='filter-detail']//h5",
    );
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
    await expect(saved_post).toContainText("UI designer");
  });

  test("Apply multiple filters and verify counts update correctly", async ({
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

  test("logging one more entry for previous day", async ({
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

    const timeLogMessage = await expertPage.getByPlaceholder(
      "What have you worked on?",
    );
    await timeLogMessage.fill("This is my second work logging");

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

    await expertPage.locator("#date").fill("2026-05-16");
    const totalHours = expertPage
      .locator(".form-group")
      .filter({ hasText: "Total hours" })
      .locator("h6");

    await expect(totalHours).toHaveText("6:00");

    const logTimeBtn = expertPage.getByRole("button", { name: "Log time" });
    await logTimeBtn.click();
    await expertPage.waitForTimeout(2000);
  });
  test("Approving logged job by doing check action", async ({
    userPage,
    userHomePage,
  }) => {
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
    const activePTJ = tabContent.locator("h4", {
      hasText: "Active Part time Job (PTJ)",
    });
    await expect(activePTJ).toBeVisible();
    const orderCard = userPage.locator("h3", {
      hasText: PTJPostName,
    });
    await expect(orderCard).toBeVisible();
    await orderCard.click();
    const postNavTabs = userPage.locator(".nav-tabs");
    const timesheetTab = postNavTabs.locator("a", {
      hasText: "Timesheet",
      exact: true,
    });
    await timesheetTab.click();
    const approveByCheck = userPage.locator(".d-flex > a:nth-child(2)").first();
    await approveByCheck.click();
    await userPage.waitForTimeout(2000);
  });
  test.only("Approving logged job by using 'Approve all' button", async ({
    userPage,
    userHomePage,
  }) => {
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
    const activePTJ = tabContent.locator("h4", {
      hasText: "Active Part time Job (PTJ)",
    });
    await expect(activePTJ).toBeVisible();
    const orderCard = userPage.locator("h3", {
      hasText: PTJPostName,
    });
    await expect(orderCard).toBeVisible();
    await orderCard.click();
    const postNavTabs = userPage.locator(".nav-tabs");
    const timesheetTab = postNavTabs.locator("a", {
      hasText: "Timesheet",
      exact: true,
    });
    await timesheetTab.click();
    const logRow = userPage.locator("div.mockup-row");

    const approveAllBtn = userPage.locator("button", {
      hasText: "Approve all",
      exact: false,
    });
    await approveAllBtn.click();

    await expect(logRow.locator("p.pending")).toHaveText("Approved");
  });
});

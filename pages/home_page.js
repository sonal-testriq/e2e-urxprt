import { expect } from "@playwright/test";
import { BasePage } from "./base_page.js";
import { pageRoutes } from "../testData/constants.js";

export default class HomePage extends BasePage {
  constructor(page) {
    super(page);

    this.ptj_link_on_homepage = page.locator(
      "a:has-text('Find Part time Job (PTJ)')",
    );
    this.pbp_link_on_homepage = page
      .locator(".welcomepage")
      .locator("a:has-text('Find Post & Browse Projects (PBP)')");

    this.wbo_link_on_homepage = page
      .locator(".welcomepage")
      .locator("a:has-text('Explore Win business Opportunities (WBO)')");

    this.BSM_link_on_homepage = page
      .locator(".welcomepage")
      .locator("a:has-text('Explore buy & sell')");
    this.TAI_link_on_homepage = page
      .locator(".welcomepage")
      .locator("a:has-text('Let’s get started')")
      .first();

    this.logo = page.locator("//div[@class='logo']");
    this.part_time_jobs_tab = page.locator(
      "//li/a[contains(text(),'Part-Time Jobs')]",
    );
    this.part_time_jobs_dropdown = this.part_time_jobs_tab.locator(
      "//following-sibling::div",
    );
    this.pbp_link_in_dropdown = this.part_time_jobs_dropdown.locator(
      "//a[contains(text(),'PBP')]",
    );
    this.ptj_link_in_dropdown = this.part_time_jobs_dropdown.locator(
      "//a[contains(text(),'PTJ')]",
    );
    this.OTS_tab = page.locator("//li/a[contains(text(),'Find OTS')]");
    this.OTS_dropdown = this.OTS_tab.locator("//following-sibling::div");
    this.BSM_link_in_dropdown = this.OTS_dropdown.locator(
      "//a[contains(text(),'BSM')]",
    );
    this.TAI_link_in_dropdown = this.OTS_dropdown.locator(
      "//a[contains(text(),'TAI')]",
    );
    this.MAS_link_in_dropdown = this.OTS_dropdown.locator(
      "//a[contains(text(),'MAS')]",
    );
    this.find_expert_tab = page.locator(
      "//li/a[contains(text(),'Find Experts')]",
    );
    this.find_expert_dropdown = this.find_expert_tab.locator(
      "//following-sibling::div",
    );
    this.create_a_post_in_dropdown =
      this.find_expert_dropdown.locator("//button");
    this.select_service_type_popup = page.locator(
      "//h2[contains(text(),'Select a service type')]",
    );
    this.pbp_option_in_service_type = page.getByRole("button", {
      name: "Post & Browse Projects (PBP)",
    });

    this.profile_dropdown = page.getByRole("button", { name: "preview" });
    this.profile_options = page.locator(
      "//div[contains(@class,'mobile-menu-header')]",
    );
    this.dashboard_button = page.locator("//a[contains(text(),'Dashboard')]");
    this.preview_button = page.getByRole("button", { name: "preview" });
    this.my_orders_button = page.getByText("My Orders");
    this.pbp_orders = page.locator(
      "//div[@id='MyOrderPostedorders']//a[contains(text(),'Post & Browse Project')]",
    );
    this.wbo_orders = page.locator(
      "//div[@id='MyOrderPostedorders']//a[contains(text(),'Win business Opportunities')]",
    );
    this.ptj_orders = page.locator(
      "//div[@id='MyOrderPostedorders']//a[contains(text(),'Part time Job')]",
    );
    this.postNamesOnMyOrders = page.locator(
      "//h4[contains(text(),'Posted Post')]/parent::div/following-sibling::div//h3",
    );
    this.post_contest_name_in_pending_payment_contest = page.locator(
      "(//h4[contains(text(),'Payment Pending Contest')]/parent::div/following-sibling::div)[1]//h3",
    );
    this.post_contest_name_in_all_active_wbo = page.locator(
      "(//h4[contains(text(),'All Active Win business Opportunities')]/parent::div/following-sibling::div)[1]//h3",
    );
    this.post_job_name_in_part_time_job = page.locator(
      "(//h4[contains(text(),'Posted Part time Job')]/parent::div/following-sibling::div)[1]//h1/parent::div//h3",
    );
    this.notification_icon = page.locator('img[src*="bell.svg"]');
  }

  async navigateToPartTimeJobsFromHomepage() {
    await this.ptj_link_on_homepage.click();
  }

  async gotoHomepage() {
    await this.logo.click();
  }

  async navigateToPBPViaDropdown() {
    await this.part_time_jobs_tab.hover();
    await expect(this.part_time_jobs_dropdown).toBeVisible();
    await expect(this.pbp_link_in_dropdown).toBeVisible();
    await this.pbp_link_in_dropdown.click();
  }
  async hoverOverNotifivationIcon() {
    await this.notification_icon.click();
  }

  async gotoPTJViaCard() {
    await this.page.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await this.ptj_link_on_homepage.click();
    await expect(this.page).toHaveURL("https://urxprt.com/en/searchall?type=3");
    await this.page.waitForLoadState("networkidle");
  }

  async gotoPBPViaCard() {
    await this.page.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await this.pbp_link_on_homepage.click(); // Assuming same link or adjust
    await expect(this.page).toHaveURL("https://urxprt.com/en/searchall?type=1"); // Assuming PBP type=1
    await this.page.waitForLoadState("networkidle");
  }

  async gotoWBOViaCard() {
    await this.page.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await this.wbo_link_on_homepage.click(); // Assuming same link or adjust
    await expect(this.page).toHaveURL("https://urxprt.com/en/searchall?type=2"); // Assuming WBO type=2
    await this.page.waitForLoadState("networkidle");
  }

  async gotoBSMViaCard() {
    await this.page.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await this.BSM_link_on_homepage.click();
    await expect(this.page).toHaveURL(
      "https://urxprt.com/en/searchbuyproducts",
    );
    await this.page.waitForLoadState("networkidle");
  }
  async gotoTAIViaCard() {
    await this.page.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await this.TAI_link_on_homepage.click();
    await expect(this.page).toHaveURL(
      "https://urxprt.com/en/searchrentproducts",
    );
    await this.page.waitForLoadState("networkidle");
  }
  async gotoMASViaCard() {
    await this.page.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await this.MAS_link_on_homepage.click();
    await expect(this.page).toHaveURL(
      "https://urxprt.com/en/searchmergersacquisitions",
    );
    await this.page.waitForLoadState("networkidle");
  }
  async goToPTJViaHeader() {
    await this.navigateViaDropdown(
      "Part-Time Jobs",
      "Browse Part-Time Jobs (PTJ)",
    );
    await expect(this.page).toHaveURL("https://urxprt.com/en/searchall?type=3");
    await this.page.waitForLoadState("networkidle");
  }

  async goToFTJViaHeader() {
    await this.page.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await this.navigateViaDirectClick("Full Time Job (FTJ)");
    await expect(this.page).toHaveURL("https://urxprt.com/en/searchdownloadcv");
    await this.page.waitForLoadState("networkidle");
  }

  async goToPBPViaHeader() {
    await this.navigateViaDropdown(
      "Part-Time Jobs", // Assuming the menu
      "Find Post & Browse Projects (PBP)", // Assuming the item
    );
    await expect(this.page).toHaveURL("https://urxprt.com/en/searchall?type=1");
    await this.page.waitForLoadState("networkidle");
  }

  async goToFindExpertOrCompanyViaHeader() {
    await this.page.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await this.navigateViaDropdown(
      "Find Experts", // Assuming the menu
      "Find Expert / Company", // Assuming the item
    );
    await expect(this.page).toHaveURL(
      "https://urxprt.com/en/hireexpertsmainpage",
    );
    await this.page.waitForLoadState("networkidle");
  }

  async goToWBOViaHeader() {
    await this.navigateViaDropdown(
      "Part-Time Jobs", // Assuming the menu
      "Search Business Opportunities (WBO)", // Assuming the item
    );
    await expect(this.page).toHaveURL("https://urxprt.com/en/searchall?type=2");
    await this.page.waitForLoadState("networkidle");
  }

  async goToBSMViaHeader() {
    await this.navigateViaDropdown(
      "Find OTS", // Assuming the menu
      "Buy & Sell with Market (BSM)", // Assuming the item
    );
    await expect(this.page).toHaveURL(
      "https://urxprt.com/en/searchbuyproducts",
    );
    await this.page.waitForLoadState("networkidle");
  }
  async goToPTJViaDashboard() {
    const profile_dropdown = this.page.getByRole("button", { name: "preview" });
    await profile_dropdown.hover();
    const dashboard_button = this.page.locator(
      "//a[contains(text(),'Dashboard')]",
    );
    await dashboard_button.click();
  }

  async navigateToCreateAPBPPostViaDropdown() {
    await this.find_expert_tab.hover();
    await expect(this.find_expert_dropdown).toBeVisible();
    await expect(this.create_a_post_in_dropdown).toBeVisible();
    await this.create_a_post_in_dropdown.click();
    await expect(this.select_service_type_popup).toBeVisible();
    await this.pbp_option_in_service_type.click();
  }

  async gotoDashboardPage() {
    await this.page.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await this.page.waitForLoadState("networkidle");
    await this.profile_dropdown.hover();
    await expect(this.dashboard_button).toBeVisible();
    await this.dashboard_button.click();
  }
  async gotoReceivedOrders() {
    {
      await this.page
        .locator("div.sidebar-menu a", { hasText: "Received Orders" })
        .click();
      await expect(this.page).toHaveURL(
        "https://urxprt.com/en/dashboard/receivedorders",
      );
    }
  }

  async navigateToMyOrdersViaPreview() {
    await this.preview_button.click();
    await expect(this.my_orders_button.first()).toBeVisible();
    await this.my_orders_button.first().click();
  }

  async openPBPPostFromMyOrders() {
    await this.pbp_orders.first().click();
  }

  async openWBOPostFromMyOrders() {
    await this.wbo_orders.first().click();
  }

  async openPTJPostFromMyOrders() {
    await this.ptj_orders.first().click();
  }
}

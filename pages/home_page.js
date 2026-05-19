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
    this.BSM_link_on_homepage = page
      .locator(".welcomepage")
      .locator("a:has-text('Explore buy & sell')");

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
  async gotoBSMViaCard() {
    await this.page.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await this.BSM_link_on_homepage.click();
    await expect(this.page).toHaveURL(
      "https://urxprt.com/en/searchbuyproducts",
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

  async goToPBPViaHeader() {
    await this.navigateViaDropdown(
      "Part-Time Jobs", // Assuming the menu
      "Find Post & Browse Projects (PBP)", // Assuming the item
    );
    await expect(this.page).toHaveURL("https://urxprt.com/en/searchall?type=1");
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
}

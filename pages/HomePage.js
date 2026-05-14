import { expect } from "@playwright/test";

export default class Homepage {
  constructor(page) {
    this.page = page;
    this.pbp_link_on_homepage = page.locator(
      "//h5[contains(text(),'PBP')]/following-sibling::a",
    );
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

  async navigateToPBPFromHomepage() {
    await this.pbp_link_on_homepage.click();
  }

  async gotohomepage() {
    await this.logo.click();
  }

  async navigateToPBPViaDropdown() {
    await this.part_time_jobs_tab.hover();
    await expect(this.part_time_jobs_dropdown).toBeVisible();
    await expect(this.pbp_link_in_dropdown).toBeVisible();
    await this.pbp_link_in_dropdown.click();
  }

  async navigateToCreateAPBPPostViaDropdown() {
    await this.find_expert_tab.hover();
    await expect(this.find_expert_dropdown).toBeVisible();
    await expect(this.create_a_post_in_dropdown).toBeVisible();
    await this.create_a_post_in_dropdown.click();
    await expect(this.select_service_type_popup).toBeVisible();
    await this.pbp_option_in_service_type.click();
  }

  async goToDashboardPage() {
    await this.profile_dropdown.click();
    await expect(this.dashboard_button).toBeVisible();
    await this.dashboard_button.click();
  }
}

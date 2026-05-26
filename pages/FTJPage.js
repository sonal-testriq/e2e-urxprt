import { expect } from "@playwright/test";
import { BasePage } from "./base_page";

export default class FTJPage extends BasePage {
  constructor(page) {
    super(page);
    this.industries_list = page.locator("//div[@class='accordion-sec']/a");
    this.sub_industry_list = page.locator(".create-project1");
    this.sub_industry_list_names = page.locator(".create-project1 h4");
    this.candidate_list = page.locator(".filter-detail");
    this.view_details_button = page.locator("//button[contains(text(),'View details')]");
    this.search_input = page.locator("#search");
    this.seacrh_button = page.locator(".search-btn");
  }

  async getIndustriesList() {
    await this.industries_list.first().waitFor();
    return await this.industries_list.allTextContents();
  }

  async selectIndustryAndFirstSubIndustry(industryName) {
    const industry = this.industries_list.filter({
        hasText: industryName,
    });
    await expect(industry).toBeVisible();
    await industry.click();
    const firstSubIndustry = this.sub_industry_list.locator("h4").first();
    await expect(firstSubIndustry).toBeVisible();
    await firstSubIndustry.click();
    }

    async searchFTJ(keyword) {
        await this.search_input.fill(keyword);
        await this.seacrh_button.click();
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1200); // Wait for search results to load, adjust as needed
    }
}
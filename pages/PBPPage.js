import { expect } from "@playwright/test";
import { BasePage } from "./base.page";

export default class PTJPage extends BasePage {
  constructor(page) {
    super(page);

    this.ptj_link_on_homepage = page.locator(
      "a:has-text('Find Part time Job (PTJ)')",
    );
    this.postNames = page.locator("//div[@class='filter-detail']//h5");
    this.post_not_found = page.locator("//div[@class='content-loader']");
    this.recently_posted_filter = page.locator(
      "//div[contains(text(),'Recently Posted')]/parent::div/parent::div",
    );
    this.old_post_option = page.getByRole("option", { name: "Old Posts" });
    this.select_industry_filter = page.locator(
      "//div[contains(text(),'Select Industry')]/parent::div/parent::div",
    );
    this.energy_option = page.getByRole("option", { name: "Energy" });
    this.select_category_filter = page.locator(
      "//div[contains(text(),'Select Category')]/parent::div/parent::div",
    );
    this.oil_category = page.getByRole("option", { name: "Oil" });
    this.select_sub_category_filter = page.locator(
      "//div[contains(text(),'Select Sub Category')]/parent::div/parent::div",
    );
    this.drilling_sub_category = page.getByRole("option", { name: "Drilling" });
    this.clear_filter_button = page.locator(
      "//a[contains(text(),'Clear filters')]",
    );
    this.pagination = page.locator("//ul[@class='pagination']/li/a");
    this.apply_button = page.locator("//button[contains(text(),'Apply Now')]");
  }
  async navigateToPTJFromHomepage() {
    const ptj_link_on_homepage = this.page.locator(
      "a:has-text('Find Part time Job (PTJ)')",
    );
    await ptj_link_on_homepage.click();
  }
  async chooseOldPostFilter() {
    await this.recently_posted_filter.click();
    await expect(this.old_post_option).toBeVisible();
    await this.old_post_option.click();
  }

  async chooseEnergyFromIndustryFilter() {
    await this.select_industry_filter.click();
    await expect(this.energy_option).toBeVisible();
    await this.energy_option.click();
  }

  async chooseOilFromCategoryFilter() {
    await this.select_category_filter.click();
    await expect(this.oil_category).toBeVisible();
    await this.oil_category.click();
  }

  async chooseDrillingFromSubCategory() {
    await this.select_sub_category_filter.click();
    await expect(this.drilling_sub_category).toBeVisible();
    await this.drilling_sub_category.click();
  }

  async getTheTotalPageNumber() {
    const totalCount = await this.pagination.count();
    return await this.pagination.nth(totalCount - 2).textContent();
  }

  async getUpdatedPageNumber() {
    const before = await this.pagination.allTextContents();
    await expect(async () => {
      const after = await this.pagination.allTextContents();
      expect(after).not.toEqual(before);
    }).toPass();
    const newCount = await this.pagination.count();
    const newText = await this.pagination.nth(newCount - 2).textContent();
    return newText?.trim();
  }

  async removeFilter() {
    await this.clear_filter_button.click();
  }

  async clickOnApplyButton(newPage) {
    const applyButton = newPage.locator(
      "//button[contains(text(),'Apply Now')]",
    );
    await applyButton.click();
  }
}

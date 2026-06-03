import { expect } from "@playwright/test";
import { BasePage } from "./base_page";

export default class MASPage extends BasePage {
  constructor(page) {
    super(page);
    this.postNames = page.locator("//div[@class='packaged-img']//h3");
    this.search_box = page.getByRole("textbox", { name: "Search MAS" });
    this.search_button = page.getByRole("button", { name: "Search" });
    this.addACompany_button = page.locator(
      "//button[contains(text(),'Add Company')]",
    );
    this.allServicesBtn = page.locator("//a[text()='All Services']");
    this.viewMore_button = page.locator("//button[text()='View more']");
    this.informationTab = page.locator(".add-education-modal");
    this.recently_viewed_tab = page.locator(
      "//a[contains(text(),'Recently viewed')]",
    );
    this.saved_posts_tab = page.locator("//a[contains(text(),'Saved Companies')]");
    this.post_not_found = page.locator("//div[@class='content-loader']");
    this.pagination = page.locator("//ul[@class='pagination']/li/a");
    this.country_filter = page.locator(
      "//div[contains(text(),'Search Country')]/parent::div/parent::div",
    );
    this.india_option = page.getByRole("option", { name: "India" , exact: true });
    this.city_input = page.locator("//input[@placeholder='Search here']");
    this.industry_filter = page.locator(
      "//div[contains(text(),'Search Here')]/parent::div/parent::div",
    );
    this.bussiness_option = page.getByRole("option", { name: "Business" });
  }
  async addACompany() {
    await this.addACompany_button.click();
  }

  async goToAllServicesTab() {
    await this.allServicesBtn.click();
  }

  async waitForPosts() {
    await this.postNames.first().waitFor();
  }
  
  async searchFor(text) {
    await this.search_box.fill(text);
    await this.search_button.click();
  }

  async waitForFilteredResults() {
    await expect
      .poll(async () => await this.postNames.count())
      .toBeLessThanOrEqual(1);
  }

  async clickOnViewMoreButton() {
    await this.viewMore_button.click();
    await expect(this.informationTab).toBeVisible();
  }

  async verifyPostDetailsIsVisible() {
    const postDetails = this.informationTab.locator(
      ".tab-content",
    );
    await postDetails.waitFor();
    await expect(postDetails).toBeVisible();
  }

  async closeInformationTab() {
    const closebutton = this.informationTab.locator(
      ".close-modal-btn img",
    );
    await closebutton.click();
  }

  async goToRecentlyReviewedPage() {
    await this.recently_viewed_tab.click();
  }

  async waitForReviewedPostToAppear() {
    await expect
      .poll(async () => await this.postNames.count())
      .toBeGreaterThanOrEqual(1);
  }

  async getPostCount() {
    return await this.postNames.count();
  }

  async isPostNamePresent(expectedText) {
    const count = await this.postNames.count();
    for (let i = 0; i < count; i++) {
      const text = await this.postNames.nth(i).textContent();
      if (text?.trim().includes(expectedText)) {
        return true;
      }
    }
    return false;
  }

  async clickOnHeartButton() {
    const postDetails = this.informationTab.locator(
      ".tab-content",
    );
    await postDetails.waitFor();
    await this.page.waitForTimeout(1200);
    const heartButton = await postDetails.locator(".heart-btn img");
    await heartButton.click();
    await this.page.waitForTimeout(1200);
 }   

 async goToSavedPostsPage() {
    await this.saved_posts_tab.click();
  }

  async waitForSavedPostToAppear() {
    await expect
      .poll(async () => await this.postNames.count())
      .toBeGreaterThanOrEqual(1);
  }

  async verifyThatTheTabHasNoPosts() {
    await expect(this.post_not_found).toBeVisible();
  }

  async getTheTotalPageNumber() {
    const totalCount = await this.pagination.count();
    return await this.pagination.nth(totalCount - 2).textContent();
  }

  async chooseCountryFilter() {
    await this.country_filter.first().click();
    await this.country_filter.first().locator("//input").fill("India");
    await expect(this.india_option).toBeVisible();
    await this.india_option.click();
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

  async enterCityName(city) {
    await this.city_input.fill(city);
    await this.page.waitForTimeout(2000);
  }

  async chooseIndustryFilter() {
    await this.industry_filter.first().click();
    await expect(this.bussiness_option).toBeVisible();
    await this.bussiness_option.click();
  }


}

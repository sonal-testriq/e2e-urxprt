import { expect } from "@playwright/test";
import { BasePage } from "./base_page";

export default class OTSPage extends BasePage {
  constructor(page) {
    super(page);
    this.create_a_post_button = page.locator(
      "//button[contains(text(),'Add OTS')]",
    );
    this.search_box = page.getByRole("textbox", { name: "Search OTS" });
    this.search_button = page.getByRole("button", { name: "Search" });
    this.allServicesBtn = page.locator("//a[text()='All Services']");
    this.add_button_On_all_services_page = page.locator(
      "//button[text()='Add']",
    );
    this.postNames = page.locator("//div[@class='packaged-img']//h6");
    this.recently_viewed_tab = page.locator(
      "//a[contains(text(),'Recently viewed')]",
    );
    this.heart_button = page.locator(".heart-btn img");
    this.saved_posts_tab = page.locator("//a[contains(text(),'Saved package')]");
    this.post_not_found = page.locator("//div[@class='content-loader']");
    this.pagination = page.locator("//ul[@class='pagination']/li/a");
    this.industry_filter = page.locator(
      "//div[contains(text(),'Search Here')]/parent::div/parent::div",
    );
    this.eCom_option = page.getByRole("option", { name: "E Commerce" });
    this.category_filter = page.locator(
      "//div[contains(text(),'Select Category')]/parent::div/parent::div",
    );
    this.sc_option = page.getByRole("option", { name: "Supply Chain" });
  }

  async clickOnCreateAPostButton() {
    await this.create_a_post_button.click();
  }

  async clickOnAddButtonOnAllServicesPage() {
    await this.add_button_On_all_services_page.click();
  }

  async goToAllServicesTab() {
    await this.allServicesBtn.click();
  }

  async verifyJoinAsExpertOrCompanyPopUpAppearsForUserAccount() {
    const popUp = this.page.locator("//div[@class='modal-content']");
    await expect(popUp).toBeVisible();
    const heading = this.page.locator(
      "//h4[contains(text(),'Please Join As Company / Expert')]",
    );
    await expect(heading).toBeVisible();
  }

  async closePopUp() {
    const closeBtn = this.page.locator(
      "//button[contains(@class,'close-button')]/img",
    );
    await closeBtn.click();
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

  async goToTheFilteredPostetails() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.postNames.click(),
    ]);
    await newPage.waitForLoadState("networkidle");
    return newPage;
  }

  async verifyPostDetailsIsVisible(newPage) {
    const postDetails = newPage.locator(
      "//div[contains(@class,'package-right')]",
    );
    await postDetails.waitFor();
    await expect(postDetails).toBeVisible();
  }

  async clickOnHeartButton(newPage) {
    const postDetails = newPage.locator(
      "//div[contains(@class,'package-right')]",
    );
    await postDetails.waitFor();
    await newPage.locator(".heart-btn img").click();
    await newPage.waitForTimeout(1000);
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

  async chooseIndustryFilter() {
    await this.industry_filter.first().click();
    await expect(this.eCom_option).toBeVisible();
    await this.eCom_option.click();
  }

  async chooseCategoryFilter() {
    await this.category_filter.first().click();
    await expect(this.sc_option).toBeVisible();
    await this.sc_option.click();
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
  
}

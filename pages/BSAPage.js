import { expect } from "@playwright/test";
import { BasePage } from "./base_page";

export default class BSAPage extends BasePage {
  constructor(page) {
    super(page);
    this.postNames = page.locator("//div[contains(@class,'auction-img')]/following-sibling::h4");
    this.search_box = page.getByRole("textbox", { name: "Search BSA" });
    this.search_button = page.getByRole("button", { name: "Search" });
    this.addAProduct_button = page.locator(
      "//button[contains(text(),'Add a Product')]",
    );
    this.allServicesBtn = page.locator("//a[text()='All Services']");
    this.recently_viewed_tab = page.locator(
      "//a[contains(text(),'Recently Viewed')]",
    );
    this.saved_posts_tab = page.locator("//a[contains(text(),'Saved')]");
    this.post_not_found = page.locator("//div[@class='content-loader']");
  }
  async addAProduct() {
    await this.addAProduct_button.click();
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

  async clickOnHeartButton(newPage) {
    const postDetails = newPage.locator(
      "//div[contains(@class,'package-right')]",
    );
    await postDetails.waitFor();
    await newPage.locator(".heart-btn img").click();
    await newPage.waitForTimeout(1000);
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


}

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
    this.add_button = page.locator("//button[.='Add']");
    this.add_BSA_tab = page.locator(".add-education-modal");
    this.next_button = page.locator("//button[.='Next']");
    this.add_currectDateTimeButton = page.locator("//button[.='Add Current Days Time']");
    this.save_and_publish = page.locator("//button[.='Save and Publish']");
    this.add_and_publish = page.locator("//button[.='Update and Publish']");
    this.success_message = page.locator(".custom-popup.alert.alert-success");
    this.failure_message = page.locator(".custom-popup.alert.alert-danger");
    this.product_names = page.locator(".auction-det h4");
    this.popUp_message = page.locator(".modal-content h4");
    this.contract_Popup = page.locator(".contract-popup-content");
    this.agree_and_submit = page.locator("//button[.='I Agree & Submit']");
    this.bid_list = page.locator(".bid-table tr p");
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

  async clickOnAddButton() {
    await this.add_button.click();
  }

  async openAddBSATab() {
    await this.clickOnAddButton();
    await expect(this.add_BSA_tab).toBeVisible();
  }

  async clickOnNextButtonOnAddPage() {
    await this.next_button.click();
  }
  async addCurrentDateAndTime() {
    await this.add_currectDateTimeButton.click();
  }

  async clickOnNextButtonOnBSADetails(){
    const nextBtn = await this.add_BSA_tab.locator(".tab-pane.active .next-button");
    await nextBtn.click();
  }

  async saveAndPublishService () {
    await this.page.waitForTimeout(500);
    await this.save_and_publish.click();
  }

  async addAndPublishService () {
    await this.page.waitForTimeout(500);
    await this.add_and_publish.click();
  }

  async verifySuccessMessageIsDisplayed(text) {
    await expect(this.success_message).toBeVisible();
    const message = await this.success_message.textContent();
    expect(message).toContain(text);
  }

  async verifySuccessfulBidMessageIsDisplayed(text, newPage) {
    await expect(newPage.locator(".custom-popup.alert.alert-success")).toBeVisible();
    const message = await newPage.locator(".custom-popup.alert.alert-success").textContent();
    expect(message).toContain(text);
  }

  async verifyErrorMessageIsDisplayed(text) {
    await expect(this.failure_message).toBeVisible();
    const message = await this.failure_message.textContent();
    expect(message).toContain(text);
  }

  async isServicePresent(expectedText) {
    const count = await this.product_names.count();
    for (let i = 0; i < count; i++) {
      const text = await this.product_names.nth(i).textContent();
      if (text?.trim().includes(expectedText)) {
        return true;
      }
    }
    return false;
  }

  async clickOnEditButton(serviceName) {
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState("networkidle");
    const count = await this.product_names.count();
    for (let i = 0; i < count; i++) {
      const text = await this.product_names.nth(i).textContent();
      if (text?.trim().includes(serviceName)) {
        const editButton = await this.product_names.locator("//parent::div//div[@class='add-button-education']//img[@alt='edit']");
        await editButton.nth(i).click();
        break;
      }
    }
  }

  async goToDesiredProduct(productName) {
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState("networkidle");
    const count = await this.product_names.count();
    for (let i = 0; i < count; i++) {
      const text = await this.product_names.nth(i).textContent();
      if (text?.trim().includes(productName)) {
        await this.product_names.nth(i).click();
        break;
      }
    }
  }

  async closeAddProductTab() {
    const closeBtn = this.add_BSA_tab.locator(".close-modal-btn img");
    await closeBtn.click();
  }

  async verifyConfirmationPopupIsPresent(message) {
    await expect(this.popUp_message).toBeVisible();
    const text = await this.popUp_message.textContent();
    expect(text).toContain(message);
  }

  async verifyAndConfirmBidConfirmation(message, newPage) {
    const popUp = newPage.locator(".modal-content h4");
    await expect(popUp).toBeVisible();
    const text = await popUp.textContent();
    expect(text).toContain(message);
  }

  async clickOnYesButton() {
    await this.page.locator(".modal-content .btn.yes").click();
  }

  async clickOnDeleteButton(serviceName) {
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState("networkidle");
    const count = await this.product_names.count();
    for (let i = 0; i < count; i++) {
      const text = await this.product_names.nth(i).textContent();
      if (text?.trim().includes(serviceName)) {
        const editButton = await this.product_names.locator("//parent::div//div[@class='add-button-education']//img[@alt='delete']");
        await editButton.nth(i).click();
        break;
      }
    }
  }

  async clickOnConfirmButton() {
    await this.page.locator("//div[@class='modal-content']//button[.='Confirm']").click();
  }

  async clickOnJoinAuctionConfirmButton(newPage) {
    await newPage.locator("//div[@class='modal-content']//button[.='Confirm']").click();
  }

  async clickOnConfirmBidButton(newPage) {
    await newPage.locator("//div[@class='modal-content']//button[.='Confirm']").click();
  }

  async getMinimumBidAmount(newPage) {
    const minBidText = await newPage
    .locator("//h6[contains(.,'Minimum bid')]/parent::div/following-sibling::h2")
    .textContent();
    const minBid = minBidText?.replace(/[^0-9.]/g, '');
    return minBid;
  }

  async verifyAndAcceptContract() {
    await expect(this.contract_Popup).toBeVisible();
    await this.agree_and_submit.click();
  }

  async clickOnPayAndJoinAuction(newPage) {
    const pay_and_join_button =  await newPage.locator("//button[.='Pay Deposit to Join Auction']");
    await pay_and_join_button.click();
  }

  async verifySuccessfulPurchaseRequest(text, newPage) {
    await expect(newPage.locator(".custom-popup.alert.alert-success")).toBeVisible();
    const message = await newPage.locator(".custom-popup.alert.alert-success").textContent();
    expect(message).toContain(text);
  }

  async enterAndPlaceBid(bid, newPage) {
    const bidInput = await newPage.locator("//input[@placeholder='Enter your bid']");
    await bidInput.fill(bid);
    await newPage.locator("//button[.='Place Bid']").click();
  }

  async goToAuctionBidTab() {
    await this.page.waitForLoadState("networkidle");
    const bid_tab = await this.page.locator("//div[@class='tab-package']//li/a[contains(.,'Bid')]");
    await bid_tab.click();
  }
  
   async getTotalBidCount() {
    await this.bid_list.first().waitFor();
    return await this.bid_list.count();
   }

}

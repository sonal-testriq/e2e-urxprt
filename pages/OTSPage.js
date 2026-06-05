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
    this.add_button_On_all_services_page = page.locator("//button[.='Add']");
    this.add_ots_tab = page.locator(".add-education-modal");
    this.next_button = page.locator("//button[.='Next']");
    this.save_and_publish = page.locator("//button[.='Save and Publish']")
    this.add_more_sample = page.locator("//button[.='Add More Sample']");
    this.remove_sample = page.locator("//button[.='Remove Sample']");
    this.success_message = page.locator(".custom-popup.alert.alert-success");
    this.services_names = page.locator(".add-education-wrapper1 h6");
    this.popUp_message = page.locator(".modal-content h4");
    this.pending_order_request_names = page.locator(".pending-img .pending-left h5");
    this.accept_button = page.locator("//div[contains(@class,'pending-img')]//div[@class='pending-right']//button[contains(.,'Accept')]");
    this.active_recieved_orders_tab = page.locator("//h2[.='Received Orders']/parent::div/ul//a[contains(.,'Active')]")
    this.complete_receive_orders_tab = page.locator("//h2[.='Received Orders']/parent::div/ul//a[contains(.,'Completed')]");
    this.active_recieved_orders_names = page.locator("//div[@class='tab-pane active']//ul//a");
    this.active_orders_list_names = page.locator(".tab-pane.active .recent-post .post-back h3");
    this.active_orders_list_review_button = page.locator(".tab-pane.active .recent-post .post-back button");
    this.submit_work_for_payment_button = page.locator("//div[@class='tab-pane active']//button[contains(text(),'Submit work for payment')]");
    this.submit_work = page.locator("//button[contains(text(),'Submit Work')]");
    this.error_message = page.locator(".error");
    this.projectTitle = page.locator("//label[contains(.,'Project title')]");
    this.projectUrl = page.locator("//label[contains(.,'Project URL')]");
  }

  async clickOnCreateAPostButton() {
    await this.create_a_post_button.click();
  }

  async clickOnAddButtonOnAllServicesPage() {
    await this.add_button_On_all_services_page.click();
    await expect(this.add_ots_tab).toBeVisible();
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

  async isRequestPresent(expectedText) {
    await this.pending_order_request_names.first().waitFor();
    const count = await this.pending_order_request_names.count();
    for (let i = 0; i < count; i++) {
      const text = await this.pending_order_request_names.nth(i).textContent();
      if (text?.trim().includes(expectedText)) {
        return true;
      }
    }
    return false;
  }

  async isActiveRequestPresent(expectedText) {
    await this.active_orders_list_names.first().waitFor();
    const count = await this.active_orders_list_names.count();
    for (let i = 0; i < count; i++) {
      const text = await this.active_orders_list_names.nth(i).textContent();
      if (text?.trim().includes(expectedText)) {
        return true;
      }
    }
    return false;
  }

  async goToActiveRequestReview(expectedText) {
    await this.active_orders_list_names.first().waitFor();
    const count = await this.active_orders_list_names.count();
    for (let i = 0; i < count; i++) {
      const text = await this.active_orders_list_names.nth(i).textContent();
      if (text?.trim().includes(expectedText)) {
        await this.active_orders_list_review_button.nth(i).click();
        break;
      }
    }
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

  async clickOnNextButtonOnServiceDetailsTab() {
    await this.page.waitForTimeout(500);
    await this.next_button.click();
  }

  async clickOnNextButtonOnWorkSampleTab() {
    await this.page.waitForTimeout(500);
    await expect(this.add_more_sample).toBeVisible();
    const nextBtn = await this.add_ots_tab.locator(".tab-pane.active .next-button");
    await nextBtn.click();
  }

  async selectPaymentTerms(term) {
    const paymentTerm = await this.page.locator("//span[contains(.,'" + term + "')]/parent::label/input");
    await paymentTerm.click();
  }

  async saveAndPublishService () {
    await this.page.waitForTimeout(500);
    await this.save_and_publish.click();
  }

  async verifySuccessMessageIsDisplayed(text) {
    await expect(this.success_message).toBeVisible();
    const message = await this.success_message.textContent();
    expect(message).toContain(text);
  }

  async verifySuccessfulPurchaseRequest(text, newPage) {
    await expect(newPage.locator(".custom-popup.alert.alert-success")).toBeVisible();
    const message = await newPage.locator(".custom-popup.alert.alert-success").textContent();
    expect(message).toContain(text);
  }

  async isServicePresent(expectedText) {
    const count = await this.services_names.count();
    for (let i = 0; i < count; i++) {
      const text = await this.services_names.nth(i).textContent();
      if (text?.trim().includes(expectedText)) {
        return true;
      }
    }
    return false;
  }

  async clickOnEditButton(serviceName) {
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState("networkidle");
    const count = await this.services_names.count();
    for (let i = 0; i < count; i++) {
      const text = await this.services_names.nth(i).textContent();
      if (text?.trim().includes(serviceName)) {
        const editButton = await this.services_names.locator("//parent::div/div[@class='add-button-education']//img[@alt='edit']");
        await editButton.nth(i).click();
        break;
      }
    }
  }

  async clickOnDeleteButton(serviceName) {
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState("networkidle");
    const count = await this.services_names.count();
    for (let i = 0; i < count; i++) {
      const text = await this.services_names.nth(i).textContent();
      if (text?.trim().includes(serviceName)) {
        const editButton = await this.services_names.locator("//parent::div/div[@class='add-button-education']//img[@alt='delete']");
        await editButton.nth(i).click();
        break;
      }
    }
  }

  async closeAddServicesTab() {
    const closeBtn = this.add_ots_tab.locator(".close-modal-btn img");
    await closeBtn.click();
  }

  async verifyConfirmationPopupIsPresent(message) {
    await expect(this.popUp_message).toBeVisible();
    const text = await this.popUp_message.textContent();
    expect(text).toContain(message);
  }

  async clickOnYesButton() {
    await this.page.locator(".modal-content .btn.yes").click();
  }

  async clickOnConfirmButton() {
    await this.page.locator("//div[@class='modal-content']//button[.='Confirm']").click();
  }
  
  async clickOnSendPurchaseButton(newPage) {
    await newPage.locator(".purchase-btn").click();
  }

  async clickOnAcceptButtonOfService(expectedText) {
    const count = await this.pending_order_request_names.count();
    for (let i = 0; i < count; i++) {
      const text = await this.pending_order_request_names.nth(i).textContent();
      if (text?.trim().includes(expectedText)) {
        await this.accept_button.nth(i).click();
        break;
      }
    }
  }

  async clickOnActiveReceivedOrdersTab() {
    await this.active_recieved_orders_tab.click();
  }

  async clickOnCompletedReceivedOrdersTab() {
    await this.complete_receive_orders_tab.click();
  }

  async goToDesiredActiveRecievedOrder(expectedText) {
    await this.active_recieved_orders_names.first().waitFor();
    const count = await this.active_recieved_orders_names.count();
    for (let i = 0; i < count; i++) {
      const text = await this.active_recieved_orders_names.nth(i).textContent();
      if (text?.trim().includes(expectedText)) {
        await this.active_recieved_orders_names.nth(i).click();
        break;
      }
    }
  }

  async clickOnSubmitWorkForPayment() {
    await expect(this.submit_work_for_payment_button).toBeVisible();
    await this.submit_work_for_payment_button.click();
  }

  async submitWorkForPayment() {
    await this.submit_work.click();
  }

  async clickOnAddMoreSample() {
    await this.add_more_sample.click();
  }

  async verifyProjectTitleAndProjectURLIsVisible() {
    await expect(this.projectTitle).toBeVisible();
    await expect(this.projectUrl).toBeVisible();
  }

  async clickOnRemoveSample() {
    await this.remove_sample.click();
  }

  async verifyProjectTitleAndProjectURLIsNotVisible() {
    await expect(this.projectTitle).not.toBeVisible();
    await expect(this.projectUrl).not.toBeVisible();
  }

}

import { expect } from "@playwright/test";
import { BasePage } from "./base_page";

export default class TAIPage extends BasePage {
  constructor(page) {
    super(page);
    this.postNames = page.locator("//div[@class='packaged-img']//h6");
    this.search_box = page.getByRole("textbox", { name: "Search TAI" });
    this.search_button = page.getByRole("button", { name: "Search" });
    this.addAProduct_button = page.locator(
      "//button[contains(text(),'Add a Product')]",
    );
    this.allServicesBtn = page.locator("//a[text()='All Services']");
    this.recently_viewed_tab = page.locator(
      "//a[contains(text(),'Recently viewed')]",
    );
    this.saved_posts_tab = page.locator("//a[contains(text(),'Saved Products')]");
    this.post_not_found = page.locator("//div[@class='content-loader']");
    this.pagination = page.locator("//ul[@class='pagination']/li/a");
    this.select_option = page.locator(
      "//div[contains(text(),'Select option')]/parent::div/parent::div",
    );
    this.rentalOnly_option = page.getByRole("option", { name: "Rental Only" , exact: true });
    this.industry_filter = page.locator(
      "//div[contains(text(),'Search Here')]/parent::div/parent::div",
    );
    this.bussiness_option = page.getByRole("option", { name: "Business" });
    this.category_filter = page.locator(
      "//div[contains(text(),'Select Category')]/parent::div/parent::div",
    );
    this.mc_option = page.getByRole("option", { name: "Managing and Consultant" });
    this.subcategory_filter = page.locator(
      "//div[contains(text(),'Search subcategories')]/parent::div/parent::div",
    );
    this.sc_option = page.getByRole("option", { name: "Strategy Consulting" });
    this.success_message = page.locator(".custom-popup.alert.alert-success");
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

  async getTheTotalPageNumber() {
    const totalCount = await this.pagination.count();
    return await this.pagination.nth(totalCount - 2).textContent();
  }

  async chooseRentalType() {
    await this.select_option.first().click();
    await expect(this.rentalOnly_option).toBeVisible();
    await this.rentalOnly_option.click();
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

  async chooseIndustryFilter() {
    await this.industry_filter.first().click();
    await expect(this.bussiness_option).toBeVisible();
    await this.bussiness_option.click();
  }

  async chooseCategoryFilter() {
    await this.category_filter.first().click();
    await expect(this.mc_option).toBeVisible();
    await this.mc_option.click();
  }

  async chooseSubCategoryFilter() {
    await this.subcategory_filter.first().click();
    await expect(this.sc_option).toBeVisible();
    await this.sc_option.click();
  }

  async verifySuccessMessageIsDisplayed(text, newPage) {
    await expect(newPage.locator(".custom-popup.alert.alert-success")).toBeVisible();
    const message = await newPage.locator(".custom-popup.alert.alert-success").textContent();
    expect(message).toContain(text);
  }

  async clickOnAddAProductButton() {
    await this.addAProduct_button.click();
  }

  async clickAddProductPlan() {
    const addBtn = this.page.locator('.packaged-first button:has-text("Add")');
    await addBtn.click();
    await expect(this.page.locator(".modal-overlay-sec.active")).toBeVisible();
  }

  async uploadFile(file) {
    await this.page.locator(".dropzone").locator('input[type="file"]').setInputFiles(file);
    await expect(this.page.locator("//img[@alt='Delete']")).toBeVisible();
  }

  async goToTypeAndPricingTab() {
    await this.page.getByRole("button", { name: "Next" }).click();
    await expect(this.page.locator("a", { hasText: " Type & Pricing" })).toHaveClass(/active nav-link/);
  }

  async goToReviewAndAddStep() {
    await this.page.locator(".tab-pane.active").locator("div.next-button").click();
    await expect(this.page.locator("a", { hasText: "Review & add" })).toHaveClass(/active nav-link/);
  }

  async publishProduct() {
    await this.page.getByRole("button", { name: "Save and Publish" }).click();
  }

  async verifyTAIPostVisible(productName) {
    const TAIPostCard = this.page.locator("div.packaged-img").filter({ has: this.page.locator("h6", { hasText: productName })});
    await expect(TAIPostCard).toContainText(productName);
  }

  async verifyYourPostTag() {
    const yourPostTag = this.page.locator("div.post-sold p.your-postbtn", { hasText: "Your post" });
    await expect(yourPostTag.first()).toBeVisible();
  }

  async verifyProductListed(productName) {
    const TAIPostCard = this.page.locator("div.packaged-img").filter({ has: this.page.locator("h6", { hasText: productName })});
    await expect(TAIPostCard).toContainText(productName);
  }

  async openTAIPost(productName) {
    const TAIPostCard = this.page.locator("div.packaged-img").filter({
      has: this.page.locator("h6", {
        hasText: productName,
      }),
    });
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      TAIPostCard.click(),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  async clickSendRentalRequest(newPage) {
    await newPage
      .locator("//button[contains(text(),'Send Rental Request')]")
      .click();
    await newPage.waitForLoadState("networkidle");
    await expect(
      newPage.locator("div.modal.fade.show")
    ).toBeVisible();
  }

  async fillRentalRequest(newPage, currentDate) {
    const pageObj = new BasePage(newPage);
    await pageObj.fillInput("Start Date ", currentDate);
    await pageObj.fillInput("End Date ", currentDate);
  }

  async selectStartTime(newPage, hour, minute, period) {
    await newPage.locator(".form-group").filter({ hasText: "Start Time" }).locator(".rs-picker-toggle-wrapper").click();
    const popup = newPage.locator(".rs-picker-popup-date").last();
    await expect(popup).toBeVisible();
    await popup.locator(`[data-key="hours-${hour}"]`).click();
    await popup.locator(`[data-key="minutes-${minute}"]`).click();
    await popup.getByRole("option", { name: period }).click();
    await popup.getByRole("button", { name: "OK" }).click();
    await expect(popup).toBeHidden();
  }

  async selectEndTime(newPage, hour, minute, period) {
    await newPage.locator(".form-group").filter({ hasText: "End Time" }).locator(".rs-picker-toggle-wrapper").click();
    const popup = newPage.locator(".rs-picker-popup-date").last();
    await expect(popup).toBeVisible();
    await popup.locator(`[data-key="hours-${hour}"]`).click();
    await popup.locator(`[data-key="minutes-${minute}"]`).click();
    await popup.getByRole("option", { name: period }).click();
    await popup.getByRole("button", { name: "OK" }).click();
    await expect(popup).toBeHidden();
  }

  async submitRentalRequest(newPage) {
    await newPage
      .locator("//button[contains(text(),'Submit Request')]")
      .click();
    await expect(newPage).toHaveURL(
      /.*\/rentalcontract\//
    );
  }

  async acceptRentalContract(newPage) {
    await newPage.locator("label[for='agree']").click();
    await newPage.locator(".popup-contract-container").locator("button", {
        name: "Scroll to Bottom",
        exact: true,
      }).click();
    await newPage.locator(".popup-contract-container").locator("input[id='agree']").click();
    await newPage.waitForLoadState("networkidle");
    await newPage.locator("button", {
      hasText: "Accept",
    }).click();
  }

  async openTAIRequests() {
    const taiRequestsHeader = this.page.locator("#Orderequests").locator(".pending-req h4", {
        hasText: "Turn Assets to Income (TAI) requests",
      });
    await expect(taiRequestsHeader).toBeVisible();
  }

  async acceptTAIRequest(productName) {
    const postRow = this.page.locator("div.pending-img", { hasText: productName });
    await postRow.getByRole("button", { name: "Accept" }).click();
    await expect(this.page).toHaveURL(/.*\/rentalcontract\//);
  }

  async acceptRentalTerms() {
    await this.page.locator("label[for='agree']").click();
    await this.page.waitForTimeout(500);
    await this.page.locator(".popup-contract-container").locator("button", {
        name: "Scroll to Bottom",
        exact: true,
    }) .click();
    await this.page.waitForTimeout(500);
    await this.page.locator(".popup-contract-container").locator("input[id='agree']").click();
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState("networkidle");
    await this.page.locator("button", { hasText: "Accept" }).click();
    await this.page.waitForTimeout(500);
  }

  async openPurchasedActiveTAIOrder(productName) {
    await this.page.locator("div.order-first a", { hasText: "Purchased orders" }).click();
    await this.page.locator("a", { hasText: "Active orders", exact: false }).click();
    const postRow = this.page.locator("div.pending-img", { hasText: productName });
    await postRow.locator("button.btn-img").click();
    await expect(this.page).toHaveURL(/.*\/myorders\/rentalproductsdetails\//);
  }

  async clickPayNow() {
    await this.page.locator("div.status-right span", { hasText: "Pay Now" }).click();
    await expect(this.page.locator("div.modal.fade.show")).toBeVisible();
    await this.page.locator("div.modal-content button", { hasText: "Confirm" }).click();
  }

  async verifyPaymentPage() {
    await expect(this.page).toHaveURL("https://urxprt.com/en/account/paymentmethodpage");
  }

  async verifyTAIPaymentSuccess() {
    await expect(this.page.getByText("TAI Payment Completed").first()).toBeVisible();
  }

  async clickOkayAfterPayment() {
    await this.page.locator("button", { hasText: "Okay" }).click();
  }

  async verifyReceivedOrderPage() {
    await expect(this.page).toHaveURL(/.*\/receivedorders\/rentalproductsdetails\//);
  }

  async openActiveTAIReceivedOrders() {
    await this.page.locator(".nav-tabs a", { hasText: "Active orders", exact: false }).click();
    await this.page.locator("#Activeorders .order-tabs a", {
      hasText: "Turn Assets to Income (TAI)",
      exact: false,
    }).click();
  }

  async openReceivedTAIOrder(productName) {
    const postRow = this.page.locator("div.pending-img", { hasText: productName });
    await postRow.locator("button.btn-img").click();
    await expect(this.page).toHaveURL(
      /.*\/receivedorders\/rentalproductsdetails\//
    );
  }

  async updateStatus() {
    await this.page.locator("div.status-right span", {
      hasText: "Update status",
    }).click();
    await expect(
      this.page.locator("div.modal.fade.show")
    ).toBeVisible();
    await this.page.locator("div.modal-content button", {
      hasText: "Confirm",
    }).click();
  }

  async verifyUpdatedSuccessfully() {
    await expect(
      this.page.getByText("Updated Successfully")
    ).toBeVisible();
  }

  async openPurchasedActiveTAIOrder(productName) {
    await this.page.locator("div.order-first a", { hasText: "Purchased orders" }).click();
    await this.page.locator("a", { hasText: "Active orders", exact: false }).click();
    const postRow = this.page.locator("div.pending-img", { hasText: productName });
    await postRow.locator("button.btn-img").click();
    await expect(this.page).toHaveURL(
      /.*\/myorders\/rentalproductsdetails\//
    );
  }

  async clickMarkDelivered() {
    await this.page.locator("div.status-right span", { hasText: "Mark Delivered" }).click();
    await expect(this.page.locator("div.modal.fade.show")).toBeVisible();
    await this.page.locator("div.modal-content button", { hasText: "Confirm" }).click();
  }

  async verifyDeliveredStep() {
    const step4 = this.page.locator("div.status-first").filter({
      has: this.page.locator("h6", {
        hasText: "Delivered",
      }),
    });
    await expect(step4.locator("div.number.complete span")).toHaveText("4");
    await expect(this.page.locator("div.deliveryotp-sec")).toBeVisible();
  }

  async enterOTP(otp) {
    await this.page.locator("input[name='otp']").fill(otp);
  }

  async submitOTP() {
    await this.page.locator("button", { hasText: "Submit" }).click();
    await expect(this.page.locator("div.modal.fade.show")).toBeVisible();
    await this.page.locator("div.modal-content button", { hasText: "Confirm" }).click();
  }

  async verifyTransactionCompletedStep() {
    const step5 = this.page.locator("div.status-first").filter({ has: this.page.locator("h6", { hasText: "Transaction Complete" })});
    await expect(step5.locator("div.number.complete span")).toHaveText("5");
  }

  async openCompletedTAIOrder(productName) {
    await this.page.locator("div.order-first a", { hasText: "Completed" }).click();
    await this.page.locator("#MyOrderCompleted .order-tabs a", { hasText: "Turn Assets to Income (TAI)", exact: false }).click();
    const postRow = this.page.locator("div.pending-img", {
      hasText: productName,
    });
    await postRow.locator("button.btn-img").click();
    await expect(this.page).toHaveURL(
      /.*\/myorders\/rentalproductsdetails\//
    );
  }

  async openCompletedTAIReceivedOrders() {
    await this.page.locator(".nav-tabs a", { hasText: "completed", exact: false }).click();
    await this.page.locator(".completed-tab-sec a", { hasText: "Turn Assets to Income (TAI)", exact: false }).click();
  }

  async verifyCompletedTAIProduct(productName) {
    const postRow = this.page.locator("div.pending-img", { hasText: productName });
    await expect(postRow.locator("h5").first()).toHaveText(productName);
  }

}

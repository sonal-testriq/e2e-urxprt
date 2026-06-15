import { expect } from "@playwright/test";
import { BasePage } from "./base_page";

export default class BSMPage extends BasePage {
  constructor(page) {
    super(page);
    this.postNames = page.locator("//div[@class='packaged-img']//h6");
    this.search_box = page.getByRole("textbox", { name: "Search BSM" });
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
    this.industry_filter = page.locator(
      "//div[contains(text(),'Search Here')]/parent::div/parent::div",
    );
    this.country_filter = page.locator(
      "//div[contains(text(),'Search Country')]/parent::div/parent::div",
    );
    this.india_option = page.getByRole("option", { name: "India" , exact: true });
    this.bussiness_option = page.getByRole("option", { name: "Business" });
    this.category_filter = page.locator(
      "//div[contains(text(),'Select Category')]/parent::div/parent::div",
    );
    this.subcategory_filter = page.locator(
      "//div[contains(text(),'Search subcategories')]/parent::div/parent::div",
    );
    this.it_option = page.getByRole("option", { name: "Information technology" });
    this.coding_option = page.getByRole("option", { name: "Coding" });
  }
  async addAProduct() {
    await this.addAProduct_button.click();
  }

  async clickOnAddAProductButton() {
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

  async chooseCountryFilter() {
    await this.country_filter.first().click();
    await this.country_filter.first().locator("//input").fill("India");
    await expect(this.india_option).toBeVisible();
    await this.india_option.click();
  }

  async chooseCategoryFilter() {
    await this.category_filter.first().click();
    await expect(this.it_option).toBeVisible();
    await this.it_option.click();
  }

  async chooseSubCategoryFilter() {
    await this.subcategory_filter.first().click();
    await expect(this.coding_option).toBeVisible();
    await this.coding_option.click();
  }

  async clickAddProductPlan() {
    const addBtn = this.page.locator('.packaged-first button:has-text("Add")');
    await addBtn.click();
    await expect(this.page.locator(".modal-overlay-sec.active")).toBeVisible();
  }
  
  async clickNextButtonOnProductDetailTab() {
    const nextBtn = this.page.locator("//button[contains(text(),'Next')]");
    await nextBtn.click();
  }

  async verifyUserIsOnProductInfoTab() {
    const productInfoTab = this.page.locator("a", { hasText: "Product info" });
    await expect(productInfoTab).toHaveClass(/active nav-link/);
  }

  async insertImage(file) {
    await this.page.locator(".dropzone").locator('input[type="file"]')
      .setInputFiles(file);
    await expect(this.page.locator("//img[@alt='Delete']")).toBeVisible();
  }

  async clickNextButtonOnProductInfoTab() {
    await this.page.locator(".add-education-modal .tab-pane.active").locator(".next-button").click();
  }

  async addAndPublishPost() {
    const publishBtn = await this.page.getByRole("button", {
      name: "Add and Publish",
    });
    await expect(publishBtn).toBeVisible();
    await publishBtn.click();
  }

  async goToBSMPost(BSMProductName) {
    const BSMpost = await this.page.locator("div.packaged-img").filter({
     has: this.page.locator(`h6:text-is("${BSMProductName}")`),
    });
    const [newPage] = await Promise.all([this.page.context().waitForEvent("page"), BSMpost.click() ]);
    return newPage;
  }

  async clickOnSendRequest(newPage) {
    await newPage.locator("//button[contains(text(),'Send request')]").click();
    await newPage.waitForLoadState("networkidle");
  }

  async acceptOfferForPost(newPage) {
    await newPage.locator("label[for='agree']").click();
    await newPage.waitForTimeout(500);
    const scrollToBottomBtn = newPage.locator(".popup-contract-container").locator("button", {
        name: "Scroll to Bottom",
        exact: true,
      });
    await scrollToBottomBtn.click();
    await newPage.waitForTimeout(500);
    await newPage.locator(".popup-contract-container").locator("input[id='agree']").click();
    await newPage.waitForLoadState("networkidle");
    await newPage.waitForTimeout(500);
    const acceptTermsButton = newPage.locator("button", {
      hasText: "Accept",
    });
    await acceptTermsButton.click();
    await newPage.waitForTimeout(500);
  }

  async verifySuccessMessageIsDisplayed(text, newPage) {
    await expect(newPage.locator(".custom-popup.alert.alert-success")).toBeVisible();
    const message = await newPage.locator(".custom-popup.alert.alert-success").textContent();
    expect(message).toContain(text);
  }

  async verifyUserIsOnBSMRequestPage() {
    const bsmRequestsHeader = await this.page.locator("#Orderequests").locator(".pending-req h4", {
        hasText: "Buy & Sell with Market (BSM) requests",
      });
    await expect(bsmRequestsHeader).toBeVisible();
  }  

  async clickOnAcceptButtonOnBSMRequestPost(BSMProductName) {
    const postRow = await this.page.locator("div.pending-img", {
          hasText: BSMProductName,
        });
    await postRow.getByRole("button", { name: "Accept" }).click();
  }

  async acceptOffer() {
    await this.page.locator("label[for='agree']").click();
    await this.page.waitForTimeout(500);
    const scrollToBottomBtn = this.page.locator(".popup-contract-container").locator("button", {
        name: "Scroll to Bottom",
        exact: true,
      });
    await scrollToBottomBtn.click();
    await this.page.waitForTimeout(500);
    await this.page.locator(".popup-contract-container").locator("input[id='agree']").click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500);
    const acceptTermsButton = this.page.locator("button", {
      hasText: "Accept",
    });
    await acceptTermsButton.click();
    await this.page.waitForTimeout(500);
  }

  async openPurchasedBSMOrder(productName) {
    await this.page.locator("div.order-first a", {
      hasText: "Purchased orders",
    }).click();
    await this.page.locator("a", {
      hasText: "Active orders",
      exact: false,
    }).click();
    const postRow = this.page.locator("div.pending-img", {
      hasText: productName,
    });
    await postRow.locator("button.btn-img").click();
    await expect(this.page).toHaveURL(
      /.*\/myorders\/productforsaledetails\//
    );
  }

  async clickPayNow() {
    await this.page.locator("div.status-right span", {
      hasText: "Pay Now",
    }).click();
    await expect(
      this.page.locator("div.modal.fade.show")
    ).toBeVisible();
    await this.page.locator("div.modal-content button", {
      hasText: "Confirm",
    }).click();
  }

  async verifyPaymentPage() {
    await expect(this.page).toHaveURL(
      "https://urxprt.com/en/account/paymentmethodpage"
    );
  }

  async verifyBSMPaymentSuccess() {
    await expect(
      this.page.getByText("BSM Payment Completed").first()
    ).toBeVisible();
  }

  async clickOkayAfterPayment() {
    await this.page.locator("button", {
      hasText: "Okay",
    }).click();
  }

  async clickAddAddress() {
    await this.page.locator("div.status-right span", {
      hasText: "Add Address",
    }).click();
    await expect(
      this.page.locator("div.modal.fade.show")
    ).toBeVisible();
  }

  async submitAddress(address) {
    await this.fillInputWithPlaceholder(
      "Enter address",
      address
    );
    await this.page.locator("div.modal-content button", {
      hasText: "Submit",
    }).click();
  }

  async openReceivedBSMOrder(productName) {
    const postRow = this.page.locator("div.pending-img", {
      hasText: productName,
    });
    await postRow.locator("button.btn-img").click();
    await expect(this.page).toHaveURL(
      /.*\/receivedorders\/productforsaledetails\//
    );
  }

  async openActiveBSMReceivedOrders() {
    await this.page.locator(".nav-tabs a", {
      hasText: "Active orders",
      exact: false,
    }).click();
    await this.page.locator("#Activeorders .order-tabs a", {
      hasText: "Buy & Sell with Market (BSM)",
      exact: false,
    }).click();
  }

  async updateOutForDelivery() {
    await this.page.locator("div.status-right span", {
      hasText: "Update Out for Delivery",
    }).click();
    await expect(
      this.page.locator("div.modal.fade.show")
    ).toBeVisible();
    await this.page.locator("div.modal-content button", {
      hasText: "Confirm",
    }).click();
  }

  async clickMarkDelivered() {
    await this.page.locator("div.status-right span", {
      hasText: "Mark Delivered",
    }).click();
    await expect(
      this.page.locator("div.modal.fade.show")
    ).toBeVisible();
    await this.page.locator("div.modal-content button", {
      hasText: "Confirm",
    }).click();
  }

  async verifyItemDeliveredStep() {
    const step4 = this.page.locator("div.status-first").filter({
      has: this.page.locator("h6", {
        hasText: "Item Delivered",
      }),
    });
    await expect(
      step4.locator("div.number.complete span")
    ).toHaveText("4");
    await expect(
      step4.locator("div.deliveryotp-sec")
    ).toBeVisible();
  }

  async openPurchasedActiveBSMOrder(productName) {
    await this.page.locator("div.order-first a", {
      hasText: "Purchased orders",
    }).click();
    await this.page.locator("a", {
      hasText: "Active orders",
      exact: false,
    }).click();
    const postRow = this.page.locator("div.pending-img", {
      hasText: productName,
    });
    await postRow.locator("button.btn-img").click();
    await expect(this.page).toHaveURL(
      /.*\/myorders\/productforsaledetails\//
    );
  }

  async enterOTP(otp) {
    await this.page.locator("input[name='otp']").fill(otp);
  }

  async submitOTP() {
    await this.page.locator("button", {
      hasText: "Submit",
    }).click();
    await expect(
      this.page.locator("div.modal.fade.show")
    ).toBeVisible();
    await this.page.locator("div.modal-content button", {
      hasText: "Confirm",
    }).click();
  }

  async verifyTransactionCompletedStep() {
    const step5 = this.page.locator("div.status-first").filter({
      has: this.page.locator("h6", {
        hasText: "Transaction Complete",
      }),
    });
    await expect(
      step5.locator("div.number.complete span")
    ).toHaveText("5");
  }

  async openCompletedPurchasedBSMOrder(productName) {
    await this.page.locator("div.order-first a", {
      hasText: "Completed",
    }).click();
    await this.page.locator("#MyOrderCompleted .order-tabs a", {
      hasText: "Buy & Sell with Market (BSM)",
      exact: false,
    }).click();
    const postRow = this.page.locator("div.pending-img", {
      hasText: productName,
    });
    await postRow.locator("button.btn-img").click();
    await expect(this.page).toHaveURL(
      /.*\/receivedorders\/productforsaledetails\//
    );
  }

  async openCompletedBSMReceivedOrders() {
    await this.page.locator(".nav-tabs a", {
      hasText: "completed",
      exact: false,
    }).click();
    await this.page.locator(".completed-tab-sec a", {
      hasText: "Buy & Sell with Market (BSM)",
      exact: false,
    }).click();
  }

  async verifyCompletedProduct(productName) {
    const postRow = this.page.locator("div.pending-img", {
      hasText: productName,
    });
    await expect(
      postRow.locator("h5").first()
    ).toHaveText(productName);
    return postRow;
  }

  async relistProduct(productName) {
    const postRow = await this.verifyCompletedProduct(
      productName
    );
    await postRow.locator("button", {
      hasText: "Re-list",
    }).click();
  }

  async verifyRelistedProduct(productName) {
    await expect(
      this.page.getByText(
        "BSM Service Created Successfully"
      )
    ).toBeVisible();
    await this.page.goto(
      "/en/searchbuyproducts",
      { waitUntil: "networkidle" }
    );
    const productCard = this.page.locator(
      "div.packaged-img",
      {
        hasText: productName,
      }
    );
    await expect(productCard).toBeVisible();
    await expect(
      productCard.locator("h6")
    ).toHaveText(productName);
  }

  async verifyUpdatedSuccessfully() {
    await expect(
      this.page.getByText("Updated Successfully")
    ).toBeVisible();
  }


}

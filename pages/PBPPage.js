import { expect } from "@playwright/test";
import { BasePage } from "./base_page";

export default class PBPPage extends BasePage {
  constructor(page) {
    super(page);
    this.postNames = page.locator("//div[@class='filter-detail']//h5");
    this.search_box = page.getByRole("textbox", { name: "Search PBP" });
    this.search_button = page.getByRole("button", { name: "Search" });
    this.create_a_post_button = page.locator(
      "//button[contains(text(),'Create a post')]",
    );
    this.recently_viewed_tab = page.locator(
      "//a[contains(text(),'Recently viewed')]",
    );
    this.post_details = page.locator("//div[contains(@class,'post-details')]");
    this.heart_button = page.locator("//button[contains(@class,'heart-btn')]");
    this.saved_posts_tab = page.locator("//a[contains(text(),'Saved posts')]");
    this.post_not_found = page.locator("//div[@class='content-loader']");
    this.recently_posted_filter = page.locator(
      "//div[contains(text(),'Recently Posted')]/parent::div/parent::div",
    );
    this.old_post_option = page.getByRole("option", { name: "Old Posts" });
    this.select_industry_filter = page.locator(
      "//div[contains(text(),'Select Industry')]/parent::div/parent::div",
    );
    this.energy_option = page.getByRole("option", { name: "Energy" });
    this.business_option = page.getByRole("option", { name: "Business" });
    this.select_category_filter = page.locator(
      "//div[contains(text(),'Select Category')]/parent::div/parent::div",
    );
    this.oil_category = page.getByRole("option", { name: "Oil" });
    this.mac_category = page.getByRole("option", { name: "Managing and Consultant" });
    this.select_sub_category_filter = page.locator(
      "//div[contains(text(),'Select Sub Category')]/parent::div/parent::div",
    );
    this.drilling_sub_category = page.getByRole("option", { name: "Drilling" });
    this.pm_sub_category = page.getByRole("option", { name: "Project Management" });
    this.clear_filter_button = page.locator(
      "//a[contains(text(),'Clear filters')]",
    );
    this.pagination = page.locator("//ul[@class='pagination']/li/a");
    this.apply_button = page.locator("//button[contains(text(),'Apply Now')]");
    this.next_button = page.getByRole("button", { name: "Next" });
    this.required_error = page.getByText("This is required");
    this.required_industry_error = page.getByText("Industry is required");
    this.required_category_error = page.getByText("Category is required");
    this.umbrella_checkbox = page.locator("#checkbox-is_ambrella");
    this.select_umbrella_project = page.getByText("Select Umbrella project *");
    this.create_new_umbrella_project = page.getByText(
      "Create new Umbrella project",
    );
    this.required_competencies_error = page.locator("//p[contains(text(),'At least 3 competencies required')]");
    this.maximum_project_budget_error = page.locator("//div[contains(text(),'Maximum project budget is required')]");
    this.duration_required_error = page.locator("//div[contains(text(),'Duration is required')]");
    this.expected_deliverables_input = page.locator("//div[contains(@class,'ql-editor')]");
    this.view_details_button = page.locator("//button[contains(text(),'View details')]");
    this.edit_details_button = page.locator("//button[contains(text(),'Edit details')]");
    this.cancel_button = page.locator("//button[contains(text(),'Cancel')]");
    this.save_button = page.locator("//button[contains(text(),'Save')]");
    this.confirm_cancellation_popup = page.locator("//h4[contains(text(),'Confirm Cancellation')]");
    this.confirm_cancellation_button = page.locator("//button[contains(text(),'Confirm')]");
    this.its_cancelled_button = page.locator("//button[contains(text(),'It’s cancelled')]");
    this.posts_list = page.locator(".filter-detail");
    this.proposal_submit = page.locator("//button[@type='submit']");
    this.postCard = (postName) => page.locator(".filter-detail", { hasText: postName });
    this.applyButton = page.getByRole("button", {
      name: "Apply Now",
      exact: true,
    });
    this.submitProposalButton = page.locator("//button[@type='submit']");
    this.errorMessages = page.locator(".error");
    this.view_milestone = page.locator("//button[contains(text(),'View milestone')]");
    this.submit_work = page.locator(".work-submit");
    this.submission_tab = page.locator("#Milestones .modal-content .submission-sec");
    this.approve_submisstion = page.locator("//button[contains(text(),'Approve Submission')]");
    this.project_complete_status = page.locator("//h3[contains(text(),'Project Completed')]");
    this.overview_submission_tab = page.locator("#Overview .modal-content .submission-sec");
    this.addUpdateButton = page.getByText("Add/Update")
    this.milestoneHeading = page.getByRole("heading", { name: "Add / Update Milestones" });
    this.milestoneTitle = page.getByRole("textbox", { name: "Enter milestone title" });
    this.milestoneDuration = page.getByRole("textbox", { name: "Duration", exact: true });
    this.milestonePrice = page.getByRole("textbox", { name: "Price", exact: true });
    this.saveMilestoneButton = page.locator("//button[contains(text(),'Save')]");
    this.submitProposalButton = page.locator("//button[contains(text(),'Submit Proposal')]");
    this.proposalError = page.locator(".error");
    this.proposalSuccessMessage = page.getByText("Congratulations! Your Proposal has been submitted successfully.");
    this.manageWorkTab = page.getByText("Post & Browse Projects (PBP)", { exact: true });
    this.appliedPost = (postName) => page.locator(".post-back", { hasText: postName });
    this.manageOrderTab = page.locator("a", { hasText: "My Orders" });
    this.orderTabs = page.locator("#MyOrderPostedorders").locator(".order-tabs");
    this.PBPTab = this.orderTabs.locator("a", { hasText: "Post & Browse Projects (PBP)", exact: false });
    this.postedPBPHeading = page.locator(".tab-content").locator("h4", { hasText: "Posted Post & Browse Projects (PBP)" });
    this.orderCard = (postName) => page.locator("h3", { hasText: postName });
    this.postNavTabs = page.locator(".nav-tabs");
    this.proposalsTab = this.postNavTabs.locator("a", { hasText: "All Proposals", exact: false });
    this.sendOfferButton = page.locator(".all-proposal", { has: page.locator("h5", { hasText: "Shivakumar GP", }) }).getByRole("button", { name: "Send Offer" });
    this.sendOfferButton_cmp = page.locator(".all-proposal", { has: page.locator("h5", { hasText: "Shivakumar Padaiyachi", }) }).getByRole("button", { name: "Send Offer" });
    this.contractCheckbox = page.locator("label[for='agree']");
    this.scrollToBottomButton = page.locator(".popup-contract-container").locator("button", { name: "Scroll to Bottom", exact: true });
    this.agreeCheckbox = page.locator(".popup-contract-container").locator("input[id='agree']");
    this.acceptButton = page.locator("button", { hasText: "Accept" });
    this.paymentButton = page.locator(".all-proposal", { has: page.locator("h5", { hasText: "Shivakumar GP" }) }).locator("button", { hasText: "Pay", exact: true });
    this.paymentButton_cmp = page.locator(".all-proposal", { has: page.locator("h5", { hasText: "Shivakumar Padaiyachi" }) }).locator("button", { hasText: "Pay", exact: true });
    this.makePaymentButton = page.locator("button", { hasText: "Make Payment" });
    this.saveAndMakePaymentButton = page.locator("button", { hasText: "Save and make payment" });
    this.cardNumberFrame = page.locator('iframe[title="Card Number"]');
    this.cardNumberInput = page.frameLocator('iframe[title="Card Number"]').locator('input[name="card.number"]');
    this.expiryInput = page.locator('input[placeholder="MM / YY"]');
    this.cardHolderInput = page.locator('input[placeholder="Card holder"]');
    this.cvvInput = page.frameLocator('iframe[title="Security Code CVV"]').locator('input[name="card.cvv"]');
    this.payNowButton = page.getByRole("button", { name: "Pay now" });
    this.paymentGatewayPayButton = page.locator('input[value="Pay"]');
    this.paymentSuccessMessage = page.getByText("PBP Milestone Payment Completed").first();
    this.offersTab = page.locator(".nav-tabs").locator("a", { hasText: "Offers", exact: true });
    this.acceptOfferButton = page.getByRole("button", { name: "Accept offer" });
    this.acceptAndStartProjectButton = page.locator("button", { hasText: "Accept & Start project" });
    this.offerAcceptedMessage = page.getByText("The Offer Has Been Accepted");
    this.activeProjectsTab = page.locator("a:has-text('Active projects')");
    this.inProgressText = page.locator(".progress-sec");
    this.viewSubmissionButton = page.locator(".work-submit");
    this.submitWorkForPaymentButton = page.locator("//div[@class='tab-pane active']//button[contains(text(),'Submit work for payment')]");
    this.submitWorkPopup = page.locator("//div[@class='modal-content']//p[contains(text(),'Submit work for payment')]");
    this.fileUpload = page.locator("input[type='file']");
    this.uploadedImage = page.locator("//img[@alt='Delete']");
    this.submitWorkButton = page.locator("//button[contains(text(),'Submit Work')]");
    this.workSubmitSuccess = page.locator(".custom-popup.alert.alert-success");
  }

  async verifyPBPPage() {
    await expect(this.page).toHaveURL("https://urxprt.com/en/searchall?type=1");
  }

  async verifyPostDetailsIsVisible(newPage) {
    const postDetails = newPage.locator(
      "//div[contains(@class,'post-details')]",
    );
    await postDetails.waitFor();
    await expect(postDetails).toBeVisible();
  }

  async goToRecentlyReviewedPage() {
    await this.recently_viewed_tab.click();
  }

  async goToSavedPostsPage() {
    await this.saved_posts_tab.click();
  }

  async clickOnFirstPostsHeartButton() {
    await this.heart_button.first().click();
  }

  async waitForPosts() {
    await this.postNames.first().waitFor();
  }

  async getRandomPostName() {
    const count = await this.postNames.count();
    if (count === 0) {
      throw new Error("No elements found");
    }
    const randomIndex = Math.floor(Math.random() * count);
    const text = await this.postNames.nth(randomIndex).textContent();
    return text?.trim() || "";
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

  async searchFor(text) {
    await this.search_box.fill(text);
    await this.search_button.click();
  }

  async waitForFilteredResults() {
    await expect
      .poll(async () => await this.postNames.count())
      .toBeLessThanOrEqual(1);
  }

  async waitForReviewedPostToAppear() {
    await expect
      .poll(async () => await this.postNames.count())
      .toBeGreaterThanOrEqual(1);
  }

  async waitForSavedPostToAppear() {
    await expect
      .poll(async () => await this.postNames.count())
      .toBeGreaterThanOrEqual(1);
  }

  async getPostCount() {
    return await this.postNames.count();
  }

  async goToTheFilteredPostetails() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.postNames.click(),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  async clickOnCreateAPostButton() {
    await this.create_a_post_button.click();
  }

  async verifyThatTheTabHasNoPosts() {
    await expect(this.post_not_found).toBeVisible();
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

  async chooseBusinessFromIndustryFilter() {
    await this.select_industry_filter.click();
    await expect(this.business_option).toBeVisible();
    await this.business_option.click();
  }

  async chooseOilFromCategoryFilter() {
    await this.select_category_filter.click();
    await expect(this.oil_category).toBeVisible();
    await this.oil_category.click();
  }

  async chooseMACFromCategoryFilter() {
    await this.select_category_filter.click();
    await expect(this.mac_category).toBeVisible();
    await this.mac_category.click();
  }

  async chooseDrillingFromSubCategory() {
    await this.select_sub_category_filter.click();
    await expect(this.drilling_sub_category).toBeVisible();
    await this.drilling_sub_category.click();
  }

  async choosePMFromSubCategory() {
    await this.select_sub_category_filter.click();
    await expect(this.pm_sub_category).toBeVisible();
    await this.pm_sub_category.click();
  }

  async getTheTotalPageNumber() {
    const totalCount = await this.pagination.count();
    return await this.pagination.nth(totalCount - 2).textContent();
  }

  async getUpdatedPageNumber() {
    const count = await this.pagination.count();
    if (count < 2) {
      return "1";
    }
    return (
      await this.pagination.nth(count - 2).textContent()
    )?.trim() ?? "1";
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

  async verifyJoinAsExpertOrCompanyPopUpAppearsForUserAccount(newPage) {
    const popUp = newPage.locator("//div[@class='modal-content']");
    await expect(popUp).toBeVisible();
    const heading = newPage.locator(
      "//h4[contains(text(),'Please Join As Company / Expert')]",
    );
    await expect(heading).toBeVisible();
  }

  async verifyJoinAsExpertAndJoinAsCompanyButtonIsClickable(newPage) {
    const joinAsExpertBtn = newPage.locator(
      "//button[contains(text(),'Join As Expert')]",
    );
    const joinAsCompanyBtn = newPage.locator(
      "//button[contains(text(),'Join As Company')]",
    );
    await expect(joinAsCompanyBtn).toBeVisible();
    await expect(joinAsCompanyBtn).toBeEnabled();
    await expect(joinAsExpertBtn).toBeVisible();
    await expect(joinAsExpertBtn).toBeEnabled();
  }

  async closePopUp(newPage) {
    const closeBtn = newPage.locator(
      "//button[contains(@class,'close-button')]/img",
    );
    await closeBtn.click();
  }

  async clickOnNextButton() {
    this.next_button.click();
  }

  async verifyElementsVisible(locators) {
    for (const locator of locators) {
      await expect(locator).toBeVisible();
    }
  }

  async clickOnUmbrellaCheckbox() {
    this.umbrella_checkbox.click();
  }

  async verifyUmbrellaSelectAndCreateNewOptionIsVisible() {
    await expect(this.select_umbrella_project).toBeVisible();
    await expect(this.create_new_umbrella_project).toBeVisible();
  }

  async verifyUmbrellaSelectAndCreateNewOptionIsHidden() {
    await expect(this.select_umbrella_project).toBeHidden();
    await expect(this.create_new_umbrella_project).toBeHidden();
  }

  async goToEditProjectDetailsPage() {
    await this.view_details_button.first().click();
    await this.edit_details_button.click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickOnSaveNButton() {
    await this.save_button.click();
  }

  async cancelCreatedPBPPost() {
    await this.cancel_button.first().click();
    await expect(this.confirm_cancellation_popup).toBeVisible();
    await this.confirm_cancellation_button.click();
  }

  async getTotalPostsCount() {
    const totalCount = await this.posts_list.count();
    return totalCount;
  }

  async openPost(postName) {
    await expect(this.postCard(postName)).toBeVisible();
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.postCard(postName).click(),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  async clickApplyNow(newPage) {
    await newPage
      .getByRole("button", { name: "Apply Now", exact: true })
      .click();
    await newPage.waitForLoadState("networkidle");
  }

  async submitProposal(newPage) {
    await newPage.locator("//button[@type='submit']").click();
  }

  async getProposalErrors(newPage) {
    const errorLocators = newPage.locator(".error");
    const count = await errorLocators.count();
    const errors = [];
    for (let i = 0; i < count; i++) {
      errors.push(
        (await errorLocators.nth(i).textContent()).trim()
      );
    }
    return errors;
  }

  async goToMyOrderPBPTab() {
    await this.page.goto(`/en/dashboard/myorders`, { waitUntil: "networkidle" });
    const orderTabs = this.page.locator("#MyOrderPostedorders").locator(".order-tabs");
    const PBPTab = orderTabs.locator("a", { hasText: "Post & Browse Projects (PBP)", exact: false });
    await PBPTab.click();
  }

  async verifyPostIsPresentInActivePBPPost(PBPPostName) {
    const tabContent = this.page.locator(".tab-content");
    const PostedPBP = tabContent.locator("h4", {
      hasText: "Active Post & Browse Projects (PBP)",
    });
    await expect(PostedPBP).toBeVisible();
    const orderCard = this.page.locator("h3", {
      hasText: PBPPostName,
    });
    await expect(orderCard).toBeVisible();
  }

  async verifyPostIsPresentInPBPManageWork(PBPPostName) {
    const postCard = this.page
        .locator(".tab-pane.active .post-back h3")
        .filter({ hasText: PBPPostName });

    await expect(postCard).toHaveCount(1);
    await expect(postCard).toBeVisible();
  }


  async viewDetailsOfPBPPost(PBPPostName) {
    await this.page.locator("//h3[contains(text(),'" + PBPPostName + "')]/parent::div/following-sibling::button").click();
  }

  async approveSubmission() {
    await this.approve_submisstion.click();
  }

  async verifyUserIsAbleToSeeStatusAsComplete() {
    const completeStatus = await this.page.locator("//a/span[contains(text(),'Completed')]");
    await expect(completeStatus).toBeVisible();
  }

  async goToMilestoneTab() {
    const postNavTabs = this.page.locator(".nav-tabs");
    const milestonesTab = postNavTabs.locator("a", {
      hasText: "Milestones",
      exact: false,
    });
    await milestonesTab.click();
  }

  async goToActivePBPPostInPBPManageWork() {
    const manageWorkTab = this.page.getByText('Post & Browse Projects (PBP)', { exact: true });
    await manageWorkTab.click();
    const activePost = this.page.locator("a:has-text('Active projects')");
    await activePost.click();
    await expect(activePost).toBeVisible();
  }

  async openSubmissionTab() {
    await this.page.locator("//div[@class='post-back']//button[contains(text(),'View Submission')]").click();
  }

  async closeSubmissionTab() {
    const closeSubmissionTabButton = await this.page.locator("#Overview .modal-content .close-button img");
    await closeSubmissionTabButton.click();
  }

  async fillProposalDetails(basePage, message, price, duration) {
    await basePage.fillInputWithPlaceholder(
      "Enter your message",
      message
    );

    await basePage.fillInputWithPlaceholder(
      "Enter proposed price",
      price
    );

    await basePage.fillInputWithPlaceholder(
      "Enter duration",
      duration
    );
  }

  async clickAddUpdate(newPage) {
    await newPage.getByText("Add/Update").click();
  }

  async fillMilestone(
    newPage,
    basePage,
    title,
    durationType,
    duration,
    price,
    penalty
  ) {
    await newPage
      .getByRole("textbox", {
        name: "Enter milestone title",
      })
      .fill(title);

    await basePage.clickFromDropdown(
      "Duration type",
      durationType
    );

    await newPage
      .getByRole("textbox", {
        name: "Duration",
        exact: true,
      })
      .fill(duration);

    await newPage
      .getByRole("textbox", {
        name: "Price",
        exact: true,
      })
      .fill(price);

    await basePage.clickFromDropdown(
      "Penalty in %",
      penalty
    );
  }

  async saveMilestone(newPage) {
    await newPage
      .locator("//button[contains(text(),'Save')]")
      .click();
  }

  async submitProposal(newPage) {
    await newPage
      .locator("//button[contains(text(),'Submit Proposal')]")
      .click();
  }

  async updateProjectDuration(basePage, duration) {
    await basePage.fillInputWithPlaceholder(
      "Enter duration",
      duration
    );
  }

  async goToPBPManageWork() {
    await this.manageWorkTab.click();
  }

  async verifyAppliedPost(postName) {
    await expect(
      this.appliedPost(postName)
    ).toBeVisible();
  }

  async goToPostedPBPOrders() {
    await this.manageOrderTab.click();
    await this.PBPTab.click();
  }

  async verifyPostedPBPPage() {
    await expect(
      this.postedPBPHeading
    ).toBeVisible();
  }

  async verifyOrderCard(postName) {
    await expect(
      this.orderCard(postName)
    ).toBeVisible();
  }

  async openPostDetails(postName) {
    await this.page.locator("//h3[contains(text(),'" + postName + "')]/parent::div/following-sibling::button").click();
  }

  async openProposalTab() {
    await this.proposalsTab.click();
  }

  async sendOffer() {
    await this.sendOfferButton.click();
  }

  async sendOffer_cmp() {
    await this.sendOfferButton_cmp.click();
  }

  async acceptContract() {
    await this.contractCheckbox.click();
    await this.page.waitForTimeout(1000);
    await this.scrollToBottomButton.click();
    await this.agreeCheckbox.click();
    await this.page.waitForLoadState("networkidle");
    await this.acceptButton.click();
  }

  async clickPaymentButton() {
    await expect(this.paymentButton).toBeVisible();
    await this.paymentButton.click();
  }

  async clickPaymentButton_cmp() {
    await expect(this.paymentButton_cmp).toBeVisible();
    await this.paymentButton_cmp.click();
  }

  async proceedForPayment() {
    await expect(this.makePaymentButton).toBeVisible();
    await this.makePaymentButton.click();
    await this.saveAndMakePaymentButton.click();
  }

  async fillCardDetails() {
    await expect(this.cardNumberFrame).toBeVisible();
    await this.cardNumberInput.fill("5555555555554444");
    await this.expiryInput.fill("12 / 30");
    await this.cardHolderInput.fill("Test User");
    await this.cvvInput.fill("123");
  }

  async clickPayNow() {
    await Promise.all([
      this.page.waitForURL("**oppwa.com/**"),
      this.payNowButton.click(),
    ]);
  }

  async completePayment() {
    await this.page.waitForLoadState("networkidle");
    await this.paymentGatewayPayButton.click();
  }

  async verifyPaymentSuccess() {
    await expect(this.paymentSuccessMessage).toBeVisible();
  }

  async openOffersTab() {
    await this.offersTab.click();
  }

  async acceptOffer() {
    await this.acceptOfferButton.click();
  }

  async acceptOfferAgreement() {
    await this.page.locator("label[for='agree']").click();
    await this.page.waitForTimeout(1000);
    await this.page.locator(".popup-contract-container").locator("button", {
      name: "Scroll to Bottom",
      exact: true,
    }).click();
    await this.page.locator(".popup-contract-container").locator("input[id='agree']").click();
    await this.page.waitForLoadState("networkidle");
    await this.acceptAndStartProjectButton.click();
  }

  async verifyOfferAccepted() {
    await expect(this.offerAcceptedMessage).toBeVisible();
  }

  async openActiveProjectsTab() {
    await this.activeProjectsTab.click();
    await expect(this.activeProjectsTab).toBeVisible();
  }

  async openMilestoneTab() {
    await this.view_milestone.click();
  } 

  async verifyWorkInProgress() {
    await expect(this.inProgressText).toBeVisible();
  }
  
  async verifySubmissionButtonNotVisible() {
    await expect(this.viewSubmissionButton).not.toBeVisible();
  }

  async clickSubmitWorkForPayment() {
    await this.submitWorkForPaymentButton.click();
  }

  async verifySubmitWorkPopup() {
    await expect(this.submitWorkPopup).toBeVisible();
  }

  async uploadWork(filePath) {
    await this.fileUpload.setInputFiles(filePath);
    await expect(this.uploadedImage).toBeVisible();
  }

  async submitWork() {
    await this.submitWorkButton.click();
  }

  async verifyWorkSubmissionSuccess() {
    const successMessage = await this.workSubmitSuccess.textContent();
    await expect(successMessage).toContain("Work submitted for payment successfully");
  }
}

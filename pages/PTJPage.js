import { expect } from "@playwright/test";
import { BasePage } from "./base_page";

export default class PTJPage extends BasePage {
  constructor(page) {
    super(page);
    this.postNames = page.locator("//div[@class='filter-detail']//h5");
    this.posts_list = page.locator(".filter-detail");
    this.search_box = page.getByRole("textbox", { name: "Search PTJ" });
    this.search_button = page.getByRole("button", { name: "Search" });
    this.create_a_post_button = page.locator(
      "//button[contains(text(),'Create a post')]",
    );
    this.recently_viewed_tab = page.locator(
      "//a[contains(text(),'Recently viewed')]",
    );
    this.success_message = page.locator(".custom-popup.alert.alert-success");
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
    this.ecom_option = page.getByRole("option", { name: "E Commerce" });
    this.select_category_filter = page.locator(
      "//div[contains(text(),'Select Category')]/parent::div/parent::div",
    );
    this.oil_category = page.getByRole("option", { name: "Oil" });
    this.sc_category = page.getByRole("option", { name: "Supply Chain" });
    this.select_sub_category_filter = page.locator(
      "//div[contains(text(),'Select Sub Category')]/parent::div/parent::div",
    );
    this.drilling_sub_category = page.getByRole("option", { name: "Drilling" });
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
  }

  async verifyPTJPage() {
    await expect(this.page).toHaveURL("https://urxprt.com/en/searchall?type=3");
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

  async chooseECommerceFromIndustryFilter() {
    await this.select_industry_filter.click();
    await expect(this.ecom_option).toBeVisible();
    await this.ecom_option.click();
  }

  async chooseOilFromCategoryFilter() {
    await this.select_category_filter.click();
    await expect(this.oil_category).toBeVisible();
    await this.oil_category.click();
  }

  async chooseSupplyChainFromCategoryFilter() {
    await this.select_category_filter.click();
    await expect(this.sc_category).toBeVisible();
    await this.sc_category.click();
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

  async getTotalPostsCount() {
    const totalCount = await this.posts_list.count();
    return totalCount;
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

  async cancelCreatedPBPPost() {
    await this.cancel_button.click();
    await expect(this.confirm_cancellation_popup).toBeVisible();
    await this.confirm_cancellation_button.click();
  }

  async goToEditProjectJobPage() {
    await this.view_details_button.first().click();
    await this.edit_details_button.click();
    await this.page.waitForLoadState("networkidle");
  }

  async saveFirstPost() {
    await this.page.waitForLoadState("networkidle");
    await this.heart_button.first().waitFor();
    await this.heart_button.first().click();
  }

  async verifySavedPost(postName) {
    await expect(this.postNames.first()).toBeVisible();
    await expect(this.postNames).toContainText(postName);
  }

  async verifySuccessMessageIsDisplayed(text) {
    await expect(this.success_message).toBeVisible();
    const message = await this.success_message.textContent();
    expect(message).toContain(text);
  }

  async openFirstFilteredPost() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.postNames.click(),
    ]);
    await newPage.waitForLoadState();
      return newPage;
  }

  async verifyRecentlyViewedPost(postName) {
    await this.searchFor(postName);
    await this.postNames.first().waitFor();
    await this.page.waitForTimeout(1200);
    const count = await this.postNames.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const text = await this.postNames.first().textContent();
    expect(text).toContain(postName);
  }

  async clickNext() {
    await this.next_button.click();
  }

  async postJob() {
    await this.page.getByRole("button", { name: "Post Job" }).click();
  }

  async verifyPTJSummary() {
    await expect(this.page.getByText("Part time job (PTJ) Summary")).toBeVisible();
  }

  async verifyPostCreated() {
    await expect(this.page.getByText("Congratulations! Your post is now live.")).toBeVisible();
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
    await this.cancel_button.click();
    await expect(this.confirm_cancellation_popup).toBeVisible();
    await this.confirm_cancellation_button.click();
  }

  async openPost(postName) {
    const postCard = this.page.locator(".filter-detail", {
      hasText: postName,
    });
    await expect(postCard).toBeVisible();
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      postCard.click(),
    ]);
    await newPage.waitForLoadState();
      return newPage;
  }

  async applyForJob(newPage) {
    await newPage.getByRole("button", {
      name: "Apply for job",
      exact: true,
    }).click();
    await newPage.waitForLoadState("networkidle");
  }

  async submitProposal(newPage) {
    const pageObj = new BasePage(newPage);
    await pageObj.fillInputWithPlaceholder(
      "Enter your message",
      "This is a test cover letter for automation"
    );
    await pageObj.fillInputWithPlaceholder(
      "Enter price in $",
      "8"
    );
    await pageObj.uploadFile(
      "Attach files",
      "testData/Cover-Letter-Samples.pdf"
    );
    await newPage.locator("//button[@type='submit']").click();
  }

  async verifyProposalSubmitted(newPage) {
    await expect(
      newPage.getByText(
        "Congratulations! Your Proposal has been submitted successfully."
      )
    ).toBeVisible();
  }

  async openAllProposalsTab() {
    await this.page.locator(".nav-tabs").locator("a", {
      hasText: "All Proposals",
      exact: false,
    }).click();
  }

  async sendOfferToCompany(userName) {
    const proposalCard = this.page.locator(".all-proposal", {
      has: this.page.locator("h5", {
        hasText: userName,
      }),
    });

    await proposalCard
      .getByRole("button", {
        name: "Send Offer",
      })
      .click();
  }

  async acceptOfferContract() {
    await this.page.waitForTimeout(500);
    await this.page.locator("label[for='agree']").click();
    await this.page.waitForTimeout(500);
    await this.page
      .locator(".popup-contract-container")
      .locator("button", {
        name: "Scroll to Bottom",
        exact: true,
      })
      .click();
    await this.page.waitForTimeout(500);
    await this.page
      .locator(".popup-contract-container")
      .locator("input[id='agree']")
      .click();
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500);
    await this.page.locator("button", {
      hasText: "Accept",
    }).click();
    await this.page.waitForTimeout(500);
  }

  async openManageWorkPost(postName) {
    const postCard = this.page.locator(
      ".post-back.recent-back.recent-first",
      {
        hasText: postName,
      }
    );
    await expect(postCard).toBeVisible();
    await postCard
      .getByRole("button", {
        name: "View Details",
      })
      .click();
  }

  async openOffersTab() {
    await this.page.locator(".nav-tabs").locator("a", {
      hasText: "Offers",
      exact: true,
    }).click();
  }

  async clickAcceptOffer() {
    await this.page
      .getByRole("button", {
        name: "Accept offer",
      })
      .click();
  }

  async acceptStartJobContract() {
    await this.page.waitForTimeout(500);
    await this.page.locator("label[for='agree']").click();
    await this.page.waitForTimeout(500);
    await this.page
      .locator(".popup-contract-container")
      .locator("button", {
        name: "Scroll to Bottom",
        exact: true,
      })
      .click();
    await this.page.waitForTimeout(500);
    await this.page
      .locator(".popup-contract-container")
      .locator("input[id='agree']")
      .click();
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500);
    await this.page.locator("button", {
      hasText: "Accept & Start Job",
    }).click();
    await this.page.waitForTimeout(500);
  }

  async verifyOfferAccepted() {
    await expect(
      this.page.getByText(
        "The Offer Has Been Accepted"
      )
    ).toBeVisible();
  }

  async openProposalForPayment(postName, userName) {
  const orderCard = this.page.locator("h3", {
    hasText: postName,
  });

  await expect(orderCard).toBeVisible();
  await orderCard.click();

  await this.openAllProposalsTab();

  const proposalCard = this.page.locator(".all-proposal", {
    has: this.page.locator("h5", {
      hasText: userName,
    }),
  });

  const paymentButton = proposalCard.locator("button", {
    hasText: "Pay",
    exact: true,
  });

  await expect(paymentButton).toBeVisible();
  await paymentButton.click();
}

async makeProposalPayment() {
  await expect(
    this.page.locator("button", {
      hasText: "Make Payment",
    })
  ).toBeVisible();

  await this.page.locator("button", {
    hasText: "Make Payment",
  }).click();

  await this.page.locator("button", {
      hasText: "Save and make payment",
    }).click();
  }

  async fillCardDetails() {
    await expect(
      this.page.locator('iframe[title="Card Number"]')
    ).toBeVisible();

    await this.page
      .frameLocator('iframe[title="Card Number"]')
      .locator('input[name="card.number"]')
      .fill("5555555555554444");

    await this.page
      .locator('input[placeholder="MM / YY"]')
      .fill("12 / 30");

    await this.page
      .locator('input[placeholder="Card holder"]')
      .fill("Test User");

    await this.page
      .frameLocator('iframe[title="Security Code CVV"]')
      .locator('input[name="card.cvv"]')
      .fill("123");
  }

  async submitPayment() {
    await Promise.all([
      this.page.waitForURL("**oppwa.com/**"),
      this.page.getByRole("button", {
        name: "Pay now",
      }).click(),
    ]);

    await this.page.waitForLoadState("networkidle");

    await this.page
      .locator('input[value="Pay"]')
      .click();
  }

  async verifyPaymentSuccess() {
    await expect(
      this.page.getByText("PTJ Payment Completed").first()
    ).toBeVisible();
  }

  async openActiveJobsTab() {
    const activeJobsTab = this.page.locator(
      "a:has-text('Active jobs')"
    );
    await activeJobsTab.click();
    await expect(activeJobsTab).toBeVisible();
  }

  async openActiveJob(postName) {
    const postCard = this.page
      .locator("div.post-back.recent-back")
      .filter({
        hasText: postName,
      });
    await expect(postCard).toBeVisible();
    await postCard.click();
  }

  async verifyActiveJob(postName) {
    const postCard = this.page
      .locator("div.post-back.recent-back")
      .filter({
        hasText: postName,
      });
    await expect(postCard).toBeVisible();
  }

  async clickLogTime() {
    await this.page.getByRole("button", {
      name: "+ Log time",
    }).click();
  }

  async verifyTimesheetTabVisible() {
    const timesheetTab = this.page
      .locator(".nav-tabs")
      .locator("a:has-text('Timesheet')");

    await expect(timesheetTab).toBeVisible();
  }

  async enterWorkLogDescription(description) {
    await this.page
      .getByPlaceholder("What have you worked on?")
      .fill(description);
  }

  async selectStartTime(hour, minute, period) {
    await this.page
      .locator(".form-group")
      .filter({ hasText: "Start Time" })
      .locator(".rs-picker-toggle-wrapper")
      .click();
    const popup = this.page.locator(".rs-picker-popup-date").last();
    await expect(popup).toBeVisible();
    await popup.locator(`[data-key="hours-${hour}"]`).click();
    await popup.locator(`[data-key="minutes-${minute}"]`).click();
    await popup.getByRole("option", { name: period }).click();
    await popup.getByRole("button", { name: "OK" }).click();
    await expect(popup).toBeHidden();
  }

  async selectEndTime(hour, minute, period) {
    await this.page
      .locator(".form-group")
      .filter({ hasText: "End Time" })
      .locator(".rs-picker-toggle-wrapper")
      .click();
    const popup = this.page.locator(".rs-picker-popup-date").last();
    await expect(popup).toBeVisible();
    await popup.locator(`[data-key="hours-${hour}"]`).click();
    await popup.locator(`[data-key="minutes-${minute}"]`).click();
    await popup.getByRole("option", { name: period }).click();
    await popup.getByRole("button", { name: "OK" }).click();
    await expect(popup).toBeHidden();
  }

  async selectWorkDate(date) {
    await this.page.locator("#date").fill(date);
  }

  async verifyTotalHours(hours) {
    const totalHours = this.page
      .locator(".form-group")
      .filter({ hasText: "Total hours" })
      .locator("h6");
    await expect(totalHours).toHaveText(hours);
  }

  async clickLogTimeButton() {
    await this.page.getByRole("button", {
      name: "Log time",
    }).click();
  }

  async verifyPendingSheetsTab() {
    const pendingSheetTab = this.page.locator("button, a", {
      hasText: "Pending Sheets",
    });  
    await expect(pendingSheetTab).toHaveClass(/active/);
  }

  async verifyLoggedDate(date) {
    const dateUpdated = this.page.locator(".week-section h6", {
      hasText: date,
    });
    await expect(dateUpdated).toBeVisible();
    return dateUpdated;
  }

  async verifyLoggedHours(dateLocator, hours) {
    const totalHours = dateLocator.locator("span", {
      hasText: hours,
    });
    await expect(totalHours).toBeVisible();
  }

  async verifyLogEntry(description, startTime, endTime, totalHours, status) {
    const logRow = this.page.locator("div.mockup-row", {
      hasText: description,
    });
    await expect(logRow).toBeVisible();
    await expect(
      logRow.locator("div.col-md-3 p").first()
    ).toHaveText(description);
    const timeCell = logRow.locator("div.mockup-center");
    await expect(
      timeCell.locator("p").nth(0)
    ).toHaveText(startTime);
    await expect(
      timeCell.locator("p").nth(1)
    ).toHaveText(endTime);
    await expect(
      logRow.locator("div.mockup-right h5")
    ).toHaveText(totalHours);
    await expect(
      logRow.locator("p.pending")
    ).toHaveText(status);
  }

}

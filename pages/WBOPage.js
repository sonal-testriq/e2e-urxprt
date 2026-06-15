import { expect } from "@playwright/test";
import { BasePage } from "./base_page";

export default class WBOPage extends BasePage {
  constructor(page) {
    super(page);
    this.postNames = page.locator("//div[@class='filter-detail']//h5");
    this.search_box = page.getByRole("textbox", { name: "Search WBO" });
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
    this.bfi_option = page.getByRole("option", { name: "Banking Financial Institutions" });
    this.select_category_filter = page.locator(
      "//div[contains(text(),'Select Category')]/parent::div/parent::div",
    );
    this.oil_category = page.getByRole("option", { name: "Oil" });
    this.wm_category = page.getByRole("option", { name: "Wealth Management" });
    this.tp_sub_category = page.getByRole("option", { name: "Tax Preparation" });
    this.select_sub_category_filter = page.locator(
      "//div[contains(text(),'Select Sub Category')]/parent::div/parent::div",
    );
    this.drilling_sub_category = page.getByRole("option", { name: "Drilling" });
    this.clear_filter_button = page.locator(
      "//a[contains(text(),'Clear filters')]",
    );
    this.pagination = page.locator("//ul[@class='pagination']/li/a");
    this.posts_list = page.locator(".filter-detail");
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
    this.paynow_button = page.locator("//button[contains(text(),'Pay now')]");
    this.cancel_button = page.locator("//button[contains(text(),'Cancel')]");
    this.save_button = page.locator("//button[contains(text(),'Save')]");
    this.confirm_cancellation_popup = page.locator("//h4[contains(text(),'Confirm Cancellation')]");
    this.confirm_cancellation_button = page.locator("//button[contains(text(),'Confirm')]");
    this.its_cancelled_button = page.locator("//button[contains(text(),'It’s cancelled')]");
    this.cards = page.locator("//div[@class='post-back']");
    this.make_payment_button = page.locator("button", { hasText: "Make Payment" });
    this.save_and_make_payment_button = page.locator("button", { hasText: "Save and make payment" });
    this.card_number_iframe = page.locator('iframe[title="Card Number"]');
    this.card_number = page.frameLocator('iframe[title="Card Number"]').locator('input[name="card.number"]');
    this.expiry_date = page.locator('input[placeholder="MM / YY"]');
    this.card_holder = page.locator('input[placeholder="Card holder"]');
    this.cvv = page.frameLocator('iframe[title="Security Code CVV"]').locator('input[name="card.cvv"]');
    this.pay_now_button = page.getByRole("button", { name: "Pay now" });
    this.pay_button = page.locator('input[value="Pay"]');
    this.payment_success_message = page.getByText("WBO Payment Completed").first();
    this.no_post_on_page = page.locator(".content-loader");
    this.next_button = page.getByRole("button", { name: "Next" });
    this.post_contest_button = page.getByRole("button", { name: "Post Contest" });
    this.order_summary_heading = page.locator("//h6[contains(text(),'Order summary')]");
    this.make_payment_button = page.locator("button", { hasText: "Make Payment", });
    this.save_and_make_payment_button = page.locator("button", { hasText: "Save and make payment" });
    this.submit_entry_button = page.getByRole("button", { name: "Submit entry", exact: true });
    this.error_messages = page.locator(".error");
  }

  async verifyWBOPage() {
    await expect(this.page).toHaveURL("https://urxprt.com/en/searchall?type=2");
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

  async searchForAndWait(text) {
    await this.searchFor(text);
    await this.waitForPosts();
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

  async chooseBusinessFinancialInstitutionFromIndustryFilter() {
    await this.select_industry_filter.click();
    await expect(this.bfi_option).toBeVisible();
    await this.bfi_option.click();
  }

  async chooseOilFromCategoryFilter() {
    await this.select_category_filter.click();
    await expect(this.oil_category).toBeVisible();
    await this.oil_category.click();
  }

  async chooseWealthManagementFromCategoryFilter() {
    await this.select_category_filter.click();
    await expect(this.wm_category).toBeVisible();
    await this.wm_category.click();
  }

  async chooseDrillingFromSubCategory() {
    await this.select_sub_category_filter.click();
    await expect(this.drilling_sub_category).toBeVisible();
    await this.drilling_sub_category.click();
  }

  async chooseTaxPreparationFromSubCategory() {
    await this.select_sub_category_filter.click();
    await expect(this.tp_sub_category).toBeVisible();
    await this.tp_sub_category.click();
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
    await this.page.waitForLoadState("networkidle");
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

  async goToOrderSummaryPage() {
    await this.view_details_button.first().click();
    await this.paynow_button.click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickOnSaveNButton() {
    await this.save_button.click();
  }

  async cancelCreatedWBOPost() {
    await this.cancel_button.click();
    await expect(this.confirm_cancellation_popup).toBeVisible();
    await this.confirm_cancellation_button.click();
  }

  async selectEntryOfUser(userName) {
    const entry = this.page.locator("//span[contains(.,'" + userName + "')]/ancestor::div[2]//img");
    await entry.click();
  }

  async writeComment(comment) {
    const commentBox = await this.page.locator(".rent-product #comment");
    await commentBox.click();
    await commentBox.fill(comment);
    await this.page.waitForTimeout(500);
  }

  async getDelayedPostName(entryCount) {
        await this.cards.first().waitFor();
        const cardCount = await this.cards.count();
        for (let i = 0; i < cardCount; i++) {
            const card = this.cards.nth(i);
            const delay = (await card.locator("//i/parent::p").textContent())?.trim();
            const entries = (await card.locator("//div[contains(@class,'activity')]//p").textContent())?.trim();
            if (
                delay?.includes('day delay') &&
                entries === `Entries: ${entryCount}`
            ) {
                return (await card.locator("//h3").textContent())?.trim();
            }
        }
        return null; // No matching post found
    }

    async clickOnMakePayment() {
      await expect(this.make_payment_button).toBeVisible();
      await this.make_payment_button.click();
    }

    async clickOnSaveAndMakePayment() {
      await this.save_and_make_payment_button.click();
    }

    async fillCardDetails() {
      await expect(this.card_number_iframe).toBeVisible();
      await this.card_number.fill("5555555555554444");
      await this.expiry_date.fill("12 / 30");
      await this.card_holder.fill("Test User");
      await this.cvv.fill("123");
    }

    async clickOnPayNow() {
      await Promise.all([
        this.page.waitForURL("**oppwa.com/**"),
        this.pay_now_button.click(),
      ]);
    }

    async completePayment() {
      await this.page.waitForLoadState("networkidle");
      await this.pay_button.click();
    }

    async verifyPaymentSuccess() {
      await expect(this.payment_success_message).toBeVisible();
    }

    async acceptContract_expert(newpage) {
      await newpage.locator("#first_name").fill("Shivakumar");
      await newpage.locator("#last_name").fill("GP");
      await newpage.locator("label[for='agree']").click();
      await newpage.waitForTimeout(1000);
      await newpage.locator(".popup-contract-container").locator("button", { name: "Scroll to Bottom", exact: true }).click();
      await newpage.locator(".popup-contract-container").locator("input[id='agree']").click();
      await newpage.waitForLoadState("networkidle");
      await newpage.locator("button", { hasText: "Accept & Publish" }).click();
    }

    async acceptContract_company(newpage) {
      await newpage.locator("#first_name").fill("Shivakumar");
      await newpage.locator("#last_name").fill("Padaiyachi");
      await newpage.locator("label[for='agree']").click();
      await newpage.waitForTimeout(1000);
      await newpage.locator(".popup-contract-container").locator("button", { name: "Scroll to Bottom", exact: true }).click();
      await newpage.locator(".popup-contract-container").locator("input[id='agree']").click();
      await newpage.waitForLoadState("networkidle");
      await newpage.locator("button", { hasText: "Accept & Publish" }).click();
    }

    async clickNext() {
      await this.next_button.click();
    }

    async clickPostContest() {
      await this.post_contest_button.click();
    }

    async selectCRMSkill() {
      await this.page
        .locator("p.select-deactive-skill", {
          hasText: "CRM +",
          exact: true,
        })
        .click();
    }

    async openPost(postName) {
      const postCard = this.page.locator(".filter-detail", { hasText: postName });
      await expect(postCard).toBeVisible();
      const [newPage] = await Promise.all([
        this.page.context().waitForEvent("page"),
        postCard.click(),
      ]);
      await newPage.waitForLoadState();
      return newPage; 
    }

    async clickSubmitEntry(newPage) {
      await newPage.getByRole("button", {
        name: "Submit entry",
        exact: true,
      }).click();
    }

    async verifyEntryValidationErrors(newPage) {
      const expectedErrors = [
        "At least one file is required",
        "This is required",
        "This is required",
        "Licensed content is required",
      ];
      const errors = newPage.locator(".error");
      const count = await errors.count();

      for (let i = 0; i < count; i++) {
        const text = (await errors.nth(i).textContent()).trim();
        expect(expectedErrors).toContain(text);
      }
    }

    async uploadEntryFile(newPage, filePath) {
      await newPage.locator('input[type="file"]').setInputFiles(filePath);
    }

    async verifyUploadedFile(newPage) {
      await expect(newPage.locator("//img[@alt='Delete']")).toBeVisible();
    }

    async fillEntryDetails(newPage, title, description) {
      const pageObj = new BasePage(newPage);
      await pageObj.fillInputWithPlaceholder("Enter entry title", title);
      await pageObj.fillInputWithPlaceholder("Enter description here", description);
    }

    async acceptEntryDeclaration(newPage) {
      const pageObj = new BasePage(newPage);
      await pageObj.clickOnCheckbox("This entry is entirely my own.");
    }

    async openWBOOrder(postName) {
      await this.page
        .locator(`//h3[contains(text(),'${postName}')]/parent::div/following-sibling::button`)
        .click();
    }

    async openEntriesTab() {
      await this.page.locator(".nav-tabs").locator("a", {
        hasText: "Entries",
        exact: false,
      }).click();
    }

    async verifyExpertEntry(userName) {
      const entryCard = this.page.locator(".entries", {
        has: this.page.locator("span", { hasText: userName }),
      });

      await expect(entryCard).toBeVisible();
    }

    async verifyCommentPopup() {
      await expect(this.page.locator(".rent-product")).toBeVisible();
    }

    async submitComment(comment) {
      await this.writeComment(comment);
      await this.page.locator(".last-popupsec .btn").click();
      await this.page.waitForTimeout(500);
    }

    async verifyComment(comment) {
      await expect(
        this.page.locator(".modal-comment .comment-sec", {
          hasText: comment,
        })
      ).toBeVisible();
    }

    async closeCommentPopup() {
      await this.page.locator(".rent-product .btn img").click();
    }

    async verifyCommentPopupClosed() {
      await expect(this.page.locator(".rent-product")).not.toBeVisible();
    }

    async verifyCompanyEntry(userName) {
    const entryCard = this.page.locator(".entries", {
      has: this.page.locator("span", { hasText: userName }),
    });

    await expect(entryCard).toBeVisible();
  }

  async verifyAwardContestButton() {
    const awardContestBtn = this.page.locator("//button[contains(.,'Award Contest')]");
    await expect(awardContestBtn).toBeVisible();
    await expect(awardContestBtn).toBeEnabled();
  }

  async clickAwardContest() {
    await this.page.waitForTimeout(1200);
    await this.page.locator("//button[contains(.,'Award Contest')]").click();
  }

  async acceptAwardContract() {
    await this.page.waitForTimeout(500);
    await this.page.locator("label[for='agree']").click();
    await this.page.waitForTimeout(500);
    await this.page.locator(".popup-contract-container").locator("button", {
        name: "Scroll to Bottom",
        exact: true,
      }).click();
    await this.page.waitForTimeout(500);
    await this.page.locator(".popup-contract-container").locator("input[id='agree']")
      .click();
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500);
    await this.page.locator("button", {
        hasText: "Accept and Award Winner",
      }).click();
  }

  async verifyWinnerSelected() {
    await expect(
      this.page.locator(
        "//h6[contains(text(),'Winner has been chosen. Waiting for Submission')]"
      )
    ).toBeVisible();
  }

  async openManageWorkPost(postName) {
    await this.page
      .locator(`//h3[text()='${postName}']/parent::div/following-sibling::button`)
      .click();
  }

  async openHandoverTab() {
    await this.page.locator(".nav-tabs")
      .locator("a", {
        hasText: "Handover",
        exact: true,
      })
      .click();
  }

  async uploadHandoverFile(filePath) {
    await this.page
      .locator('input[type="file"]')
      .setInputFiles(filePath);
  }

  async clickSubmitFiles() {
    await this.page.getByRole("button", {
      name: "Submit files",
      exact: true,
    }).click();
  }

  async verifyAwaitingReviewMessage() {
    await expect(
      this.page.locator(
        "//h6[contains(text(),'Awaiting Review of Submitted Documents')]"
      )
    ).toBeVisible();
  }

  async clickApproveSubmission() {
    const approveButton = this.page.locator(
      "//button[contains(text(),'Approve Submission')]"
    );

    await expect(approveButton).toBeVisible();
    await approveButton.click();
  }

  async verifyAcceptDocumentsPopup() {
    await expect(
      this.page.locator(
        "//h6[contains(text(),'Accept Documents and Files')]"
      )
    ).toBeVisible();
  }

  async confirmSubmissionApproval() {
    await this.page
      .locator("//button[contains(text(),'YES')]")
      .click();
  }

  async verifySubmissionAccepted() {
    await expect(
      this.page.locator(
        "//h6[contains(text(),'Submission Accepted - Congratulations')]"
      )
    ).toBeVisible();
  }

}

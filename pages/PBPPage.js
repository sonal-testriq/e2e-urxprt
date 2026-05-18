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
    this.select_category_filter = page.locator(
      "//div[contains(text(),'Select Category')]/parent::div/parent::div",
    );
    this.oil_category = page.getByRole("option", { name: "Oil" });
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

  async chooseOilFromCategoryFilter() {
    await this.select_category_filter.click();
    await expect(this.oil_category).toBeVisible();
    await this.oil_category.click();
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
}

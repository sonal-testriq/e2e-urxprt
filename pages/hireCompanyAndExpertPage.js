import { expect } from "@playwright/test";
import { BasePage } from "./base_page";

export default class hireCompanyAndExpertPage extends BasePage {
  constructor(page) {
    super(page);
    this.header = page.locator("//h2");
    this.hire_row = page.locator(".hire-row h6");
    this.expertdetail_row = page.locator(".expertdetail-row h6");
    this.expertdetail_row_link = page.locator(".expertdetail-row img");
    this.expertdetails = page.locator(".expert-details");
    this.search_input = page.locator("#search");
    this.search_button = page.locator(".search-btn");
    this.view_profile_button = page.locator("//button[contains(text(),'See Profile')]");
    this.profile_heading = page.locator(".manage-head");
    this.follow_button = page.locator("//button[contains(text(),'Follow')]");
    this.unfollow_button = page.locator("//button[contains(text(),'Unfollow')]");
    this.message_button =page.locator("//button[contains(text(),'Message')]");
    this.hire_expert_button = page.locator("//button[contains(text(),'Message')]");
  }

    async verifyHireCompanyAndExpertPage() {   
        await expect(this.header).toHaveText("Hire Experts / Company with the competencies you need");
        await expect(this.hire_row.first()).toBeVisible();
    } 

    async verifyUserIsOnTheExpectedIndustryPage(expectedIndustry) {
        await expect(this.header).toBeVisible();
        await expect(this.header).toHaveText(expectedIndustry);
    }

    async verifyAllIndustriesAreVisible() {
        const industryCount = await this.hire_row.count();
        expect(industryCount).toBeGreaterThan(0);
    }

    async getAllHireRowTexts() {
        await expect(this.hire_row.first()).toBeVisible();
        const texts = await this.hire_row.allTextContents();
        return texts.map(text => text.trim()).filter(text => text.length > 0);
    }

    async getRandomElementPosition(list) {
        if (!list || list.length === 0) {
            throw new Error("List is empty or undefined");
        }
        return Math.floor(Math.random() * list.length);
    }

    async verifyAllexpertDetailRowsAreVisible() {
        const industryCount = await this.expertdetail_row.count();
        expect(industryCount).toBeGreaterThan(0);
    }

    async getAllExpertDetailRowTexts() {
        await expect(this.expertdetail_row.first()).toBeVisible();
        const texts = await this.expertdetail_row.allTextContents();
        return texts.map(text => text.trim()).filter(text => text.length > 0);
    }

    async verifyUserIsOnExpectedExpertDetailPage(expectedExpert) {
        await this.page.waitForTimeout(1200);
        await expect(this.header).toBeVisible();
        const headerText = await this.header.textContent();
        expect(headerText.trim()).toBe("Hire the best   " +expectedExpert+"  Experts / Company");
    }

    async verifyAllExpertDetailsAreVisible() {
        await expect(this.expertdetails.first()).toBeVisible();
        const expertCount = await this.expertdetails.count();
        expect(expertCount).toBeGreaterThan(0);
    }

    async getAllExpertNameTexts() {
        await expect(this.expertdetails.first()).toBeVisible();
        const texts = await this.expertdetails.locator("h4").allTextContents();
        return texts.map(text => text.trim()).filter(text => text.length > 0);
    }

    async searchForExpert(expertName) {
        await this.search_input.fill(expertName);
        await this.search_button.click();
    }

    async verifySearchResult(expectedExpert) {
        const searchResult = await this.expertdetails.locator("h4");
        await this.page.waitForTimeout(1200);
        expect(searchResult.first()).toBeVisible();
        const resultCount = await searchResult.count();
        expect(resultCount).toBe(1);
        const searchResultText = await searchResult.first().textContent();
        expect(searchResultText.trim()).toBe(expectedExpert);
    }

    async clickOnViewProfileButton(expectedExpert) {
        await this.verifySearchResult(expectedExpert);
        const [newPage] = await Promise.all([
            this.page.waitForEvent('popup'),
            this.view_profile_button.first().click()
        ]);
        await newPage.waitForLoadState();
        return newPage;
    }

    async verifyJoinAsExpertOrCompanyPopUpAppearsForUserAccount() {
    const popUp = this.page.locator("//div[@class='modal-content']");
    await expect(popUp).toBeVisible();
    const heading = this.page.locator(
      "//h4[contains(text(),'Please Join As Company / Expert')]",
    );
    await expect(heading).toBeVisible();
  }

  async verifyJoinAsExpertAndJoinAsCompanyButtonIsClickable() {
    const joinAsExpertBtn = this.page.locator(
      "//button[contains(text(),'Join As Expert')]",
    );
    const joinAsCompanyBtn = this.page.locator(
      "//button[contains(text(),'Join As Company')]",
    );
    await expect(joinAsCompanyBtn).toBeVisible();
    await expect(joinAsCompanyBtn).toBeEnabled();
    await expect(joinAsExpertBtn).toBeVisible();
    await expect(joinAsExpertBtn).toBeEnabled();
  }

  async closePopUp() {
    const closeBtn = this.page.locator(
      "//button[contains(@class,'close-button')]/img",
    );
    await closeBtn.click();
  }

  async verifyFollowUnfollowFlow(newPage) {
    const followButton = newPage.locator("//button[contains(text(),'Follow')]");
    const unfollowButton = newPage.locator("//button[contains(text(),'Unfollow')]");
    await followButton.click();
    await expect(unfollowButton).toBeVisible();
    await unfollowButton.click();
    await expect(followButton).toBeVisible();
  }

  async verifyMessageNavigation(newPage) {
    await Promise.all([
        newPage.waitForURL("https://urxprt.com/en/account/chats/**"),
        newPage.locator("//button[contains(text(),'Message')]").click()
    ]);
    await expect(newPage).toHaveURL("https://urxprt.com/en/account/chats/");
  }

  async verifyHireExpertNavigation(newPage) { 
    // Go back to profile 
    await newPage.goBack(); 
    await Promise.all([ 
        newPage.waitForURL(/https:\/\/urxprt\.com\/en\/youexperthiring\/.*/), 
        newPage.locator("//button[contains(text(),'Hire')]").click() 
    ]); 
    await expect(newPage).toHaveURL(/https:\/\/urxprt\.com\/en\/youexperthiring\/.*/); 
  }

  
}
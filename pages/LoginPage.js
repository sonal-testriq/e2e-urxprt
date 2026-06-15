import { expect } from "@playwright/test";
import { BasePage } from "./base_page.js";
import { pageRoutes } from "../testData/constants.js";

export default class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.signInButton = page.getByRole("button", { name: "Sign in" });
    this.loginButton = page.getByRole("button", { name: "Login account" });
    this.emailField = page.getByRole("textbox", { name: "Email *" });
    this.passwordField = page.getByRole("textbox", { name: "Password *" });
    this.mobileLoginLink = page.locator("//a[contains(text(), 'Login with mobile number')]");
    this.mobileNumberField = page.locator("input[placeholder='Enter mobile number']");
    this.submitViaWhatsapp = page.getByRole('button', { name: 'Verify via WhatsApp' });
    this.submitViaSMS = page.getByRole('button', { name: 'Verify via SMS' });
    this.verifyAndLoginButton = page.getByRole("button", { name: "Verify & Login" });
    this.signupButton = page.getByRole("button", { name: "Sign Up" });
    this.loginErrorPopup = page.locator(".custom-popup.alert.alert-danger");
    this.successPopup = page.locator(".custom-popup.alert.alert-success");
    this.errorMessages = page.locator(".error");
  }

  async openLoginPage() {
    await this.page.goto(pageRoutes.home);
    await this.signInButton.click();
  }

  async openSignupPage() {
    await this.page.goto(pageRoutes.home);
    await this.signupButton.click();
  }

  async gotoHomepage() {
    await this.page.goto(pageRoutes.home);
  }

  async submitLogin() {
    await this.loginButton.click();
  }

  async loginWithEmail(email, password) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.submitLogin();
  }

  async enterEmail(email) {
    await this.emailField.fill(email);
  }

  async clearEmail() {
    await this.emailField.clear();
  }

  async enterPassword(password) {
    await this.passwordField.fill(password);
  }

  async openMobileLogin() {
    await this.mobileLoginLink.click();
  }

  async submitMobileNumber(mobileNumber) {
    await this.mobileNumberField.fill(mobileNumber);
    await this.createAccountButton.click();
  }

  async submitViaMobileSMS(mobileNumber) {
    await this.mobileNumberField.fill(mobileNumber);
    await this.submitViaSMS.click();
  }

  async submitViaMobileWhatsApp(mobileNumber) {
    await this.mobileNumberField.fill(mobileNumber);
    await this.submitViaWhatsapp.click();
  }

  async verifyOtp(otpDigits) {
    const otpInputs = this.page.locator(".otp-container div input");
    for (let i = 0; i < otpDigits.length; i++) {
      await otpInputs.nth(i).fill(otpDigits[i]);
    }
    await this.verifyAndLoginButton.click();
  }

  async clickCreateAccount() {
    await this.submitViaSMS.click();
  }

  async fillRegistrationField(fieldName, value) {
    await this.page.locator(`input[name='${fieldName}']`).fill(value);
  }

  async fillRegistrationField_placeholder(fieldName, value) {
    await this.page.locator(`input[placeholder='${fieldName}']`).fill(value);
  }

  async selectCountry(countryName) {
    await this.page.locator("div").filter({ hasText: /^Select country$/ }).nth(1).click();
    await this.page.getByRole("option", { name: countryName }).click();
  }

  async getPopupText() {
    return this.loginErrorPopup.textContent();
  }

  async getSuccessPopupText() {
    return this.successPopup.textContent();
  }

  async expectErrorMessageVisible(text) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async expectErrorMessageHidden(text) {
    await expect(this.page.getByText(text)).toBeHidden();
  }

  async expectToBeRedirectedToAccount() {
    await this.page.waitForURL("**/account", { timeout: 30000 });
    await expect(this.page).toHaveURL("https://urxprt.com/en/account");
  }

  async expectToBeRedirectedToLoginWithEmail() {
    await this.page.waitForURL("**/loginwithemail", { timeout: 30000 });
    await expect(this.page).toHaveURL("https://urxprt.com/en/loginwithemail");
  }

  async expectToBeRedirectedToSignup() {
    await this.page.waitForURL("**/signup", { timeout: 30000 });
    await expect(this.page).toHaveURL("https://urxprt.com/en/signup");
  }

  async getAllErrorMessages() {
    return this.errorMessages;
  }

  async clickCreatePostButton() {
    await this.page.locator("//h2[contains(text(),'Create a post')]/following-sibling::button").click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickFindWorkButton() {
    await this.page.locator("//h2[contains(text(),'Find work')]/following-sibling::button").click();
    await this.page.waitForLoadState("networkidle");
  }

  async expectToBeRedirectedToLoginWithEmailPage() {
    await expect(this.page).toHaveURL("https://urxprt.com/en/loginwithemail");
  }

  async expectToNotBeRedirectedToLoginWithEmailPage() {
    await expect(this.page).not.toHaveURL("https://urxprt.com/en/loginwithemail");
  }

  async expectToBeOnSearchAllPage() {
    await expect(this.page).toHaveURL("https://urxprt.com/en/searchall");
  }
}

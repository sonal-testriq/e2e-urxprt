import { test, expect } from "../../fixtures/page.fixture.js";
import LoginPage from "../../pages/LoginPage.js";
import credentials from "../../testData/credentials.json";
import { authData } from "../../testData/constants.js";

//npx playwright test AUTH.spec.js --config=playwright.no-setup.config.js

test("TC_AUTH_001: Ensure validation prevents submitting blank credentials.", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.openLoginPage();
  await loginPage.submitLogin();
  await loginPage.expectErrorMessageVisible(authData.errorMessages.blankEmail);
  await loginPage.expectErrorMessageVisible(authData.errorMessages.blankPassword);
});

test("TC_AUTH_002: Ensure that only valid email formats are accepted.", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = credentials.find((u) => u.name === "user");
  await loginPage.openLoginPage();
  await loginPage.enterEmail(authData.invalidEmailFormat);
  await loginPage.submitLogin();
  await loginPage.expectErrorMessageVisible(authData.errorMessages.invalidEmailFormat);
  await loginPage.clearEmail();
  await loginPage.enterEmail(user.email);
  await loginPage.expectErrorMessageHidden(authData.errorMessages.invalidEmailFormat);
});

test("TC_AUTH_003: Verify error message is displayed if the password is not as per requirements.", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = credentials.find((u) => u.name === "user");
  await loginPage.openLoginPage();
  await loginPage.loginWithEmail(user.email, authData.invalidPassword);
  const errorMessage = await loginPage.errorMessages.first().textContent();
  expect(errorMessage).toContain(authData.errorMessages.passwordRequirements);
});

test("TC_AUTH_004: Verify that login fails with an incorrect password.", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = credentials.find((u) => u.name === "user");
  await loginPage.openLoginPage();
  await loginPage.loginWithEmail(user.email, authData.incorrectPassword);
  const errorPopup = await loginPage.getPopupText();
  expect(errorPopup).toContain(authData.errorMessages.invalidPassword);
});

test("TC_AUTH_005: Verify that the user can login with valid email and password.", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = credentials.find((u) => u.name === "user");
  await loginPage.openLoginPage();
  await loginPage.loginWithEmail(user.email, user.password);
  await loginPage.expectToBeRedirectedToAccount();
});

test("TC_AUTH_006: Verify that the user can login with valid Mobile number via SMS.", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.openLoginPage();
  await loginPage.openMobileLogin();
  await loginPage.submitViaMobileSMS(authData.validMobileNumber);
  const otpSentMessage = await loginPage.getSuccessPopupText();
  expect(otpSentMessage).toContain(authData.errorMessages.otpSentSuccess);
  await loginPage.verifyOtp(authData.otpSuccess);
  await loginPage.expectToBeRedirectedToAccount();
});

test("TC_AUTH_007: Verify that the user can login with valid Mobile number via WhatsApp.", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.openLoginPage();
  await loginPage.openMobileLogin();
  await loginPage.submitViaMobileWhatsApp(authData.validMobileNumber);
  const otpSentMessage = await loginPage.getSuccessPopupText();
  expect(otpSentMessage).toContain(authData.errorMessages.otpSentSuccess);
  await loginPage.verifyOtp(authData.otpSuccess);
  await loginPage.expectToBeRedirectedToAccount();
});

test("TC_AUTH_008: Verify that login fails with invalid/unregistered Mobile number.", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.openLoginPage();
  await loginPage.openMobileLogin();
  await loginPage.submitViaMobileSMS(authData.invalidMobileNumber);
  const errorPopup = await loginPage.getPopupText();
  expect(errorPopup).toContain(authData.errorMessages.unregisteredMobile);
});

test("TC_AUTH_009: Verify that login fails with empty/invalid Mobile number.", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.openLoginPage();
  await loginPage.openMobileLogin();
  await loginPage.submitViaMobileSMS(authData.shortMobileNumber);
  await loginPage.expectErrorMessageVisible(authData.errorMessages.exactly10Digits);
  await loginPage.mobileNumberField.clear();
  await loginPage.clickCreateAccount();
  await loginPage.expectErrorMessageVisible(authData.errorMessages.requiredField);
});

test("TC_AUTH_010: Verify that user can not login with incorrect/invalid OTP", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.openLoginPage();
  await loginPage.openMobileLogin();
  await loginPage.submitViaMobileSMS(authData.validMobileNumber);
  const otpSentMessage = await loginPage.getSuccessPopupText();
  expect(otpSentMessage).toContain(authData.errorMessages.otpSentSuccess);
  await loginPage.verifyOtp(authData.otpInvalid);
  const errorPopup = await loginPage.getPopupText();
  expect(errorPopup).toContain("Invalid OTP");
});

test("TC_AUTH_011: Verify that all compulsory fields must be filled and accepted before submitting the registration form", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = credentials.find((u) => u.name === "user");
  await loginPage.openSignupPage();
  await loginPage.expectToBeRedirectedToSignup();
  await loginPage.clickCreateAccount();
  const firstErrorTextList = [
    authData.errorMessages.registrationRequired,
    authData.errorMessages.registrationRequired,
    authData.errorMessages.blankEmail,
    authData.errorMessages.requiredField,
    authData.errorMessages.blankPassword,
    "Confirm Password is required",
    "Country is required",
    authData.errorMessages.termsRequired,
  ];
  const errorLocators = await loginPage.getAllErrorMessages();
  const count = await errorLocators.count();
  for (let i = 0; i < count; i++) {
    const errorText = (await errorLocators.nth(i).textContent()).trim();
    expect(firstErrorTextList).toContain(errorText);
  }
  await page.reload();
  await page.waitForLoadState("networkidle");
  await loginPage.fillRegistrationField("first_name", "Test");
  await loginPage.fillRegistrationField("last_name", "User");
  await loginPage.fillRegistrationField("email_id", user.email);
  await loginPage.clickCreateAccount();
  const secondErrorTextList = [
    authData.errorMessages.requiredField,
    authData.errorMessages.blankPassword,
    "Confirm Password is required",
    "Country is required",
    authData.errorMessages.termsRequired,
  ];
  const errorLocators2 = await loginPage.getAllErrorMessages();
  const count2 = await errorLocators2.count();
  for (let i = 0; i < count2; i++) {
    const errorText = (await errorLocators2.nth(i).textContent()).trim();
    expect(secondErrorTextList).toContain(errorText);
  }
  await page.reload();
  await page.waitForLoadState("networkidle");
  await loginPage.fillRegistrationField("first_name", "Test");
  await loginPage.fillRegistrationField("last_name", "User");
  await loginPage.fillRegistrationField("email_id", user.email);
  await loginPage.fillRegistrationField_placeholder("Enter mobile number", authData.validMobileNumber);
  await loginPage.fillRegistrationField("password", user.password);
  await loginPage.fillRegistrationField("conformpassword", user.password);
  await loginPage.selectCountry("Afghanistan");
  await loginPage.clickCreateAccount();
  const finalErrorTextList = [authData.errorMessages.termsRequired];
  const errorLocators3 = await loginPage.getAllErrorMessages();
  const count3 = await errorLocators3.count();
  for (let i = 0; i < count3; i++) {
    const errorText = (await errorLocators3.nth(i).textContent()).trim();
    expect(finalErrorTextList).toContain(errorText);
  }
});

test("TC_AUTH_012: Ensure that users who are not logged in (guests) are redirected to the login page when attempting to access restricted content", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoHomepage();
  await loginPage.clickCreatePostButton();
  await loginPage.expectToBeRedirectedToLoginWithEmailPage();
});

test("TC_AUTH_013: Ensure that users who are not logged in (guests) can only access public pages", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoHomepage();
  await loginPage.clickFindWorkButton();
  await loginPage.expectToNotBeRedirectedToLoginWithEmailPage();
  await loginPage.expectToBeOnSearchAllPage();
});

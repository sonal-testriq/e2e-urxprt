import { test, expect } from "../../fixtures/page.fixture.js";

test("TC_HireEC_001: Open Hire Experts & Companies page after User login", async ({
  userHomePage,
  userHirePage,
  userPage,
}) => {
  await userHomePage.goToFindExpertOrCompanyViaHeader();
  await expect(userPage).toHaveURL("https://urxprt.com/en/hireexpertsmainpage");
  await userHirePage.verifyHireCompanyAndExpertPage();
  await userHirePage.verifyAllIndustriesAreVisible();
});

test("TC_HireEC_002: Navigate to an industry page from Hire Experts & Companies list", async ({
  userHomePage,
  userHirePage,
}) => {
    await userHomePage.goToFindExpertOrCompanyViaHeader();
    const hireTexts = await userHirePage.getAllHireRowTexts();
    const randomIndex = await userHirePage.getRandomElementPosition(hireTexts);
    const randomValue = hireTexts[randomIndex];
    await userHirePage.hire_row.nth(randomIndex).click();
    await userHirePage.verifyUserIsOnTheExpectedIndustryPage(randomValue);
});

test("TC_HireEC_003: Open an expert detail page from industry listing", async ({
  userHomePage,
  userHirePage,
}) => {
    await userHomePage.goToFindExpertOrCompanyViaHeader();
    const hireTexts = await userHirePage.getAllHireRowTexts();
    const randomIndex_industry = await userHirePage.getRandomElementPosition(hireTexts);
    await userHirePage.hire_row.nth(randomIndex_industry).click();
    const expertTexts = await userHirePage.getAllExpertDetailRowTexts();
    const randomIndex = await userHirePage.getRandomElementPosition(expertTexts);
    const randomValue = expertTexts[randomIndex];
    await userHirePage.expertdetail_row_link.nth(randomIndex).click();
    await userHirePage.verifyUserIsOnExpectedExpertDetailPage(randomValue);
});

test("TC_HireEC_004: Search for an expert from detail listing and verify search results", async ({
  userHomePage,
  userHirePage,
}) => {
    await userHomePage.goToFindExpertOrCompanyViaHeader();
    const hireTexts = await userHirePage.getAllHireRowTexts();
    const randomIndex_industry = await userHirePage.getRandomElementPosition(hireTexts);
    await userHirePage.hire_row.nth(randomIndex_industry).click();
    const expertTexts = await userHirePage.getAllExpertDetailRowTexts();
    const randomIndex = await userHirePage.getRandomElementPosition(expertTexts);
    await userHirePage.expertdetail_row_link.nth(randomIndex).click();
    await userHirePage.verifyAllExpertDetailsAreVisible();
    const expertName = await userHirePage.getAllExpertNameTexts();
    const randomIndex_expert = await userHirePage.getRandomElementPosition(expertName);
    const randomExpertName = expertName[randomIndex_expert];
    await userHirePage.searchForExpert(randomExpertName);
    await userHirePage.verifySearchResult(randomExpertName);
});

test("TC_HireEC_005: Open expert profile and verify follow, message, and hire navigation", async ({
  userHomePage,
  userHirePage,
}) => {
    await userHomePage.goToFindExpertOrCompanyViaHeader();
    const hireTexts = await userHirePage.getAllHireRowTexts();
    const randomIndex_industry = await userHirePage.getRandomElementPosition(hireTexts);
    await userHirePage.hire_row.nth(randomIndex_industry).click();
    const expertTexts = await userHirePage.getAllExpertDetailRowTexts();
    const randomIndex = await userHirePage.getRandomElementPosition(expertTexts);
    await userHirePage.expertdetail_row_link.nth(randomIndex).click();
    await userHirePage.verifyAllExpertDetailsAreVisible();
    const expertName = await userHirePage.getAllExpertNameTexts();
    const randomIndex_expert = await userHirePage.getRandomElementPosition(expertName);
    const randomExpertName = expertName[randomIndex_expert];
    await userHirePage.searchForExpert(randomExpertName);
    const profilePage = await userHirePage.clickOnViewProfileButton(randomExpertName);
    await expect(profilePage).toHaveURL(/\/expertsprofiledetails\/\d+$/);
    await userHirePage.verifyFollowUnfollowFlow(profilePage);
    await userHirePage.verifyMessageNavigation(profilePage);
    await userHirePage.verifyHireExpertNavigation(profilePage);
});

test("TC_HireEC_006: Open Hire Experts & Companies page after Expert login", async ({
  expertHomePage,
  expertHirePage,
  expertPage,
}) => {
  await expertHomePage.goToFindExpertOrCompanyViaHeader();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/hireexpertsmainpage");
  await expertHirePage.verifyHireCompanyAndExpertPage();
  await expertHirePage.verifyAllIndustriesAreVisible();
});

test("TC_HireEC_007: Navigate to an industry page from Hire list as Expert", async ({
  expertHomePage,
  expertHirePage,
}) => {
    await expertHomePage.goToFindExpertOrCompanyViaHeader();
    const hireTexts = await expertHirePage.getAllHireRowTexts();
    const randomIndex = await expertHirePage.getRandomElementPosition(hireTexts);
    const randomValue = hireTexts[randomIndex];
    await expertHirePage.hire_row.nth(randomIndex).click();
    await expertHirePage.verifyUserIsOnTheExpectedIndustryPage(randomValue);
});

test("TC_HireEC_008: Open an expert detail page from industry listing as Expert", async ({
  expertHomePage,
  expertHirePage,
}) => {
    await expertHomePage.goToFindExpertOrCompanyViaHeader();
    const hireTexts = await expertHirePage.getAllHireRowTexts();
    const randomIndex_industry = await expertHirePage.getRandomElementPosition(hireTexts);
    await expertHirePage.hire_row.nth(randomIndex_industry).click();
    const expertTexts = await expertHirePage.getAllExpertDetailRowTexts();
    const randomIndex = await expertHirePage.getRandomElementPosition(expertTexts);
    const randomValue = expertTexts[randomIndex];
    await expertHirePage.expertdetail_row_link.nth(randomIndex).click();
    await expertHirePage.verifyUserIsOnExpectedExpertDetailPage(randomValue);
});

test("TC_HireEC_009: Search for an expert from detail listing as Expert and verify results", async ({
  expertHomePage,
  expertHirePage,
}) => {
    await expertHomePage.goToFindExpertOrCompanyViaHeader();
    const hireTexts = await expertHirePage.getAllHireRowTexts();
    const randomIndex_industry = await expertHirePage.getRandomElementPosition(hireTexts);
    await expertHirePage.hire_row.nth(randomIndex_industry).click();
    const expertTexts = await expertHirePage.getAllExpertDetailRowTexts();
    const randomIndex = await expertHirePage.getRandomElementPosition(expertTexts);
    await expertHirePage.expertdetail_row_link.nth(randomIndex).click();
    await expertHirePage.verifyAllExpertDetailsAreVisible();
    const expertName = await expertHirePage.getAllExpertNameTexts();
    const randomIndex_expert = await expertHirePage.getRandomElementPosition(expertName);
    const randomExpertName = expertName[randomIndex_expert];
    await expertHirePage.searchForExpert(randomExpertName);
    await expertHirePage.verifySearchResult(randomExpertName);
});

test("TC_HireEC_010: Open Hire Experts & Companies page after Company login", async ({
  companyHomePage,
  companyHirePage,
  companyPage,
}) => {
  await companyHomePage.goToFindExpertOrCompanyViaHeader();
  await expect(companyPage).toHaveURL("https://urxprt.com/en/hireexpertsmainpage");
  await companyHirePage.verifyHireCompanyAndExpertPage();
  await companyHirePage.verifyAllIndustriesAreVisible();
});

test("TC_HireEC_011: Navigate to an industry page from Hire list as Company", async ({
  companyHomePage,
  companyHirePage,
}) => {
    await companyHomePage.goToFindExpertOrCompanyViaHeader();
    const hireTexts = await companyHirePage.getAllHireRowTexts();
    const randomIndex = await companyHirePage.getRandomElementPosition(hireTexts);
    const randomValue = hireTexts[randomIndex];
    await companyHirePage.hire_row.nth(randomIndex).click();
    await companyHirePage.verifyUserIsOnTheExpectedIndustryPage(randomValue);
});

test("TC_HireEC_012: Open an expert detail page from industry listing as Company", async ({
  companyHomePage,
  companyHirePage,
}) => {
    await companyHomePage.goToFindExpertOrCompanyViaHeader();
    const hireTexts = await companyHirePage.getAllHireRowTexts();
    const randomIndex_industry = await companyHirePage.getRandomElementPosition(hireTexts);
    await companyHirePage.hire_row.nth(randomIndex_industry).click();
    const expertTexts = await companyHirePage.getAllExpertDetailRowTexts();
    const randomIndex = await companyHirePage.getRandomElementPosition(expertTexts);
    const randomValue = expertTexts[randomIndex];
    await companyHirePage.expertdetail_row_link.nth(randomIndex).click();
    await companyHirePage.verifyUserIsOnExpectedExpertDetailPage(randomValue);
});

test("TC_HireEC_013: Search for an expert from detail listing as Company and verify results", async ({
  companyHomePage,
  companyHirePage,
}) => {
    await companyHomePage.goToFindExpertOrCompanyViaHeader();
    const hireTexts = await companyHirePage.getAllHireRowTexts();
    const randomIndex_industry = await companyHirePage.getRandomElementPosition(hireTexts);
    await companyHirePage.hire_row.nth(randomIndex_industry).click();
    const expertTexts = await companyHirePage.getAllExpertDetailRowTexts();
    const randomIndex = await companyHirePage.getRandomElementPosition(expertTexts);
    await companyHirePage.expertdetail_row_link.nth(randomIndex).click();
    await companyHirePage.verifyAllExpertDetailsAreVisible();
    const expertName = await companyHirePage.getAllExpertNameTexts();
    const randomIndex_expert = await companyHirePage.getRandomElementPosition(expertName);
    const randomExpertName = expertName[randomIndex_expert];
    await companyHirePage.searchForExpert(randomExpertName);
    await companyHirePage.verifySearchResult(randomExpertName);
});

test("TC_HireEC_014: Open expert profile and verify follow, message, and hire navigation as Expert", async ({
  expertHomePage,
  expertHirePage,
}) => {
    await expertHomePage.goToFindExpertOrCompanyViaHeader();
    const hireTexts = await expertHirePage.getAllHireRowTexts();
    const randomIndex_industry = await expertHirePage.getRandomElementPosition(hireTexts);
    await expertHirePage.hire_row.nth(randomIndex_industry).click();
    const expertTexts = await expertHirePage.getAllExpertDetailRowTexts();
    const randomIndex = await expertHirePage.getRandomElementPosition(expertTexts);
    await expertHirePage.expertdetail_row_link.nth(randomIndex).click();
    await expertHirePage.verifyAllExpertDetailsAreVisible();
    const expertName = await expertHirePage.getAllExpertNameTexts();
    const randomIndex_expert = await expertHirePage.getRandomElementPosition(expertName);
    const randomExpertName = expertName[randomIndex_expert];
    await expertHirePage.searchForExpert(randomExpertName);
    const profilePage = await expertHirePage.clickOnViewProfileButton(randomExpertName);
    await expect(profilePage).toHaveURL(/\/expertsprofiledetails\/\d+$/);
    await expertHirePage.verifyFollowUnfollowFlow(profilePage);
    await expertHirePage.verifyMessageNavigation(profilePage);
    await expertHirePage.verifyHireExpertNavigation(profilePage);
});

test("TC_HireEC_015: Open expert profile and verify follow, message, and hire navigation as Company", async ({
  companyHomePage,
  companyHirePage,
}) => {
    await companyHomePage.goToFindExpertOrCompanyViaHeader();
    const hireTexts = await companyHirePage.getAllHireRowTexts();
    const randomIndex_industry = await companyHirePage.getRandomElementPosition(hireTexts);
    await companyHirePage.hire_row.nth(randomIndex_industry).click();
    const expertTexts = await companyHirePage.getAllExpertDetailRowTexts();
    const randomIndex = await companyHirePage.getRandomElementPosition(expertTexts);
    await companyHirePage.expertdetail_row_link.nth(randomIndex).click();
    await companyHirePage.verifyAllExpertDetailsAreVisible();
    const expertName = await companyHirePage.getAllExpertNameTexts();
    const randomIndex_expert = await companyHirePage.getRandomElementPosition(expertName);
    const randomExpertName = expertName[randomIndex_expert];
    await companyHirePage.searchForExpert(randomExpertName);
    const profilePage = await companyHirePage.clickOnViewProfileButton(randomExpertName);
    await expect(profilePage).toHaveURL(/\/expertsprofiledetails\/\d+$/);
    await companyHirePage.verifyFollowUnfollowFlow(profilePage);
    await companyHirePage.verifyMessageNavigation(profilePage);
    await companyHirePage.verifyHireExpertNavigation(profilePage);
});
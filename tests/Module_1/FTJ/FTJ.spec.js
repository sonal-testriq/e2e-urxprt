import { test, expect } from "../../../fixtures/page.fixture.js";


test("TC_FTJ_001: FTJ account page is accessible after login and industries are displayed", async ({
  userHomePage,
  userPage,
  userFTJPage,
}) => {
  await userHomePage.goToFTJViaHeader();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchdownloadcv");
  const expectedIndustries = ["E Commerce", "Banking  Financial Institutions", "Corporate Legal Departments", "Legal", "Business", "Technology and Software", "Insurance and Financial Services"];
  const industries = await userFTJPage.getIndustriesList();
  for (const industry of expectedIndustries) {
    expect(industries).toContain(industry);
  }
});

test("TC_FTJ_002: Verify sub industries are displayed under each industry", async ({
  userHomePage,
  userPage,
  userFTJPage,
}) => {
  await userHomePage.goToFTJViaHeader();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchdownloadcv");
  const industries = userFTJPage.industries_list;
  await expect(industries.first()).toBeVisible();
  const count = await industries.count();
  for (let i = 0; i < count; i++) {
    const industry = industries.nth(i);
    if (i !== 0) {
        await industry.click();
    }
    const subIndustries = userFTJPage.sub_industry_list;
    await expect(subIndustries.first()).toBeVisible();
    expect(await subIndustries.count()).toBeGreaterThan(0);
  }
})

test("TC_FTJ_003: Verify user is able to search sub industries", async ({
  userHomePage,
  userPage,
  userFTJPage,
}) => {
    await userHomePage.goToFTJViaHeader();
    await expect(userPage).toHaveURL("https://urxprt.com/en/searchdownloadcv");
    const industries = userFTJPage.industries_list;
    await expect(industries.first()).toBeVisible();
    const industryCount = await industries.count();
    const allSubIndustries = [];
    for (let i = 0; i < industryCount; i++) {
        const industry = industries.nth(i);
        // First accordion already expanded
        if (i !== 0) {
            await industry.click();
        }
        const subIndustries = userFTJPage.sub_industry_list_names;
        await expect(subIndustries.first()).toBeVisible();
        const subIndustryTexts = await subIndustries.allTextContents();
        const cleanedTexts = subIndustryTexts.map(text =>
        text.replace(/\s+/g, " ").trim()
        );
        allSubIndustries.push(...cleanedTexts);
    }
    // Remove duplicates if needed
    const uniqueSubIndustries = [...new Set(allSubIndustries)];
    // Select random sub industry
    const randomSubIndustry =
    uniqueSubIndustries[
    Math.floor(Math.random() * uniqueSubIndustries.length)
    ];
    console.log("Random Sub Industry:", randomSubIndustry);
    await userFTJPage.searchFTJ(randomSubIndustry);
    const updatedIndustryCount = await industries.count();
    expect(updatedIndustryCount).not.toBe(industryCount);
})

test("TC_FTJ_004: Verify candidates are visible under sub industries", async ({
  userHomePage,
  userPage,
  userFTJPage,
}) => {
    await userHomePage.goToFTJViaHeader();
    await expect(userPage).toHaveURL("https://urxprt.com/en/searchdownloadcv");
    await userFTJPage.selectIndustryAndFirstSubIndustry("Business");
    const candidateList = userFTJPage.candidate_list;
    await expect(candidateList.first()).toBeVisible();
    const count = await candidateList.count();
    expect(count).toBeGreaterThan(0);
})   

test("TC_FTJ_005: Verify that user can download the cv of the candidate", async ({
  userHomePage,
  userPage,
  userFTJPage,
}) => {
    await userHomePage.goToFTJViaHeader();
    await expect(userPage).toHaveURL("https://urxprt.com/en/searchdownloadcv");
    await userFTJPage.selectIndustryAndFirstSubIndustry("Business");
    const candidateList = userFTJPage.candidate_list;
    await expect(candidateList.first()).toBeVisible();
    await candidateList.first().click();
    const [newPage] = await Promise.all([
    userPage.waitForEvent("popup"),
    userFTJPage.view_details_button.first().click(),
    ]);
    await newPage.waitForLoadState();
    const downloadButton = newPage.getByRole("button", {
    name: "Download CV",
    });
    const reDownloadButton = newPage.getByRole("button", {
    name: "Re - Download CV",
    });
    if (await reDownloadButton.isVisible()) {
        await expect(reDownloadButton).toBeVisible();
        const downloadPromise =
        newPage.context().waitForEvent("download");
        await downloadButton.click();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toBeTruthy();
        await expect(reDownloadButton).toBeVisible();
    } else {
        await expect(downloadButton).toBeVisible();
        const downloadPromise =
        newPage.context().waitForEvent("download");
        await downloadButton.click();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toBeTruthy();
        await expect(reDownloadButton).toBeVisible();
    }
})
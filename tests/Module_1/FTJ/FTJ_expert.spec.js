import { test, expect } from "../../../fixtures/page.fixture.js";


test("TC_FTJ_001: FTJ account page is accessible after login and industries are displayed", async ({
  expertHomePage,
  expertPage,
  expertFTJPage,
}) => {
  await expertHomePage.goToFTJViaHeader();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchdownloadcv");
  const expectedIndustries = ["E Commerce", "Energy", "Banking  Financial Institutions", "Corporate Legal Departments", "Legal", "Business", "Technology and Software", "Insurance and Financial Services"];
  const industries = await expertFTJPage.getIndustriesList();
  for (const industry of expectedIndustries) {
    expect(industries).toContain(industry);
  }
});

test("TC_FTJ_002: Verify sub industries are displayed under each industry", async ({
  expertHomePage,
  expertPage,
  expertFTJPage,
}) => {
  await expertHomePage.goToFTJViaHeader();
  await expect(expertPage).toHaveURL("https://urxprt.com/en/searchdownloadcv");
  const industries = expertFTJPage.industries_list;
  await expect(industries.first()).toBeVisible();
  const count = await industries.count();
  for (let i = 0; i < count; i++) {
    const industry = industries.nth(i);
    if (i !== 0) {
        await industry.click();
    }
    const subIndustries = expertFTJPage.sub_industry_list;
    await expect(subIndustries.first()).toBeVisible();
    expect(await subIndustries.count()).toBeGreaterThan(0);
  }
})

test("TC_FTJ_003: Verify user is able to search sub industries", async ({
  expertHomePage,
  expertPage,
  expertFTJPage,
}) => {
    await expertHomePage.goToFTJViaHeader();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/searchdownloadcv");
    const industries = expertFTJPage.industries_list;
    await expect(industries.first()).toBeVisible();
    const industryCount = await industries.count();
    const allSubIndustries = [];
    for (let i = 0; i < industryCount; i++) {
        const industry = industries.nth(i);
        // First accordion already expanded
        if (i !== 0) {
            await industry.click();
        }
        const subIndustries = expertFTJPage.sub_industry_list_names;
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
    await expertFTJPage.searchFTJ(randomSubIndustry);
    const updatedIndustryCount = await industries.count();
    expect(updatedIndustryCount).not.toBe(industryCount);
})

test("TC_FTJ_004: Verify candidates are visible under sub industries", async ({
  expertHomePage,
  expertPage,
  expertFTJPage,
}) => {
    await expertHomePage.goToFTJViaHeader();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/searchdownloadcv");
    await expertFTJPage.selectIndustryAndFirstSubIndustry("Business");
    const candidateList = expertFTJPage.candidate_list;
    await expect(candidateList.first()).toBeVisible();
    const count = await candidateList.count();
    expect(count).toBeGreaterThan(0);
})   

test("TC_FTJ_005: Verify that user can download the cv of the candidate", async ({
  expertHomePage,
  expertPage,
  expertFTJPage,
}) => {
    await expertHomePage.goToFTJViaHeader();
    await expect(expertPage).toHaveURL("https://urxprt.com/en/searchdownloadcv");
    await expertFTJPage.selectIndustryAndFirstSubIndustry("Business");
    const candidateList = expertFTJPage.candidate_list;
    await expect(candidateList.first()).toBeVisible();
    await candidateList.first().click();
    const [newPage] = await Promise.all([
    expertPage.waitForEvent("popup"),
    expertFTJPage.view_details_button.first().click(),
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
    }
})
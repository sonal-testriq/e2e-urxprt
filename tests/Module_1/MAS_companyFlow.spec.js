import { test, expect } from "../../fixtures/page.fixture.js";
import MASPage from "../../pages/MASPage.js";
import { assert } from "node:console";
import { describe } from "node:test";
import credentials from "../../testData/credentials.json";
import fs from "fs";
import path from "path";
import { pageRoutes, BSMProductName, MASPostName } from "../../testData/constants.js";
import { BasePage } from "../../pages/base_page.js";
import { setEngine } from "node:crypto";

test.describe.serial("MAS Flow", () => {
  test("Adding a company by user at MAS", async ({
    userPage,
    userHomePage,
    userMASPage
  }) => {
    await userPage.goto(pageRoutes.account);
    const masCard = userPage.locator(".it-dev", {
      has: userPage.locator("h5", {
        hasText: "Merger and Acquisition (MAS)",
      }),
    });

    await masCard.locator("a.btn").click();
    await expect(userPage).toHaveURL(
      "https://urxprt.com/en/searchmergersacquisitions",
    );
    await userPage.waitForLoadState("networkidle");
    await userMASPage.addACompany();
    await expect(userPage.getByText("Add Company")).toBeVisible();
    await userPage.waitForTimeout(2000);
    await expect(userPage).toHaveURL(
      "https://urxprt.com/en/dashboard/myotsproducts",
    );
    const addBtn = userPage.locator('.packaged-first button:has-text("Add")');
    await addBtn.click();
    await expect(userPage.locator(".modal-overlay-sec.active")).toBeVisible();
    await userPage.waitForTimeout(2000);
    await userMASPage.fillInputWithPlaceholder("Company Name", MASPostName);
    const uploadedCompanyLogo = await userPage
      .locator(".dropzone")
      .first()
      .locator('input[type="file"]')
      .setInputFiles("testData/sampleCompanyImg.jpg");
    await userPage.waitForTimeout(3000); // wait for upload to finish
    await userMASPage.selectDropdown("Company Industry *", "Business");
    await userMASPage.fillInputWithPlaceholder(
      "Enter URL",
      "https://www.testcompany.com",
    );
    await userMASPage.fillInputWithPlaceholder("Enter address", "Maharashtra");
    await userMASPage.fillInputWithPlaceholder("Enter pincode", "400001");
    await userMASPage.fillInputWithPlaceholder("Enter city", "Mumbai");
    await userMASPage.selectDropdown("Country *", "India");
    await userMASPage.fillRichTextEditor(
      "Description",
      "This is a test company for automation testing.",
    );

    const uploadedCompanyProfile = await userPage
      .locator(".dropzone")
      .last()
      .locator('input[type="file"]')
      .setInputFiles("testData/companyProfile.pdf");
    await userPage.waitForTimeout(10000); // wait for upload to finish
    const companyPublishButton = userPage.getByRole("button", {
      name: "Add Company and Publish",
      exact: true,
    });
    await companyPublishButton.click();

    await userPage.waitForLoadState("networkidle");

    await userPage.waitForTimeout(2000);

    const popup = userPage.locator(".contract-popup-content");
    await popup.scrollIntoViewIfNeeded();

    const agreeButton = popup.getByRole("button", {
      name: "I Agree & Submit",
      exact: true,
    });

    await agreeButton.click();
    await userPage.waitForLoadState("networkidle");
    await expect(
      userPage.getByText("MAS Service Created Successfully"),
    ).toBeVisible();
  });
  test("Verify whether newly created MAS appears at the product listing page as 'Your Post'", async ({
    userPage,
    userHomePage,
    userMASPage,
  }) => {
    await userPage.goto(pageRoutes.account);
    const masCard = userPage.locator(".it-dev", {
      has: userPage.locator("h5", {
        hasText: "Merger and Acquisition (MAS)",
      }),
    });

    await masCard.locator("a.btn").click();
    await expect(userPage).toHaveURL(
      "https://urxprt.com/en/searchmergersacquisitions",
    );
    await userPage.waitForLoadState("networkidle");
    const MASPostCard = userPage.locator("div.packaged-img h3", {
      hasText: MASPostName,
      exact: false,
    });

    await expect(MASPostCard).toHaveText(MASPostName);

    const yourPostTag = userPage.locator("div.post-sold p.your-postbtn", {
      hasText: "Your post",
    });
    await expect(yourPostTag.first()).toBeVisible();
  });
  test("Verify whether newly created post appears at expert's product listing page", async ({
    companyPage,
    companyHomePage,
    companyMASPage,
  }) => {
    await companyPage.goto(pageRoutes.account);
    const masCard = companyPage.locator(".it-dev", {
      has: companyPage.locator("h5", {
        hasText: "Merger and Acquisition (MAS)",
      }),
    });

    await masCard.locator("a.btn").click();
    await expect(companyPage).toHaveURL(
      "https://urxprt.com/en/searchmergersacquisitions",
    );
    const MASPostCard = companyPage.locator("div.packaged-img h3", {
      hasText: MASPostName,
      exact: false,
    });
    await expect(MASPostCard).toHaveText(MASPostName);
  });
  test("Verify if company can apply on new created post", async ({
    companyPage,
    companyHomePage,
    companyTAIPage,
  }) => {
    await companyPage.goto(pageRoutes.account);
    const masCard = companyPage.locator(".it-dev", {
      has: companyPage.locator("h5", {
        hasText: "Merger and Acquisition (MAS)",
      }),
    });

    await masCard.locator("a.btn").click();
    await expect(companyPage).toHaveURL(
      "https://urxprt.com/en/searchmergersacquisitions",
    );
    await companyPage
      .locator(".packaged-img")
      .filter({ hasText: MASPostName })
      .getByRole("button", { name: "View more" })
      .click();
    await expect(
      companyPage.locator(".modal-overlay-sec.active"),
    ).toBeVisible();
    const interestedButton = companyPage.getByRole("button", {
      name: "I'm Interested",
    });
    await interestedButton.click();
    //https://urxprt.com/en/mergersacquisitionscontract/24414
    await companyPage.waitForTimeout(2000);

    expect(companyPage.url()).toContain(
      "https://urxprt.com/en/mergersacquisitionscontract/",
    );

    await companyPage.locator("label[for='agree']").click();

    const scrollToBottomBtn = companyPage
      .locator(".popup-contract-container")
      .locator("button", {
        name: "Scroll to Bottom",
        exact: true,
      });
    await companyPage.waitForTimeout(2000);
    await scrollToBottomBtn.click();
    await companyPage
      .locator(".popup-contract-container")
      .locator("input[id='agree']")
      .click();
    await companyPage.waitForLoadState("networkidle");
    await companyPage.waitForTimeout(2000);

    const applyButton = companyPage.locator("button", {
      hasText: "Apply",
    });
    await applyButton.click();
    const successToast = companyPage.getByText(
      "Your Interest Has Been Submitted",
    );

    await expect(successToast).toBeVisible({ timeout: 10000 });
  });
  test("Verify if user receives notification when expert applies on MAS post", async ({
    userPage,
    userHomePage,
    userMASPage,
  }) => {
    // await userPage.goto(pageRoutes.account);
    // await userPage.waitForLoadState("networkidle", { timeout: 10000 });
    await userPage.goto(pageRoutes.account);
    await userPage.waitForTimeout(5000);
    await userHomePage.hoverOverNotifivationIcon();
    // const notificationItem = userPage.locator(".notification-img button", {
    //   hasText:
    //     "You have a new interested party in your MAS for " +
    //     MASPostName +
    //     ".",
    // });
    await userPage.waitForTimeout(3000);
    const notificationItem = userPage
      .locator(
        `//h6[normalize-space()='You have a new interested party in your MAS for MAS Post Automation36.']`,
      )
      .first();
    await expect(notificationItem).toBeVisible();
    await notificationItem.click();
    await expect(userPage).toHaveURL(
      "https://urxprt.com/en/dashboard/receivedorders",
    );
  });
  test("Verify if user can see the expert's details who applied on MAS post", async ({
    userPage,
    userHomePage,
  }) => {
    await userPage.goto(pageRoutes.account);
    await userPage.waitForTimeout(5000);

    await userPage.goto("https://urxprt.com/en/dashboard/receivedorders");
    const activeOrders = userPage.locator(".nav-tabs a", {
      hasText: "Active orders",
      exact: false,
    });
    await activeOrders.click();

    const MASOrders = userPage.locator("#Activeorders .order-tabs a", {
      hasText: "Merger & Acquisition Services (MAS)",
      exact: false,
    });

    await MASOrders.click();
    await userPage
      .locator(".packaged-img")
      .filter({ hasText: MASPostName })
      .getByRole("button", { name: "View requests" })
      .click();
    await expect(userPage.locator(".modal-overlay-sec.active")).toBeVisible();
    const expertName = userPage.locator(".professional-left h6");
    await expect(expertName).toHaveText("Shivakumar Padaiyachi");
  });
});

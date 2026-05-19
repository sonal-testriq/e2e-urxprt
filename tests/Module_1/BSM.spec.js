import { test, expect } from "../../fixtures/page.fixture.js";
import BSMPage from "../../pages/BSMPage.js";
import { assert } from "node:console";
import { describe } from "node:test";
import credentials from "../../testData/credentials.json";
import fs from "fs";
import path from "path";
import { pageRoutes, BSMProductName } from "../../testData/constants.js";

import { BasePage } from "../../pages/base_page.js";
test.describe.serial("PTJ Flow", () => {
  test.only("Adding a product by user at BSM", async ({
    userPage,
    userHomePage,
    userBSMPage,
  }) => {
    await userHomePage.gotoBSMViaCard();
    const addAProduct_button = userPage.locator(
      "//button[contains(text(),'Add a Product')]",
    );
    await addAProduct_button.click();
    await userPage.waitForTimeout(2000);
    await expect(userPage).toHaveURL(
      "https://urxprt.com/en/dashboard/myotsproducts",
    );
    const addBtn = userPage.locator('.packaged-first button:has-text("Add")');
    await addBtn.click();
    await expect(userPage.locator(".modal-overlay-sec.active")).toBeVisible();

    await userBSMPage.fillInput("Product title", BSMProductName);
    await userBSMPage.fillRichTextEditor(
      " ",
      "This is a test description for automation",
    );
    await userBSMPage.selectDropdown("Industry *", "Business");
    await userBSMPage.selectDropdown("Category *", "Managing and Consultant");
    await userBSMPage.selectDropdown("Sub Category", "Project Management");
    await userBSMPage.fillInput("Price * *", "50");
    const nextBtn = userPage.locator("//button[contains(text(),'Next')]");
    await nextBtn.click();
    const productInfoTab = expertPage.locator("a", {
      hasText: "Product info",
    });

    await expect(productInfoTab).toHaveClass(/active/);
    await userBSMPage.uploadFile("Attach files", "testData/sampleImg.jpg");
  });
});

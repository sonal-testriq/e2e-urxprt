import { test, expect } from "../../fixtures/page.fixture.js";
import BSMPage from "../../pages/BSMPage.js";
import { assert } from "node:console";
import { describe } from "node:test";
import credentials from "../../testData/credentials.json";
import fs from "fs";
import path from "path";
import { pageRoutes, BSMProductName } from "../../testData/constants.js";

import { BasePage } from "../../pages/base_page.js";
import { setEngine } from "node:crypto";
test.describe.serial("PTJ Flow", () => {
  test("Adding a product by user at BSM", async ({
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

    const selectedIndustry = "Business";
    const selectedCategory = "Managing and Consultant";
    const selectedSubCategory = "Project Management";
    const selectedPrice = "50";
    const selectedCountry = "India";
    const selectedCondition = "Brand new";
    const selectedShips = "Not included";
    const description = "This is a test description for automation";
    await userBSMPage.fillInput("Product title", BSMProductName);
    const richTextEditor = userPage.locator(".ql-editor");

    // To fill
    await richTextEditor.click();
    await richTextEditor.fill(description);

    // To assert the value

    await userBSMPage.selectDropdown("Industry *", selectedIndustry);
    await userBSMPage.selectDropdown("Category *", selectedCategory);
    await userBSMPage.selectDropdown("Sub Category", selectedSubCategory);
    await userBSMPage.fillInput("Price * *", selectedPrice);
    const nextBtn = userPage.locator("//button[contains(text(),'Next')]");
    await nextBtn.click();
    const productInfoTab = userPage.locator("a", {
      hasText: "Product info",
    });

    await expect(productInfoTab).toHaveClass(/active nav-link/);
    const uploadedFile = await userPage
      .locator(".dropzone")
      .locator('input[type="file"]')
      .setInputFiles("testData/sampleImg.jpg");
    await userPage.waitForTimeout(2000); // wait for upload to finish
    await userBSMPage.selectDropdown("Country", selectedCountry);
    await userBSMPage.selectRadioOption(selectedCondition);
    await userBSMPage.selectRadioOption(selectedShips);
    await userPage
      .locator(".tab-pane.active")
      .locator("div.next-button")
      .click("click");
    await userPage.waitForTimeout(2000);
    const reviewTab = userPage.locator("a", {
      hasText: "Review & add",
    });

    await expect(reviewTab).toHaveClass(/active nav-link/);
    const getFieldValue = (label) =>
      userPage
        .locator("div.price-duration")
        .filter({
          has: userPage.locator(`h6:text-is("${label}")`),
        })
        .locator("h4");

    // Assert each field matches what was filled
    await expect(getFieldValue("Item Title")).toHaveText(BSMProductName);
    await expect(getFieldValue("Industry")).toHaveText("Business");
    await expect(getFieldValue("Category")).toHaveText(
      "Managing and Consultant",
    );
    await expect(getFieldValue("Sub-Category")).toHaveText(
      "Project Management",
    );
    await expect(getFieldValue("Product price")).toHaveText("$ 50");
    await expect(
      userPage
        .locator("div.price-duration")
        .filter({ has: userPage.locator(`h6:text-is("Description")`) })
        .locator("div.custom-html.truncate p"),
    ).toHaveText(description);
    await expect(getFieldValue("Country")).toHaveText(selectedCountry);
    await expect(getFieldValue("Product condition")).toHaveText("Brand New");
    await expect(getFieldValue("Shipping charges")).toHaveText("Not Included");
    // add more fields as needed...

    // ---------- PUBLISH ----------
    const publishBtn = userPage.getByRole("button", {
      name: "Add and Publish",
    });
    await expect(publishBtn).toBeVisible();
    await publishBtn.click();

    // ---------- VERIFY POST PUBLISHED ----------
    await userPage.waitForLoadState("networkidle");
    await userPage.waitForTimeout(2000);
    await expect(
      userPage.getByText("BSM Service Created Successfully"),
    ).toBeVisible();
    // await expect(userPage).toHaveURL(/.*\/myotsproducts\//); // adjust to actual redirect URL
  });

  test("Send request for buying product by company", async ({
    companyPage,
    companyHomePage,
    companyBSMPage,
  }) => {
    await companyPage.goto(pageRoutes.account, { waitUntil: "networkidle" });

    await companyHomePage.goToBSMViaHeader();
    const BSMpost = await companyPage.locator("div.packaged-img").filter({
      has: companyPage.locator(`h6:text-is("${BSMProductName}")`),
      // has: companyPage.locator(`h6:text-is("Temp BSM post958")`),
    });

    const [newPage] = await Promise.all([
      companyPage.context().waitForEvent("page"),
      BSMpost.click(),
    ]);
    await newPage.waitForLoadState();

    const newPageObject = new BasePage(newPage);
    await newPage.locator("//button[contains(text(),'Send request')]").click();
    await newPage.waitForLoadState("networkidle");
    expect(newPage.url()).toContain("https://urxprt.com/en/salecontract/");

    await newPage.locator("label[for='agree']").click();

    const scrollToBottomBtn = newPage
      .locator(".popup-contract-container")
      .locator("button", {
        name: "Scroll to Bottom",
        exact: true,
      });
    await newPage.waitForTimeout(2000);
    await scrollToBottomBtn.click();
    await newPage
      .locator(".popup-contract-container")
      .locator("input[id='agree']")
      .click();
    await newPage.waitForLoadState("networkidle");
    await newPage.waitForTimeout(2000);

    const acceptTermsButton = newPage.locator("button", {
      hasText: "Accept",
    });
    await acceptTermsButton.click();
    await newPage.waitForTimeout(5000);
    expect(newPage.getByText("BSM Request Has Been Sent")).toBeVisible();
    // expect(company);
    expect(
      newPage.locator("//button[contains(text(),'Request pending')]"),
    ).toBeDisabled();
    await newPage.waitForTimeout(2000);
  });

  test("Accepting BSM request by the 'User'", async ({
    userPage,
    userHomePage,
    userBSMPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    const bsmRequestsHeader = userPage
      .locator("#Orderequests")
      .locator(".pending-req h4", {
        hasText: "Buy & Sell with Market (BSM) requests",
      });

    await expect(bsmRequestsHeader).toBeVisible();
    const postRow = userPage.locator("div.pending-img", {
      hasText: BSMProductName,
    });

    await postRow.getByRole("button", { name: "Accept" }).click();
    await userPage.waitForTimeout(2000);

    expect(userPage.url()).toContain("https://urxprt.com/en/salecontract/");

    await userPage.locator("label[for='agree']").click();

    const scrollToBottomBtn = userPage
      .locator(".popup-contract-container")
      .locator("button", {
        name: "Scroll to Bottom",
        exact: true,
      });
    await userPage.waitForTimeout(2000);
    await scrollToBottomBtn.click();
    await userPage
      .locator(".popup-contract-container")
      .locator("input[id='agree']")
      .click();
    await userPage.waitForLoadState("networkidle");
    await userPage.waitForTimeout(2000);

    const acceptTermsButton = userPage.locator("button", {
      hasText: "Accept",
    });
    await acceptTermsButton.click();
    await userPage.waitForTimeout(5000);
  });
  test("Paying for product by company(Buyer)  ", async ({
    companyPage,
    companyHomePage,
    companyBSMPage,
  }) => {
    await companyPage.goto(`/en/dashboard/myorders`, {
      waitUntil: "networkidle",
    });
    const purchasedOrdersTab = companyPage.locator("div.order-first a", {
      hasText: "Purchased orders",
    });

    await purchasedOrdersTab.click();

    const activeTab = companyPage.locator("a", {
      hasText: "Active orders",
      exact: false,
    });
    await activeTab.click();
    const postRow = companyPage.locator("div.pending-img", {
      hasText: BSMProductName,
    });
    await postRow.locator("button.btn-img").click();
    await companyPage.waitForTimeout(2000);

    await expect(companyPage).toHaveURL(
      /.*\/myorders\/productforsaledetails\//,
    );
    const payNowBtn = companyPage.locator("div.status-right span", {
      hasText: "Pay Now",
    });
    await payNowBtn.click();
    await companyPage.waitForTimeout(2000);
    expect(companyPage.locator("div.modal.fade.show")).toBeVisible();
    const confirmBtn = companyPage.locator("div.modal-content button", {
      hasText: "Confirm",
    });
    await confirmBtn.click();
    await companyPage.waitForTimeout(2000);
    expect(companyPage).toHaveURL(
      "https://urxprt.com/en/account/paymentmethodpage",
    );
    const makePayment = companyPage.locator("button", {
      hasText: "Make Payment",
    });
    await expect(makePayment).toBeVisible();
    await makePayment.click();
    const saveAndMakePayment = companyPage.locator("button", {
      hasText: "Save and make payment",
    });
    await saveAndMakePayment.click();
    await companyPage.waitForTimeout(5000);

    await expect(
      companyPage.locator('iframe[title="Card Number"]'),
    ).toBeVisible();

    await companyPage
      .frameLocator('iframe[title="Card Number"]')
      .locator('input[name="card.number"]')
      .fill("5555555555554444");

    await companyPage.locator('input[placeholder="MM / YY"]').fill("12 / 30");

    await companyPage
      .locator('input[placeholder="Card holder"]')
      .fill("Test User");

    await companyPage
      .frameLocator('iframe[title="Security Code CVV"]')
      .locator('input[name="card.cvv"]')
      .fill("123");

    // Click payment submit and wait for redirect
    await Promise.all([
      companyPage.waitForURL("**oppwa.com/**"),
      await companyPage
        .getByRole("button", {
          name: "Pay now",
        })
        .click(),
    ]);
    await companyPage.waitForLoadState("networkidle");

    const payBtn = await companyPage.locator('input[value="Pay"]');
    await payBtn.click();
    await companyPage.waitForTimeout(3000);
    await expect(
      companyPage.getByText("BSM Payment Completed").first(),
    ).toBeVisible();
    const okayBtn = companyPage.locator("button", { hasText: "Okay" });
    await okayBtn.click();
    await companyPage.waitForTimeout(5000);

    await expect(companyPage).toHaveURL(
      /.*\/receivedorders\/productforsaledetails\//,
    );
    const addAddressBtn = companyPage.locator("div.status-right span", {
      hasText: "Add Address",
    });
    await addAddressBtn.click();
    await companyPage.waitForTimeout(2000);
    expect(companyPage.locator("div.modal.fade.show")).toBeVisible();

    await companyBSMPage.fillInputWithPlaceholder(
      "Enter address",
      "Mumbai, Maharashtra",
    );
    const submitBtn = companyPage.locator("div.modal-content button", {
      hasText: "Submit",
    });
    await submitBtn.click();
  });
  test("Updating product to 'Out for Delivery' by user(seller)", async ({
    userPage,
    userHomePage,
    userBSMPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    const activeOrders = userPage.locator(".nav-tabs a", {
      hasText: "Active orders",
      exact: false,
    });
    await activeOrders.click();

    const BSMOrders = userPage.locator("#Activeorders .order-tabs a", {
      hasText: "Buy & Sell with Market (BSM)",
      exact: false,
    });

    await BSMOrders.click();
    const postRow = userPage.locator("div.pending-img", {
      hasText: BSMProductName,
    });

    await postRow.locator("button.btn-img").click();
    await userPage.waitForTimeout(2000);

    await expect(userPage).toHaveURL(
      /.*\/receivedorders\/productforsaledetails\//,
    );
    const updateDeliveryBtn = userPage.locator("div.status-right span", {
      hasText: "Update Out for Delivery",
    });
    await updateDeliveryBtn.click();
    await userPage.waitForTimeout(2000);
    expect(userPage.locator("div.modal.fade.show")).toBeVisible();
    const confirmBtn = userPage.locator("div.modal-content button", {
      hasText: "Confirm",
    });
    await confirmBtn.click();
    await userPage.waitForTimeout(2000);
    await expect(userPage.getByText("Updated Successfully")).toBeVisible();
  });
  test("Marking product 'Deleivered' by company(Buyer)", async ({
    companyPage,
    companyHomePage,
    companyBSMPage,
  }) => {
    await companyPage.goto(`/en/dashboard/myorders`, {
      waitUntil: "networkidle",
    });
    const purchasedOrdersTab = companyPage.locator("div.order-first a", {
      hasText: "Purchased orders",
    });

    await purchasedOrdersTab.click();

    const activeTab = companyPage.locator("a", {
      hasText: "Active orders",
      exact: false,
    });
    await activeTab.click();
    const postRow = companyPage.locator("div.pending-img", {
      hasText: BSMProductName,
    });
    await postRow.locator("button.btn-img").click();
    await companyPage.waitForTimeout(2000);

    await expect(companyPage).toHaveURL(
      /.*\/myorders\/productforsaledetails\//,
    );
    const DeliveredBtn = companyPage.locator("div.status-right span", {
      hasText: "Mark Delivered",
    });
    await DeliveredBtn.click();
    await companyPage.waitForTimeout(2000);
    expect(companyPage.locator("div.modal.fade.show")).toBeVisible();
    const confirmBtn = companyPage.locator("div.modal-content button", {
      hasText: "Confirm",
    });
    await confirmBtn.click();
    await companyPage.waitForTimeout(2000);
    await expect(companyPage.getByText("Updated Successfully")).toBeVisible();
    await companyPage.waitForTimeout(2000);
    // Assert step 4 "Item Delivered" is active/complete
    const step4 = companyPage.locator("div.status-first").filter({
      has: companyPage.locator("h6", { hasText: "Item Delivered" }),
    });

    // Assert the number circle is marked complete
    await expect(step4.locator("div.number.complete span")).toHaveText("4");

    // Assert OTP is generated and visible
    await expect(step4.locator("div.deliveryotp-sec")).toBeVisible();
  });
  test("Completing transaction by user(Seller) by verifying OTP", async ({
    userPage,
    userHomePage,
    userBSMPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    const activeOrders = userPage.locator(".nav-tabs a", {
      hasText: "Active orders",
      exact: false,
    });
    await activeOrders.click();

    const BSMOrders = userPage.locator("#Activeorders .order-tabs a", {
      hasText: "Buy & Sell with Market (BSM)",
      exact: false,
    });

    await BSMOrders.click();
    const postRow = userPage.locator("div.pending-img", {
      hasText: BSMProductName,
    });

    await postRow.locator("button.btn-img").click();
    await userPage.waitForTimeout(2000);

    await expect(userPage).toHaveURL(
      /.*\/receivedorders\/productforsaledetails\//,
    );
    await userPage.locator("input[name= 'otp']").fill("123456");
    await userPage.locator("button", { hasText: "Submit" }).click();
    await userPage.waitForTimeout(2000);
    expect(userPage.locator("div.modal.fade.show")).toBeVisible();
    const confirmBtn = userPage.locator("div.modal-content button", {
      hasText: "Confirm",
    });
    await confirmBtn.click();
    await userPage.waitForTimeout(2000);
    await expect(userPage.getByText("Updated Successfully")).toBeVisible();
    const step5 = userPage.locator("div.status-first").filter({
      has: userPage.locator("h6", { hasText: "Transaction Complete" }),
    });

    // Assert the number circle is marked complete
    await expect(step5.locator("div.number.complete span")).toHaveText("5");
  });
  test("Asserting completion of last step of Completing transaction at company's(buyer) window", async ({
    companyPage,
    companyHomePage,
    companyBSMPage,
  }) => {
    await companyPage.goto(`/en/dashboard/myorders`, {
      waitUntil: "networkidle",
    });
    const completedOrdersTab = companyPage.locator("div.order-first a", {
      hasText: "Completed",
    });

    await completedOrdersTab.click();

    const BSMOrders = companyPage.locator("#MyOrderCompleted .order-tabs a", {
      hasText: "Buy & Sell with Market (BSM)",
      exact: false,
    });

    await BSMOrders.click();
    const postRow = companyPage.locator("div.pending-img", {
      hasText: BSMProductName,
    });
    await postRow.locator("button.btn-img").click();
    await companyPage.waitForTimeout(2000);
    // ✅ Fix for companyPage as well
    await expect(companyPage).toHaveURL(
      /.*\/receivedorders\/productforsaledetails\//,
    );
    const step5 = companyPage.locator("div.status-first").filter({
      has: companyPage.locator("h6", { hasText: "Transaction Complete" }),
    });

    // Assert the number circle is marked complete
    await expect(step5.locator("div.number.complete span")).toHaveText("5");
  });
  test("Asserting completion of last step of Completing transaction at user's(seller) window and relisting of product", async ({
    userPage,
    userHomePage,
    userBSMPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    const completedOrders = userPage.locator(".nav-tabs a", {
      hasText: "completed",
      exact: false,
    });
    await completedOrders.click();

    const BSMOrders = userPage.locator(".completed-tab-sec a", {
      hasText: "Buy & Sell with Market (BSM)",
      exact: false,
    });

    await BSMOrders.click();

    const postRow = userPage.locator("div.pending-img", {
      hasText: BSMProductName,
    });

    // Then assert only the h5 within that row
    await expect(postRow.locator("h5").first()).toHaveText(BSMProductName);

    const relistBtn = postRow.locator("button", { hasText: "Re-list" });
    await relistBtn.click();

    await expect(
      userPage.getByText("BSM Service Created Successfully"),
    ).toBeVisible();
    await userHomePage.gotoHomepage();
    userHomePage.gotoBSMViaCard();
    // Assert the specific product is listed on the BSM page
    const productCard = userPage.locator("div.packaged-img", {
      hasText: BSMProductName, // "Temp BSM post310"
    });

    await expect(productCard).toBeVisible();

    // Optionally, assert the exact title text
    await expect(productCard.locator("h6")).toHaveText(BSMProductName);
  });
});

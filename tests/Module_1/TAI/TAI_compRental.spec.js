import { test, expect } from "../../../fixtures/page.fixture.js";
import TAIPage from "../../../pages/TAIPage.js";
import { assert } from "node:console";
import { describe } from "node:test";
import credentials from "../../../testData/credentials.json";
import fs from "fs";
import path from "path";
import { pageRoutes, TAIProductName } from "../../../testData/constants.js";

import { BasePage } from "../../../pages/base_page.js";
import { setEngine } from "node:crypto";
test.describe.serial("TAI Flow", () => {
  test("Adding a product by user at TAI", async ({
    userPage,
    userHomePage,
    userTAIPage,
  }) => {
    await userHomePage.gotoTAIViaCard();
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
    const description = "This is a test description for automation";

    await userTAIPage.fillInput("Product name", TAIProductName);

    await userTAIPage.selectDropdown("Industry *", selectedIndustry);
    await userTAIPage.selectDropdown("Category *", selectedCategory);
    await userTAIPage.selectDropdown("SubCategory", selectedSubCategory);
    const uploadedFile = await userPage
      .locator(".dropzone")
      .locator('input[type="file"]')
      .setInputFiles("testData/sampleImg.jpg");
    await userTAIPage.fillRichTextEditor("Description", description);
    await userPage.waitForTimeout(2000);
    const nextBtn = userPage.getByRole("button", { name: "Next" });
    await nextBtn.click();

    const typeAndPricingTab = userPage.locator("a", {
      hasText: " Type & Pricing",
    });

    await expect(typeAndPricingTab).toHaveClass(/active nav-link/);
    await userTAIPage.setCheckbox("Rental only", true);
    await userTAIPage.fillInputWithPlaceholder("Enter Price in $", "10");
    await userTAIPage.selectDropdown("Price per", "Days");
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
    await expect(getFieldValue("Product name")).toHaveText(TAIProductName);
    await expect(getFieldValue("Industry")).toHaveText(selectedIndustry);
    await expect(getFieldValue("Category")).toHaveText(selectedCategory);
    await expect(getFieldValue("Sub category")).toHaveText(selectedSubCategory);

    await expect(
      userPage
        .locator("div.price-duration")
        .filter({ has: userPage.locator(`h6:text-is("Description")`) })
        .locator("div.custom-html.truncate p"),
    ).toHaveText(description);

    await expect(getFieldValue("Rental type")).toHaveText("Rental Only");
    await expect(getFieldValue("Rental price")).toHaveText("$ 10/day");
    // add more fields as needed...x

    // ---------- PUBLISH ----------
    const publishBtn = userPage.getByRole("button", {
      name: "Save and Publish",
    });
    await expect(publishBtn).toBeVisible();
    await publishBtn.click();

    // ---------- VERIFY POST PUBLISHED ----------
    await userPage.waitForLoadState("networkidle");
    await userPage.waitForTimeout(2000);
    await expect(
      userPage.getByText("TAI Service Created Successfully"),
    ).toBeVisible();
  });

  test("Verify whether newly created TAI appears at the product listing page as 'Your Post'", async ({
    userPage,
    userHomePage,
    userTAIPage,
  }) => {
    await userHomePage.gotoTAIViaCard();
    await userPage.waitForLoadState("networkidle");
    const TAIPostCard = userPage
      .locator("div.packaged-img")
      .filter({ has: userPage.locator("h6", { hasText: TAIProductName }) });
    await expect(TAIPostCard).toHaveText(TAIProductName);

    const yourPostTag = userPage.locator("div.post-sold p.your-postbtn", {
      hasText: "Your post",
    });
    await expect(yourPostTag.first()).toBeVisible();
  });

  test("Verify whether newly created post appears at company's product listing page", async ({
    companyPage,
    companyHomePage,
    companyTAIPage,
  }) => {
    await companyHomePage.gotoTAIViaCard();
    const TAIPostCard = companyPage.locator("div.packaged-img").filter({
      has: companyPage.locator("h6", { hasText: TAIProductName }),
    });
    await expect(TAIPostCard).toHaveText(TAIProductName);
  });

  test("Verify if company can apply on new created post", async ({
    companyPage,
    companyHomePage,
    companyTAIPage,
  }) => {
    const currentDate = new Date().toISOString().split('T')[0];
    await companyHomePage.gotoTAIViaCard();
    const TAIPostCard = companyPage.locator("div.packaged-img").filter({
      has: companyPage.locator("h6", { hasText: TAIProductName }),
    });
    //await TAIPostCard.click();
    const [newPage] = await Promise.all([
      companyPage.context().waitForEvent("page"),
      TAIPostCard.click(),
    ]);

    await newPage.waitForLoadState();

    const newPageObject = new BasePage(newPage);
    await newPage
      .locator("//button[contains(text(),'Send Rental Request')]")
      .click();
    await newPage.waitForLoadState("networkidle");

    await expect(newPage.locator("div.modal.fade.show")).toBeVisible();
    await newPageObject.fillInput("Start Date ", currentDate);
    await newPageObject.fillInput("End Date ", currentDate);
    await newPage
      .locator(".form-group")
      .filter({ hasText: "Start Time" })
      .locator(".rs-picker-toggle-wrapper")
      .click();

    const startPopup = newPage.locator(".rs-picker-popup-date").last();
    await expect(startPopup).toBeVisible();

    const startHour = startPopup.locator('[data-key="hours-6"]');
    await startHour.scrollIntoViewIfNeeded();
    await startHour.click();

    const startMinute = startPopup.locator('[data-key="minutes-15"]');
    await startMinute.scrollIntoViewIfNeeded();
    await startMinute.click();

    await startPopup.getByRole("option", { name: "PM" }).click();
    await startPopup.getByRole("button", { name: "OK" }).click();

    // Wait for start popup to fully close before opening end picker
    await expect(startPopup).toBeHidden();

    // ---------- END TIME ----------
    await newPage
      .locator(".form-group")
      .filter({ hasText: "End Time" })
      .locator(".rs-picker-toggle-wrapper")
      .click();

    const endPopup = newPage.locator(".rs-picker-popup-date").last();
    await expect(endPopup).toBeVisible();

    const endHour = endPopup.locator('[data-key="hours-6"]');
    await endHour.scrollIntoViewIfNeeded();
    await endHour.click();

    const endMinute = endPopup.locator('[data-key="minutes-30"]');
    await endMinute.scrollIntoViewIfNeeded();
    await endMinute.click();

    await endPopup.getByRole("option", { name: "PM" }).click();
    await endPopup.getByRole("button", { name: "OK" }).click();

    await expect(endPopup).toBeHidden();
    await newPage.waitForTimeout(2000);
    await newPage
      .locator("//button[contains(text(),'Submit Request')]")
      .click();
    await newPage.waitForTimeout(2000);
    expect(newPage.url()).toContain("https://urxprt.com/en/rentalcontract/");

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
    await newPage.waitForTimeout(1000);
    await companyTAIPage.verifySuccessMessageIsDisplayed("TAI request has been sent", newPage)
    // expect(newPage.getByText("TAI Request Has Been Sent")).toBeVisible();
    // // expect(company);
    // expect(
    //   newPage.locator("//button[contains(text(),'Request Sent')]"),
    // ).toBeDisabled();
    // await newPage.waitForTimeout(2000);
  });

  test("Accepting TAI request by the 'User'", async ({
    userPage,
    userHomePage,
    userTAIPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    const taiRequestsHeader = userPage
      .locator("#Orderequests")
      .locator(".pending-req h4", {
        hasText: "Turn Assets to Income (TAI) requests",
      });

    await expect(taiRequestsHeader).toBeVisible();
    const postRow = userPage.locator("div.pending-img", {
      hasText: TAIProductName,
    });

    await postRow.getByRole("button", { name: "Accept" }).click();
    await userPage.waitForTimeout(2000);

    expect(userPage.url()).toContain("https://urxprt.com/en/rentalcontract/");

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
    await userPage.waitForTimeout(10000);
  });

  test("Paying for product by company(Buyer)  ", async ({
    companyPage,
    companyHomePage,
    companyTAIPage,
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
      hasText: TAIProductName,
    });
    await postRow.locator("button.btn-img").click();
    await companyPage.waitForTimeout(2000);

    await expect(companyPage).toHaveURL(
      /.*\/myorders\/rentalproductsdetails\//,
    );
    const payNowBtn = companyPage.locator("div.status-right span", {
      hasText: "Pay Now",
    });
    await payNowBtn.click();
    await companyPage.waitForTimeout(2000);
    await expect(companyPage.locator("div.modal.fade.show")).toBeVisible();
    const confirmBtn = companyPage.locator("div.modal-content button", {
      hasText: "Confirm",
    });
    await confirmBtn.click();
    await companyPage.waitForTimeout(2000);
    await expect(companyPage).toHaveURL(
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
      companyPage
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
      companyPage.getByText("TAI Payment Completed").first(),
    ).toBeVisible();
    const okayBtn = companyPage.locator("button", { hasText: "Okay" });
    await okayBtn.click();
    await companyPage.waitForTimeout(5000);

    await expect(companyPage).toHaveURL(
      /.*\/receivedorders\/rentalproductsdetails\//,
    );
  });

  test("Updating product status by user(seller)", async ({
    userPage,
    userHomePage,
    userTAIPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    const activeOrders = userPage.locator(".nav-tabs a", {
      hasText: "Active orders",
      exact: false,
    });
    await activeOrders.click();

    const TAIOrders = userPage.locator("#Activeorders .order-tabs a", {
      hasText: "Turn Assets to Income (TAI)",
      exact: false,
    });

    await TAIOrders.click();
    const postRow = userPage.locator("div.pending-img", {
      hasText: TAIProductName,
    });

    await postRow.locator("button.btn-img").click();
    await userPage.waitForTimeout(2000);

    await expect(userPage).toHaveURL(
      /.*\/receivedorders\/rentalproductsdetails\//,
    );
    const updateStatusBtn = userPage.locator("div.status-right span", {
      hasText: "Update status",
    });
    await updateStatusBtn.click();
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
    companyTAIPage,
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
      hasText: TAIProductName,
    });
    await postRow.locator("button.btn-img").click();
    await companyPage.waitForTimeout(2000);
    // ✅ Fix for companyPage as well
    await expect(companyPage).toHaveURL(
      /.*\/myorders\/rentalproductsdetails\//,
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
      has: companyPage.locator("h6", { hasText: "Delivered" }),
    });

    // Assert the number circle is marked complete
    await expect(step4.locator("div.number.complete span")).toHaveText("4");

    // Assert OTP is generated and visible
    await expect(companyPage.locator("div.deliveryotp-sec")).toBeVisible();
  });

  test("Completing transaction by user(Seller) by verifying OTP", async ({
    userPage,
    userHomePage,
    userTAIPage,
  }) => {
    await userPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
    await userHomePage.gotoDashboardPage();
    await userHomePage.gotoReceivedOrders();
    const activeOrders = userPage.locator(".nav-tabs a", {
      hasText: "Active orders",
      exact: false,
    });
    await activeOrders.click();

    const TAIOrders = userPage.locator("#Activeorders .order-tabs a", {
      hasText: "Turn Assets to Income (TAI)",
      exact: false,
    });
    ``;

    await TAIOrders.click();
    const postRow = userPage.locator("div.pending-img", {
      hasText: TAIProductName,
    });

    await postRow.locator("button.btn-img").click();
    await userPage.waitForTimeout(2000);

    await expect(userPage).toHaveURL(
      /.*\/receivedorders\/rentalproductsdetails\//,
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
  });

  test("Asserting completion of last step of Completing transaction at company's(buyer) window", async ({
    companyPage,
    companyHomePage,
    companyTAIPage,
  }) => {
    await companyPage.goto(`/en/dashboard/myorders`, {
      waitUntil: "networkidle",
    });
    const completedOrdersTab = companyPage.locator("div.order-first a", {
      hasText: "Completed",
    });

    await completedOrdersTab.click();

    const TAIOrders = companyPage.locator("#MyOrderCompleted .order-tabs a", {
      hasText: "Turn Assets to Income (TAI)",
      exact: false,
    });

    await TAIOrders.click();
    const postRow = companyPage.locator("div.pending-img", {
      hasText: TAIProductName,
    });
    await postRow.locator("button.btn-img").click();
    await companyPage.waitForTimeout(2000);
    // ✅ Fix for companyPage as well
    await expect(companyPage).toHaveURL(
      /.*\/myorders\/rentalproductsdetails\//,
    );
    const step5 = companyPage.locator("div.status-first").filter({
      has: companyPage.locator("h6", { hasText: "Transaction Complete" }),
    });
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

    const TAIOrders = userPage.locator(".completed-tab-sec a", {
      hasText: "Turn Assets to Income (TAI)",
      exact: false,
    });

    await TAIOrders.click();

    const postRow = userPage.locator("div.pending-img", {
      hasText: TAIProductName,
    });

    // Then assert only the h5 within that row
    await expect(postRow.locator("h5").first()).toHaveText(TAIProductName);
  });
});

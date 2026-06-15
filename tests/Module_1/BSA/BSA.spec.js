import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, BSA_ProductName } from "../../../testData/constants.js";

test("TC_BSA_001: BSA page is accessible after login", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoBSAViaCard();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchauction");
  await userHomePage.gotoHomepage();
  await userHomePage.goToBSAViaHeader();
  await expect(userPage).toHaveURL("https://urxprt.com/en/searchauction");
});

test("TC_BSA_002: Search filters return expected results", async ({
  userPage,
  userHomePage,
}) => {
  await userHomePage.gotoBSAViaCard();
  const randomText = "test";
  const search_box = userPage.getByRole("textbox", { name: "Search BSA" });
  const search_button = userPage.getByRole("button", { name: "Search" });
  await search_box.fill(randomText);
  await search_button.click();
  const postNames = await userPage.locator("//div[@class='auction-det']//h6").first();
  await postNames.first().waitFor();
  await userPage.waitForTimeout(1200);
  const count = await postNames.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("TC_BSA_003: Navigate to create post page from homepage and dashboard", async ({
  userPage,
  userHomePage,
  userBSAPage,
}) => {
  await userHomePage.gotoBSAViaCard();
  await userBSAPage.addAProduct();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
  await userHomePage.gotoHomepage();
  await userHomePage.navigateToAddBSAViaDropdown();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
  await userHomePage.gotoHomepage();
  await userHomePage.gotoDashboardPage();
  await userBSAPage.goToAllServicesTab();
  await expect(userPage).toHaveURL(/.*\/myotsproducts/);
});

test("TC_BSA_004: View filtered post details and verify recently reviewed posts", async ({
  userPage,
  userHomePage,
  userBSAPage,
}) => {
  await userHomePage.gotoBSAViaCard();
  await userBSAPage.waitForPosts();
  const randomText = "test";
  await userBSAPage.searchFor(randomText);
  await userBSAPage.waitForFilteredResults();
  const newPage = await userBSAPage.goToTheFilteredPostetails();
  await userBSAPage.verifyPostDetailsIsVisible(newPage);
  await newPage.close();
  await userPage.reload();
  await userBSAPage.goToRecentlyReviewedPage();
  await userBSAPage.waitForReviewedPostToAppear();
  const count = await userBSAPage.getPostCount();
  expect(count).toBeGreaterThan(1);
  const isPresent = await userBSAPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
});

test("TC_BSA_005: Save a filtered post and verify saved posts page", async ({
  userPage,
  userHomePage,
  userBSAPage,
}) => {
  await userHomePage.gotoBSAViaCard();
  await userBSAPage.waitForPosts();
  const randomText = "test";
  await userBSAPage.searchFor(randomText);
  await userBSAPage.waitForFilteredResults();
  const newPage1 = await userBSAPage.goToTheFilteredPostetails();
  await userBSAPage.clickOnHeartButton(newPage1);
  await newPage1.close();
  await userPage.reload();
  await userBSAPage.goToSavedPostsPage();
  await userBSAPage.waitForSavedPostToAppear();
  const count = await userBSAPage.getPostCount();
  expect(count).toBeGreaterThanOrEqual(1);
  const isPresent = await userBSAPage.isPostNamePresent(randomText);
  expect(isPresent).toBeTruthy();
  const newPage2 = await userBSAPage.goToTheFilteredPostetails();
  await userBSAPage.clickOnHeartButton(newPage2);
  await newPage2.close();
  await userPage.reload();
  await userBSAPage.goToSavedPostsPage();
  await userBSAPage.verifyThatTheTabHasNoPosts();
});

test.describe.serial("BSA Tests for User Role", () => {
  let bsa_productName;

  test.beforeAll(async () => {
    bsa_productName = BSA_ProductName;
  })

  test("TC_BSA_006: Verify user is able to add a BSA", async ({
  userPage,
  userHomePage,
  userBSAPage,
  }) => {
    await userHomePage.gotoBSAViaCard();
    await userBSAPage.waitForPosts();
    await userBSAPage.addAProduct();
    await userBSAPage.openAddBSATab()
    await userPage.waitForTimeout(800);
    await userBSAPage.fillInput("Product Title ", bsa_productName);
    await userBSAPage.fillInput("Minimum bid ", "10");
    await userPage.locator('input[type="file"]').setInputFiles('testData/sampleImg.jpg');
    await expect(userPage.locator("//img[@alt='Delete']")).toBeVisible();
    await userBSAPage.fillRichTextEditor("Description", "This is a sample description for the BSA Product.");
    await userPage.waitForTimeout(800);
    await userBSAPage.clickOnNextButtonOnAddPage();
    await userPage.waitForTimeout(800);
    await userBSAPage.selectDropdown("Buy & Sell with Auction (BSA) type ", "Sealed");
    await userBSAPage.addCurrentDateAndTime();
    await userBSAPage.fillInput("Duration in hour", "1");
    await userBSAPage.clickOnNextButtonOnBSADetails();
    await userPage.waitForTimeout(800);
    await userBSAPage.saveAndPublishService()
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
    const acceptOfferButton = userPage.locator("button", {
      hasText: "Accept & Publish",
    });
    await acceptOfferButton.click();
    await userBSAPage.verifySuccessMessageIsDisplayed("BSA service created successfully")
  });

  test("TC_BSA_007: Verify user is able to view created product in All Services", async ({
    userPage,
    userHomePage,
    userBSAPage,
  }) => {
    await userHomePage.gotoBSAViaCard();
    await userBSAPage.addAProduct();
    await expect(userPage).toHaveURL(/.*\/myotsproducts/);
    await userHomePage.selectServices("BSA");
    await userBSAPage.isServicePresent(bsa_productName)
  })

  test("TC_OTS_008: Verify user is able to edit the create product", async ({
    userPage,
    userHomePage,
    userBSAPage,
  }) => {
    await userHomePage.gotoBSAViaCard();
    await userBSAPage.addAProduct();
    await expect(userPage).toHaveURL(/.*\/myotsproducts/);
    await userHomePage.selectServices("BSA");
    await userPage.waitForTimeout(500);
    await userBSAPage.clickOnEditButton(bsa_productName)
    await userPage.waitForTimeout(500);
    await userBSAPage.fillInput("Product Title ", bsa_productName + " Updated");
    await userBSAPage.clickOnNextButtonOnAddPage();
    await userBSAPage.addCurrentDateAndTime();
    await userBSAPage.clickOnNextButtonOnBSADetails();
    await userBSAPage.addAndPublishService();
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
    const acceptOfferButton = userPage.locator("button", {
      hasText: "Accept & Publish",
    });
    await acceptOfferButton.click();
    await userBSAPage.verifyErrorMessageIsDisplayed("You cannot delete/update a running BSA")
  })

  test("TC_OTS_009: Verify user is able to cancel the edit", async ({
    userPage,
    userHomePage,
    userBSAPage,
  }) => {
    await userHomePage.gotoBSAViaCard();
    await userBSAPage.addAProduct();
    await expect(userPage).toHaveURL(/.*\/myotsproducts/);
    await userHomePage.selectServices("BSA");
    await userPage.waitForTimeout(500);
    await userBSAPage.clickOnEditButton(bsa_productName)
    await userBSAPage.closeAddProductTab();
    await userBSAPage.verifyConfirmationPopupIsPresent("You have unsaved changes. Are you sure you want to cancel?")
    await userBSAPage.clickOnYesButton();
  })

  test("TC_OTS_010: Verify user is gets a error message while deleting active created auction", async ({
    userPage,
    userHomePage,
    userBSAPage,
  }) => {
    await userHomePage.gotoBSAViaCard();
    await userBSAPage.addAProduct();
    await expect(userPage).toHaveURL(/.*\/myotsproducts/);
    await userHomePage.selectServices("BSA");
    await userPage.waitForTimeout(500);
    await userBSAPage.clickOnDeleteButton(bsa_productName)
    await userBSAPage.verifyConfirmationPopupIsPresent("Confirm Delete")
    await userBSAPage.clickOnConfirmButton();
    await userBSAPage.verifyErrorMessageIsDisplayed("You cannot delete/update a running BSA")
  })

  test.only("TC_BSA_013: Verify Expert user is able to accept a bid", async ({
    expertHomePage,
    expertBSAPage,
  }) => {
    await expertHomePage.gotoBSAViaCard();
    const randomText = bsa_productName;
    await expertBSAPage.searchFor(randomText);
    await expertBSAPage.waitForFilteredResults();
    const newPage = await expertBSAPage.goToTheFilteredPostetails();
    const bidAmt = await expertBSAPage.getMinimumBidAmount(newPage);
    await expertBSAPage.enterAndPlaceBid(bidAmt, newPage)
    await expertBSAPage.verifyAndConfirmBidConfirmation("Confirm Bid", newPage);
    await expertBSAPage.clickOnConfirmBidButton(newPage);
    await expertBSAPage.verifySuccessfulBidMessageIsDisplayed("Your bid amount has been submitted", newPage)
  });

  test.only("TC_BSA_014: Verify Company user is able to accept a bid", async ({
    companyHomePage,
    companyBSAPage,
  }) => {
    await companyHomePage.gotoBSAViaCard();
    const randomText = bsa_productName;
    await companyBSAPage.searchFor(randomText);
    await companyBSAPage.waitForFilteredResults();
    const newPage = await companyBSAPage.goToTheFilteredPostetails();
    const bidAmt = await companyBSAPage.getMinimumBidAmount(newPage);
    await companyBSAPage.enterAndPlaceBid(bidAmt, newPage)
    await companyBSAPage.verifyAndConfirmBidConfirmation("Confirm Bid", newPage);
    await companyBSAPage.clickOnConfirmBidButton(newPage);
    await companyBSAPage.verifySuccessfulBidMessageIsDisplayed("Your bid amount has been submitted", newPage)
  });

  test.only("TC_BSA_011: Verify Expert user is able to accept the agreement bid", async ({
    expertHomePage,
    expertBSAPage,
  }) => {
    await expertHomePage.gotoBSAViaCard();
    const randomText = bsa_productName;
    await expertBSAPage.searchFor(randomText);
    await expertBSAPage.waitForFilteredResults();
    const newPage = await expertBSAPage.goToTheFilteredPostetails();
    await expertBSAPage.clickOnPayAndJoinAuction(newPage);
    await expertBSAPage.clickOnJoinAuctionConfirmButton(newPage);
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
    const acceptOfferButton = newPage.locator("button", {
      hasText: "Accept",
    });
    await acceptOfferButton.click();
    await expertBSAPage.verifySuccessfulPurchaseRequest("Updated Successfully", newPage);
    const makePayment = newPage.locator("button", { hasText: "Make Payment" });
    await expect(makePayment).toBeVisible();
    await makePayment.click();
    const saveAndMakePayment = newPage.locator("button", {
      hasText: "Save and make payment",
    });
    await saveAndMakePayment.click();
    await newPage.waitForTimeout(3000);
    await expect(newPage.locator('iframe[title="Card Number"]')).toBeVisible();
    await newPage
      .frameLocator('iframe[title="Card Number"]')
      .locator('input[name="card.number"]')
      .fill("5555555555554444");
    await newPage.locator('input[placeholder="MM / YY"]').fill("12 / 30");
    await newPage
      .locator('input[placeholder="Card holder"]')
      .fill("Test User");
    await newPage
      .frameLocator('iframe[title="Security Code CVV"]')
      .locator('input[name="card.cvv"]')
      .fill("123");
    // Click payment submit and wait for redirect
    await Promise.all([
      newPage.waitForURL("**oppwa.com/**"),
      await newPage
        .getByRole("button", {
          name: "Pay now",
        })
        .click(),
    ]);
    await newPage.waitForLoadState("networkidle");
    const payBtn = await newPage.locator('input[value="Pay"]');
    await payBtn.click();
    await newPage.waitForTimeout(2000);
    await expect(
      newPage.getByText("BSA Deposit Payment Completed").first(),
    ).toBeVisible();
  });

  test.only("TC_BSA_012: Verify Company user is able to accept the agreement bid", async ({
    companyHomePage,
    companyBSAPage,
  }) => {
    await companyHomePage.gotoBSAViaCard();
    const randomText = bsa_productName;
    await companyBSAPage.searchFor(randomText);
    await companyBSAPage.waitForFilteredResults();
    const newPage = await companyBSAPage.goToTheFilteredPostetails();
    await companyBSAPage.clickOnPayAndJoinAuction(newPage);
    await companyBSAPage.clickOnJoinAuctionConfirmButton(newPage);
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
    const acceptOfferButton = newPage.locator("button", {
      hasText: "Accept",
    });
    await acceptOfferButton.click();
    await companyBSAPage.verifySuccessfulPurchaseRequest("Updated Successfully", newPage);
    const makePayment = newPage.locator("button", { hasText: "Make Payment" });
    await expect(makePayment).toBeVisible();
    await makePayment.click();
    const saveAndMakePayment = newPage.locator("button", {
      hasText: "Save and make payment",
    });
    await saveAndMakePayment.click();
    await newPage.waitForTimeout(3000);
    await expect(newPage.locator('iframe[title="Card Number"]')).toBeVisible();
    await newPage
      .frameLocator('iframe[title="Card Number"]')
      .locator('input[name="card.number"]')
      .fill("5555555555554444");
    await newPage.locator('input[placeholder="MM / YY"]').fill("12 / 30");
    await newPage
      .locator('input[placeholder="Card holder"]')
      .fill("Test User");
    await newPage
      .frameLocator('iframe[title="Security Code CVV"]')
      .locator('input[name="card.cvv"]')
      .fill("123");
    // Click payment submit and wait for redirect
    await Promise.all([
      newPage.waitForURL("**oppwa.com/**"),
      await newPage
        .getByRole("button", {
          name: "Pay now",
        })
        .click(),
    ]);
    await newPage.waitForLoadState("networkidle");
    const payBtn = await newPage.locator('input[value="Pay"]');
    await payBtn.click();
    await newPage.waitForTimeout(2000);
    await expect(
      newPage.getByText("BSA Deposit Payment Completed").first(),
    ).toBeVisible();
  });

  test.only("TC_BSA_015: Verify user is able to view bids submitted by different user", async ({
    userHomePage,
    userPage,
    userBSAPage,
  }) => {
    await userHomePage.gotoDashboardPage();
    await userHomePage.navigateToRecievedOrders();
    await userHomePage.goToReceivedOrderType("Active orders");
    await userHomePage.goToSubReceivedOrderType("BSA");
    await userBSAPage.goToDesiredProduct(bsa_productName);
    await userPage.waitForTimeout(500);
    await userBSAPage.goToAuctionBidTab();
    const bid_count = await userBSAPage.getTotalBidCount();
    expect(bid_count).toBeGreaterThanOrEqual(1);
  });

  // test("TC_BSA_013: Verify Expert user is able to pay and join the bid", async ({
  //   expertHomePage,
  //   expertPage,
  //   expertBSAPage,
  // }) => {
  //   await expertPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
  //   await expertHomePage.navigateToMyOrdersViaPreview();
  //   await expertHomePage.goToOrderType("Posted orders");
  //   await expertHomePage.goToSubOrderType("BSA");
  //   await expertBSAPage.goToDesiredProduct(BSA_ProductName);
  //   await expertBSAPage.clickOnPayAndJoinAuction();
  //   await expertBSAPage.clickOnJoinAuctionConfirmButton();
  //   await expertPage.locator("label[for='agree']").click();
  //   const scrollToBottomBtn = expertPage
  //     .locator(".popup-contract-container")
  //     .locator("button", {
  //       name: "Scroll to Bottom",
  //       exact: true,
  //     });
  //   await expertPage.waitForTimeout(2000);
  //   await scrollToBottomBtn.click();
  //   await expertPage
  //     .locator(".popup-contract-container")
  //     .locator("input[id='agree']")
  //     .click();
  //   await expertPage.waitForLoadState("networkidle");
  //   await expertPage.waitForTimeout(2000);
  //   const acceptOfferButton = expertPage.locator("button", {
  //     hasText: "Accept",
  //   });
  //   await acceptOfferButton.click();
  //   await expertBSAPage.verifySuccessfulPurchaseRequest("Updated Successfully");
  //   const makePayment = expertPage.locator("button", { hasText: "Make Payment" });
  //   await expect(makePayment).toBeVisible();
  //   await makePayment.click();
  //   const saveAndMakePayment = expertPage.locator("button", {
  //     hasText: "Save and make payment",
  //   });
  //   await saveAndMakePayment.click();
  //   await expertPage.waitForTimeout(3000);
  //   await expect(expertPage.locator('iframe[title="Card Number"]')).toBeVisible();
  //   await expertPage
  //     .frameLocator('iframe[title="Card Number"]')
  //     .locator('input[name="card.number"]')
  //     .fill("5555555555554444");
  //   await expertPage.locator('input[placeholder="MM / YY"]').fill("12 / 30");
  //   await expertPage
  //     .locator('input[placeholder="Card holder"]')
  //     .fill("Test User");
  //   await expertPage
  //     .frameLocator('iframe[title="Security Code CVV"]')
  //     .locator('input[name="card.cvv"]')
  //     .fill("123");
  //   // Click payment submit and wait for redirect
  //   await Promise.all([
  //     expertPage.waitForURL("**oppwa.com/**"),
  //     await expertPage
  //       .getByRole("button", {
  //         name: "Pay now",
  //       })
  //       .click(),
  //   ]);
  //   await expertPage.waitForLoadState("networkidle");
  //   const payBtn = await expertPage.locator('input[value="Pay"]');
  //   await payBtn.click();
  //   await expertPage.waitForTimeout(2000);
  //   await expect(
  //     expertPage.getByText("BSA Deposit Payment Completed").first(),
  //   ).toBeVisible();
  // });
  
}) 

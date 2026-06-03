import { test, expect } from "../../../fixtures/page.fixture.js";
import { pageRoutes, WBOPostName } from "../../../testData/constants.js";
import { BasePage } from "../../../pages/base_page.js";

test.describe.serial("WBO Flow", () => {
    test("TC_WBO_001: Verify create post from WBO page", async ({
      userPage,
      userHomePage,
      userWBOPage,
      }) => {
        await userHomePage.gotoWBOViaCard();
        await userWBOPage.clickOnCreateAPostButton();
        await expect(userPage).toHaveURL(/.*\/createpost/);
        await userWBOPage.fillInput("Write a title for your post this ", WBOPostName);
        await userWBOPage.selectDropdown("Select Industries *", "Business");
        await userWBOPage.selectDropdown(
          "Select Category *",
          "Managing and Consultant",
        );
        await userWBOPage.selectDropdown(
          "Select Sub Category",
          "Project Management",
        );
        await userWBOPage.fillInput(
          "Prize money *",
          "10",
        );
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${
          String(today.getMonth() + 1).padStart(2, "0")}-${
          String(today.getDate()).padStart(2, "0")
        }`;
        await userWBOPage.fillInput(
          "Last date of entry *",
          formattedDate,
        );
        await userWBOPage.fillRichTextEditor(
          "Win business Opportunities (WBO) Description *",
          "This is a test description for automation",
        );
        await userPage.waitForTimeout(2000); // wait for validation to trigger
        const nextButton = userPage.getByRole("button", { name: "Next" });
        await expect(nextButton).toBeEnabled();
        await nextButton.click();
        await userWBOPage.selectMultiDropdown("Select competencies", [
          "Branding",
          "Campaigns",
        ]);
        await nextButton.click();
        await expect(userWBOPage.required_competencies_error).toBeVisible();
        const skill = userPage.locator("p.select-deactive-skill", { hasText: "CRM +", exact: true,});
        await skill.click();
        await nextButton.click();
        await nextButton.click();
        await userWBOPage.expected_deliverables_input.fill("This is test deliverable");
        await userWBOPage.selectDropdown(
          "Preferred Language of Work Submission *",
          "English",
        );
        await userPage.waitForTimeout(1000);
        await expect(nextButton).toBeEnabled();
        await nextButton.click();
        await expect(
          userPage.getByText("Win business Opportunities (WBO) Summary"),
        ).toBeVisible();  
        const postContestButton = userPage.getByRole("button", { name: "Post Contest" });
        await postContestButton.click();
        await expect(userPage.locator("//h6[contains(text(),'Order summary')]")).toBeVisible();
        const makePayment = userPage.locator("button", { hasText: "Make Payment" });
        await expect(makePayment).toBeVisible();
        await makePayment.click();
        const saveAndMakePayment = userPage.locator("button", {
          hasText: "Save and make payment",
        });
        await saveAndMakePayment.click();
        await userPage.waitForTimeout(5000);
        await expect(userPage.locator('iframe[title="Card Number"]')).toBeVisible();
        await userPage
          .frameLocator('iframe[title="Card Number"]')
          .locator('input[name="card.number"]')
          .fill("5555555555554444");
        await userPage.locator('input[placeholder="MM / YY"]').fill("12 / 30");
        await userPage
          .locator('input[placeholder="Card holder"]')
          .fill("Test User");
        await userPage
          .frameLocator('iframe[title="Security Code CVV"]')
          .locator('input[name="card.cvv"]')
          .fill("123");
        // Click payment submit and wait for redirect
        await Promise.all([
          userPage.waitForURL("**oppwa.com/**"),
          await userPage
            .getByRole("button", {
              name: "Pay now",
            })
            .click(),
        ]);
        await userPage.waitForLoadState("networkidle");
        const payBtn = await userPage.locator('input[value="Pay"]');
        await payBtn.click();
        await userPage.waitForTimeout(3000);
        await expect(
          userPage.getByText("WBO Payment Completed").first(),
        ).toBeVisible();
      });

    test("TC_WBO_002: Search filters return newly created post in results", async ({
          userPage,
          userHomePage,
        }) => {
          await userHomePage.gotoWBOViaCard();
          const search_box = userPage.getByRole("textbox", { name: "Search WBO" });
          const search_button = userPage.getByRole("button", { name: "Search" });
          await search_box.fill(WBOPostName);
          await search_button.click();
          await userPage.waitForLoadState("networkidle");
          const postNames = await userPage.locator(
            "//div[@class='filter-detail']//h5",
          );
          await postNames.first().waitFor();
          const count = await postNames.count();
          expect(count).toBe(1);
      });

    test("TC_WBO_003: Verify newly created post are displayed in My Orders under Posted Posts", async ({
    userHomePage,
    }) => {
        await userHomePage.gotoWBOViaCard();
        await userHomePage.navigateToMyOrdersViaPreview();
        await userHomePage.openWBOPostFromMyOrders();
        await expect(userHomePage.post_contest_name_in_all_active_wbo.first()).toHaveText(WBOPostName);
    })

    test("TC_WBO_004: Verify Expert User not able to submit entry", async ({
        expertPage,
        expertHomePage,
      }) => {
        await expertHomePage.gotoWBOViaCard();
        await expect(expertPage).toHaveURL(
          "https://urxprt.com/en/searchall?type=2",
        );
        const postCard = expertPage.locator(".filter-detail", {
          hasText: WBOPostName,
        });
        await expect(postCard).toBeVisible();
        await postCard.click();
        const [newPage] = await Promise.all([
          expertPage.context().waitForEvent("page"),
          postCard.click(),
        ]);
    
        await newPage.waitForLoadState();
        const newPageObject = new BasePage(newPage);
        const submitEntryButton = newPage.getByRole("button", {
          name: "Submit entry",
          exact: true,
        });
        await submitEntryButton.click();
        await newPage.waitForLoadState("networkidle");
        await submitEntryButton.click();
        const errorTextList = [
            "At least one file is required",
            "This is required",
            "This is required",
            "Licensed content is required"
          ];
        const errorLocators = await newPage.locator(".error");
        const count = await errorLocators.count();
        for (let i = 0; i < count; i++) {
            const errorText = (await errorLocators.nth(i).textContent()).trim();
            expect(errorTextList).toContain(errorText);
        }
    });

    test("TC_WBO_005: Verify Expert User is able to submit entry", async ({
      expertPage,
      expertHomePage,
    }) => {
      await expertHomePage.gotoWBOViaCard();
      await expect(expertPage).toHaveURL(
          "https://urxprt.com/en/searchall?type=2",
      );
      const postCard = expertPage.locator(".filter-detail", {
          hasText: WBOPostName,
      });
      await expect(postCard).toBeVisible();
      await postCard.click();
      const [newPage] = await Promise.all([
          expertPage.context().waitForEvent("page"),
          postCard.click(),
      ]);

      await newPage.waitForLoadState();
      const newPageObject = new BasePage(newPage);
      const submitEntryButton = newPage.getByRole("button", {
          name: "Submit entry",
          exact: true,
      });
      await submitEntryButton.click();
      await newPage.waitForLoadState("networkidle");
      await newPage.locator('input[type="file"]').setInputFiles('testData/sampleImg.jpg');
      await expect(newPage.locator("//img[@alt='Delete']")).toBeVisible();
      await newPageObject.fillInputWithPlaceholder(
          "Enter entry title",
          "This is a test title for automation",
      );
      await newPageObject.fillInputWithPlaceholder(
          "Enter description here",
          "This is a test description for automation",
      );
      await newPageObject.clickOnCheckbox("This entry is entirely my own.");
      await submitEntryButton.click();
      await expect(
        newPage.getByText(
          "Congratulations! Your Entry has been submitted successfully.",
        ),
      ).toBeVisible();
    });

    test("TC_WBO_006: Verify submitted entry appears in 'Manage Work' page for 'Expert' user", async ({
        expertPage,
        expertHomePage,
      }) => {
        await expertHomePage.gotoDashboardPage();
        await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
        await expertPage.waitForLoadState("networkidle");
        const manageWorkTab = expertPage.getByText('Win business Opportunities (WBO)', { exact: true });
        await manageWorkTab.click();
        const appliedPost = expertPage.locator(
          ".post-back",
          {
            hasText: WBOPostName,
          },
        );
        await expect(appliedPost).toBeVisible();
    });

    test("TC_WBO_007: Verify submitted entry appears in 'My Orders' page for 'User' after expert submits", async ({
        userPage,
      }) => {
        await userPage.goto(`/en/dashboard`, { waitUntil: "networkidle" });
        const manageOrderTab = userPage.locator("a", {
          hasText: "My Orders",
        });
        await manageOrderTab.click();
        const orderTabs = userPage
          .locator("#MyOrderPostedorders")
          .locator(".order-tabs");
    
        const WBOTab = orderTabs.locator("a", {
          hasText: "Win business Opportunities (WBO)",
          exact: false,
        });
        await WBOTab.click();
        const tabContent = userPage.locator(".tab-content");
        const PostedWBO = tabContent.locator("h4", {
          hasText: "All Active Win business Opportunities (WBO)",
        });
        await expect(PostedWBO).toBeVisible();
        const orderCard = userPage.locator("h3", {
          hasText: WBOPostName,
        });
        await expect(orderCard).toBeVisible();
        await userPage.locator("//h3[contains(text(),'" + WBOPostName + "')]/parent::div/following-sibling::button").click();
        const postNavTabs = userPage.locator(".nav-tabs");
        const entriesTab = postNavTabs.locator("a", {
          hasText: "Entries",
          exact: false,
        });
        await entriesTab.click();
        const shivakumarCard = userPage.locator(".entries", {
          has: userPage.locator("span", { hasText: "Shivakumar GP" }),
        });
        await expect(shivakumarCard).toBeVisible();
        // Updated Successfully

        // await userPage.waitForTimeout(2000);
        // await shivakumarCard.getByRole("button", { name: "Send Offer" }).click();
        // await userPage.locator("label[for='agree']").click();
        // const scrollToBottomBtn = userPage
        //   .locator(".popup-contract-container")
        //   .locator("button", {
        //     name: "Scroll to Bottom",
        //     exact: true,
        //   });
        // await userPage.waitForTimeout(2000);
        // await scrollToBottomBtn.click();
        // await userPage
        //   .locator(".popup-contract-container")
        //   .locator("input[id='agree']")
        //   .click();
        // await userPage.waitForLoadState("networkidle");
        // await userPage.waitForTimeout(2000);
        // const acceptOfferButton = userPage.locator("button", {
        //   hasText: "Accept",
        // });
        // await acceptOfferButton.click();
        // await userPage.waitForTimeout(2000);
    });

    test("TC_WBO_008: Verify Company User is able to submit entry", async ({
      companyPage,
      companyHomePage,
    }) => {
      await companyHomePage.gotoWBOViaCard();
      await expect(companyPage).toHaveURL(
          "https://urxprt.com/en/searchall?type=2",
      );
      const postCard = companyPage.locator(".filter-detail", {
          hasText: WBOPostName,
      });
      await expect(postCard).toBeVisible();
      await postCard.click();
      const [newPage] = await Promise.all([
          companyPage.context().waitForEvent("page"),
          postCard.click(),
      ]);

      await newPage.waitForLoadState();
      const newPageObject = new BasePage(newPage);
      const submitEntryButton = newPage.getByRole("button", {
          name: "Submit entry",
          exact: true,
      });
      await submitEntryButton.click();
      await newPage.waitForLoadState("networkidle");
      await newPage.locator('input[type="file"]').setInputFiles('testData/sampleImg.jpg');
      await expect(newPage.locator("//img[@alt='Delete']")).toBeVisible();
      await newPageObject.fillInputWithPlaceholder(
          "Enter entry title",
          "This is a test title for automation",
      );
      await newPageObject.fillInputWithPlaceholder(
          "Enter description here",
          "This is a test description for automation",
      );
      await newPageObject.clickOnCheckbox("This entry is entirely my own.");
      await submitEntryButton.click();
      await expect(
        newPage.getByText(
          "Congratulations! Your Entry has been submitted successfully.",
        ),
      ).toBeVisible();
    });

    test("TC_WBO_009: Verify submitted entry appears in 'Manage Work' page for 'Company' user", async ({
        companyPage,
        companyHomePage,
      }) => {
        await companyHomePage.gotoDashboardPage();
        await expect(companyPage).toHaveURL("https://urxprt.com/en/dashboard");
        await companyPage.waitForLoadState("networkidle");
        const manageWorkTab = companyPage.getByText('Win business Opportunities (WBO)', { exact: true });
        await manageWorkTab.click();
        const appliedPost = companyPage.locator(
          ".post-back",
          {
            hasText: WBOPostName,
          },
        );
        await expect(appliedPost).toBeVisible();
    });

    test("TC_WBO_010: Verify submitted entry appears in 'My Orders' page for 'User' after company submits", async ({
        userPage,
      }) => {
        await userPage.goto(`/en/dashboard`, { waitUntil: "networkidle" });
        const manageOrderTab = userPage.locator("a", {
          hasText: "My Orders",
        });
        await manageOrderTab.click();
        const orderTabs = userPage
          .locator("#MyOrderPostedorders")
          .locator(".order-tabs");
    
        const WBOTab = orderTabs.locator("a", {
          hasText: "Win business Opportunities (WBO)",
          exact: false,
        });
        await WBOTab.click();
        const tabContent = userPage.locator(".tab-content");
        const PostedWBO = tabContent.locator("h4", {
          hasText: "All Active Win business Opportunities (WBO)",
        });
        await expect(PostedWBO).toBeVisible();
        const orderCard = userPage.locator("h3", {
          hasText: WBOPostName,
        });
        await expect(orderCard).toBeVisible();
        await userPage.locator("//h3[contains(text(),'" + WBOPostName + "')]/parent::div/following-sibling::button").click();
        const postNavTabs = userPage.locator(".nav-tabs");
        const entriesTab = postNavTabs.locator("a", {
          hasText: "Entries",
          exact: false,
        });
        await entriesTab.click();
        const shivakumarCard = userPage.locator(".entries", {
          has: userPage.locator("span", { hasText: "Shivakumar Padaiyachi" }),
        });
        await expect(shivakumarCard).toBeVisible();
    });

    test("TC_WBO_011: Verify user is able to view and add comments on both 'Expert' and 'Company' entries", async ({
        userPage,
        userWBOPage,
      }) => {
        await userPage.goto(`/en/dashboard`, { waitUntil: "networkidle" });
        const manageOrderTab = userPage.locator("a", {
          hasText: "My Orders",
        });
        await manageOrderTab.click();
        const orderTabs = userPage
          .locator("#MyOrderPostedorders")
          .locator(".order-tabs");
    
        const WBOTab = orderTabs.locator("a", {
          hasText: "Win business Opportunities (WBO)",
          exact: false,
        });
        await WBOTab.click();
        const tabContent = userPage.locator(".tab-content");
        const PostedWBO = tabContent.locator("h4", {
          hasText: "All Active Win business Opportunities (WBO)",
        });
        await expect(PostedWBO).toBeVisible();
        const orderCard = userPage.locator("h3", {
          hasText: WBOPostName,
        });
        await expect(orderCard).toBeVisible();
        await userPage.locator("//h3[contains(text(),'" + WBOPostName + "')]/parent::div/following-sibling::button").click();
        const postNavTabs = userPage.locator(".nav-tabs");
        const entriesTab = postNavTabs.locator("a", {
          hasText: "Entries",
          exact: false,
        });
        await entriesTab.click();
        await userWBOPage.selectEntryOfUser("GP");
        await expect(userPage.locator(".rent-product")).toBeVisible();
        await userPage.waitForTimeout(2000);
        await userWBOPage.writeComment("This is a test comment");
        const sendButton = await userPage.locator(".last-popupsec .btn");
        await sendButton.click();
        await expect(userPage.locator(".modal-comment .comment-sec", { hasText: "This is a test comment" })).toBeVisible();
        const closeButton = userPage.locator(".rent-product .btn img");
        await closeButton.click();
        await expect(userPage.locator(".rent-product")).not.toBeVisible();
        await userWBOPage.selectEntryOfUser("Padaiyachi");
        await expect(userPage.locator(".rent-product")).toBeVisible();
        await userPage.waitForTimeout(2000);
        await userWBOPage.writeComment("This is a test comment");
        await sendButton.click();
        await expect(userPage.locator(".modal-comment .comment-sec", { hasText: "This is a test comment" })).toBeVisible();
        await closeButton.click();
        await expect(userPage.locator(".rent-product")).not.toBeVisible();
    });

    test("TC_WBO_012: Verify comments appears in 'Notification' for 'Expert' user", async ({
        expertPage,
        expertHomePage,
      }) => {
        await expertPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
        await expertHomePage.hoverOverNotifivationIcon(); 
        const notificationMsg = await expertPage.locator("//h6[normalize-space()='New comment on your WBO entry: " + WBOPostName + "']").first();
        await expect(notificationMsg).toBeVisible();
    });

    test("TC_WBO_013: Verify comments appears in 'Notification' for 'Company' user", async ({
        companyPage,
        companyHomePage,
      }) => {
        await companyPage.goto(pageRoutes.account, { waitUntil: "networkidle" });
        await companyHomePage.hoverOverNotifivationIcon(); 
        const notificationMsg = await companyPage.locator("//h6[normalize-space()='New comment on your WBO entry: " + WBOPostName + "']").first();
        await expect(notificationMsg).toBeVisible();
    });

});
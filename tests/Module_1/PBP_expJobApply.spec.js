import { test, expect } from "../../fixtures/page.fixture.js";
import { pageRoutes, PBPPostName } from "../../testData/constants.js";
import { BasePage } from "../../pages/base_page.js";

test.describe.serial("PBP Flow", () => {
    test("TC_PBP_001: Verify create post from PBP page", async ({
    userPage,
    userHomePage,
    userPBPPage,
    }) => {
        await userHomePage.gotoPBPViaCard();
        await userPBPPage.clickOnCreateAPostButton();
        await expect(userPage).toHaveURL(/.*\/createpost/);
        await userPBPPage.fillInput("Write a title for your post ", PBPPostName);
        await userPBPPage.selectDropdown("Select Industries *", "Business");
        await userPBPPage.selectDropdown(
        "Select Category *",
        "Managing and Consultant",
        );
        await userPBPPage.selectDropdown(
        "Select Sub Category",
        "Project Management",
        );
        await userPBPPage.fillRichTextEditor(
        "Project Description *",
        "This is a test description for automation",
        );
        await userPage.waitForTimeout(2000); // wait for validation to trigger
        const nextButton = userPage.getByRole("button", { name: "Next" });
        await expect(nextButton).toBeEnabled();
        await nextButton.click();
        await userPBPPage.selectMultiDropdown("Select competencies", [
        "Branding",
        "Campaigns",
        ]);
        await nextButton.click();
        await expect(userPBPPage.required_competencies_error).toBeVisible();
        const skill = userPage.locator("p.select-deactive-skill", { hasText: "CRM +", exact: true,});
        await skill.click();
        await nextButton.click();
        await nextButton.click();
        await expect(userPBPPage.maximum_project_budget_error).toBeVisible();
        await expect(userPBPPage.duration_required_error).toBeVisible();
        await userPBPPage.fillInputWithPlaceholder("Enter Budget in $", "10");
        await userPBPPage.fillInputWithPlaceholder("Enter number of days", "10");
        await nextButton.click();
        await userPBPPage.expected_deliverables_input.fill("This is test deliverable");
        await userPBPPage.selectDropdown(
        "Preferred Language of Work Submission *",
        "English",
        );
        await userPage.waitForTimeout(1000);
        await expect(nextButton).toBeEnabled();
        await nextButton.click();
        await expect(
        userPage.getByText("Post & Browse Projects (PBP) Summary"),
        ).toBeVisible();  
        const postJobButton = userPage.getByRole("button", { name: "Post Project" });
        postJobButton.click();
        await expect(
        userPage.getByText("Congratulations! Your post is now live."),
        ).toBeVisible();
    });

    test("TC_PBP_002: Search filters return newly created post in results", async ({
      userPage,
      userHomePage,
    }) => {
      await userHomePage.gotoPBPViaCard();
      // await userHomePage.searchOnPBPPage('Frontend Developer');
      const search_box = userPage.getByRole("textbox", { name: "Search PBP" });
      const search_button = userPage.getByRole("button", { name: "Search" });
      //   await userPage.waitForTimeout(2000);
      await search_box.fill(PBPPostName);
      await search_button.click();
      await userPage.waitForLoadState("networkidle"); // wait for search results to load
      const postNames = await userPage.locator(
        "//div[@class='filter-detail']//h5",
      );
      await postNames.first().waitFor();
      const count = await postNames.count();
      expect(count).toBe(1);
    });

    test("TC_PBP_003: Verify newly created post are displayed in My Orders under Posted Posts", async ({
    userHomePage,
    }) => {
        await userHomePage.gotoPBPViaCard();
        await userHomePage.navigateToMyOrdersViaPreview();
        await userHomePage.openPBPPostFromMyOrders();
        await expect(userHomePage.postNamesOnMyOrders.first()).toHaveText(PBPPostName);
    })

    test("TC_PBP_004: Verify Expert User not able to submit proposal", async ({
        expertPage,
        expertHomePage,
      }) => {
        await expertHomePage.gotoPBPViaCard();
        await expect(expertPage).toHaveURL(
          "https://urxprt.com/en/searchall?type=1",
        );
        const postCard = expertPage.locator(".filter-detail", {
          hasText: PBPPostName,
        });
        await expect(postCard).toBeVisible();
        await postCard.click();
        const [newPage] = await Promise.all([
          expertPage.context().waitForEvent("page"),
          postCard.click(),
        ]);
    
        await newPage.waitForLoadState();
        const newPageObject = new BasePage(newPage);
        const applyButton = newPage.getByRole("button", {
          name: "Apply Now",
          exact: true,
        });
        await applyButton.click();
        await newPage.waitForLoadState("networkidle");
        const submitProposal = newPage.locator("//button[@type='submit']");
        await submitProposal.click();
        const errorTextList = [
            "This is required",
            "Proposed price is required",
            "Project duration is required",
            "Select at least one milestone"
          ];
        const errorLocators = await newPage.locator(".error");
        const count = await errorLocators.count();
        for (let i = 0; i < count; i++) {
            const errorText = (await errorLocators.nth(i).textContent()).trim();
            expect(errorTextList).toContain(errorText);
        }
      });

    test("TC_PBP_005: Verify Expert User is able to submit proposal", async ({
    expertPage,
    expertHomePage,
    }) => {
    await expertHomePage.gotoPBPViaCard();
    await expect(expertPage).toHaveURL(
        "https://urxprt.com/en/searchall?type=1",
    );
    const postCard = expertPage.locator(".filter-detail", {
        hasText: PBPPostName,
    });
    await expect(postCard).toBeVisible();
    await postCard.click();
    const [newPage] = await Promise.all([
        expertPage.context().waitForEvent("page"),
        postCard.click(),
    ]);

    await newPage.waitForLoadState();
    const newPageObject = new BasePage(newPage);
    const applyButton = newPage.getByRole("button", {
        name: "Apply Now",
        exact: true,
    });
    await applyButton.click();
    await newPage.waitForLoadState("networkidle");
    await newPageObject.fillInputWithPlaceholder(
        "Enter your message",
        "This is a test cover letter for automation",
    );
    await newPageObject.fillInputWithPlaceholder(
        "Enter proposed price",
        "100",
    );
    await newPageObject.fillInputWithPlaceholder(
        "Enter duration",
        "10",
    );
    await newPage.getByText('Add/Update').click();
    await expect(newPage.getByRole('heading', { name: 'Add / Update Milestones' })).toBeVisible();
    await newPage.getByRole('textbox', { name: 'Enter milestone title' }).fill('Test Milestone');
    await newPageObject.clickFromDropdown("Duration type","Weeks");
    await newPage.getByRole('textbox', { name: 'Duration', exact: true }).fill('10');
    await newPage.getByRole('textbox', { name: 'Price', exact: true }).fill('10');
    await newPageObject.clickFromDropdown("Penalty in %","10%");
    await newPage.locator("//button[contains(text(),'Save')]").click();
    const submitProposal = newPage.locator("//button[contains(text(),'Submit Proposal')]");
    await submitProposal.click();
    const errorText = "Total milestone duration cannot exceed total project duration.";
    const errorLocator = newPage.locator(".error");
    await expect(errorLocator).toHaveText(errorText);
    await newPageObject.fillInputWithPlaceholder(
        "Enter duration",
        "100",
    );
    await submitProposal.click();
    await expect(
      newPage.getByText(
        "Congratulations! Your Proposal has been submitted successfully.",
      ),
    ).toBeVisible();
      });

    test("TC_PBP_006: Verify applied post appears in 'Manage Work' page for 'Expert' user", async ({
        expertPage,
        expertHomePage,
      }) => {
        await expertHomePage.gotoDashboardPage();
        await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
        await expertPage.waitForLoadState("networkidle");
        const manageWorkTab = expertPage.getByText('Post & Browse Projects (PBP)', { exact: true });
        await manageWorkTab.click();
        const appliedPost = expertPage.locator(
          ".post-back",
          {
            hasText: PBPPostName,
          },
        );
        await expect(appliedPost).toBeVisible();
      });

    test("TC_PBP_007: Verify applied post appears in 'My Orders' page for 'User' after expert applies", async ({
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
    
        const PBPTab = orderTabs.locator("a", {
          hasText: "Post & Browse Projects (PBP)",
          exact: false,
        });
        await PBPTab.click();
        const tabContent = userPage.locator(".tab-content");
        const PostedPBP = tabContent.locator("h4", {
          hasText: "Posted Post & Browse Projects (PBP)",
        });
        await expect(PostedPBP).toBeVisible();
        const orderCard = userPage.locator("h3", {
          hasText: PBPPostName,
        });
        await expect(orderCard).toBeVisible();
        await userPage.locator("//h3[contains(text(),'" + PBPPostName + "')]/parent::div/following-sibling::button").click();
        const postNavTabs = userPage.locator(".nav-tabs");
        const proposalsTab = postNavTabs.locator("a", {
          hasText: "All Proposals",
          exact: false,
        });
        await proposalsTab.click();
        const shivakumarCard = userPage.locator(".all-proposal", {
          has: userPage.locator("h5", { hasText: "Shivakumar GP" }),
        });
        await userPage.waitForTimeout(2000);
        await shivakumarCard.getByRole("button", { name: "Send Offer" }).click();
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
          hasText: "Accept",
        });
        await acceptOfferButton.click();
        await userPage.waitForTimeout(2000);
      });

    test("TC_PBP_008: Making payment for sent offer", async ({ 
        userPage 
    }) => {
        await userPage.goto(`/en/dashboard/myorders`, { waitUntil: "networkidle" });
        const orderTabs = userPage
          .locator("#MyOrderPostedorders")
          .locator(".order-tabs");
    
        const PBPTab = orderTabs.locator("a", {
          hasText: "Post & Browse Projects (PBP)",
          exact: false,
        });
        await PBPTab.click();
        const tabContent = userPage.locator(".tab-content");
        const PostedPBP = tabContent.locator("h4", {
          hasText: "Posted Post & Browse Projects (PBP)",
        });
        await expect(PostedPBP).toBeVisible();
        const orderCard = userPage.locator("h3", {
          hasText: PBPPostName,
        });
        await expect(orderCard).toBeVisible();
        await userPage.locator("//h3[contains(text(),'" + PBPPostName + "')]/parent::div/following-sibling::button").click();
        const postNavTabs = userPage.locator(".nav-tabs");
        const proposalsTab = postNavTabs.locator("a", {
          hasText: "All Proposals",
          exact: false,
        });
        await proposalsTab.click();
        const shivakumarCard = userPage.locator(".all-proposal", {
          has: userPage.locator("h5", { hasText: "Shivakumar GP" }),
        });
        const PaymentButton = shivakumarCard.locator("button", {
          hasText: "Pay",
          exact: true,
        });
        await expect(PaymentButton).toBeVisible();
        await PaymentButton.click();
        const makePayment = userPage.locator("button", { hasText: "Make Payment" });
        await expect(makePayment).toBeVisible();
        await makePayment.click();
        const saveAndMakePayment = userPage.locator("button", {
          hasText: "Save and make payment",
        });
        await saveAndMakePayment.click();
        await userPage.waitForTimeout(3000);
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
        await userPage.waitForTimeout(2000);
        await expect(
          userPage.getByText("PBP Milestone Payment Completed").first(),
        ).toBeVisible();
      });

    test("TC_PBP_009: Verify whether expert gets notification about offer and expert can accept offer from manage work page", async ({
        expertPage,
        expertHomePage,
      }) => {
        await expertHomePage.gotoDashboardPage();
        await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
        await expertPage.waitForLoadState("networkidle");
        const manageWorkTab = expertPage.getByText('Post & Browse Projects (PBP)', { exact: true });
        await manageWorkTab.click();
        const appliedPost = await expertPage.locator(
          ".post-back",
          {
            hasText: PBPPostName,
          },
        );
        await expect(appliedPost).toBeVisible();
        await expertPage.locator("//h3[contains(text(),'" + PBPPostName + "')]/parent::div/following-sibling::button").click();
        const postNavTabs = expertPage.locator(".nav-tabs");
        const offersTab = postNavTabs.locator("a", {
          hasText: "Offers",
          exact: true,
        });
        await offersTab.click();
        await expertPage.getByRole("button", { name: "Accept offer" }).click();
        await expertPage.waitForTimeout(1000);
        await expertPage.locator("label[for='agree']").click();
        const scrollToBottomBtn = expertPage
          .locator(".popup-contract-container")
          .locator("button", {
            name: "Scroll to Bottom",
            exact: true,
          });
        await expertPage.waitForTimeout(2000);
        await scrollToBottomBtn.click();
        await expertPage
          .locator(".popup-contract-container")
          .locator("input[id='agree']")
          .click();
        await expertPage.waitForLoadState("networkidle");
        await expertPage.waitForTimeout(2000);
        const acceptOfferButton = expertPage.locator("button", {
          hasText: "Accept & Start project",
        });
        await acceptOfferButton.click();
        await expertPage.waitForTimeout(5000);
        await expect(
          expertPage.getByText("The Offer Has Been Accepted"),
        ).toBeVisible();
      });

    test("TC_PBP_010: Verify applied job appears at 'Active job' tabs", async ({
        expertHomePage,
        expertPage,
      }) => {
        await expertHomePage.gotoDashboardPage();
        await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
        await expertPage.waitForLoadState("networkidle"); 
        const manageWorkTab = expertPage.getByText('Post & Browse Projects (PBP)', { exact: true });
        await manageWorkTab.click();
        const activePost = expertPage.locator("a:has-text('Active projects')");
        await activePost.click();
        await expect(activePost).toBeVisible();
        await expertPage.waitForLoadState("networkidle");
        await expertPage.waitForTimeout(2000);
        const postCard = expertPage.locator(".tab-pane.active .post-back").filter({
          hasText: PBPPostName,
        });
        await expect(postCard).toBeVisible();
      });

    test("TC_PBP_011: Verify without submitting the work, User is able to review In Progress work and View Sumbission is not available", async ({
        userPage
      }) => {
        await userPage.goto(`/en/dashboard`, { waitUntil: "networkidle" });
        const manageOrderTab = userPage.locator("a", {
          hasText: "My Orders",
        });
        await manageOrderTab.click();
        const orderTabs = userPage
          .locator("#MyOrderPostedorders")
          .locator(".order-tabs");
    
        const PBPTab = orderTabs.locator("a", {
          hasText: "Post & Browse Projects (PBP)",
          exact: false,
        });
        await PBPTab.click();
        const tabContent = userPage.locator(".tab-content");
        const PostedPBP = tabContent.locator("h4", {
          hasText: "Active Post & Browse Projects (PBP)",
        });
        await expect(PostedPBP).toBeVisible();
        const orderCard = userPage.locator("h3", {
          hasText: PBPPostName,
        });
        await expect(orderCard).toBeVisible();
        await userPage.locator("//h3[contains(text(),'" + PBPPostName + "')]/parent::div/following-sibling::button").click();
        await userPage.locator("//button[contains(text(),'View milestone')]").click();
        const inProgressText = userPage.locator(".progress-sec");
        const viewSubmissionButton = userPage.locator(".work-submit");
        await expect(inProgressText).toBeVisible();
        await expect(viewSubmissionButton).not.toBeVisible();
    });

    test("TC_PBP_012: Verify Expert is able to submit work for payment", async ({
        expertHomePage,
        expertPage,
      }) => {
        await expertHomePage.gotoDashboardPage();
        await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
        await expertPage.waitForLoadState("networkidle");
        const manageWorkTab = expertPage.getByText('Post & Browse Projects (PBP)', { exact: true });
        await manageWorkTab.click();
        const activePost = expertPage.locator("a:has-text('Active projects')");
        await activePost.click();
        await expect(activePost).toBeVisible();
        await expertPage.waitForLoadState("networkidle");
        await expertPage.waitForTimeout(2000);
        const postCard = expertPage.locator(".tab-pane.active .post-back").filter({
          hasText: PBPPostName,
        });
        await expect(postCard).toBeVisible();
        await expertPage.locator("//h3[contains(text(),'" + PBPPostName + "')]/parent::div/following-sibling::button").click();
        await expertPage.locator("//div[@class='tab-pane active']//button[contains(text(),'Submit work for payment')]").click();
        await expect(expertPage.locator("//div[@class='modal-content']//p[contains(text(),'Submit work for payment')]")).toBeVisible();
        await expertHomePage.fillInputWithPlaceholder("Enter description here", "This is a test submission for automation");
        await expertPage.locator('input[type="file"]').setInputFiles('testData/sampleImg.jpg');
        await expect(expertPage.locator("//img[@alt='Delete']")).toBeVisible();
        const submitWorkButton = expertPage.locator("//button[contains(text(),'Submit Work')]");
        await submitWorkButton.click();
        await expertPage.waitForTimeout(2000);
        const successMessage = await expertPage.locator(".custom-popup.alert.alert-success").textContent();
        await expect(successMessage).toContain("Work submitted for payment successfully");
      });

    test("TC_PBP_013: Verify Expert is able to view its submitted work", async ({
        expertHomePage,
        expertPage,
      }) => {
        await expertHomePage.gotoDashboardPage();
        await expect(expertPage).toHaveURL("https://urxprt.com/en/dashboard");
        await expertPage.waitForLoadState("networkidle");
        const manageWorkTab = expertPage.getByText('Post & Browse Projects (PBP)', { exact: true });
        await manageWorkTab.click();
        const activePost = expertPage.locator("a:has-text('Active projects')");
        await activePost.click();
        await expect(activePost).toBeVisible();
        await expertPage.waitForLoadState("networkidle");
        await expertPage.waitForTimeout(2000);
        const postCard = expertPage.locator(".tab-pane.active .post-back").filter({
          hasText: PBPPostName,
        });
        await expect(postCard).toBeVisible();
        await expertPage.locator("//h3[contains(text(),'" + PBPPostName + "')]/parent::div/following-sibling::button").click();
        await expertPage.locator("//div[@class='post-back']//button[contains(text(),'View Submission')]").click();
        const submissionTab = await expertPage.locator("#Overview .modal-content .submission-sec");
        await expect(submissionTab).toBeVisible();
        const closeSubmissionTabButton = await expertPage.locator("#Overview .modal-content .close-button img");
        await closeSubmissionTabButton.click();
        await expect(submissionTab).toBeHidden();
      });
      
    test("TC_PBP_014: Verify user is able to review work, view submission, and Approve Submission", async ({ 
        userPage 
    }) => {
        await userPage.goto(`/en/dashboard/myorders`, { waitUntil: "networkidle" });
        const orderTabs = userPage
          .locator("#MyOrderPostedorders")
          .locator(".order-tabs");
    
        const PBPTab = orderTabs.locator("a", {
          hasText: "Post & Browse Projects (PBP)",
          exact: false,
        });
        await PBPTab.click();
        const tabContent = userPage.locator(".tab-content");
        const PostedPBP = tabContent.locator("h4", {
          hasText: "Active Post & Browse Projects (PBP)",
        });
        await expect(PostedPBP).toBeVisible();
        const orderCard = userPage.locator("h3", {
          hasText: PBPPostName,
        });
        await expect(orderCard).toBeVisible();
        await userPage.locator("//h3[contains(text(),'" + PBPPostName + "')]/parent::div/following-sibling::button").click();
        await userPage.locator("//button[contains(text(),'View milestone')]").click();
        await userPage.locator(".work-submit").click();

        const submissionTab = await userPage.locator("#Milestones .modal-content .submission-sec");
        await expect(submissionTab).toBeVisible();
        const approveButton = userPage.locator("//button[contains(text(),'Approve Submission')]");
        await approveButton.click();
        const completeStatus = await userPage.locator("//a/span[contains(text(),'Completed')]");
        await expect(completeStatus).toBeVisible();
        const postNavTabs = userPage.locator(".nav-tabs");
        const milestonesTab = postNavTabs.locator("a", {
          hasText: "Milestones",
          exact: false,
        });
        await milestonesTab.click();
        const projectCompleteStatus = userPage.locator("//h3[contains(text(),'Project Completed')]");
        await expect(projectCompleteStatus).toBeVisible();
      })
});
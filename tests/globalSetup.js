import { chromium } from "@playwright/test";
import credentials from "../testData/credentials.json";
import fs from "fs";

const baseUrl = "https://urxprt.com/en";

async function globalSetup() {
  // Create .auth folder if it doesn't exist
  if (!fs.existsSync(".auth")) fs.mkdirSync(".auth");

  const browser = await chromium.launch();

  for (const user of credentials) {
    const authFile = `.auth/${user.name}.json`;
    console.log(`Logging in as: ${user.name}`);

    // ✅ Skip login if auth file already exists
    if (fs.existsSync(authFile)) {
      console.log(`⏭ Skipping ${user.name} — auth file already exists`);
      continue;
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(baseUrl);
    await page
      .getByText(
        "Connect With Top Experts or Find Exciting Post & Browse Projects (PBP)Upgrade",
      )
      .click();
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.getByRole("textbox", { name: "Email *" }).fill(user.email); // ✓ user.email
    await page.getByRole("textbox", { name: "Password *" }).fill(user.password); // ✓ user.password
    await page.getByRole("button", { name: "Login account" }).click();

    await page.waitForURL("**/account", { timeout: 30000 });
    await page.waitForTimeout(5000);

    await context.storageState({ path: authFile });
    console.log(`✓ Saved .auth/${user.name}.json`);

    await context.close();
  }

  await browser.close();
}

export default globalSetup;

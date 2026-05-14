import { expect } from "@playwright/test";

export async function selectDropdown(page, label, option) {
  await page
    .getByText(label)
    .locator('xpath=following::input[@role="combobox"][1]')
    .click();

  await page.getByRole("option", { name: option, exact: true }).click();
}

export async function selectRadioOption(page, option) {
  // where is label used?
  const radioOption = page.getByRole("radio", { name: option });
  await radioOption.check();
  await expect(radioOption).toBeChecked();
}

export async function fillInput(page, label, value) {
  const inputField = page.getByText(label).locator("xpath=following::input[1]");
  await inputField.fill(value);
}
export async function fillInputWithPlaceholder(page, placeholder, value) {
  const inputField = page.getByPlaceholder(placeholder);
  await inputField.fill(value);
}

export async function fillRichTextEditor(page, label, text) {
  const editor = page
    .getByText(label)
    .locator('xpath=following::div[contains(@class,"ql-editor")][1]');

  await editor.click();

  await page.keyboard.press("Control+A");
  await page.keyboard.press("Backspace");

  await page.keyboard.type(text);

  await expect(editor).toContainText(text);
}

export async function selectMultiDropdown(page, label, options) {
  for (const option of options) {
    // Click the dropdown container to open it (same pattern as selectDropdown)
    await page
      .getByText(label, { exact: false })
      .locator('xpath=following::input[@role="combobox"][1]')
      .click();

    // Type to filter
    await page
      .getByText(label, { exact: false })
      .locator('xpath=following::input[@role="combobox"][1]')
      .fill(option);

    // Select the matching option
    await page.getByRole("option", { name: option, exact: true }).click();

    await page.waitForTimeout(300);
  }
}

export async function uploadFile(page, label, filePath) {
  // Get the file input and set files directly
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  // Wait for upload to complete
  await page.waitForLoadState("networkidle");
}

export async function navigateViaDropdown(page, menuLabel, itemText) {
  const menuItem = page.locator("ul.menu > li").filter({
    has: page.locator(`a.nav-item:has-text("${menuLabel}")`),
  });

  await menuItem.locator("a.nav-item").hover();
  await menuItem.locator(".nav-drop a", { hasText: itemText }).click();
}

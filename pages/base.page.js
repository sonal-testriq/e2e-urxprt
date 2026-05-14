import { expect } from "@playwright/test";

export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path) {
    await this.page.goto(process.env.BASE_URL + path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  async uploadFile(label, filePath) {
    // Get the file input and set files directly
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    // Wait for upload to complete
    await this.page.waitForLoadState("networkidle");
  }

  async selectDropdown(label, option) {
    await this.page
      .getByText(label)
      .locator('xpath=following::input[@role="combobox"][1]')
      .click();

    await this.page.getByRole("option", { name: option, exact: true }).click();
  }

  async selectRadioOption(option) {
    // where is label used?
    const radioOption = this.page.getByRole("radio", { name: option });
    await radioOption.check();
    await expect(radioOption).toBeChecked();
  }

  async fillInput(label, value) {
    const inputField = this.page
      .getByText(label)
      .locator("xpath=following::input[1]");
    await inputField.fill(value);
  }

  async fillInputWithPlaceholder(placeholder, value) {
    const inputField = this.page.getByPlaceholder(placeholder);
    await inputField.fill(value);
  }

  async fillRichTextEditor(label, text) {
    const editor = this.page
      .getByText(label)
      .locator('xpath=following::div[contains(@class,"ql-editor")][1]');

    await editor.click();

    await this.page.keyboard.press("Control+A");
    await this.page.keyboard.press("Backspace");

    await this.page.keyboard.type(text);

    await expect(editor).toContainText(text);
  }

  async selectMultiDropdown(label, options) {
    for (const option of options) {
      // Click the dropdown container to open it (same pattern as selectDropdown)
      await this.page
        .getByText(label, { exact: false })
        .locator('xpath=following::input[@role="combobox"][1]')
        .click();

      // Type to filter
      await this.page
        .getByText(label, { exact: false })
        .locator('xpath=following::input[@role="combobox"][1]')
        .fill(option);

      // Select the matching option
      await this.page
        .getByRole("option", { name: option, exact: true })
        .click();

      await this.page.waitForTimeout(300);
    }
  }

  async navigateViaDropdown(menuLabel, itemText) {
    const menuItem = this.page.locator("ul.menu > li").filter({
      has: this.page.locator(`a.nav-item:has-text("${menuLabel}")`),
    });

    await menuItem.locator("a.nav-item").hover();
    await menuItem.locator(".nav-drop a", { hasText: itemText }).click();
  }
}

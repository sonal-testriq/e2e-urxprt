import { expect } from "@playwright/test";
import { BasePage } from "./base_page";

export default class MASPage extends BasePage {
  constructor(page) {
    super(page);
    this.companyNames = page.locator("//div[@class='packaged-img']//h3");
    this.search_box = page.getByRole("textbox", { name: "Search MAS" });
    this.search_button = page.getByRole("button", { name: "Search" });
    this.addCompany_button = page.locator(
      "//button[contains(text(),'Add Company')]",
    );
  }
  async addACompany() {
    await this.addCompany_button.click();
  }
}

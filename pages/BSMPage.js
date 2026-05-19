import { expect } from "@playwright/test";
import { BasePage } from "./base_page";

export default class BSMPage extends BasePage {
  constructor(page) {
    super(page);
    this.productNames = page.locator("//div[@class='packaged-img']//h5");
    this.search_box = page.getByRole("textbox", { name: "Search BSM" });
    this.search_button = page.getByRole("button", { name: "Search" });
    this.addAProduct_button = page.locator(
      "//button[contains(text(),'Add a Product')]",
    );
    
  }
  async addAProduct() {
    await this.addAProduct_button.click();
  }
}

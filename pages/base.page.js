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
}

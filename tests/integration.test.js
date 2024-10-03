const puppeteer = require("puppeteer");

describe("Integration Test for HTML Files", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test("should test index.html for function execution", async () => {
    const baseUrl = process.env.BASE_URL || "http://127.0.0.1:8080"; // ใช้ BASE_URL จาก environment
    console.log(`Navigating to ${baseUrl}/index.html`);

    await page.goto(`${baseUrl}/index.html`);

    const title = await page.title();
    expect(title).toBe("Expected Page Title");
  });
});

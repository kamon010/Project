const puppeteer = require("puppeteer");
const path = require("path");

describe("Integration Test for HTML Files", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true, // Set to false if you want to see the browser while running the test
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("should test index.html for function execution", async () => {
    const filePath = `file:${path.resolve(__dirname, "../docs/index.html")}`;
    await page.goto(filePath);

    // สมมุติว่ามีฟังก์ชันชื่อ testFunction ใน HTML
    await page.evaluate(() => testFunction());

    // ตรวจสอบผลลัพธ์ในหน้า
    const result = await page.evaluate(() =>
      document.body.textContent.includes("Test function is working!")
    );
    expect(result).toBe(true);
  });
});

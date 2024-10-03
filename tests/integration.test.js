const puppeteer = require("puppeteer");

describe("Integration Test for HTML Files", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test("should test index.html for function execution", async () => {
    await page.goto("http://localhost:8080/index.html");
    // เพิ่มคำสั่งทดสอบอื่น ๆ ที่นี่ เช่นการคลิกหรือการเช็คข้อมูลบนหน้าเว็บ
  });
});

const puppeteer = require("puppeteer");

describe("Integration Test for HTML Files", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // เพิ่มออปชั่นเพื่อลดปัญหาจาก environment
      headless: true, // รันในโหมด headless เพื่อความเร็วในการทดสอบ
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test("should test index.html for function execution", async () => {
    const baseUrl = process.env.BASE_URL || "http://127.0.0.1:8080"; // กำหนดค่าเริ่มต้นเป็น localhost ถ้าไม่มี BASE_URL
    await page.goto(`${baseUrl}/index.html`);

    // เขียนการทดสอบตามที่ต้องการ
    const title = await page.title();
    expect(title).toBe("Expected Page Title");
  });
});

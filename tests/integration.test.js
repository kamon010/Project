const puppeteer = require("puppeteer");

describe("Integration Test for HTML Files", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();

    // Mock WebSocket เพื่อหลีกเลี่ยงปัญหา WebSocket ใน Puppeteer
    await page.evaluateOnNewDocument(() => {
      window.WebSocket = function () {
        return {
          send: () => {},
          close: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
        };
      };
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test("should test index.html for function execution", async () => {
    await page.goto("http://localhost:8080/index.html");
    // ทดสอบการทำงานในหน้า index.html
  });
});

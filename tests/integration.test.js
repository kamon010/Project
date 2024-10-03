const puppeteer = require("puppeteer");

describe("Integration Test for HTML Files", () => {
  let browser;
  let page;

  beforeAll(async () => {
    // เริ่มการทำงานของ Puppeteer โดยเพิ่ม argument เพื่อรองรับ environment ที่มีข้อจำกัด
    browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security", // ปิดการรักษาความปลอดภัยเพื่อแก้ไขข้อจำกัดบางอย่างใน environment CI
        "--disable-features=IsolateOrigins,site-per-process", // ปิดการใช้งานบางฟีเจอร์ที่อาจมีผลกับการทำงาน
      ],
      headless: true, // ทำให้รันในโหมด headless เพื่อให้เร็วขึ้น
    });

    page = await browser.newPage();

    // Mock WebSocket ให้ Puppeteer สามารถทดสอบได้โดยไม่มีข้อผิดพลาด
    await page.evaluate(() => {
      window.WebSocket = function () {
        return {
          close: () => {}, // Mock ฟังก์ชัน close
          send: () => {}, // Mock ฟังก์ชัน send
          readyState: 1, // Mock ให้ WebSocket อยู่ในสถานะ open
          addEventListener: () => {}, // Mock ฟังก์ชัน addEventListener
          removeEventListener: () => {}, // Mock ฟังก์ชัน removeEventListener
        };
      };
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close(); // ปิด browser หลังจากการทดสอบเสร็จสิ้น
    }
  });

  test("should test index.html for function execution", async () => {
    const baseUrl = process.env.BASE_URL || "http://127.0.0.1:8080"; // ใช้ BASE_URL จาก environment หรือ localhost ถ้าไม่มี
    await page.goto(`${baseUrl}/index.html`); // ไปที่หน้า index.html เพื่อทำการทดสอบ

    // ทดสอบว่า title ของหน้าเว็บเป็นสิ่งที่คาดหวังหรือไม่
    const title = await page.title();
    expect(title).toBe("Expected Page Title");
  });
});

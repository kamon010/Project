const puppeteer = require("puppeteer");

describe("Integration Test for HTML Files", () => {
  let browser;
  let page;

  // ตั้งค่าเบราว์เซอร์ก่อนการทดสอบทั้งหมด
  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // เพิ่มออปชั่นเพื่อลดปัญหาจาก environment
      headless: true, // รันในโหมด headless เพื่อความเร็วในการทดสอบ
    });
    page = await browser.newPage();
  });

  // ปิดเบราว์เซอร์หลังจากการทดสอบทั้งหมดเสร็จสิ้น
  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test("should test index.html for function execution", async () => {
    const baseUrl = process.env.BASE_URL || "http://127.0.0.1:8080"; // กำหนดค่าเริ่มต้นเป็น localhost ถ้าไม่มี BASE_URL
    console.log(`Navigating to ${baseUrl}/index.html`); // ตรวจสอบ URL ที่ Puppeteer ใช้

    // ไปที่หน้า index.html ที่กำหนด
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "load", timeout: 0 }); // รอจนกว่าจะโหลดเสร็จ

    // ตรวจสอบ title ของหน้า
    const title = await page.title();
    console.log(`Page title: ${title}`); // แสดง title ของหน้าใน console เพื่อการตรวจสอบ

    // คาดหวังว่า title จะเป็นค่าที่กำหนด
    expect(title).toBe("Expected Page Title");
  });
});

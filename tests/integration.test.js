const puppeteer = require("puppeteer");

let browser;

beforeAll(async () => {
  // เปิด browser ก่อนเริ่มการทดสอบทั้งหมด
  browser = await puppeteer.launch();
});

afterAll(async () => {
  // ปิด browser หลังจากการทดสอบทั้งหมดเสร็จสิ้น
  if (browser) {
    await browser.close();
  }
});

describe("Integration Test for HTML Files", () => {
  test("should test index.html for function execution", async () => {
    const page = await browser.newPage(); // เปิดหน้าต่างใหม่ใน browser
    await page.goto("http://127.0.0.1:5500/docs/index.html"); // ไปยังหน้า index.html

    // สมมุติว่ามีฟังก์ชันใน HTML ที่ต้องทดสอบ เช่น document.getElementById หรือคลิกปุ่ม
    const button = await page.$("button"); // ตรวจสอบว่ามีปุ่มอยู่ในหน้า
    expect(button).toBeDefined(); // ตรวจสอบว่าปุ่มถูกสร้างขึ้นใน DOM

    // ทดสอบการคลิกปุ่ม และทดสอบการทำงานหลังการคลิก
    await button.click();
    const result = await page.evaluate(
      () => document.getElementById("result").innerText
    );
    expect(result).toBe("Expected Result"); // เปรียบเทียบค่าที่ได้กับค่าที่คาดหวัง

    await page.close(); // ปิดหน้าต่างหลังจากทดสอบเสร็จ
  });
});

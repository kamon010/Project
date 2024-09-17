// tests/integration/allFiles.test.js
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { fileURLToPath } from 'url';

// สร้าง __dirname สำหรับ ES Module
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// โฟลเดอร์ที่ต้องการทดสอบ
const docsDir = path.resolve(__dirname, '../../docs');

// ค้นหาไฟล์ทั้งหมดในโฟลเดอร์ docs
const files = fs.readdirSync(docsDir).filter(file => file.endsWith('.html'));

// ทดสอบแต่ละไฟล์ในโฟลเดอร์ docs
describe('Security Tests for HTML files in docs folder', () => {
    files.forEach(file => {
        it(`Testing file: ${file}`, () => {
            // โหลดไฟล์ HTML
            const filePath = path.join(docsDir, file);
            const htmlContent = fs.readFileSync(filePath, 'utf8');

            // สร้าง JSDOM จากไฟล์ HTML
            const dom = new JSDOM(htmlContent);
            const document = dom.window.document;

            // ตรวจสอบว่า meta tag สำหรับ CSP มีอยู่หรือไม่
            const cspMetaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');

            if (!cspMetaTag) {
                // ถ้าไม่มี CSP ให้แสดงข้อความแจ้งข้อผิดพลาดและวิธีแก้ไข
                console.warn(`พบข้อผิดพลาดในไฟล์: ${file}`);
                console.warn(`ข้อผิดพลาด: ไฟล์นี้ไม่มี Content Security Policy (CSP) meta tag`);
                console.warn(`วิธีแก้ไข: กรุณาเพิ่ม meta tag สำหรับ Content Security Policy (CSP) ในส่วน <head> ของไฟล์ HTML ตัวอย่างเช่น:`);
                console.warn(`<meta http-equiv="Content-Security-Policy" content="default-src 'self';">`);
            }

            // ทดสอบว่า meta tag สำหรับ CSP ไม่เป็น null
            expect(cspMetaTag, `Missing CSP in ${file}`).not.to.be.null;
        });
    });
});
// tests/unit/htmlFiles.test.js
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { expect } from 'chai'; // ใช้ expect จาก chai
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
describe('Unit Tests for HTML files in docs folder', () => {
    files.forEach(file => {
        it(`Testing file: ${file}`, () => {
            // โหลดไฟล์ HTML
            const filePath = path.join(docsDir, file);
            const htmlContent = fs.readFileSync(filePath, 'utf8');

            // สร้าง JSDOM จากไฟล์ HTML
            const dom = new JSDOM(htmlContent);
            const document = dom.window.document;

            // ทดสอบว่าไฟล์มี Content Security Policy (CSP)
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (!cspMeta) {
                console.warn(`Missing CSP in ${file}`);
            }
            expect(cspMeta, `Missing CSP in ${file}`).not.to.be.null;

            // ทดสอบว่าไฟล์มี title
            const title = document.querySelector('title');
            if (!title) {
                console.warn(`Missing <title> tag in ${file}`);
            }
            expect(title, `Missing <title> tag in ${file}`).not.to.be.null;

            // ทดสอบว่าไฟล์ไม่มี inline JavaScript เพื่อป้องกันช่องโหว่
            const scripts = document.querySelectorAll('script');
            scripts.forEach(script => {
                if (!script.src) {
                    console.warn(`Inline script found in ${file}`);
                }
                expect(script.src, `Inline script found in ${file}`).not.to.be.empty;
            });
        });
    });
});
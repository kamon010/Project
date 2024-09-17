// tests/integration/security.test.js
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

            // ทดสอบว่าไฟล์ HTML มี Content Security Policy หรือไม่
            const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            expect(metaCSP, `Missing CSP in ${file}`).not.to.be.null;

            // ทดสอบว่าไม่มี inline script ที่อาจทำให้เกิด XSS
            const scripts = Array.from(document.querySelectorAll('script'));
            scripts.forEach(script => {
                if (!script.src) {
                    expect.fail(`Inline script found in ${file}`);
                }
            });

            // ทดสอบว่าไม่มีการเปิดเผยข้อมูลสำคัญในคอมเมนต์
            const comments = htmlContent.match(/<!--[\s\S]*?-->/g);
            if (comments) {
                comments.forEach(comment => {
                    expect(comment.includes('password') || comment.includes('secret'), `Sensitive information found in comments in ${file}`).to.be.false;
                });
            }
        });
    });
});
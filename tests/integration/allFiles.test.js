// tests/integration/allFiles.test.js
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
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
describe('Test HTML files in docs folder', () => {
    files.forEach(file => {
        test(`Testing file: ${file}`, () => {
            // โหลดไฟล์ HTML
            const filePath = path.join(docsDir, file);
            const htmlContent = fs.readFileSync(filePath, 'utf8');

            // สร้าง JSDOM จากไฟล์ HTML
            const dom = new JSDOM(htmlContent);
            const document = dom.window.document;

            // ทดสอบว่ามี element <button> อยู่ในไฟล์หรือไม่
            const button = document.querySelector('button');
            expect(button).not.toBeNull();
        });
    });
});
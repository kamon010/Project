// tests/allFiles.test.js
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

// กำหนดโฟลเดอร์ที่ต้องการทดสอบ
const docsDir = path.resolve(__dirname, '../docs');

// อ่านไฟล์ทั้งหมดในโฟลเดอร์ docs
const files = fs.readdirSync(docsDir).filter(file => file.endsWith('.html'));

// รันการทดสอบกับทุกไฟล์ในโฟลเดอร์ docs
describe('Test all HTML files in docs folder', () => {
    files.forEach(file => {
        test(`Test file: ${file}`, () => {
            const filePath = path.join(docsDir, file);
            const html = fs.readFileSync(filePath, 'utf8');

            // สร้าง JSDOM จากไฟล์ HTML
            const dom = new JSDOM(html);
            const document = dom.window.document;

            // ตัวอย่างการทดสอบ: ตรวจสอบว่ามีองค์ประกอบ button อยู่ในหน้าเว็บหรือไม่
            const button = document.querySelector('button');
            expect(button).not.toBeNull();

            // คุณสามารถเพิ่มการทดสอบอื่น ๆ ได้ที่นี่
        });
    });
});
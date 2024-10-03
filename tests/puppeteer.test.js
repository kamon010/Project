const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const directoryPath = path.join(__dirname, "../docs"); // ระบุเส้นทางไปยังโฟลเดอร์ docs ที่มีไฟล์ HTML

  // อ่านไฟล์ HTML ทั้งหมดในโฟลเดอร์ docs
  fs.readdir(directoryPath, async (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    // รันการทดสอบสำหรับแต่ละไฟล์ HTML
    for (const file of files) {
      if (path.extname(file) === ".html") {
        const filePath = `file://${path.join(directoryPath, file)}`;
        await page.goto(filePath);
        console.log(`Testing ${file}`);

        // ตัวอย่างการทดสอบการทำงานของฟังก์ชันในไฟล์
        const result = await page.evaluate(() => {
          if (typeof myFunction === "function") {
            return myFunction(); // เรียกใช้งานฟังก์ชัน
          }
          return "Function not found";
        });

        console.log(`Result for ${file}:`, result);
      }
    }

    await browser.close();
  });
})();

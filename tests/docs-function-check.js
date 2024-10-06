const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const escomplex = require("escomplex");

// ฟังก์ชันเพื่อโหลดไฟล์ทั้งหมดในโฟลเดอร์ docs
function getHtmlFilesInDocsFolder() {
  const docsFolder = path.resolve(__dirname, "../docs");
  return fs
    .readdirSync(docsFolder)
    .filter((file) => file.endsWith(".html"))
    .map((file) => path.join(docsFolder, file));
}

// ฟังก์ชันเพื่อดึงฟังก์ชันจากสคริปต์ในไฟล์ HTML
function extractFunctionsFromHtmlFile(filePath) {
  try {
    const html = fs.readFileSync(filePath, "utf8");
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // ดึงโค้ด JavaScript จากแท็ก <script> ภายใน HTML
    const scripts = Array.from(document.querySelectorAll("script"))
      .map((script) => script.textContent)
      .join("\n");

    // ใช้ escomplex เพื่อวิเคราะห์ความซับซ้อนของโค้ด JavaScript
    const analysis = escomplex.analyse(scripts);

    // ค้นหาฟังก์ชันและข้อมูลความซับซ้อน
    const functionDetails = analysis.functions.map((func) => {
      return {
        name: func.name,
        complexity: func.cyclomatic,
        lines: func.lines,
        isComplex: func.cyclomatic > 10, // กำหนดว่าถ้ามากกว่า 10 จะถือว่ามีความซับซ้อนสูง
      };
    });

    return functionDetails;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return []; // ส่งกลับเป็น array ว่างถ้ามีข้อผิดพลาด
  }
}

// ฟังก์ชันหลักเพื่อทำการตรวจสอบฟังก์ชันในไฟล์ HTML
function testFunctionsInHtmlFiles() {
  const htmlFiles = getHtmlFilesInDocsFolder();

  htmlFiles.forEach((filePath) => {
    const functions = extractFunctionsFromHtmlFile(filePath);

    console.log(`File: ${path.basename(filePath)}`);
    console.log(`Number of functions: ${functions.length}`);

    functions.forEach((func) => {
      const status = func.isComplex ? "❌ (Too complex)" : "✔️ (Good)";
      console.log(`Function: ${func.name}`);
      console.log(
        `Lines: ${func.lines}, Cyclomatic Complexity: ${func.complexity}`
      );
      console.log(`Status: ${status}`);
      console.log("----------------------------");
    });

    console.log("----------------------------");
  });
}

testFunctionsInHtmlFiles();

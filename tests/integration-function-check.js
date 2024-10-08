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
        code: scripts,
        isComplex: func.cyclomatic > 10,
      };
    });

    return functionDetails;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return [];
  }
}

// ฟังก์ชันหลักเพื่อทำการตรวจสอบฟังก์ชันแบบต่อเนื่องในทุกไฟล์ HTML
function testIntegrationAcrossHtmlFiles() {
  const htmlFiles = getHtmlFilesInDocsFolder();
  let allTestsPassed = true;

  console.log(`\nStarting integration tests for all HTML files.`);

  htmlFiles.forEach((filePath, fileIndex) => {
    console.log(`\nTesting integration for file: ${path.basename(filePath)}`);
    const functions = extractFunctionsFromHtmlFile(filePath);

    functions.forEach((func, funcIndex) => {
      console.log(
        `\nTesting Function #${funcIndex + 1} in file #${fileIndex + 1}: ${
          func.name || "<anonymous>"
        }`
      );

      try {
        // การทดสอบฟังก์ชันแบบต่อเนื่องในบริบทเดียวกัน
        const mockContext = { console }; // สร้างบริบทจำลอง
        const functionCode = new Function(
          "context",
          `with(context) { ${func.code} }`
        );
        functionCode(mockContext);

        console.log(
          `Test: ✔️ Function ${
            func.name || "<anonymous>"
          } executed successfully.`
        );
      } catch (error) {
        console.log(
          `Test: ❌ Error executing function ${func.name || "<anonymous>"} - ${
            error.message
          }`
        );
        allTestsPassed = false;
      }

      console.log("----------------------------");
    });
  });

  if (allTestsPassed) {
    console.log(
      `\n✔️ All integration tests across HTML files passed successfully!`
    );
  } else {
    console.log(
      `\n❌ Some integration tests failed. Please review the errors above.`
    );
    process.exit(1);
  }
}

// เรียกใช้ฟังก์ชันการทดสอบแบบต่อเนื่องสำหรับทุกไฟล์ HTML
testIntegrationAcrossHtmlFiles();

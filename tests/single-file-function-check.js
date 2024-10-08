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
        code: scripts, // เพิ่มโค้ดฟังก์ชันเพื่อตรวจสอบการทำงาน
        isComplex: func.cyclomatic > 10,
      };
    });

    return functionDetails;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return []; // ส่งกลับเป็น array ว่างถ้ามีข้อผิดพลาด
  }
}

// ฟังก์ชันหลักเพื่อทำการตรวจสอบฟังก์ชันภายในไฟล์ HTML เดียวกัน
function testFunctionsInSingleHtmlFile(filePath) {
  const functions = extractFunctionsFromHtmlFile(filePath);
  let passedTests = 0;
  let failedTests = 0;

  console.log(`\nRunning tests for file: ${path.basename(filePath)}`);
  console.log(`Number of functions found: ${functions.length}`);

  functions.forEach((func, index) => {
    console.log(`\n----------------------------`);
    console.log(`Function #${index + 1}: ${func.name || "<anonymous>"}`);
    console.log(
      `Lines: ${func.lines}, Cyclomatic Complexity: ${func.complexity}`
    );

    // กำหนดค่าให้ตัวแปร status อย่างถูกต้อง
    const status = func.isComplex ? "❌ (Too complex)" : "✔️ (Good)";
    console.log(`Status: ${status}`);

    // ทดสอบการทำงานของฟังก์ชันแบบเบื้องต้นภายในไฟล์เดียว
    try {
      if (func.name) {
        // สร้างฟังก์ชันเพื่อทดสอบการทำงาน
        const functionCode = new Function(`return ${func.code}`);
        functionCode();

        console.log(`Test: ✔️ Function ${func.name} executed successfully.`);
        passedTests += 1;
      } else {
        console.log(`Test: ❌ Function ${func.name} is not callable.`);
        failedTests += 1;
      }
    } catch (error) {
      console.log(
        `Test: ❌ Error when executing function ${func.name} - ${error.message}`
      );
      failedTests += 1;
    }

    console.log(`----------------------------`);
  });

  // สรุปผลการทดสอบสำหรับไฟล์เดียว
  console.log(`\nTest Summary for ${path.basename(filePath)}:`);
  console.log(`Passed tests: ${passedTests}`);
  console.log(`Failed tests: ${failedTests}`);

  if (failedTests > 0) {
    console.log(`\n❌ Some tests failed in ${path.basename(filePath)}.`);
  } else {
    console.log(
      `\n✔️ All tests passed successfully in ${path.basename(filePath)}.`
    );
  }
}

// เรียกใช้ฟังก์ชันเพื่อทดสอบไฟล์ HTML แต่ละไฟล์
const htmlFiles = getHtmlFilesInDocsFolder();
htmlFiles.forEach(testFunctionsInSingleHtmlFile);

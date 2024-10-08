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

// ฟังก์ชันจำลองธรรมดา (Mock function)
const mockFirebaseClient = {
  initializeApp: () => {},
  firestore: () => ({
    collection: () => ({
      doc: () => ({
        get: async () => ({ data: () => ({}) }),
        set: async () => {},
      }),
    }),
  }),
  storage: () => ({
    ref: () => ({
      getDownloadURL: async () => "mock-url",
    }),
  }),
};

// ฟังก์ชันหลักเพื่อทำการตรวจสอบฟังก์ชันในไฟล์ HTML แบบเบื้องต้น
function testFunctionsInHtmlFiles() {
  const htmlFiles = getHtmlFilesInDocsFolder();
  let totalFunctions = 0;
  let passedTests = 0;
  let failedTests = 0;

  htmlFiles.forEach((filePath) => {
    const functions = extractFunctionsFromHtmlFile(filePath);
    totalFunctions += functions.length;

    console.log(`File: ${path.basename(filePath)}`);
    console.log(`Number of functions: ${functions.length}`);

    functions.forEach((func, index) => {
      console.log(`\n----------------------------`);
      console.log(`Function #${index + 1}: ${func.name || "<anonymous>"}`);
      console.log(
        `Lines: ${func.lines}, Cyclomatic Complexity: ${func.complexity}`
      );
      console.log(`Status: ${status}`);

      // ทดสอบการทำงานของฟังก์ชันแบบเบื้องต้น
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

    console.log("----------------------------");
  });

  // สรุปผลการทดสอบ
  console.log(`\nTest Summary:`);
  console.log(`Total functions tested: ${totalFunctions}`);
  console.log(`Passed tests: ${passedTests}`);
  console.log(`Failed tests: ${failedTests}`);

  if (failedTests > 0) {
    console.log(`\n❌ Some tests failed. Please review the errors above.`);
    process.exit(1); // ออกจากโปรแกรมด้วยรหัส 1 หากมีการทดสอบล้มเหลว
  } else {
    console.log(`\n✔️ All tests passed successfully!`);
    process.exit(0); // ออกจากโปรแกรมด้วยรหัส 0 หากการทดสอบทั้งหมดสำเร็จ
  }
}

testFunctionsInHtmlFiles();

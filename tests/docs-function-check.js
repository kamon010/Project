const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const escomplex = require("escomplex");

// นำเข้า Firebase Admin SDK
const admin = require("firebase-admin");

// กำหนดค่า Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // ใช้ค่า default credentials หรือกำหนดค่าใหม่ตามต้องการ
  storageBucket: "team-1849c.appspot.com",
});

const db = admin.firestore();
const storage = admin.storage();

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

// Mock Firebase Client SDK สำหรับการทดสอบ
const mockFirebaseClient = {
  initializeApp: jest.fn(),
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ data: () => ({}) }),
        set: jest.fn().mockResolvedValue(),
      })),
    })),
  })),
  storage: jest.fn(() => ({
    ref: jest.fn(() => ({
      getDownloadURL: jest.fn().mockResolvedValue("mock-url"),
    })),
  })),
};

// ใช้ mock Firebase Client เป็น context สำหรับการทดสอบ
const mockContext = { firebase: mockFirebaseClient };

// ฟังก์ชันหลักเพื่อทำการตรวจสอบฟังก์ชันในไฟล์ HTML
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

    functions.forEach((func) => {
      const status = func.isComplex ? "❌ (Too complex)" : "✔️ (Good)";
      console.log(`Function: ${func.name || "<anonymous>"}`);
      console.log(
        `Lines: ${func.lines}, Cyclomatic Complexity: ${func.complexity}`
      );
      console.log(`Status: ${status}`);

      // ทดสอบการทำงานของฟังก์ชัน
      try {
        if (func.name) {
          const functionCode = new Function(
            "context",
            `with(context) { ${func.code} }`
          );
          functionCode(mockContext);

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

      console.log("----------------------------");
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

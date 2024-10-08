const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const escomplex = require("escomplex");

const firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyC1qX4ttFX42SzVFbg6LqjNJv9rRSepYXw",
  authDomain: "project-63a86.firebaseapp.com",
  projectId: "team-1849c",
  storageBucket: "team-1849c.appspot.com",
  messagingSenderId: "448111875731",
  appId: "1:448111875731:web:6180e0c46cc10593051f66",
  measurementId: "G-SR4EFC2VFC",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = firebase.storage();

// ที่นี่สามารถใส่โค้ดทดสอบของคุณได้เลย

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

      // ทดสอบการทำงานของฟังก์ชัน
      try {
        if (func.name) {
          // Mock สภาพแวดล้อมที่ฟังก์ชันต้องการ
          const mockContext = {}; // สร้าง context ตามที่ฟังก์ชันต้องการ

          // ใช้ eval หรือ new Function เพื่อทดสอบการทำงาน
          const functionCode = new Function(
            "context",
            `with(context) { ${func.code} }`
          );
          functionCode(mockContext);

          console.log(`Test: ✔️ Function ${func.name} executed successfully.`);
        } else {
          console.log(`Test: ❌ Function ${func.name} is not callable.`);
        }
      } catch (error) {
        console.log(
          `Test: ❌ Error when executing function ${func.name} - ${error.message}`
        );
      }

      console.log("----------------------------");
    });

    console.log("----------------------------");
  });
}

testFunctionsInHtmlFiles();

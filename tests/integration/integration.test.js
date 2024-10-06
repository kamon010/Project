const { TextEncoder, TextDecoder } = require("util"); // นำเข้า TextEncoder และ TextDecoder

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

// Mock ฟังก์ชันที่ไม่รองรับใน jsdom
beforeAll(() => {
  window.moveBy = jest.fn();
  window.moveTo = jest.fn();
  window.open = jest.fn();
  window.resizeBy = jest.fn();
  window.prompt = jest.fn();
  window.print = jest.fn();
  window.blur = jest.fn();
  window.focus = jest.fn();
  window.scroll = jest.fn();
  window.alert = jest.fn();
  window.confirm = jest.fn();
});

// ฟังก์ชันเพื่อโหลดไฟล์ทั้งหมดในโฟลเดอร์ docs
function getHtmlFilesInDocsFolder() {
  const docsFolder = path.resolve(__dirname, "../docs");
  return fs
    .readdirSync(docsFolder)
    .filter((file) => file.endsWith(".html"))
    .map((file) => path.join(docsFolder, file));
}

function testFunctionsInHtmlFile(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable",
  });
  const window = dom.window;

  const browserOnlyFunctions = [
    "queueMicrotask",
    "postMessage",
    "getComputedStyle",
    "XPathExpression",
    "resizeTo",
    "scroll",
    "scrollBy",
    "alert",
    "confirm",
    "focus",
    "blur",
  ];

  const functionsToTest = Object.keys(window).filter(
    (key) => typeof window[key] === "function"
  );

  functionsToTest.forEach((funcName) => {
    if (browserOnlyFunctions.includes(funcName)) {
      console.log(
        `Skipping function ${funcName} in ${path.basename(
          filePath
        )} because it requires a real browser environment.`
      );
      return;
    }

    test(`should test function ${funcName} in ${path.basename(
      filePath
    )}`, () => {
      expect(window[funcName]).toBeDefined();

      try {
        const argLength = window[funcName].length;
        const mockArgs = Array(argLength).fill(null);
        const result = window[funcName](...mockArgs);
        expect(true).toBe(true);
      } catch (error) {
        console.error(
          `Error executing function ${funcName} in ${path.basename(filePath)}:`,
          error
        );
        throw error;
      }
    });
  });
}

const htmlFiles = getHtmlFilesInDocsFolder();

htmlFiles.forEach((filePath) => {
  describe(`Testing functions in ${path.basename(filePath)}`, () => {
    testFunctionsInHtmlFile(filePath);
  });
});

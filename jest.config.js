module.exports = {
  verbose: true,
  testEnvironment: "jsdom", // ใช้ jsdom สำหรับการทดสอบ DOM
  collectCoverage: true,
  coverageDirectory: "coverage",
  testMatch: ["**/tests/**/*.test.js"], // รันเฉพาะไฟล์ที่อยู่ในโฟลเดอร์ tests
};

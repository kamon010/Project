module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "jsdom", // ใช้ jsdom สำหรับการทดสอบ DOM
};

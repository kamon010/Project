const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

module.exports = {
  e2e: {
    baseUrl: "http://localhost:8080", // URL สำหรับทดสอบไฟล์ HTML
    supportFile: false, // ไม่มีไฟล์ support
  },
};

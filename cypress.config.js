module.exports = {
  e2e: {
    specPattern: "cypress/integration/**/*.js", // ให้ Cypress ค้นหาไฟล์ในโฟลเดอร์นี้
    baseUrl: "http://localhost:8080",
    supportFile: false,
  },
};

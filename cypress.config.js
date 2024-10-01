module.exports = {
  e2e: {
    specPattern: "cypress/integration/e2e_test.js",
    baseUrl: "http://localhost:8080",
    supportFile: false, // If you're not using a support file, it's fine to leave it as false
    video: true, // Optional: Record videos during test runs
    screenshotOnRunFailure: true, // Optional: Take screenshots on test failures
  },
};

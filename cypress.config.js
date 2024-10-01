module.exports = {
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.js", // Cypress V10+ spec file pattern
    baseUrl: "http://localhost:8080",
    supportFile: false, // If you're not using a support file, it's fine to leave it as false
    video: true, // Optional: Record videos during test runs
    screenshotOnRunFailure: true, // Optional: Take screenshots on test failures
  },
};

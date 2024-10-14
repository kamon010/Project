const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Function to lint a file and measure the time taken
function lintFile(filePath) {
  const startTime = new Date();

  return new Promise((resolve) => {
    exec(`npx htmlhint "${filePath}"`, (error, stdout, stderr) => {
      const endTime = new Date();
      const timeTaken = (endTime - startTime) / 1000; // Calculate time in seconds

      // Check if there were errors or warnings in the output
      if (stdout.includes("no errors found")) {
        console.log(
          `✔️ ${filePath} - Passed - Time : ${timeTaken.toFixed(2)}s`
        );
      } else {
        console.log(
          `❌ Linting ${filePath} - Failed - Time taken: ${timeTaken.toFixed(
            2
          )}s`
        );
        console.log(`Output:\n${stdout}`);
      }

      if (stderr) {
        console.error(`Error:\n${stderr}`);
      }
      resolve(timeTaken);
    });
  });
}

// Function to lint all HTML files in a directory
async function lintAllFiles(dir) {
  const files = fs
    .readdirSync(dir)
    .filter((file) => path.extname(file) === ".html");
  let totalTime = 0;

  for (const file of files) {
    const timeTaken = await lintFile(path.join(dir, file));
    totalTime += timeTaken;
  }

  // Display total time taken for all files
  console.log(`\nTotal time taken for linting: ${totalTime.toFixed(2)}s`);
}

// Run the linting process for all files in the 'docs' directory
lintAllFiles("./docs");

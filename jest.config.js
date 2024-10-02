name: Lint, Unit Test, Security Testing

on:
    push:
    branches:
    -main
pull_request:
    branches:
    -main

jobs:
    lint:
    runs - on: ubuntu - latest

steps:
    -name: Checkout repository
uses: actions / checkout @v2

    -
    name: Set up Node.js
uses: actions / setup - node @v3
with:
    node - version: "16"

-
name: Install dependencies
run: npm install

    -
    name: Verify htmllint installation
run: npx htmllint--version

    -
    name: Run HTML Linting
run: npm run lint: html
continue -on - error: true# ถ้ ามีข้ อผิดพลาดจะยั งคงทำงานต่ อ

unit - test:
    runs - on: ubuntu - latest
needs: lint# รอ job lint ทำงานเสร็ จ

steps:
    -name: Checkout repository
uses: actions / checkout @v2

    -
    name: Set up Node.js
uses: actions / setup - node @v3
with:
    node - version: "16"

-
name: Install dependencies
run: npm install

    -
    name: Run Unit Tests
run: npm test

npm - audit:
    runs - on: ubuntu - latest
needs: lint# รอ job lint ทำงานเสร็ จ

steps:
    -name: Checkout repository
uses: actions / checkout @v2

    -
    name: Set up Node.js
uses: actions / setup - node @v3
with:
    node - version: "16"

-
name: Install dependencies
run: npm install

    -
    name: Run npm audit to check
for vulnerabilities
run: npm audit

html - security - check:
    runs - on: ubuntu - latest
needs: lint# รอ job lint ทำงานเสร็ จ

steps:
    -name: Checkout repository
uses: actions / checkout @v2

    -
    name: Install dependencies
run: npm install

    -
    name: Verify htmlhint installation
run: npx htmlhint--version

    -
    name: Run HTML Linting
for docs folder
run: npx htmlhint "docs/**/*.html"

penetration - test:
    runs - on: ubuntu - latest
needs: lint# รอ job lint ทำงานเสร็ จ

steps:
    -name: Checkout repository
uses: actions / checkout @v2

    -
    name: Install OWASP ZAP
run: |
    sudo apt - get update
sudo apt - get install - y zaproxy

    -
    name: Run OWASP ZAP Baseline Scan
run: |
    zap - baseline.py - t http: //localhost:8080 -r zap_report.html

    -name: Upload ZAP Report
uses: actions / upload - artifact @v2
with:
    name: zap - report
path: zap_report.html
import { createRequire } from 'module';
const require = createRequire(
    import.meta.url);

import { ESLint } from 'eslint';
import parser from '@typescript-eslint/parser'; // แก้ไขส่วนนี้

export default {
    languageOptions: {
        parser: parser, // ใช้ parser ที่ import มา
    },
    plugins: {
        '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
        // เพิ่มกฎที่ต้องการตามการใช้งานของคุณ
    },
};
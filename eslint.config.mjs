import { createRequire } from 'module';
const require = createRequire(
    import.meta.url);

import { ESLint } from 'eslint';

export default {
    languageOptions: {
        parser: require.resolve('@typescript-eslint/parser'),
    },
    plugins: {
        '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
        // เพิ่มกฎที่ต้องการตามการใช้งานของคุณ
    },
};
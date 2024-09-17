import { ESLint } from 'eslint';
import { createRequire } from 'module';

const require = createRequire(
    import.meta.url);

export default {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        // เพิ่มกฎต่าง ๆ ที่ต้องการ
    },
};
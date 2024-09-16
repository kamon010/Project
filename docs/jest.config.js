module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json', // ใช้ไฟล์ tsconfig สำหรับการคอมไพล์ TypeScript
        },
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // แก้ไข path alias (ถ้ามี)
    },
    setupFilesAfterEnv: ['./jest.setup.js'], // เพิ่มการตั้งค่าเพิ่มเติม (ถ้ามี)
};
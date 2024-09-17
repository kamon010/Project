// tests/calculator.test.js
const { expect } = require('chai');
const { add, subtract, multiply, divide } = require('../src/calculator');

describe('Calculator Tests', () => {
    // ทดสอบฟังก์ชัน add
    it('should return 5 when adding 2 and 3', () => {
        const result = add(2, 3);
        expect(result).to.equal(5);
    });

    // ทดสอบฟังก์ชัน subtract
    it('should return 1 when subtracting 3 from 4', () => {
        const result = subtract(4, 3);
        expect(result).to.equal(1);
    });

    // ทดสอบฟังก์ชัน multiply
    it('should return 12 when multiplying 4 by 3', () => {
        const result = multiply(4, 3);
        expect(result).to.equal(12);
    });

    // ทดสอบฟังก์ชัน divide
    it('should return 2 when dividing 6 by 3', () => {
        const result = divide(6, 3);
        expect(result).to.equal(2);
    });

    // ทดสอบการ division by zero
    it('should throw an error when dividing by zero', () => {
        expect(() => divide(4, 0)).to.throw('Cannot divide by zero');
    });
});
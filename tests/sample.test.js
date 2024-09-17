// เปลี่ยนจาก require เป็น import
import { expect } from 'chai';
import { add, subtract, multiply, divide } from '../src/calculator.js';

describe('Calculator Tests', () => {
    it('should return 5 when adding 2 and 3', () => {
        const result = add(2, 3);
        expect(result).to.equal(5);
    });

    it('should return 1 when subtracting 3 from 4', () => {
        const result = subtract(4, 3);
        expect(result).to.equal(1);
    });

    it('should return 12 when multiplying 4 by 3', () => {
        const result = multiply(4, 3);
        expect(result).to.equal(12);
    });

    it('should return 2 when dividing 6 by 3', () => {
        const result = divide(6, 3);
        expect(result).to.equal(2);
    });
});
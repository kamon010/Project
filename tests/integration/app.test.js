// tests/integration/app.test.js
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app.js'; // นำเข้าไฟล์ app.js

const { expect } = chai;
chai.use(chaiHttp);

describe('Integration Tests for /add API', () => {
    it('should return the sum of two numbers', (done) => {
        chai.request(app)
            .post('/add')
            .send({ a: 3, b: 4 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('result').eql(7);
                done();
            });
    });

    it('should return 400 for invalid input', (done) => {
        chai.request(app)
            .post('/add')
            .send({ a: 3 })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.text).to.equal('Invalid input');
                done();
            });
    });
});
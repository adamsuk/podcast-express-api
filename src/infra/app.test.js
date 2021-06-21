var supertest = require("supertest");
var app = require('./app');
var { InvalidReqError, InvalidMethodError, InvalidPathError } = require("./errors");


const expected_get_res = 'Hello World';
const expected_post_res = {'Hello': 'World'};

describe('Dummy API Response Test', () => {
    it(`should test reponse is ${expected_get_res}`, () => {
        expect('Hello World').toBe(expected_get_res);
    })
});

describe("Test Eroneous Method Requested", () => {
    it('should test request throws a InvalidMethodError', async() => {
        await supertest(app).delete('/hello-world')
            .expect(400)
            .then((err) => {
                expect({'message': "Requested method 'DELETE' is not supported.",
                        'name': 'InvalidMethodError'})
            });
    })
});

describe("Test Actual GET Response", () => {
    it(`should test reponse is ${expected_get_res}`, async() => {
        await supertest(app).get('/hello-world')
            .expect(200)
            .then((res) => {
                expect(res.text).toBe(expected_get_res)
        });
    })
});

describe("Test Actual GET InvalidPathError", () => {
    it('should test request throws a InvalidPathError', async() => {
        await supertest(app).get('/definitely-a-dummy-path')
            .expect(400)
            .then((err) => {
                expect({'message': "Requested path 'definitely-a-dummy-path' not found.",
                        'name': 'InvalidPathError'})
            });
    })
});

describe("Test Actual POST Response", () => {
    it(`should test reponse is ${expected_post_res}`, async() => {
        await supertest(app).post('/hello-world')
            .send({'anything': 'will do'})
            .expect(200)
            .then((res) => {
                expect(JSON.parse(res.text)).toStrictEqual(expected_post_res)
        });
    })
});
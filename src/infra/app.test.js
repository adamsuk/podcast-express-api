var supertest = require('supertest');
var app = require('./app');
var { InvalidReqError, InvalidMethodError, InvalidPathError } = require('./errors');

const expected_get_status_res = 'Healthy';
var feed_urls = [
  'https://audioboom.com/channels/2399216.rss',
  'https://rss.acast.com/mydadwroteaporno'
];

describe('Test Eroneous Method Requested', () => {
  it('should test request throws a InvalidMethodError', async () => {
    await supertest(app).delete('/hello-world')
      .expect(400)
      .then((err) => {
        expect({
          message: "Requested method 'DELETE' is not supported.",
          name: 'InvalidMethodError'
        });
      });
  });
});

describe('Test Actual GET Response', () => {
  it(`should test reponse is ${expected_get_status_res}`, async () => {
    await supertest(app).get('/status')
      .expect(200)
      .then((res) => {
        expect(res.text).toBe(expected_get_status_res);
      });
  });
});

describe('Test Actual GET InvalidPathError', () => {
  it('should test request throws a InvalidPathError', async () => {
    await supertest(app).get('/definitely-a-dummy-path')
      .expect(400)
      .then((err) => {
        expect({
          message: "Requested path 'definitely-a-dummy-path' not found.",
          name: 'InvalidPathError'
        });
      });
  });
});

for (const feed_url of feed_urls) {
  describe("Test Actual POST Response: '/podcasts'", () => {
    it('should test reponse is json object', async () => {
      const input = {
        feed_url,
        podcast_filter: {
          key: 'episode',
          value: '10',
          match: 'includes'
        }
      };
      await supertest(app).post('/podcasts')
        .send(input)
        .expect(200)
        .then((res) => {
          expect(JSON.parse(res.text).length).toBeGreaterThan(0);
        });
    });
  });
}

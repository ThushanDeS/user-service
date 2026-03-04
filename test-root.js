// test-root.js
const request = require('supertest');
const app = require('./src/app');

(async () => {
  try {
    const res = await request(app).get('/');
    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(res.body, null, 2));
  } catch (err) {
    console.error('Test request failed:', err);
    process.exit(1);
  }
})();

// test-login.js
const request = require('supertest');
const app = require('./src/app');

(async () => {
  try {
    // First register
    await request(app)
      .post('/api/users/register')
      .send({ email: 'login.test@example.com', password: 'pass1234' })
      .set('Accept', 'application/json');

    // Then login
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'login.test@example.com', password: 'pass1234' })
      .set('Accept', 'application/json');

    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(res.body, null, 2));
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
})();

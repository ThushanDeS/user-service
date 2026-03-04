// test-register.js
const request = require('supertest');
const app = require('./src/app');

(async () => {
  try {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      })
      .set('Accept', 'application/json');

    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(res.body, null, 2));
  } catch (err) {
    console.error('Test request failed:', err);
    process.exit(1);
  }
})();

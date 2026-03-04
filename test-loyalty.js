// test-loyalty.js
const request = require('supertest');
const app = require('./src/app');

(async () => {
  try {
    // Register a user and use the returned userId
    const reg = await request(app)
      .post('/api/users/register')
      .send({ email: 'loyalty.test@example.com', password: 'pw', firstName: 'Loyal', lastName: 'User', phone: '123' })
      .set('Accept', 'application/json');

    const userId = (reg.body && reg.body.user && (reg.body.user.userId || reg.body.user.id));

    // Add points
    const addRes = await request(app)
      .post('/api/loyalty/points/add')
      .send({ userId: userId, points: 100, bookingReference: 'BKG123', description: 'test add' })
      .set('Accept', 'application/json');

    console.log('add status', addRes.status);
    console.log('add body', addRes.body);

    // Get points (should be 100 for that userId if user created)
    const pointsRes = await request(app).get(`/api/loyalty/points/${userId}`);
    console.log('points status', pointsRes.status);
    console.log('points body', pointsRes.body);

    // Get history
    const histRes = await request(app).get(`/api/loyalty/history/${userId}`);
    console.log('history status', histRes.status);
    console.log('history body', histRes.body);
  } catch (err) {
    console.error('loyalty test failed', err);
  }
})();

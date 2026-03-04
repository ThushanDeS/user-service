// test-live-loyalty.js
const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5004,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(body)),
      },
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(data) });
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5004,
      path,
      method: 'GET',
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data ? JSON.parse(data) : '' });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    // Register user
    console.log('Registering user...');
    const regRes = await post('/api/users/register', {
      email: 'test.live@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '555-1234',
    });
    console.log('Register:', regRes.status, regRes.body);
    const userId = regRes.body.user.userId || regRes.body.user.id;
    console.log('userId:', userId);

    // Add points
    console.log('\nAdding 100 points...');
    const addRes = await post('/api/loyalty/points/add', {
      userId: userId,
      points: 100,
      bookingReference: 'BKG789',
      description: 'Test booking points',
    });
    console.log('Add Points:', addRes.status, addRes.body);

    // Get points
    console.log('\nGetting points...');
    const pointsRes = await get(`/api/loyalty/points/${userId}`);
    console.log('Get Points:', pointsRes.status, pointsRes.body);

    // Get history
    console.log('\nGetting transaction history...');
    const histRes = await get(`/api/loyalty/history/${userId}`);
    console.log('History:', histRes.status, histRes.body);
  } catch (err) {
    console.error('Error:', err);
  }
})();

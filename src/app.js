// Load environment variables - THIS MUST BE AT THE VERY TOP
const dotenv = require('dotenv');
dotenv.config();

// quick debug logs for environment
// (these help confirm dotenv loaded when running directly)
// eslint-disable-next-line no-console
console.log('✅ Environment variables loaded');
// eslint-disable-next-line no-console
console.log('📡 PORT from env:', process.env.PORT);
// eslint-disable-next-line no-console
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// Mount API routes
const userRoutes = require('./routes/userRoutes');
const loyaltyRoutes = require('./routes/loyaltyRoutes');

app.use('/api/users', userRoutes);
app.use('/api/loyalty', loyaltyRoutes);

// basic health route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// root route - friendly landing page
app.get('/', (req, res) => {
  res.json({
    service: 'user-service',
    status: 'ok',
    routes: ['/health', '/api/users', '/api/loyalty'],
  });
});

// Start server when run directly (allows importing in tests without listening)
if (require.main === module) {
  const port = parseInt(process.env.PORT, 10) || 5004;
  const server = app.listen(port);
  server.on('listening', () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${port}`);
  });
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      // eslint-disable-next-line no-console
      console.error(`Port ${port} is already in use. Stop the process using it or set PORT env var.`);
    } else {
      // eslint-disable-next-line no-console
      console.error('Server error:', err && err.message ? err.message : err);
    }
    process.exit(1);
  });
}

module.exports = app;

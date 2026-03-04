// test-env.js
require('dotenv').config();
console.log('PORT from .env:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

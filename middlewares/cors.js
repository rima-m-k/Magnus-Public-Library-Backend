const cors = require('cors');

const corsMiddleware = cors({
  origin: 'https://magnuspubliclibrary.tech',
  // origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
});

module.exports = corsMiddleware;


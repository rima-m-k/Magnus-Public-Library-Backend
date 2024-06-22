const cors = require('cors');

const corsMiddleware = cors({
  origin: '*' ,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
});

module.exports = corsMiddleware;


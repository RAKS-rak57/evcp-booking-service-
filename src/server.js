require('dotenv').config();
const express = require('express');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'evcp-booking-service', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EVCP Booking Service listening on port ${PORT}`);
});

module.exports = app;

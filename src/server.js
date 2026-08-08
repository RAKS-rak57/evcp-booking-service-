require('dotenv').config();
const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const stationsRoutes = require('./routes/stations.routes');
const bookingsRoutes = require('./routes/bookings.routes');

const app = express();
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Basic in-memory rate limiting (100 requests / 15 min per IP)
const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMax = 100;
const requestCounts = new Map();
app.use((req, res, next) => {
  const now = Date.now();
  const entry = requestCounts.get(req.ip) || { count: 0, start: now };
  if (now - entry.start > rateLimitWindowMs) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  requestCounts.set(req.ip, entry);
  if (entry.count > rateLimitMax) {
    return res.status(429).json({ error: true, message: 'Too many requests' });
  }
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'evcp-booking-service', timestamp: new Date().toISOString() });
});

app.use('/api/stations', stationsRoutes);
app.use('/api/bookings', bookingsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EVCP Booking Service listening on port ${PORT}`);
});

module.exports = app;

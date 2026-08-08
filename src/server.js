require('dotenv').config();
const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const stationsRoutes = require('./routes/stations.routes');
const bookingsRoutes = require('./routes/bookings.routes');

const app = express();
app.use(express.json());

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

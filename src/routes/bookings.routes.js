const express = require('express');
const { createBooking, getBookingById } = require('../models/booking.model');
const { redisClient, connectRedis } = require('../config/db');

const router = express.Router();

// POST /api/bookings
router.post('/', async (req, res, next) => {
  try {
    const { userId, stationId, connectorId } = req.body;
    if (!userId || !stationId || !connectorId) {
      const err = new Error('userId, stationId and connectorId are required');
      err.status = 400;
      throw err;
    }
    const holdMinutes = process.env.BOOKING_HOLD_MINUTES || 15;
    const booking = await createBooking({ userId, stationId, connectorId, holdMinutes });

    // BUGFIX: invalidate the cached availability figure for this station so
    // the next GET /api/stations/:id/availability reflects the new reservation
    // instead of serving a stale count for up to 30 seconds (race condition
    // reported after the v1.0.0 release).
    await connectRedis();
    await redisClient.del(`availability:${stationId}`);

    res.status(201).json({ message: 'Slot reserved', booking });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/:id
router.get('/:id', async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      const err = new Error('Booking not found');
      err.status = 404;
      throw err;
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require('express');
const { pgPool } = require('../config/db');
const { redisClient, connectRedis } = require('../config/db');

const router = express.Router();

// GET /api/stations?lat=&lng=&radius=
router.get('/', async (req, res, next) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    if (!lat || !lng) {
      const err = new Error('lat and lng query parameters are required');
      err.status = 400;
      throw err;
    }
    // Haversine-based radius search against the stations table
    const query = `
      SELECT id, name, latitude, longitude, connector_type, status
      FROM stations
      WHERE (
        6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(latitude))
        )
      ) <= $3;
    `;
    const { rows } = await pgPool.query(query, [lat, lng, radius]);
    res.json({ count: rows.length, stations: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/stations/:id/availability
router.get('/:id/availability', async (req, res, next) => {
  try {
    const { id } = req.params;
    await connectRedis();
    const cacheKey = `availability:${id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ stationId: id, source: 'cache', ...JSON.parse(cached) });
    }

    const { rows } = await pgPool.query(
      `SELECT id, status FROM connectors WHERE station_id = $1`,
      [id]
    );
    const available = rows.filter((c) => c.status === 'AVAILABLE').length;
    const payload = { totalConnectors: rows.length, available };

    await redisClient.set(cacheKey, JSON.stringify(payload), { EX: 30 });
    res.json({ stationId: id, source: 'db', ...payload });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

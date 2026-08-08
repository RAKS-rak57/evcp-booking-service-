const { pgPool } = require('../config/db');

async function createBooking({ userId, stationId, connectorId, holdMinutes }) {
  const query = `
    INSERT INTO bookings (user_id, station_id, connector_id, status, start_time, hold_expires_at)
    VALUES ($1, $2, $3, 'RESERVED', NOW(), NOW() + ($4 || ' minutes')::interval)
    RETURNING *;
  `;
  const values = [userId, stationId, connectorId, holdMinutes];
  const { rows } = await pgPool.query(query, values);
  return rows[0];
}

async function getBookingById(bookingId) {
  const { rows } = await pgPool.query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
  return rows[0];
}

async function releaseExpiredHolds() {
  const query = `
    UPDATE bookings SET status = 'RELEASED'
    WHERE status = 'RESERVED' AND hold_expires_at < NOW()
    RETURNING id;
  `;
  const { rows } = await pgPool.query(query);
  return rows;
}

module.exports = { createBooking, getBookingById, releaseExpiredHolds };

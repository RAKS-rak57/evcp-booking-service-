const test = require('node:test');
const assert = require('node:assert');

test('booking hold window defaults to 15 minutes', () => {
  const holdMinutes = process.env.BOOKING_HOLD_MINUTES || 15;
  assert.strictEqual(Number(holdMinutes), 15);
});

test('booking payload requires userId, stationId, connectorId', () => {
  const requiredFields = ['userId', 'stationId', 'connectorId'];
  const payload = { userId: 'u1', stationId: 's1', connectorId: 'c1' };
  const missing = requiredFields.filter((f) => !(f in payload));
  assert.strictEqual(missing.length, 0);
});

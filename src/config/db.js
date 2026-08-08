const { Pool } = require('pg');
const { createClient } = require('redis');

const pgPool = new Pool({
  host: process.env.PGHOST || 'postgres',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'evcp_booking',
  user: process.env.PGUSER || 'evcp_user',
  password: process.env.PGPASSWORD || 'changeme',
});

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
  },
});

redisClient.on('error', (err) => console.error('Redis connection error:', err));

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

module.exports = { pgPool, redisClient, connectRedis };

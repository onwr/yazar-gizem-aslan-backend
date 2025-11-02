const mysql = require('mysql2/promise');
const { createClient } = require('redis');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 60000,
});

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('Redis: Bağlantı kurulamadı, 10 denemeden sonra durduruldu');
        return false;
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

redis.on('error', (err) => console.log('Redis Client Error', err));

const connectRedis = async () => {
  try {
    await redis.connect();
    console.log('Redis bağlantısı başarılı!');
  } catch (error) {
    console.error('Redis bağlantı hatası:', error.message);
  }
};

connectRedis();

module.exports = { pool, redis };

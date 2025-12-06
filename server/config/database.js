const mariadb = require('mariadb');
const { logger } = require('../utils/logger');

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'magnetic_clouds',
  connectionLimit: 10,
  acquireTimeout: 30000,
  connectTimeout: 30000,
  idleTimeout: 60000,
  resetAfterUse: true
});

// Test connection
pool.getConnection()
  .then(conn => {
    logger.info('✅ MariaDB connected successfully');
    conn.release();
  })
  .catch(err => {
    logger.error('❌ MariaDB connection failed:', err.message);
  });

// Query helper with automatic connection handling
const query = async (sql, params = []) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return result;
  } catch (err) {
    logger.error('Database query error:', err.message);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

// Transaction helper
const transaction = async (callback) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    if (conn) await conn.rollback();
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { pool, query, transaction };

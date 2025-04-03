const { Pool } = require('pg');

console.log('=== DEBUG START ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '***REDACTED***' : 'UNDEFINED');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 2000
});

// Test immédiat
pool.query('SELECT NOW()')
  .then(res => console.log('DB TEST SUCCESS:', res.rows[0]))
  .catch(err => {
    console.error('DB TEST FAILED:', {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    process.exit(1); // Force l'échec visible
  });

module.exports = pool;
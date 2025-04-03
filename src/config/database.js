const { Pool } = require('pg');

// Ajouter un test de connexion pour déboguer
const testDatabaseConnection = async () => {
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '***REDACTED***' : 'non défini');
  
  const testPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { 
      rejectUnauthorized: false, 
      sslmode: 'require' 
    }
  });
  
  try {
    const client = await testPool.connect();
    console.log('DB TEST SUCCESS: Connected to database');
    client.release();
    return true;
  } catch (error) {
    console.error('DB TEST FAILED:', error);
    return false;
  } finally {
    await testPool.end();
  }
};

// En production, tester la connexion au démarrage
if (process.env.NODE_ENV === 'production') {
  testDatabaseConnection();
}

// Configuration du pool de connexion
const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { 
        rejectUnauthorized: false, 
        sslmode: 'require' 
      }
    })
  : new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      ssl: { 
        rejectUnauthorized: false, 
        sslmode: 'require'
      }
    });

// Ajouter un gestionnaire d'erreurs pour le pool
pool.on('error', (err) => {
  console.error('Erreur de connexion à la base de données:', err);
});

module.exports = {
  pool,
  testDatabaseConnection
};
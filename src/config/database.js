const { Pool } = require('pg');

// Si DATABASE_URL est fourni, utilisez-le en priorité
// Sinon, utilisez les variables individuelles
const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      }
    });

// Ajouter un gestionnaire d'erreurs pour le pool
pool.on('error', (err) => {
  console.error('Erreur de connexion à la base de données:', err);
});

module.exports = pool;
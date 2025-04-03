const { Pool } = require('pg');

const sslConfig = process.env.NODE_ENV === 'production' ? {
  rejectUnauthorized: true,
  ca: process.env.DB_SSL_CA || null // À utiliser si Supabase le requiert
} : false; // Désactivé en développement

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  connectionTimeoutMillis: 5000, // 5 secondes timeout
  idleTimeoutMillis: 30000
});

// Test de connexion immédiat avec logging détaillé
pool.query('SELECT 1+1 AS test')
  .then(res => console.log('🟢 Connexion DB réussie. Test:', res.rows[0].test))
  .catch(err => {
    console.error('🔴 ERREUR DE CONNEXION:', {
      message: err.message,
      code: err.code,
      stack: err.stack,
      config: {
        host: new URL(process.env.DATABASE_URL).hostname,
        ssl: sslConfig
      }
    });
    process.exit(1); // Force l'arrêt si la DB échoue
  });


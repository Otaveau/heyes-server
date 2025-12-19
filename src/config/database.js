const { Pool } = require('pg');

// Détermine la configuration du pool en fonction de l'environnement
let poolConfig;
let dbInfo;

// Configuration SSL sécurisée
const getSSLConfig = () => {
  // Désactiver SSL uniquement en développement local
  if (process.env.NODE_ENV !== 'production') {
    return false;
  }

  // En production, SSL avec validation stricte du certificat
  const sslConfig = {
    rejectUnauthorized: true
  };

  // Permettre de fournir un certificat CA personnalisé si nécessaire
  // (pour certains fournisseurs de base de données qui utilisent des CA auto-signés)
  if (process.env.DB_SSL_CA) {
    sslConfig.ca = process.env.DB_SSL_CA;
  }

  return sslConfig;
};

if (process.env.DATABASE_URL) {
  // Configuration pour Vercel ou tout environnement utilisant une URL de connexion
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: getSSLConfig()
  };

  dbInfo = {
    type: 'URL connection',
    url: process.env.DATABASE_URL ? 'provided (hidden)' : 'missing',
    sslEnabled: process.env.NODE_ENV === 'production',
    sslValidation: process.env.NODE_ENV === 'production' ? 'strict' : 'disabled'
  };
} else {
  // Configuration pour développement local avec paramètres individuels
  poolConfig = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'heyes',
    ssl: getSSLConfig()
  };

  dbInfo = {
    type: 'Individual parameters',
    user: process.env.DB_USER || 'postgres',
    passwordProvided: !!process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_NAME || 'heyes',
    sslEnabled: process.env.NODE_ENV === 'production',
    sslValidation: process.env.NODE_ENV === 'production' ? 'strict' : 'disabled'
  };
}

// Créer le pool avec la configuration appropriée
const pool = new Pool(poolConfig);

pool.on('connect', async (client) => {
  await client.query('SET search_path TO heyes_schema, public');
});

// Logging des paramètres de connexion (uniquement en développement)
if (process.env.NODE_ENV !== 'production') {
  console.log('Paramètres de connexion à la DB:', dbInfo);
  console.log('Environnement:', process.env.NODE_ENV || 'development');
}

// Test de connexion à la base de données
const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Connexion à la base de données réussie');
    }
    client.release();

    // Test de l'existence du schéma et de la table
    try {
      const schemaResult = await pool.query(
        "SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'heyes_schema'"
      );

      const tableResult = await pool.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'heyes_schema' AND table_name = 'users'"
      );

      const schemaExists = schemaResult.rows.length > 0;
      const tableExists = tableResult.rows.length > 0;

      if (process.env.NODE_ENV !== 'production') {
        console.log(`Schéma heyes_schema: ${schemaExists ? 'existe' : 'manquant'}`);
        console.log(`Table users: ${tableExists ? 'existe' : 'manquante'}`);
      }

      if (!schemaExists || !tableExists) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('⚠️ Attention: Le schéma ou la table n\'existe pas. Création automatique recommandée.');
        }
        // Création automatique du schéma et de la table si nécessaire
        if (!schemaExists) {
          await pool.query('CREATE SCHEMA IF NOT EXISTS heyes_schema');
          if (process.env.NODE_ENV !== 'production') {
            console.log('Schéma heyes_schema créé avec succès');
          }
        }

        if (!tableExists) {
          await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
              user_id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL UNIQUE,
              password VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `);
          if (process.env.NODE_ENV !== 'production') {
            console.log('Table users créée avec succès');
          }
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erreur lors de la vérification ou création du schéma/table:', err);
      }
    }

    return true;
  } catch (error) {
    // Les erreurs de connexion DB doivent toujours être loggées, même en production
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  testDatabaseConnection
};
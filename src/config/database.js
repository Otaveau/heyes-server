const { Pool } = require('pg');

// Configuration du pool de connexion avec des valeurs par défaut
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'heyes',
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false
});

// Logging des paramètres de connexion (sans exposer le mot de passe)
console.log('Paramètres de connexion à la DB:', {
  user: process.env.DB_USER || 'postgres',
  passwordProvided: !!process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '5432',
  database: process.env.DB_NAME || 'heyes',
  sslEnabled: process.env.NODE_ENV === 'production'
});

// Test de connexion à la base de données
const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connexion à la base de données réussie');
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
      
      console.log(`Schéma heyes_schema: ${schemaExists ? 'existe' : 'manquant'}`);
      console.log(`Table users: ${tableExists ? 'existe' : 'manquante'}`);
      
      if (!schemaExists || !tableExists) {
        console.log('⚠️ Attention: Le schéma ou la table n\'existe pas. Création automatique recommandée.');
        // Ici vous pourriez ajouter un code pour créer automatiquement la structure
      }
    } catch (err) {
      console.error('Erreur lors de la vérification du schéma/table:', err);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    return false;
  }
};

module.exports = {
  pool,
  testDatabaseConnection
};
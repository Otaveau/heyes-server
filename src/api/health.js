// Fichier : api/health.js
import { pool } from '../database.js'; // Adaptez le chemin selon votre structure

export default async (req, res) => {
  try {
    // Test basique de l'application
    const appStatus = { 
      status: 'Application running',
      timestamp: new Date().toISOString() 
    };

    // Test de connexion à la DB (seulement si vous voulez vérifier la DB)
    let dbStatus = {};
    try {
      const dbResult = await pool.query('SELECT NOW() as time');
      dbStatus = { 
        db: 'Connected', 
        time: dbResult.rows[0].time 
      };
    } catch (dbError) {
      dbStatus = { 
        db: 'Connection failed', 
        error: dbError.message 
      };
    }

    // Réponse combinée
    res.status(200).json({
      success: true,
      app: appStatus,
      database: dbStatus,
      env: {
        node_env: process.env.NODE_ENV,
        vercel_region: process.env.VERCEL_REGION
      }
    });

  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
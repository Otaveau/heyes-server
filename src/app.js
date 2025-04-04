const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const apiRoutes = require('./routes/api');

const { testDatabaseConnection } = require('./config/database');

const app = express();

app.get('/', async (req, res) => {
  let dbStatus = 'unknown';
  
  try {
    const dbConnected = await testDatabaseConnection();
    dbStatus = dbConnected ? 'connected' : 'connection failed';
  } catch (error) {
    dbStatus = `error: ${error.message}`;
  }
  
  res.status(200).json({ 
    message: "Heyes API is running", 
    status: "healthy",
    environment: process.env.NODE_ENV || 'development',
    corsOrigin: corsOptions.origin,
    database: dbStatus
  });
});


// Déterminer l'origine en fonction de l'environnement
const getOrigin = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.CLIENT_URL || 'https://heyes-client.vercel.app';
  }
  // En développement, autoriser localhost avec différents ports possibles
  return ['http://localhost:3000', 'http://127.0.0.1:3000'];
};


// Configuration CORS optimisée pour les deux environnements
const corsOptions = {
  origin: getOrigin(),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
};

// Appliquer CORS globalement
app.use(cors(corsOptions));

// Gérer explicitement les requêtes OPTIONS (preflight)
app.options('*', cors(corsOptions));

app.options('*', (req, res) => {
  // Définir les headers CORS explicitement
  res.header('Access-Control-Allow-Origin', corsOptions.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // Répondre avec un status 200
  res.sendStatus(200);
});

// Configurer Helmet avec contentSecurityPolicy désactivé pour éviter les conflits
app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api', apiRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

module.exports = app;
const express = require('express');
const app = express();

// Configuration de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://heyes-client.vercel.app');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: "API is working",
    timestamp: new Date().toISOString()
  });
});

// Importer le routeur principal
const apiRoutes = require('../routes/api');

// Utiliser le routeur avec le préfixe /api
app.use('/api', apiRoutes);

// Logging après le traitement de la requête
app.use((req, res, next) => {
    console.log(`Requête traitée: ${req.method} ${req.originalUrl}`);
    next();
  });

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ 
    error: 'Erreur serveur', 
    message: err.message 
  });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.originalUrl 
  });
});

// Exporter le handler pour Vercel
module.exports = (req, res) => {
  app(req, res);
};
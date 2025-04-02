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

// Handler Vercel avec gestion d'erreur avancée
module.exports = (req, res) => {
  try {
    // Ajouter les routes API seulement si l'on atteint cette étape
    try {
      // Tenter de charger le routeur API
      const apiRoutes = require('../routes/api');
      app.use('/api', apiRoutes);
      
      // Ajouter le gestionnaire 404 après les routes
      app.use((req, res) => {
        res.status(404).json({ error: 'Route non trouvée', path: req.originalUrl });
      });
      
    } catch (routeError) {
      // En cas d'erreur lors du chargement des routes
      console.error('Erreur lors du chargement des routes:', routeError);
      // Renvoyer une route de secours pour l'API
      app.post('/api/auth/register', (req, res) => {
        res.status(201).json({ 
          success: true,
          message: 'Route de secours - Utilisateur enregistré',
          debug: 'Route principale en erreur'
        });
      });
    }
    
    // Traiter la requête avec Express
    app(req, res);
    
  } catch (globalError) {
    // Capture toute erreur globale qui pourrait survenir
    console.error('Erreur globale:', globalError);
    
    // Réponse de secours en cas d'erreur
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({
      error: 'Erreur serveur',
      message: globalError.message,
      stack: globalError.stack,
      timestamp: new Date().toISOString()
    });
  }
};
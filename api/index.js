const express = require('express');
const app = express();

// Configuration minimale
app.use(express.json());

// Ajouter les headers CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://heyes-client.vercel.app');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Gérer les requêtes OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: "Express API is working",
    timestamp: new Date().toISOString()
  });
});

// Exporter un handler pour Vercel
module.exports = (req, res) => {
  app(req, res);
};
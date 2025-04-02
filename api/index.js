// api/index.js - Version avec Express mais sans app.js
const express = require('express');
const app = express();

// Configuration de base
app.use(express.json());

// Middleware CORS basique
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://heyes-client.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Route test
app.get('/', (req, res) => {
  res.json({
    message: "Express API is working",
    timestamp: new Date().toISOString()
  });
});

// Route API test
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: "API test route" });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Exporter le handler
module.exports = (req, res) => {
  app(req, res);
};
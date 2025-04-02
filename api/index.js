// api/index.js - Point d'entrée pour Vercel
const app = require('../src/app');

// Handler Vercel
module.exports = (req, res) => {
  // Vérifier si c'est exécuté dans Vercel
  console.log('Environnement:', process.env.VERCEL ? 'Vercel' : 'Local');
  
  // Utiliser l'application Express pour gérer la requête
  return app(req, res);
};
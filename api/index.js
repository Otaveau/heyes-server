const app = require('../app');

// Exporter le handler pour Vercel
module.exports = (req, res) => {
  // Pour les applications Express dans Vercel, parfois le chemin doit être ajusté
  // car Vercel redirige toutes les requêtes vers /api
  const originalUrl = req.url;
  
  // Si vous accédez à la racine via /api, rediriger vers /
  if (req.url === '/api' || req.url === '/api/') {
    req.url = '/';
  } 
  // Sinon si c'est un autre chemin sous /api, supprimer le préfixe /api
  else if (req.url.startsWith('/api/')) {
    req.url = req.url.substring(4); // Enlever '/api'
  }
  
  console.log(`URL originale: ${originalUrl}, URL modifiée: ${req.url}`);
  
  // Passer la requête à Express
  app(req, res);
};
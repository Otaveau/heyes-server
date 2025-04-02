// api/index.js
const app = require('../app');

// Exportez la fonction handler pour Vercel
module.exports = (req, res) => {
  // Ne pas permettre à Express de terminer la réponse
  app(req, res);
};
const app = require('../app');

// Exporter le handler pour Vercel
module.exports = (req, res) => {
  app(req, res);
};
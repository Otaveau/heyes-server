module.exports = (req, res) => {
    // Ajouter les headers CORS basiques
    res.setHeader('Access-Control-Allow-Origin', 'https://heyes-client.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Gérer les requêtes OPTIONS
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Réponse simple pour toutes les autres requêtes
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      message: "Simple API is working",
      path: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  };
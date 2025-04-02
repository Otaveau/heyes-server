const express = require('express');
const app = express();

// Configuration de nase
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Route racine
app.get('/', (req, res) => {
    res.json({
        message: "Express API is working",
        timestamp: new Date().toISOString()
    });
});

// Importer le routeur principal
const apiRoutes = require('../routes/api');

// Utiliser le routeur principal avec le préfixe /api
app.use('/api', apiRoutes);

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur serveur' });
});

// Route 404 pour les chemins non trouvés
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Exporter un handler pour Vercel
module.exports = (req, res) => {
    app(req, res);
};
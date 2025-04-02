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

// Exemple d'ajout de route d'enregistrement
app.post('/api/auth/register', (req, res) => {
    try {
        // Logique d'enregistrement simplifiée pour tester
        const { email, password } = req.body;

        // Validation de base
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
        }

        // Réponse de test
        res.status(201).json({
            success: true,
            message: 'Utilisateur enregistré avec succès',
            user: { email, id: 'test-id' }
        });
    } catch (error) {
        console.error('Erreur d\'enregistrement:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement' });
    }
});

// Exporter un handler pour Vercel
module.exports = (req, res) => {
    app(req, res);
};
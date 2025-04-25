const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * Récupère les jours fériés pour une année spécifique
 * GET /api/holidays/:year
 */
router.get('/:year', async (req, res) => {
  try {
    const { year } = req.params;
    
    // Validation basique
    if (!year || isNaN(year)) {
      return res.status(400).json({ error: 'Année invalide' });
    }
    
    // Faire la requête vers l'API des jours fériés
    const response = await axios.get(
      `https://calendrier.api.gouv.fr/jours-feries/metropole/${year}.json`
    );
    
    // Retourner les données au client
    return res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des jours fériés:', error);
    
    // Gestion des erreurs avec codes HTTP appropriés
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Erreur lors de la récupération des jours fériés',
        details: error.response.data
      });
    }
    
    return res.status(500).json({
      error: 'Erreur lors de la récupération des jours fériés',
      message: error.message
    });
  }
});

module.exports = router;
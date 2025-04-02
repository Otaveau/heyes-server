// api/index.js
const app = require('../app');

module.exports = (req, res) => {
    // Réponse simple pour tester
    res.status(200).json({
        message: "Test API is working",
        path: req.url,
        method: req.method
    });
};
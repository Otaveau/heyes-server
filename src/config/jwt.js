const jwt = require('jsonwebtoken');

// Vérifier que JWT_SECRET est défini
if (!process.env.JWT_SECRET) {
  throw new Error(
    'FATAL ERROR: JWT_SECRET environment variable is not defined.\n' +
    'Please set JWT_SECRET in your .env file with a secure random string.\n' +
    'You can generate one using: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
  );
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  generateToken,
  verifyToken
};
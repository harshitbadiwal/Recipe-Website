const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'recipe_jwt_secret_key_production_2026_super_secure', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'recipe_jwt_secret_key_production_2026_super_secure');
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
};

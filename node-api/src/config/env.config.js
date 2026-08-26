const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/recipe_db',
  jwtSecret: process.env.JWT_SECRET || 'recipe_jwt_secret_key_production_2026_super_secure',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:5173',
  apiBaseUrl: process.env.API_BASE_URL || process.env.RENDER_EXTERNAL_URL || 'https://recipe-website-ja3v.onrender.com',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || 'n9thvoig',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '344836114775421',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '8Sr26vc0tKpCb1Vl2-3p71tAP6U',
};

const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const authenticate = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', favoriteController.getFavorites);
router.get('/check/:recipeId', favoriteController.checkFavorite);
router.post('/:recipeId', favoriteController.addFavorite);
router.delete('/:recipeId', favoriteController.removeFavorite);

module.exports = router;

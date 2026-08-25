const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// Public Read-Only Category Routes
router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);
router.get('/:slug/recipes', categoryController.getCategoryRecipes);

module.exports = router;

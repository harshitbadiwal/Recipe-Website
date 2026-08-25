const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const recipeRoutes = require('./recipe.routes');
const categoryRoutes = require('./category.routes');
const blogRoutes = require('./blog.routes');
const commentRoutes = require('./comment.routes');
const favoriteRoutes = require('./favorite.routes');
const collectionRoutes = require('./collection.routes');
const newsletterRoutes = require('./newsletter.routes');
const userRoutes = require('./user.routes');
const homeRoutes = require('./home.routes');
const uploadRoutes = require('./upload.routes');
const adminRoutes = require('./admin');

// Public & User Routes
router.use('/auth', authRoutes);
router.use('/recipes', recipeRoutes);
router.use('/categories', categoryRoutes);
router.use('/blogs', blogRoutes);
router.use('/comments', commentRoutes);
router.use('/users/me/favorites', favoriteRoutes);
router.use('/users/me/collections', collectionRoutes);
router.use('/users', userRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/home', homeRoutes);
router.use('/upload', uploadRoutes);

// Protected Admin Routes
router.use('/admin', adminRoutes);

module.exports = router;

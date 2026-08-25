const express = require('express');
const router = express.Router();

const recipeRoutes = require('./recipe.routes');
const categoryRoutes = require('./category.routes');
const blogRoutes = require('./blog.routes');
const userRoutes = require('./user.routes');
const commentRoutes = require('./comment.routes');
const newsletterRoutes = require('./newsletter.routes');

const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const ROLES = require('../../constants/roles');

// Enforce authentication & ADMIN role authorization for all admin routes
router.use(authenticate, authorize(ROLES.ADMIN));

router.use('/recipes', recipeRoutes);
router.use('/categories', categoryRoutes);
router.use('/blogs', blogRoutes);
router.use('/users', userRoutes);
router.use('/comments', commentRoutes);
router.use('/newsletter', newsletterRoutes);

module.exports = router;

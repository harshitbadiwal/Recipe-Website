const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const commentController = require('../controllers/comment.controller');
const ratingController = require('../controllers/rating.controller');
const validate = require('../middlewares/validate.middleware');
const authenticate = require('../middlewares/auth.middleware');
const { recipeQueryValidator } = require('../validators/query.validator');
const { createCommentValidator } = require('../validators/comment.validator');
const { ratingValidator } = require('../validators/rating.validator');

// Public Recipe Read-Only Routes
router.get('/featured', recipeController.getFeaturedRecipes);
router.get('/latest', recipeController.getLatestRecipes);
router.get('/search', validate(recipeQueryValidator), recipeController.searchRecipes);
router.get('/', validate(recipeQueryValidator), recipeController.getRecipes);
router.get('/:slug', recipeController.getRecipeBySlug);
router.get('/:id/related', recipeController.getRelatedRecipes);

// Recipe Comments (Public GET, Protected POST)
router.get('/:recipeId/comments', commentController.getRecipeComments);
router.post(
  '/:recipeId/comments',
  authenticate,
  validate(createCommentValidator),
  commentController.createComment
);

// Recipe Ratings (Public GET, Protected POST/PATCH/DELETE)
router.get('/:recipeId/ratings', ratingController.getRecipeRatings);
router.post(
  '/:recipeId/rating',
  authenticate,
  validate(ratingValidator),
  ratingController.addOrUpdateRating
);
router.patch(
  '/:recipeId/rating',
  authenticate,
  validate(ratingValidator),
  ratingController.addOrUpdateRating
);
router.delete('/:recipeId/rating', authenticate, ratingController.removeRating);

module.exports = router;

const { query } = require('express-validator');

const recipeQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['latest', 'oldest', 'rating_desc', 'rating_asc', 'name_asc', 'name_desc', 'popular'])
    .withMessage('Invalid sort parameter'),
  query('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('Invalid difficulty parameter'),
  query('minTime').optional().isInt({ min: 0 }).withMessage('minTime must be a non-negative integer'),
  query('maxTime').optional().isInt({ min: 0 }).withMessage('maxTime must be a non-negative integer'),
  query('minRating').optional().isFloat({ min: 0, max: 5 }).withMessage('minRating must be between 0 and 5'),
];

module.exports = {
  recipeQueryValidator,
};

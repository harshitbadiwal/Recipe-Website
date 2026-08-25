const { body, param } = require('express-validator');

const ratingValidator = [
  param('recipeId').isMongoId().withMessage('Invalid recipe ID'),
  body('score')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating score must be an integer between 1 and 5'),
  body('review').optional().trim(),
];

module.exports = {
  ratingValidator,
};

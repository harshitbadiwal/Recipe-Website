const { body, param } = require('express-validator');

const createCommentValidator = [
  param('recipeId').isMongoId().withMessage('Invalid recipe ID'),
  body('content').trim().notEmpty().withMessage('Comment content is required'),
];

const updateCommentValidator = [
  param('id').isMongoId().withMessage('Invalid comment ID'),
  body('content').trim().notEmpty().withMessage('Comment content is required'),
];

module.exports = {
  createCommentValidator,
  updateCommentValidator,
};

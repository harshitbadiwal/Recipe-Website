const { body, param } = require('express-validator');

const createCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('slug').optional().trim(),
  body('description').optional().trim(),
  body('image').optional().isURL().withMessage('Category image must be a valid URL'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

const updateCategoryValidator = [
  param('id').isMongoId().withMessage('Invalid category ID'),
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
  body('slug').optional().trim(),
  body('description').optional().trim(),
  body('image').optional().isURL().withMessage('Category image must be a valid URL'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
};

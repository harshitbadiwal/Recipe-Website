const { body, param } = require('express-validator');

const validateImage = (value, { req }) => {
  if (req.file) return true;
  if (!value || (typeof value === 'string' && value.trim() === '')) return true;
  try {
    new URL(value);
    return true;
  } catch (e) {
    throw new Error('Category image must be a valid URL');
  }
};

const createCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('slug').optional().trim(),
  body('description').optional().trim(),
  body('image').optional({ checkFalsy: true }).custom(validateImage),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

const updateCategoryValidator = [
  param('id').isMongoId().withMessage('Invalid category ID'),
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
  body('slug').optional().trim(),
  body('description').optional().trim(),
  body('image').optional({ checkFalsy: true }).custom(validateImage),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
};

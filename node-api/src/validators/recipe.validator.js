const { body, param } = require('express-validator');

const parseJsonIfString = (val) => {
  if (typeof val === 'string' && val.trim() !== '') {
    try {
      return JSON.parse(val);
    } catch (e) {
      if (val.includes(',')) {
        return val.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }
  }
  return val;
};

const validateImage = (value, { req }) => {
  if (req.file) return true;
  if (!value || (typeof value === 'string' && value.trim() === '')) return true;
  try {
    new URL(value);
    return true;
  } catch (e) {
    throw new Error('Image must be a valid URL');
  }
};

const createRecipeValidator = [
  body('title').trim().notEmpty().withMessage('Recipe title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').optional(),
  body('categories').optional().customSanitizer(parseJsonIfString),
  body('image').optional({ checkFalsy: true }).custom(validateImage),
  body('prepTime').optional().isInt({ min: 0 }).withMessage('Prep time must be a non-negative integer'),
  body('cookTime').optional().isInt({ min: 0 }).withMessage('Cook time must be a non-negative integer'),
  body('servings').optional().isInt({ min: 1 }).withMessage('Servings must be at least 1'),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('tags').optional().customSanitizer(parseJsonIfString).isArray().withMessage('Tags must be an array of strings'),
  body('ingredients').optional().customSanitizer(parseJsonIfString).isArray().withMessage('Ingredients must be an array'),
  body('ingredients.*.item').optional().notEmpty().withMessage('Ingredient item name is required'),
  body('instructions').optional().customSanitizer(parseJsonIfString).isArray().withMessage('Instructions must be an array of strings'),
  body('nutrition').optional().customSanitizer(parseJsonIfString).isObject().withMessage('Nutrition must be an object'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  body('isScheduled').optional(),
  body('is_scheduled').optional(),
  body('is_posting').optional(),
  body('scheduledDate').optional().isString(),
  body('scheduledTime').optional().isString(),
  body('seoTitle').optional().trim(),
  body('seoDescription').optional().trim(),
];

const updateRecipeValidator = [
  param('id').isMongoId().withMessage('Invalid recipe ID'),
  body('title').optional().trim().notEmpty().withMessage('Recipe title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional(),
  body('categories').optional().customSanitizer(parseJsonIfString),
  body('image').optional({ checkFalsy: true }).custom(validateImage),
  body('prepTime').optional().isInt({ min: 0 }).withMessage('Prep time must be a non-negative integer'),
  body('cookTime').optional().isInt({ min: 0 }).withMessage('Cook time must be a non-negative integer'),
  body('servings').optional().isInt({ min: 1 }).withMessage('Servings must be at least 1'),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('tags').optional().customSanitizer(parseJsonIfString).isArray().withMessage('Tags must be an array of strings'),
  body('ingredients').optional().customSanitizer(parseJsonIfString).isArray().withMessage('Ingredients must be an array'),
  body('instructions').optional().customSanitizer(parseJsonIfString).isArray().withMessage('Instructions must be an array of strings'),
  body('nutrition').optional().customSanitizer(parseJsonIfString).isObject().withMessage('Nutrition must be an object'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  body('isScheduled').optional(),
  body('is_scheduled').optional(),
  body('is_posting').optional(),
  body('scheduledDate').optional().isString(),
  body('scheduledTime').optional().isString(),
  body('seoTitle').optional().trim(),
  body('seoDescription').optional().trim(),
];

module.exports = {
  createRecipeValidator,
  updateRecipeValidator,
};

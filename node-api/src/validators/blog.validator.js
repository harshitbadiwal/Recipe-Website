const { body, param } = require('express-validator');

const createBlogValidator = [
  body('title').trim().notEmpty().withMessage('Blog title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('excerpt').optional().trim(),
  body('featuredImage').optional().isURL().withMessage('Featured image must be a valid URL'),
];

const updateBlogValidator = [
  param('id').isMongoId().withMessage('Invalid article ID'),
  body('title').optional().trim().notEmpty().withMessage('Blog title cannot be empty'),
  body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
];

module.exports = {
  createBlogValidator,
  updateBlogValidator,
};

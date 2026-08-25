const { body, param } = require('express-validator');

const updateProfileValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('bio').optional().trim(),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
];

const adminUpdateUserValidator = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('role').optional().isIn(['USER', 'ADMIN']).withMessage('Role must be USER or ADMIN'),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE']).withMessage('Status must be ACTIVE or INACTIVE'),
];

module.exports = {
  updateProfileValidator,
  adminUpdateUserValidator,
};

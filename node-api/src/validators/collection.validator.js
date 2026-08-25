const { body, param } = require('express-validator');

const createCollectionValidator = [
  body('name').trim().notEmpty().withMessage('Collection name is required'),
  body('description').optional().trim(),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
];

const updateCollectionValidator = [
  param('id').isMongoId().withMessage('Invalid collection ID'),
  body('name').optional().trim().notEmpty().withMessage('Collection name cannot be empty'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
];

module.exports = {
  createCollectionValidator,
  updateCollectionValidator,
};

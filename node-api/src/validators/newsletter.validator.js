const { body } = require('express-validator');

const newsletterValidator = [
  body('email').trim().isEmail().withMessage('Valid email address is required'),
];

module.exports = {
  newsletterValidator,
};

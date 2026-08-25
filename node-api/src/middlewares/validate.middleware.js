const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');
const HTTP_STATUS = require('../constants/httpStatusCodes');

const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return ApiResponse.error(
      res,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      'Validation failed',
      'VALIDATION_ERROR',
      formattedErrors
    );
  };
};

module.exports = validate;

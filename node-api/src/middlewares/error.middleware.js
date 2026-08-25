const ApiResponse = require('../utils/apiResponse');
const HTTP_STATUS = require('../constants/httpStatusCodes');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal server error';
  let errorCode = err.code || 'INTERNAL_ERROR';
  let errors = err.errors || null;

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Invalid format for ${err.path}`;
    errorCode = 'INVALID_ID';
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}`;
    errorCode = 'DUPLICATE_ENTRY';
  }

  // Handle JsonWebTokenError
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token';
    errorCode = 'UNAUTHORIZED';
  }

  // Log error stack in non-test mode if internal server error
  if (statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    logger.error('Unhandled Server Error:', err);
  }

  return ApiResponse.error(res, statusCode, message, errorCode, errors);
};

module.exports = errorHandler;

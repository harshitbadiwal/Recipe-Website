const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/apiResponse');
const HTTP_STATUS = require('../constants/httpStatusCodes');

const createLimiter = (windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests from this IP') => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      return ApiResponse.error(res, HTTP_STATUS.TOO_MANY_REQUESTS, message, 'TOO_MANY_REQUESTS');
    },
    skip: () => process.env.NODE_ENV === 'test',
  });
};

const apiLimiter = createLimiter(15 * 60 * 1000, 300, 'Too many requests. Please try again later.');
const authLimiter = createLimiter(15 * 60 * 1000, 20, 'Too many authentication attempts. Please try again later.');

module.exports = {
  apiLimiter,
  authLimiter,
};

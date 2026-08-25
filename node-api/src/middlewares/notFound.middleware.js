const ApiResponse = require('../utils/apiResponse');
const HTTP_STATUS = require('../constants/httpStatusCodes');

const notFoundHandler = (req, res, next) => {
  return ApiResponse.error(
    res,
    HTTP_STATUS.NOT_FOUND,
    `Route ${req.originalUrl} not found`,
    'ROUTE_NOT_FOUND'
  );
};

module.exports = notFoundHandler;

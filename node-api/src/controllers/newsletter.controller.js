const newsletterService = require('../services/newsletter.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class NewsletterController {
  subscribe = asyncWrapper(async (req, res) => {
    const subscriber = await newsletterService.subscribe(req.body.email);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Subscribed to newsletter successfully', subscriber);
  });

  unsubscribe = asyncWrapper(async (req, res) => {
    const subscriber = await newsletterService.unsubscribe(req.body.email);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Unsubscribed from newsletter successfully', subscriber);
  });
}

module.exports = new NewsletterController();

const newsletterService = require('../../services/newsletter.service');
const ApiResponse = require('../../utils/apiResponse');
const asyncWrapper = require('../../utils/asyncWrapper');
const HTTP_STATUS = require('../../constants/httpStatusCodes');

class AdminNewsletterController {
  getSubscribers = asyncWrapper(async (req, res) => {
    const { subscribers, meta } = await newsletterService.getSubscribersAdmin(req.query);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Newsletter subscribers fetched', subscribers, meta);
  });
}

module.exports = new AdminNewsletterController();

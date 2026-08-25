const homeService = require('../services/home.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class HomeController {
  getHomepageContent = asyncWrapper(async (req, res) => {
    const data = await homeService.getHomepageContent();
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Homepage payload fetched successfully', data);
  });
}

module.exports = new HomeController();

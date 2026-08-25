const userService = require('../services/user.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class UserController {
  getProfile = asyncWrapper(async (req, res) => {
    const user = await userService.getProfile(req.user._id);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Profile details fetched successfully', user);
  });

  updateProfile = asyncWrapper(async (req, res) => {
    const user = await userService.updateProfile(req.user._id, req.body);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Profile updated successfully', user);
  });
}

module.exports = new UserController();

const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class AuthController {
  register = asyncWrapper(async (req, res) => {
    const result = await authService.register(req.body);
    return ApiResponse.success(res, HTTP_STATUS.CREATED, 'User registered successfully', result);
  });

  login = asyncWrapper(async (req, res) => {
    const result = await authService.login(req.body);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Login successful', result);
  });

  logout = asyncWrapper(async (req, res) => {
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Logged out successfully');
  });

  me = asyncWrapper(async (req, res) => {
    const user = await authService.getCurrentUser(req.user._id);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Current user profile fetched', user);
  });
}

module.exports = new AuthController();

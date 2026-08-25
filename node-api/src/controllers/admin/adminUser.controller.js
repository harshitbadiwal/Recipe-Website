const userService = require('../../services/user.service');
const ApiResponse = require('../../utils/apiResponse');
const asyncWrapper = require('../../utils/asyncWrapper');
const HTTP_STATUS = require('../../constants/httpStatusCodes');

class AdminUserController {
  getAllUsers = asyncWrapper(async (req, res) => {
    const { users, meta } = await userService.getAllUsersAdmin(req.query);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Users list fetched for admin', users, meta);
  });

  getUserById = asyncWrapper(async (req, res) => {
    const user = await userService.getUserByIdAdmin(req.params.id);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'User details fetched', user);
  });

  updateUser = asyncWrapper(async (req, res) => {
    const user = await userService.updateUserAdmin(req.params.id, req.body);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'User updated successfully', user);
  });
}

module.exports = new AdminUserController();

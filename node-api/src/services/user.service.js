const userRepository = require('../repositories/user.repository');
const { NotFoundError, AppError } = require('../utils/apiError');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    // Security: Prevent updating sensitive fields via profile patch
    delete updateData.role;
    delete updateData.email;
    delete updateData.password;

    const user = await userRepository.updateById(userId, updateData);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  // Admin Methods
  async getAllUsersAdmin(queryParams = {}) {
    const { page = 1, limit = 20 } = queryParams;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const { users, total } = await userRepository.findAll({}, {
      page: pageNum,
      limit: limitNum,
    });

    return {
      users,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  async getUserByIdAdmin(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateUserAdmin(id, updateData) {
    // Admin can update status, role, and profile info
    delete updateData.password;
    const user = await userRepository.updateById(id, updateData);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}

module.exports = new UserService();

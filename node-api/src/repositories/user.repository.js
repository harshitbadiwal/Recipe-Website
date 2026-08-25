const User = require('../models/User.model');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+password');
    }
    return await query.exec();
  }

  async findById(id) {
    return await User.findById(id).exec();
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  }

  async findAll(filter = {}, options = {}) {
    const { page = 1, limit = 20, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      User.countDocuments(filter),
    ]);

    return { users, total };
  }
}

module.exports = new UserRepository();

const Comment = require('../models/Comment.model');
const COMMENT_STATUS = require('../constants/commentStatus');

class CommentRepository {
  async create(commentData) {
    return await Comment.create(commentData);
  }

  async findById(id) {
    return await Comment.findById(id).populate('user', 'name avatar').exec();
  }

  async findByRecipe(recipeId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;
    const filter = { recipe: recipeId, status: COMMENT_STATUS.APPROVED };

    const [comments, total] = await Promise.all([
      Comment.find(filter)
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Comment.countDocuments(filter),
    ]);

    return { comments, total };
  }

  async findAll(filter = {}, options = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find(filter)
        .populate('user', 'name email avatar')
        .populate('recipe', 'title slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Comment.countDocuments(filter),
    ]);

    return { comments, total };
  }

  async updateById(id, updateData) {
    return await Comment.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('user', 'name avatar')
      .exec();
  }

  async deleteById(id) {
    return await Comment.findByIdAndDelete(id).exec();
  }
}

module.exports = new CommentRepository();

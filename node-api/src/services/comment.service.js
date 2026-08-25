const commentRepository = require('../repositories/comment.repository');
const recipeRepository = require('../repositories/recipe.repository');
const { NotFoundError, AuthorizationError } = require('../utils/apiError');
const COMMENT_STATUS = require('../constants/commentStatus');
const ROLES = require('../constants/roles');

class CommentService {
  async getRecipeComments(recipeId, queryParams = {}) {
    const { page = 1, limit = 20 } = queryParams;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const { comments, total } = await commentRepository.findByRecipe(recipeId, {
      page: pageNum,
      limit: limitNum,
    });

    return {
      comments,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  async createComment(userId, user, recipeId, content) {
    const recipe = await recipeRepository.findById(recipeId);
    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }

    return await commentRepository.create({
      user: userId,
      userName: user.name,
      userAvatar: user.avatar || '',
      recipe: recipeId,
      content,
      status: COMMENT_STATUS.APPROVED,
    });
  }

  async updateComment(commentId, userId, userRole, content) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    if (comment.user._id.toString() !== userId.toString() && userRole !== ROLES.ADMIN) {
      throw new AuthorizationError('You can only edit your own comments');
    }

    return await commentRepository.updateById(commentId, { content });
  }

  async deleteComment(commentId, userId, userRole) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    if (comment.user._id.toString() !== userId.toString() && userRole !== ROLES.ADMIN) {
      throw new AuthorizationError('You can only delete your own comments');
    }

    return await commentRepository.deleteById(commentId);
  }

  // Admin Moderation
  async getAllCommentsAdmin(queryParams = {}) {
    const { page = 1, limit = 20, status } = queryParams;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const { comments, total } = await commentRepository.findAll(filter, {
      page: pageNum,
      limit: limitNum,
    });

    return {
      comments,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  async updateCommentStatusAdmin(commentId, status) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    if (!Object.values(COMMENT_STATUS).includes(status)) {
      throw new Error('Invalid comment moderation status');
    }

    return await commentRepository.updateById(commentId, { status });
  }
}

module.exports = new CommentService();

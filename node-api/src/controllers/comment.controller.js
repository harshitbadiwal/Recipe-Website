const commentService = require('../services/comment.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class CommentController {
  getRecipeComments = asyncWrapper(async (req, res) => {
    const { comments, meta } = await commentService.getRecipeComments(req.params.recipeId, req.query);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Comments fetched successfully', comments, meta);
  });

  createComment = asyncWrapper(async (req, res) => {
    const comment = await commentService.createComment(
      req.user._id,
      req.user,
      req.params.recipeId,
      req.body.content
    );
    return ApiResponse.success(res, HTTP_STATUS.CREATED, 'Comment posted successfully', comment);
  });

  updateComment = asyncWrapper(async (req, res) => {
    const comment = await commentService.updateComment(
      req.params.id,
      req.user._id,
      req.user.role,
      req.body.content
    );
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Comment updated successfully', comment);
  });

  deleteComment = asyncWrapper(async (req, res) => {
    await commentService.deleteComment(req.params.id, req.user._id, req.user.role);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Comment deleted successfully');
  });
}

module.exports = new CommentController();

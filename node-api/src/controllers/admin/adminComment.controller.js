const commentService = require('../../services/comment.service');
const ApiResponse = require('../../utils/apiResponse');
const asyncWrapper = require('../../utils/asyncWrapper');
const HTTP_STATUS = require('../../constants/httpStatusCodes');

class AdminCommentController {
  getAllComments = asyncWrapper(async (req, res) => {
    const { comments, meta } = await commentService.getAllCommentsAdmin(req.query);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Comments list fetched for moderation', comments, meta);
  });

  updateCommentStatus = asyncWrapper(async (req, res) => {
    const comment = await commentService.updateCommentStatusAdmin(req.params.id, req.body.status);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Comment status updated', comment);
  });

  deleteComment = asyncWrapper(async (req, res) => {
    await commentService.deleteComment(req.params.id, req.user._id, req.user.role);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Comment deleted by admin');
  });
}

module.exports = new AdminCommentController();

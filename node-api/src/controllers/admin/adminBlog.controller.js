const blogService = require('../../services/blog.service');
const ApiResponse = require('../../utils/apiResponse');
const asyncWrapper = require('../../utils/asyncWrapper');
const HTTP_STATUS = require('../../constants/httpStatusCodes');

class AdminBlogController {
  createBlog = asyncWrapper(async (req, res) => {
    const blog = await blogService.createBlog(req.body);
    return ApiResponse.success(res, HTTP_STATUS.CREATED, 'Article created successfully', blog);
  });

  getAllBlogs = asyncWrapper(async (req, res) => {
    const { blogs, meta } = await blogService.getAllBlogsAdmin(req.query);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Articles fetched for admin', blogs, meta);
  });

  getBlogById = asyncWrapper(async (req, res) => {
    const blog = await blogService.getBlogByIdAdmin(req.params.id);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Article details fetched', blog);
  });

  updateBlog = asyncWrapper(async (req, res) => {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Article updated successfully', blog);
  });

  deleteBlog = asyncWrapper(async (req, res) => {
    await blogService.deleteBlog(req.params.id);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Article deleted successfully');
  });
}

module.exports = new AdminBlogController();

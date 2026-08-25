const blogService = require('../services/blog.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class BlogController {
  getBlogs = asyncWrapper(async (req, res) => {
    const { blogs, meta } = await blogService.getBlogs(req.query);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Articles fetched successfully', blogs, meta);
  });

  getBlogBySlug = asyncWrapper(async (req, res) => {
    const blog = await blogService.getBlogBySlugOrId(req.params.slug);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Article details fetched successfully', blog);
  });

  searchBlogs = asyncWrapper(async (req, res) => {
    const { blogs, meta } = await blogService.getBlogs({ ...req.query, q: req.query.q || req.query.query });
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Search results fetched successfully', blogs, meta);
  });

  getRelatedBlogs = asyncWrapper(async (req, res) => {
    const blogs = await blogService.getRelatedBlogs(req.params.id, parseInt(req.query.limit, 10) || 3);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Related articles fetched successfully', blogs);
  });
}

module.exports = new BlogController();

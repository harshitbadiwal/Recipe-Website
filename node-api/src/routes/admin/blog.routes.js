const express = require('express');
const router = express.Router();
const adminBlogController = require('../../controllers/admin/adminBlog.controller');
const validate = require('../../middlewares/validate.middleware');
const { createBlogValidator, updateBlogValidator } = require('../../validators/blog.validator');

router.post('/', validate(createBlogValidator), adminBlogController.createBlog);
router.get('/', adminBlogController.getAllBlogs);
router.get('/:id', adminBlogController.getBlogById);
router.patch('/:id', validate(updateBlogValidator), adminBlogController.updateBlog);
router.delete('/:id', adminBlogController.deleteBlog);

module.exports = router;

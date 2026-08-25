const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');

router.get('/search', blogController.searchBlogs);
router.get('/', blogController.getBlogs);
router.get('/:slug', blogController.getBlogBySlug);
router.get('/:id/related', blogController.getRelatedBlogs);

module.exports = router;

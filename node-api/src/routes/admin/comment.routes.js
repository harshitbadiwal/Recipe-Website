const express = require('express');
const router = express.Router();
const adminCommentController = require('../../controllers/admin/adminComment.controller');

router.get('/', adminCommentController.getAllComments);
router.patch('/:id/status', adminCommentController.updateCommentStatus);
router.delete('/:id', adminCommentController.deleteComment);

module.exports = router;

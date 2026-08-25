const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateCommentValidator } = require('../validators/comment.validator');

router.use(authenticate);

router.patch('/:id', validate(updateCommentValidator), commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;

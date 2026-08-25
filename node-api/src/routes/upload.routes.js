const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const upload = require('../middlewares/upload.middleware');
const authenticate = require('../middlewares/auth.middleware');

// Upload single image binary file (field name: 'image' or 'file')
router.post('/image', authenticate, upload.single('image'), uploadController.uploadImage);
router.post('/file', authenticate, upload.single('file'), uploadController.uploadImage);

module.exports = router;

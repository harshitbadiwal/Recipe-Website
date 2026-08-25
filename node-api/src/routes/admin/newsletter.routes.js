const express = require('express');
const router = express.Router();
const adminNewsletterController = require('../../controllers/admin/adminNewsletter.controller');

router.get('/subscribers', adminNewsletterController.getSubscribers);

module.exports = router;

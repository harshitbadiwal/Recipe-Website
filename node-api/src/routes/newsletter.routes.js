const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');
const validate = require('../middlewares/validate.middleware');
const { newsletterValidator } = require('../validators/newsletter.validator');

router.post('/subscribe', validate(newsletterValidator), newsletterController.subscribe);
router.post('/unsubscribe', validate(newsletterValidator), newsletterController.unsubscribe);

module.exports = router;

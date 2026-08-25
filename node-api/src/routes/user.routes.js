const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateProfileValidator } = require('../validators/user.validator');

router.use(authenticate);

router.get('/me', userController.getProfile);
router.patch('/me', validate(updateProfileValidator), userController.updateProfile);

module.exports = router;

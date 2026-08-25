const express = require('express');
const router = express.Router();
const adminUserController = require('../../controllers/admin/adminUser.controller');
const validate = require('../../middlewares/validate.middleware');
const { adminUpdateUserValidator } = require('../../validators/user.validator');

router.get('/', adminUserController.getAllUsers);
router.get('/:id', adminUserController.getUserById);
router.patch('/:id', validate(adminUpdateUserValidator), adminUserController.updateUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const adminCategoryController = require('../../controllers/admin/adminCategory.controller');
const upload = require('../../middlewares/upload.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
  createCategoryValidator,
  updateCategoryValidator,
} = require('../../validators/category.validator');

router.post('/', upload.single('image'), validate(createCategoryValidator), adminCategoryController.createCategory);
router.get('/', adminCategoryController.getAllCategories);
router.get('/:id', adminCategoryController.getCategoryById);
router.patch('/:id', upload.single('image'), validate(updateCategoryValidator), adminCategoryController.updateCategory);
router.put('/:id', upload.single('image'), validate(updateCategoryValidator), adminCategoryController.updateCategory);
router.delete('/:id', adminCategoryController.deleteCategory);

module.exports = router;

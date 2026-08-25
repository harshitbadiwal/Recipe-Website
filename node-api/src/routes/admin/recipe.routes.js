const express = require('express');
const router = express.Router();
const adminRecipeController = require('../../controllers/admin/adminRecipe.controller');
const upload = require('../../middlewares/upload.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
  createRecipeValidator,
  updateRecipeValidator,
} = require('../../validators/recipe.validator');

router.post('/', upload.single('image'), validate(createRecipeValidator), adminRecipeController.createRecipe);
router.get('/', adminRecipeController.getAllRecipes);
router.get('/:id', adminRecipeController.getRecipeById);
router.patch('/:id', upload.single('image'), validate(updateRecipeValidator), adminRecipeController.updateRecipe);
router.put('/:id', upload.single('image'), validate(updateRecipeValidator), adminRecipeController.updateRecipe);
router.delete('/:id', adminRecipeController.deleteRecipe);

module.exports = router;

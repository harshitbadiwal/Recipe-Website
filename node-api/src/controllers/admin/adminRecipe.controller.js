const recipeService = require('../../services/recipe.service');
const { uploadToCloudinary } = require('../../utils/cloudinary');
const ApiResponse = require('../../utils/apiResponse');
const asyncWrapper = require('../../utils/asyncWrapper');
const HTTP_STATUS = require('../../constants/httpStatusCodes');

const parseJsonFields = (data) => {
  const result = { ...data };
  ['ingredients', 'instructions', 'nutrition', 'tags', 'categories'].forEach((field) => {
    if (typeof result[field] === 'string' && result[field].trim() !== '') {
      try {
        result[field] = JSON.parse(result[field]);
      } catch (e) {
        if (field === 'tags' || field === 'categories') {
          result[field] = result[field].split(',').map((t) => t.trim()).filter(Boolean);
        }
      }
    }
  });
  return result;
};

class AdminRecipeController {
  createRecipe = asyncWrapper(async (req, res) => {
    let recipeData = parseJsonFields(req.body);
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, 'recipes');
      recipeData.image = uploadRes.url;
    }
    const recipe = await recipeService.createRecipe(recipeData, req.user);
    return ApiResponse.success(res, HTTP_STATUS.CREATED, 'Recipe created successfully', recipe);
  });

  getAllRecipes = asyncWrapper(async (req, res) => {
    const { recipes, meta } = await recipeService.getAllRecipesAdmin(req.query);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'All recipes fetched for admin', recipes, meta);
  });

  getRecipeById = asyncWrapper(async (req, res) => {
    const recipe = await recipeService.getRecipeBySlugOrId(req.params.id, false);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Recipe details fetched for admin', recipe);
  });

  updateRecipe = asyncWrapper(async (req, res) => {
    let recipeData = parseJsonFields(req.body);
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, 'recipes');
      recipeData.image = uploadRes.url;
    }
    const recipe = await recipeService.updateRecipe(req.params.id, recipeData);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Recipe updated successfully', recipe);
  });

  deleteRecipe = asyncWrapper(async (req, res) => {
    await recipeService.deleteRecipe(req.params.id);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Recipe deleted successfully');
  });
}

module.exports = new AdminRecipeController();

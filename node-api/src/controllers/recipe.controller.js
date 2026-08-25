const recipeService = require('../services/recipe.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class RecipeController {
  // CREATE
  createRecipe = asyncWrapper(async (req, res) => {
    const recipe = await recipeService.createRecipe(req.body, req.user);
    return ApiResponse.success(res, HTTP_STATUS.CREATED, 'Recipe created successfully', recipe);
  });

  // READ ALL
  getRecipes = asyncWrapper(async (req, res) => {
    const { recipes, meta } = await recipeService.getRecipes(req.query);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Recipes fetched successfully', recipes, meta);
  });

  // READ ONE
  getRecipeBySlug = asyncWrapper(async (req, res) => {
    const recipe = await recipeService.getRecipeBySlugOrId(req.params.slug);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Recipe details fetched successfully', recipe);
  });

  // UPDATE
  updateRecipe = asyncWrapper(async (req, res) => {
    const recipe = await recipeService.updateRecipe(req.params.id, req.body, req.user);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Recipe updated successfully', recipe);
  });

  // DELETE
  deleteRecipe = asyncWrapper(async (req, res) => {
    await recipeService.deleteRecipe(req.params.id, req.user);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Recipe deleted successfully');
  });

  // FEATURED / LATEST / SEARCH / RELATED
  getFeaturedRecipes = asyncWrapper(async (req, res) => {
    const recipes = await recipeService.getFeaturedRecipes(parseInt(req.query.limit, 10) || 8);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Featured recipes fetched successfully', recipes);
  });

  getLatestRecipes = asyncWrapper(async (req, res) => {
    const recipes = await recipeService.getLatestRecipes(parseInt(req.query.limit, 10) || 8);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Latest recipes fetched successfully', recipes);
  });

  searchRecipes = asyncWrapper(async (req, res) => {
    const { recipes, meta } = await recipeService.getRecipes({ ...req.query, q: req.query.q || req.query.query });
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Search results fetched successfully', recipes, meta);
  });

  getRelatedRecipes = asyncWrapper(async (req, res) => {
    const recipes = await recipeService.getRelatedRecipes(req.params.id, parseInt(req.query.limit, 10) || 4);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Related recipes fetched successfully', recipes);
  });
}

module.exports = new RecipeController();

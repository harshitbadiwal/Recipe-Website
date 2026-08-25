const categoryService = require('../services/category.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class CategoryController {
  // CREATE
  createCategory = asyncWrapper(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    return ApiResponse.success(res, HTTP_STATUS.CREATED, 'Category created successfully', category);
  });

  // READ ALL
  getCategories = asyncWrapper(async (req, res) => {
    const categories = await categoryService.getCategories();
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Categories fetched successfully', categories);
  });

  // READ ONE
  getCategoryBySlug = asyncWrapper(async (req, res) => {
    const category = await categoryService.getCategoryBySlugOrId(req.params.slug);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Category details fetched successfully', category);
  });

  // UPDATE
  updateCategory = asyncWrapper(async (req, res) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Category updated successfully', category);
  });

  // DELETE
  deleteCategory = asyncWrapper(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Category deleted successfully');
  });

  // GET RECIPES BY CATEGORY
  getCategoryRecipes = asyncWrapper(async (req, res) => {
    const { category, recipes, total } = await categoryService.getCategoryRecipes(req.params.slug, {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    });
    return ApiResponse.success(res, HTTP_STATUS.OK, `Recipes for category '${category.name}' fetched`, recipes, {
      category,
      total,
    });
  });
}

module.exports = new CategoryController();

const categoryService = require('../../services/category.service');
const { uploadToCloudinary } = require('../../utils/cloudinary');
const ApiResponse = require('../../utils/apiResponse');
const asyncWrapper = require('../../utils/asyncWrapper');
const HTTP_STATUS = require('../../constants/httpStatusCodes');

class AdminCategoryController {
  createCategory = asyncWrapper(async (req, res) => {
    let categoryData = { ...req.body };
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, 'categories');
      categoryData.image = uploadRes.url;
    }
    const category = await categoryService.createCategory(categoryData);
    return ApiResponse.success(res, HTTP_STATUS.CREATED, 'Category created successfully', category);
  });

  getAllCategories = asyncWrapper(async (req, res) => {
    const { categories, meta } = await categoryService.getAllCategoriesAdmin(req.query);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Categories fetched for admin', categories, meta);
  });

  getCategoryById = asyncWrapper(async (req, res) => {
    const category = await categoryService.getCategoryByIdAdmin(req.params.id);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Category details fetched', category);
  });

  updateCategory = asyncWrapper(async (req, res) => {
    let categoryData = { ...req.body };
    if (req.file) {
      const uploadRes = await uploadToCloudinary(req.file.buffer, 'categories');
      categoryData.image = uploadRes.url;
    }
    const category = await categoryService.updateCategory(req.params.id, categoryData);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Category updated successfully', category);
  });

  deleteCategory = asyncWrapper(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Category deleted successfully');
  });
}

module.exports = new AdminCategoryController();

const categoryRepository = require('../repositories/category.repository');
const recipeRepository = require('../repositories/recipe.repository');
const createSlug = require('../utils/slugify');
const { NotFoundError, ConflictError, AppError } = require('../utils/apiError');
const HTTP_STATUS = require('../constants/httpStatusCodes');
const mongoose = require('mongoose');

class CategoryService {
  async getCategories(includeInactive = false) {
    const filter = includeInactive ? {} : { isActive: true };
    const { categories } = await categoryRepository.findAll(filter);
    return categories;
  }

  async getCategoryBySlugOrId(slugOrId) {
    let category = null;
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      category = await categoryRepository.findById(slugOrId);
    }
    if (!category) {
      category = await categoryRepository.findBySlug(slugOrId);
    }
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category;
  }

  async getCategoryRecipes(slugOrId, options = {}) {
    const category = await this.getCategoryBySlugOrId(slugOrId);
    const { recipes, total } = await recipeRepository.findAll(
      { category: category._id, isPublished: true },
      options
    );
    return { category, recipes, total };
  }

  // CREATE
  async createCategory(categoryData) {
    const slug = categoryData.slug ? createSlug(categoryData.slug) : createSlug(categoryData.name);

    const existingSlug = await categoryRepository.findBySlug(slug);
    if (existingSlug) {
      throw new ConflictError('Category with this name/slug already exists');
    }

    return await categoryRepository.create({
      ...categoryData,
      slug,
    });
  }

  async getAllCategoriesAdmin(queryParams = {}) {
    const { q, page = 1, limit = 20, sort = 'name_asc' } = queryParams;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const matchFilter = {};
    if (q) {
      matchFilter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    let sortObj = { name: 1 };
    if (sort === 'name_desc') sortObj = { name: -1 };
    if (sort === 'latest') sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };

    const result = await categoryRepository.aggregatePaginateAdmin(matchFilter, {
      page: pageNum,
      limit: limitNum,
      sort: sortObj,
    });

    return {
      categories: result.data,
      meta: result.meta,
    };
  }

  async getCategoryByIdAdmin(id) {
    return await this.getCategoryBySlugOrId(id);
  }

  // UPDATE
  async updateCategory(id, categoryData) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (categoryData.name && !categoryData.slug) {
      categoryData.slug = createSlug(categoryData.name);
    } else if (categoryData.slug) {
      categoryData.slug = createSlug(categoryData.slug);
    }

    if (categoryData.slug && categoryData.slug !== category.slug) {
      const existing = await categoryRepository.findBySlug(categoryData.slug);
      if (existing && existing._id.toString() !== id.toString()) {
        throw new ConflictError('Category slug already exists');
      }
    }

    return await categoryRepository.updateById(id, categoryData);
  }

  // DELETE
  async deleteCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // Safety check: Prevent deletion if recipes depend on this category
    const recipeCount = await recipeRepository.countByCategory(id);
    if (recipeCount > 0) {
      throw new AppError(
        `Cannot delete category '${category.name}' because it contains ${recipeCount} associated recipe(s). Reassign or remove recipes first.`,
        HTTP_STATUS.BAD_REQUEST,
        'CATEGORY_IN_USE'
      );
    }

    return await categoryRepository.deleteById(id);
  }
}

module.exports = new CategoryService();

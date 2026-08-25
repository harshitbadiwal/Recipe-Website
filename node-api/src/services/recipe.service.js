const recipeRepository = require('../repositories/recipe.repository');
const categoryRepository = require('../repositories/category.repository');
const createSlug = require('../utils/slugify');
const { NotFoundError, ConflictError, AuthorizationError } = require('../utils/apiError');
const ROLES = require('../constants/roles');
const mongoose = require('mongoose');

class RecipeService {
  async getRecipes(queryParams = {}) {
    const {
      q,
      category,
      tag,
      difficulty,
      minTime,
      maxTime,
      minRating,
      sort = 'latest',
      page = 1,
      limit = 20,
    } = queryParams;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const filter = { isPublished: true };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
        { categoryName: { $regex: q, $options: 'i' } },
      ];
    }

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const catObj = await categoryRepository.findBySlug(category);
        if (catObj) {
          filter.category = catObj._id;
        } else {
          filter.categoryName = { $regex: `^${category}$`, $options: 'i' };
        }
      }
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (difficulty) {
      filter.difficulty = new RegExp(`^${difficulty}$`, 'i');
    }

    if (minTime || maxTime) {
      filter.totalTime = {};
      if (minTime) filter.totalTime.$gte = parseInt(minTime, 10);
      if (maxTime) filter.totalTime.$lte = parseInt(maxTime, 10);
    }

    if (minRating) {
      filter.ratingAverage = { $gte: parseFloat(minRating) };
    }

    // Sort Mapping
    let sortObj = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'rating_desc':
        sortObj = { ratingAverage: -1, createdAt: -1 };
        break;
      case 'rating_asc':
        sortObj = { ratingAverage: 1, createdAt: -1 };
        break;
      case 'name_asc':
        sortObj = { title: 1 };
        break;
      case 'name_desc':
        sortObj = { title: -1 };
        break;
      case 'popular':
        sortObj = { ratingCount: -1, ratingAverage: -1 };
        break;
      case 'latest':
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    const { recipes, total } = await recipeRepository.findAll(filter, {
      page: pageNum,
      limit: limitNum,
      sort: sortObj,
    });

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      recipes,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    };
  }

  async getRecipeBySlugOrId(slugOrId) {
    let recipe = null;
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      recipe = await recipeRepository.findById(slugOrId);
    }
    if (!recipe) {
      recipe = await recipeRepository.findBySlug(slugOrId);
    }
    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }
    return recipe;
  }

  async getFeaturedRecipes(limit = 8) {
    return await recipeRepository.findFeatured(limit);
  }

  async getLatestRecipes(limit = 8) {
    return await recipeRepository.findLatest(limit);
  }

  async getRelatedRecipes(recipeIdOrSlug, limit = 4) {
    const recipe = await this.getRecipeBySlugOrId(recipeIdOrSlug);
    return await recipeRepository.findRelated(recipe, limit);
  }

  // CREATE
  async createRecipe(recipeData, authorUser) {
    let slug = recipeData.slug ? createSlug(recipeData.slug) : createSlug(recipeData.title);

    const existing = await recipeRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let categoryObj = null;
    if (recipeData.category) {
      if (mongoose.Types.ObjectId.isValid(recipeData.category)) {
        categoryObj = await categoryRepository.findById(recipeData.category);
      } else {
        categoryObj = await categoryRepository.findBySlug(recipeData.category);
      }
    }

    if (!categoryObj) {
      const categories = await categoryRepository.findAll({}, { limit: 1 });
      categoryObj = categories.categories[0];
    }

    const totalTime = (parseInt(recipeData.prepTime) || 15) + (parseInt(recipeData.cookTime) || 30);

    const recipeToSave = {
      ...recipeData,
      slug,
      category: categoryObj._id,
      categoryName: categoryObj.name,
      totalTime,
      author: authorUser ? authorUser._id : null,
      authorName: authorUser ? authorUser.name : 'Chef Master',
    };

    return await recipeRepository.create(recipeToSave);
  }

  // UPDATE
  async updateRecipe(id, recipeData, currentUser = null) {
    const recipe = await recipeRepository.findById(id);
    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }

    if (currentUser && currentUser.role !== ROLES.ADMIN) {
      if (!recipe.author || recipe.author._id.toString() !== currentUser._id.toString()) {
        throw new AuthorizationError('You can only update your own recipes');
      }
    }

    if (recipeData.title && !recipeData.slug) {
      recipeData.slug = createSlug(recipeData.title);
    } else if (recipeData.slug) {
      recipeData.slug = createSlug(recipeData.slug);
    }

    if (recipeData.slug && recipeData.slug !== recipe.slug) {
      const existing = await recipeRepository.findBySlug(recipeData.slug);
      if (existing && existing._id.toString() !== id.toString()) {
        throw new ConflictError('Recipe slug already exists');
      }
    }

    if (recipeData.category) {
      let categoryObj = null;
      if (mongoose.Types.ObjectId.isValid(recipeData.category)) {
        categoryObj = await categoryRepository.findById(recipeData.category);
      } else {
        categoryObj = await categoryRepository.findBySlug(recipeData.category);
      }

      if (categoryObj) {
        recipeData.category = categoryObj._id;
        recipeData.categoryName = categoryObj.name;
      }
    }

    if (recipeData.prepTime !== undefined || recipeData.cookTime !== undefined) {
      const prep = recipeData.prepTime !== undefined ? parseInt(recipeData.prepTime) : recipe.prepTime;
      const cook = recipeData.cookTime !== undefined ? parseInt(recipeData.cookTime) : recipe.cookTime;
      recipeData.totalTime = prep + cook;
    }

    return await recipeRepository.updateById(id, recipeData);
  }

  // DELETE
  async deleteRecipe(id, currentUser = null) {
    const recipe = await recipeRepository.findById(id);
    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }

    if (currentUser && currentUser.role !== ROLES.ADMIN) {
      if (!recipe.author || recipe.author._id.toString() !== currentUser._id.toString()) {
        throw new AuthorizationError('You can only delete your own recipes');
      }
    }

    return await recipeRepository.deleteById(id);
  }

  // ADMIN ALL RECIPES FETCH (AGGREGATE PAGINATED)
  async getAllRecipesAdmin(queryParams = {}) {
    const { q, category, difficulty, page = 1, limit = 20, sort = 'latest' } = queryParams;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const matchFilter = {};
    if (q) {
      matchFilter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { categoryName: { $regex: q, $options: 'i' } },
      ];
    }
    if (category) matchFilter.categoryName = { $regex: `^${category}$`, $options: 'i' };
    if (difficulty) matchFilter.difficulty = new RegExp(`^${difficulty}$`, 'i');

    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    if (sort === 'title_asc') sortObj = { title: 1 };
    if (sort === 'title_desc') sortObj = { title: -1 };

    const result = await recipeRepository.aggregatePaginateAdmin(matchFilter, {
      page: pageNum,
      limit: limitNum,
      sort: sortObj,
    });

    return {
      recipes: result.data,
      meta: result.meta,
    };
  }
}

module.exports = new RecipeService();

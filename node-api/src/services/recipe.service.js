const recipeRepository = require('../repositories/recipe.repository');
const categoryRepository = require('../repositories/category.repository');
const createSlug = require('../utils/slugify');
const { NotFoundError, ConflictError, AuthorizationError } = require('../utils/apiError');
const ROLES = require('../constants/roles');
const mongoose = require('mongoose');

class RecipeService {
  _getPublicVisibilityFilter() {
    const now = new Date();
    return {
      isPublished: true,
      $or: [
        { isScheduled: false },
        { isScheduled: { $exists: false } },
        { isScheduled: null },
        { scheduledAt: { $lte: now } },
      ],
    };
  }

  async _resolveCategories(recipeData) {
    let rawCategories = recipeData.categories !== undefined ? recipeData.categories : recipeData.category;
    if (typeof rawCategories === 'string') {
      try {
        const parsed = JSON.parse(rawCategories);
        if (Array.isArray(parsed)) rawCategories = parsed;
      } catch (e) {
        if (rawCategories.includes(',')) {
          rawCategories = rawCategories.split(',').map((s) => s.trim()).filter(Boolean);
        } else {
          rawCategories = [rawCategories.trim()];
        }
      }
    }
    if (!Array.isArray(rawCategories)) {
      rawCategories = rawCategories ? [rawCategories] : [];
    }
    rawCategories = rawCategories.filter(Boolean);

    const categoriesArr = [];
    const categoryNamesArr = [];

    for (const item of rawCategories) {
      let catObj = null;
      if (typeof item === 'object' && item !== null && item._id) {
        catObj = item;
      } else if (mongoose.Types.ObjectId.isValid(item)) {
        catObj = await categoryRepository.findById(item);
      } else if (typeof item === 'string') {
        catObj = await categoryRepository.findBySlug(item);
        if (!catObj) {
          const allCats = await categoryRepository.findAll({}, { limit: 100 });
          catObj = allCats.categories.find(
            (c) => c.name.toLowerCase() === item.toLowerCase() || c.slug.toLowerCase() === item.toLowerCase()
          );
        }
      }
      if (catObj) {
        if (!categoriesArr.some((id) => id.toString() === catObj._id.toString())) {
          categoriesArr.push(catObj._id);
          categoryNamesArr.push(catObj.name);
        }
      }
    }

    if (categoriesArr.length === 0) {
      const fallback = await categoryRepository.findAll({}, { limit: 1 });
      if (fallback.categories && fallback.categories.length > 0) {
        const catObj = fallback.categories[0];
        categoriesArr.push(catObj._id);
        categoryNamesArr.push(catObj.name);
      }
    }

    return {
      categories: categoriesArr,
      categoryNames: categoryNamesArr,
      category: categoriesArr[0] || null,
      categoryName: categoryNamesArr[0] || '',
    };
  }

  _resolveScheduling(recipeData, existingRecipe = null) {
    const isScheduledRaw = recipeData.isScheduled ?? recipeData.is_scheduled ?? recipeData.is_posting ?? (existingRecipe ? existingRecipe.isScheduled : false);
    const isScheduled = isScheduledRaw === true || isScheduledRaw === 'true' || isScheduledRaw === 1 || isScheduledRaw === '1';

    let scheduledDate = recipeData.scheduledDate ?? recipeData.scheduled_date ?? (existingRecipe ? existingRecipe.scheduledDate : '') ?? '';
    let scheduledTime = recipeData.scheduledTime ?? recipeData.scheduled_time ?? (existingRecipe ? existingRecipe.scheduledTime : '') ?? '';
    let scheduledAt = null;
    let isPublished = recipeData.isPublished !== undefined ? Boolean(recipeData.isPublished) : (existingRecipe ? existingRecipe.isPublished : true);

    if (isScheduled && scheduledDate) {
      const timeStr = scheduledTime || '00:00';
      scheduledAt = new Date(`${scheduledDate}T${timeStr}:00`);
      if (isNaN(scheduledAt.getTime())) {
        scheduledAt = new Date(scheduledDate);
      }

      if (scheduledAt && scheduledAt > new Date()) {
        isPublished = false;
      } else {
        isPublished = true;
      }
    } else {
      scheduledDate = '';
      scheduledTime = '';
      scheduledAt = null;
    }

    return {
      isScheduled: Boolean(isScheduled && scheduledAt && scheduledAt > new Date()),
      scheduledDate,
      scheduledTime,
      scheduledAt,
      isPublished,
    };
  }

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

    const filter = { ...this._getPublicVisibilityFilter() };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
        { categoryName: { $regex: q, $options: 'i' } },
        { categoryNames: { $regex: q, $options: 'i' } },
      ];
    }

    if (category) {
      const catOrArray = [];
      if (mongoose.Types.ObjectId.isValid(category)) {
        catOrArray.push({ category: category }, { categories: category });
      } else {
        const catObj = await categoryRepository.findBySlug(category);
        if (catObj) {
          catOrArray.push({ category: catObj._id }, { categories: catObj._id });
        }
        catOrArray.push(
          { categoryName: { $regex: `^${category}$`, $options: 'i' } },
          { categoryNames: { $regex: `^${category}$`, $options: 'i' } }
        );
      }
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: catOrArray }];
        delete filter.$or;
      } else {
        filter.$or = catOrArray;
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

  async getRecipeBySlugOrId(slugOrId, isPublicRequest = true) {
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

    if (isPublicRequest) {
      const now = new Date();
      if (!recipe.isPublished) {
        throw new NotFoundError('Recipe not found');
      }
      if (recipe.isScheduled && recipe.scheduledAt && recipe.scheduledAt > now) {
        throw new NotFoundError('Recipe not found');
      }
    }

    return recipe;
  }

  async getFeaturedRecipes(limit = 8) {
    return await recipeRepository.findFeatured(this._getPublicVisibilityFilter(), limit);
  }

  async getLatestRecipes(limit = 8) {
    return await recipeRepository.findLatest(this._getPublicVisibilityFilter(), limit);
  }

  async getRelatedRecipes(recipeIdOrSlug, limit = 4) {
    const recipe = await this.getRecipeBySlugOrId(recipeIdOrSlug, true);
    return await recipeRepository.findRelated(recipe, this._getPublicVisibilityFilter(), limit);
  }

  // CREATE
  async createRecipe(recipeData, authorUser) {
    let slug = recipeData.slug ? createSlug(recipeData.slug) : createSlug(recipeData.title);

    const existing = await recipeRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const catData = await this._resolveCategories(recipeData);
    const schedData = this._resolveScheduling(recipeData);

    const totalTime = (parseInt(recipeData.prepTime) || 15) + (parseInt(recipeData.cookTime) || 30);

    const recipeToSave = {
      ...recipeData,
      ...catData,
      ...schedData,
      slug,
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

    if (recipeData.category !== undefined || recipeData.categories !== undefined) {
      const catData = await this._resolveCategories(recipeData);
      Object.assign(recipeData, catData);
    }

    const schedData = this._resolveScheduling(recipeData, recipe);
    Object.assign(recipeData, schedData);

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
        { categoryNames: { $regex: q, $options: 'i' } },
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

const favoriteRepository = require('../repositories/favorite.repository');
const recipeRepository = require('../repositories/recipe.repository');
const { NotFoundError, ConflictError } = require('../utils/apiError');
const mongoose = require('mongoose');

class FavoriteService {
  async addFavorite(userId, recipeIdentifier) {
    let recipe;
    if (mongoose.Types.ObjectId.isValid(recipeIdentifier)) {
      recipe = await recipeRepository.findById(recipeIdentifier);
    }
    if (!recipe) {
      recipe = await recipeRepository.findBySlug(recipeIdentifier);
    }
    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }

    const existing = await favoriteRepository.findOne(userId, recipe._id);
    if (existing) {
      throw new ConflictError('Recipe is already in your favorites');
    }

    return await favoriteRepository.add(userId, recipe._id);
  }

  async removeFavorite(userId, recipeIdentifier) {
    let recipe;
    if (mongoose.Types.ObjectId.isValid(recipeIdentifier)) {
      recipe = await recipeRepository.findById(recipeIdentifier);
    }
    if (!recipe) {
      recipe = await recipeRepository.findBySlug(recipeIdentifier);
    }
    const targetRecipeId = recipe ? recipe._id : (mongoose.Types.ObjectId.isValid(recipeIdentifier) ? recipeIdentifier : null);
    if (!targetRecipeId) {
      throw new NotFoundError('Recipe not found');
    }

    const favorite = await favoriteRepository.findOne(userId, targetRecipeId);
    if (!favorite) {
      throw new NotFoundError('Favorite not found in your list');
    }

    return await favoriteRepository.remove(userId, targetRecipeId);
  }

  async isFavorite(userId, recipeIdentifier) {
    let recipe;
    if (mongoose.Types.ObjectId.isValid(recipeIdentifier)) {
      recipe = await recipeRepository.findById(recipeIdentifier);
    }
    if (!recipe) {
      recipe = await recipeRepository.findBySlug(recipeIdentifier);
    }
    if (!recipe) return false;

    const favorite = await favoriteRepository.findOne(userId, recipe._id);
    return !!favorite;
  }

  async getUserFavorites(userId, queryParams = {}) {
    const { page = 1, limit = 20 } = queryParams;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const { favorites, total } = await favoriteRepository.findByUser(userId, {
      page: pageNum,
      limit: limitNum,
    });

    return {
      favorites: favorites
        .filter((f) => Boolean(f.recipe))
        .map((f) => {
          const recipeObj = typeof f.recipe.toObject === 'function' ? f.recipe.toObject() : f.recipe;
          const { _id: recipeId, ...restRecipe } = recipeObj;
          return {
            _id: f._id,
            recipe_id: recipeId,
            ...restRecipe,
          };
        }),
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }
}

module.exports = new FavoriteService();

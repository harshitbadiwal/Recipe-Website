const favoriteRepository = require('../repositories/favorite.repository');
const recipeRepository = require('../repositories/recipe.repository');
const { NotFoundError, ConflictError } = require('../utils/apiError');

class FavoriteService {
  async addFavorite(userId, recipeId) {
    const recipe = await recipeRepository.findById(recipeId);
    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }

    const existing = await favoriteRepository.findOne(userId, recipeId);
    if (existing) {
      throw new ConflictError('Recipe is already in your favorites');
    }

    return await favoriteRepository.add(userId, recipeId);
  }

  async removeFavorite(userId, recipeId) {
    const favorite = await favoriteRepository.findOne(userId, recipeId);
    if (!favorite) {
      throw new NotFoundError('Favorite not found');
    }

    return await favoriteRepository.remove(userId, recipeId);
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
      favorites: favorites.map((f) => f.recipe).filter(Boolean),
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

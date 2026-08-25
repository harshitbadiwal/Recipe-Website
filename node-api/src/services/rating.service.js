const ratingRepository = require('../repositories/rating.repository');
const recipeRepository = require('../repositories/recipe.repository');
const { NotFoundError, AppError } = require('../utils/apiError');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class RatingService {
  async addOrUpdateRating(userId, recipeId, score, review) {
    if (score < 1 || score > 5) {
      throw new AppError('Rating score must be between 1 and 5', HTTP_STATUS.BAD_REQUEST);
    }

    const recipe = await recipeRepository.findById(recipeId);
    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }

    const rating = await ratingRepository.upsert(userId, recipeId, score, review);
    await this.recalculateRecipeRating(recipeId);

    return rating;
  }

  async removeRating(userId, recipeId) {
    const rating = await ratingRepository.findOne(userId, recipeId);
    if (!rating) {
      throw new NotFoundError('Rating not found');
    }

    await ratingRepository.remove(userId, recipeId);
    await this.recalculateRecipeRating(recipeId);

    return { message: 'Rating removed successfully' };
  }

  async getRecipeRatings(recipeId, queryParams = {}) {
    const { page = 1, limit = 20 } = queryParams;
    const { ratings, total } = await ratingRepository.findByRecipe(recipeId, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    const summary = await ratingRepository.getAverageRating(recipeId);

    return {
      ratings,
      summary,
      meta: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
      },
    };
  }

  async recalculateRecipeRating(recipeId) {
    const { average, count } = await ratingRepository.getAverageRating(recipeId);
    await recipeRepository.updateById(recipeId, {
      ratingAverage: average > 0 ? average : 4.5,
      ratingCount: count,
    });
  }
}

module.exports = new RatingService();

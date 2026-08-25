const ratingService = require('../services/rating.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class RatingController {
  addOrUpdateRating = asyncWrapper(async (req, res) => {
    const rating = await ratingService.addOrUpdateRating(
      req.user._id,
      req.params.recipeId,
      req.body.score,
      req.body.review
    );
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Rating submitted successfully', rating);
  });

  removeRating = asyncWrapper(async (req, res) => {
    await ratingService.removeRating(req.user._id, req.params.recipeId);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Rating deleted successfully');
  });

  getRecipeRatings = asyncWrapper(async (req, res) => {
    const { ratings, summary, meta } = await ratingService.getRecipeRatings(req.params.recipeId, req.query);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Ratings fetched successfully', { ratings, summary }, meta);
  });
}

module.exports = new RatingController();

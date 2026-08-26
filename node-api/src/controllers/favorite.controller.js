const favoriteService = require('../services/favorite.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class FavoriteController {
  addFavorite = asyncWrapper(async (req, res) => {
    const favorite = await favoriteService.addFavorite(req.user._id, req.params.recipeId);
    return ApiResponse.success(res, HTTP_STATUS.CREATED, 'Recipe added to favorites', favorite);
  });

  removeFavorite = asyncWrapper(async (req, res) => {
    await favoriteService.removeFavorite(req.user._id, req.params.recipeId);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Recipe removed from favorites');
  });

  getFavorites = asyncWrapper(async (req, res) => {
    const { favorites, meta } = await favoriteService.getUserFavorites(req.user._id, req.query);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'User favorites fetched successfully', favorites, meta);
  });

  checkFavorite = asyncWrapper(async (req, res) => {
    const isFavorite = await favoriteService.isFavorite(req.user._id, req.params.recipeId);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Favorite status checked', { isFavorite });
  });
}

module.exports = new FavoriteController();

const collectionService = require('../services/collection.service');
const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../utils/asyncWrapper');
const HTTP_STATUS = require('../constants/httpStatusCodes');

class CollectionController {
  createCollection = asyncWrapper(async (req, res) => {
    const collection = await collectionService.createCollection(req.user._id, req.body);
    return ApiResponse.success(res, HTTP_STATUS.CREATED, 'Collection created successfully', collection);
  });

  getUserCollections = asyncWrapper(async (req, res) => {
    const { collections, meta } = await collectionService.getUserCollections(req.user._id, req.query);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Collections fetched successfully', collections, meta);
  });

  getCollectionById = asyncWrapper(async (req, res) => {
    const userId = req.user ? req.user._id : null;
    const collection = await collectionService.getCollectionById(req.params.id, userId);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Collection details fetched', collection);
  });

  updateCollection = asyncWrapper(async (req, res) => {
    const collection = await collectionService.updateCollection(req.params.id, req.user._id, req.body);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Collection updated successfully', collection);
  });

  deleteCollection = asyncWrapper(async (req, res) => {
    await collectionService.deleteCollection(req.params.id, req.user._id);
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Collection deleted successfully');
  });

  addRecipeToCollection = asyncWrapper(async (req, res) => {
    const collection = await collectionService.addRecipeToCollection(
      req.params.id,
      req.user._id,
      req.params.recipeId
    );
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Recipe added to collection', collection);
  });

  removeRecipeFromCollection = asyncWrapper(async (req, res) => {
    const collection = await collectionService.removeRecipeFromCollection(
      req.params.id,
      req.user._id,
      req.params.recipeId
    );
    return ApiResponse.success(res, HTTP_STATUS.OK, 'Recipe removed from collection', collection);
  });
}

module.exports = new CollectionController();

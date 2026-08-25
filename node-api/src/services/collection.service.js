const collectionRepository = require('../repositories/collection.repository');
const recipeRepository = require('../repositories/recipe.repository');
const { NotFoundError, AuthorizationError } = require('../utils/apiError');

class CollectionService {
  async createCollection(userId, collectionData) {
    return await collectionRepository.create({
      ...collectionData,
      user: userId,
    });
  }

  async getUserCollections(userId, queryParams = {}) {
    const { page = 1, limit = 20 } = queryParams;
    const { collections, total } = await collectionRepository.findByUser(userId, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    return {
      collections,
      meta: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
      },
    };
  }

  async getCollectionById(collectionId, userId = null) {
    const collection = await collectionRepository.findById(collectionId);
    if (!collection) {
      throw new NotFoundError('Collection not found');
    }

    if (!collection.isPublic && (!userId || collection.user._id.toString() !== userId.toString())) {
      throw new AuthorizationError('This collection is private');
    }

    return collection;
  }

  async updateCollection(collectionId, userId, updateData) {
    const collection = await collectionRepository.findById(collectionId);
    if (!collection) {
      throw new NotFoundError('Collection not found');
    }

    if (collection.user._id.toString() !== userId.toString()) {
      throw new AuthorizationError('You can only update your own collections');
    }

    return await collectionRepository.updateById(collectionId, updateData);
  }

  async deleteCollection(collectionId, userId) {
    const collection = await collectionRepository.findById(collectionId);
    if (!collection) {
      throw new NotFoundError('Collection not found');
    }

    if (collection.user._id.toString() !== userId.toString()) {
      throw new AuthorizationError('You can only delete your own collections');
    }

    return await collectionRepository.deleteById(collectionId);
  }

  async addRecipeToCollection(collectionId, userId, recipeId) {
    const collection = await collectionRepository.findById(collectionId);
    if (!collection) {
      throw new NotFoundError('Collection not found');
    }

    if (collection.user._id.toString() !== userId.toString()) {
      throw new AuthorizationError('You can only modify your own collections');
    }

    const recipe = await recipeRepository.findById(recipeId);
    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }

    return await collectionRepository.addRecipe(collectionId, recipeId);
  }

  async removeRecipeFromCollection(collectionId, userId, recipeId) {
    const collection = await collectionRepository.findById(collectionId);
    if (!collection) {
      throw new NotFoundError('Collection not found');
    }

    if (collection.user._id.toString() !== userId.toString()) {
      throw new AuthorizationError('You can only modify your own collections');
    }

    return await collectionRepository.removeRecipe(collectionId, recipeId);
  }
}

module.exports = new CollectionService();

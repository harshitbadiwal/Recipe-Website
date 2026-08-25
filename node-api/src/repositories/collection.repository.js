const Collection = require('../models/Collection.model');

class CollectionRepository {
  async create(collectionData) {
    return await Collection.create(collectionData);
  }

  async findById(id) {
    return await Collection.findById(id)
      .populate('user', 'name avatar')
      .populate({
        path: 'recipes',
        populate: { path: 'category', select: 'name slug' },
      })
      .exec();
  }

  async findByUser(userId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const [collections, total] = await Promise.all([
      Collection.find({ user: userId })
        .populate('recipes', 'title slug image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Collection.countDocuments({ user: userId }),
    ]);

    return { collections, total };
  }

  async updateById(id, updateData) {
    return await Collection.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('recipes', 'title slug image')
      .exec();
  }

  async deleteById(id) {
    return await Collection.findByIdAndDelete(id).exec();
  }

  async addRecipe(collectionId, recipeId) {
    return await Collection.findByIdAndUpdate(
      collectionId,
      { $addToSet: { recipes: recipeId } },
      { new: true }
    )
      .populate('recipes', 'title slug image')
      .exec();
  }

  async removeRecipe(collectionId, recipeId) {
    return await Collection.findByIdAndUpdate(
      collectionId,
      { $pull: { recipes: recipeId } },
      { new: true }
    )
      .populate('recipes', 'title slug image')
      .exec();
  }
}

module.exports = new CollectionRepository();

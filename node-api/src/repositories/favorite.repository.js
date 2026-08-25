const Favorite = require('../models/Favorite.model');

class FavoriteRepository {
  async add(userId, recipeId) {
    return await Favorite.create({ user: userId, recipe: recipeId });
  }

  async remove(userId, recipeId) {
    return await Favorite.findOneAndDelete({ user: userId, recipe: recipeId }).exec();
  }

  async findOne(userId, recipeId) {
    return await Favorite.findOne({ user: userId, recipe: recipeId }).exec();
  }

  async findByUser(userId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      Favorite.find({ user: userId })
        .populate({
          path: 'recipe',
          populate: { path: 'category', select: 'name slug' },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Favorite.countDocuments({ user: userId }),
    ]);

    return { favorites, total };
  }
}

module.exports = new FavoriteRepository();

const Rating = require('../models/Rating.model');

class RatingRepository {
  async upsert(userId, recipeId, score, review = '') {
    return await Rating.findOneAndUpdate(
      { user: userId, recipe: recipeId },
      { score, review },
      { upsert: true, new: true, runValidators: true }
    ).exec();
  }

  async remove(userId, recipeId) {
    return await Rating.findOneAndDelete({ user: userId, recipe: recipeId }).exec();
  }

  async findOne(userId, recipeId) {
    return await Rating.findOne({ user: userId, recipe: recipeId }).exec();
  }

  async findByRecipe(recipeId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      Rating.find({ recipe: recipeId })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Rating.countDocuments({ recipe: recipeId }),
    ]);

    return { ratings, total };
  }

  async getAverageRating(recipeId) {
    const result = await Rating.aggregate([
      { $match: { recipe: recipeId } },
      {
        $group: {
          _id: '$recipe',
          avgScore: { $avg: '$score' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      return {
        average: parseFloat(result[0].avgScore.toFixed(1)),
        count: result[0].count,
      };
    }

    return { average: 0, count: 0 };
  }
}

module.exports = new RatingRepository();

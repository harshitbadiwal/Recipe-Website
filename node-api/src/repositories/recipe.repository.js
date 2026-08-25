const Recipe = require('../models/Recipe.model');
const aggregatePaginate = require('../utils/aggregatePaginate');

class RecipeRepository {
  async create(recipeData) {
    return await Recipe.create(recipeData);
  }

  async findBySlug(slug) {
    return await Recipe.findOne({ slug: slug.toLowerCase() }).populate('category', 'name slug image').exec();
  }

  async findById(id) {
    return await Recipe.findById(id).populate('category', 'name slug image').exec();
  }

  async findAll(filter = {}, options = {}) {
    const { page = 1, limit = 20, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const [recipes, total] = await Promise.all([
      Recipe.find(filter)
        .populate('category', 'name slug image')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      Recipe.countDocuments(filter),
    ]);

    return { recipes, total };
  }

  /**
   * Aggregate Pagination for Admin Recipe Listing
   */
  async aggregatePaginateAdmin(matchFilter = {}, options = {}) {
    const pipeline = [
      { $match: matchFilter },
      // Join Category
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
      // Join Comments Count
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'recipe',
          as: 'comments',
        },
      },
      {
        $addFields: {
          commentsCount: { $size: '$comments' },
        },
      },
      {
        $project: {
          comments: 0,
        },
      },
    ];

    const sort = options.sort || { createdAt: -1 };
    return await aggregatePaginate(Recipe, pipeline, { ...options, sort });
  }

  async findFeatured(limit = 8) {
    return await Recipe.find({ isFeatured: true, isPublished: true })
      .populate('category', 'name slug image')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findLatest(limit = 8) {
    return await Recipe.find({ isPublished: true })
      .populate('category', 'name slug image')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findRelated(recipe, limit = 4) {
    return await Recipe.find({
      _id: { $ne: recipe._id },
      isPublished: true,
      $or: [
        { category: recipe.category },
        { difficulty: recipe.difficulty },
        { tags: { $in: recipe.tags || [] } },
      ],
    })
      .populate('category', 'name slug image')
      .limit(limit)
      .exec();
  }

  async countByCategory(categoryId) {
    return await Recipe.countDocuments({ category: categoryId });
  }

  async updateById(id, updateData) {
    return await Recipe.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('category', 'name slug image')
      .exec();
  }

  async deleteById(id) {
    return await Recipe.findByIdAndDelete(id).exec();
  }
}

module.exports = new RecipeRepository();

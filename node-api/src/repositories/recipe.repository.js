const Recipe = require('../models/Recipe.model');
const aggregatePaginate = require('../utils/aggregatePaginate');

class RecipeRepository {
  async create(recipeData) {
    return await Recipe.create(recipeData);
  }

  async findBySlug(slug) {
    return await Recipe.findOne({ slug: slug.toLowerCase(), is_deleted: false })
      .populate('category', 'name slug image')
      .populate('categories', 'name slug image')
      .populate('subCategory', 'name slug image parentCategory')
      .populate('subCategories', 'name slug image parentCategory')
      .exec();
  }

  async findById(id) {
    return await Recipe.findOne({ _id: id, is_deleted: false })
      .populate('category', 'name slug image')
      .populate('categories', 'name slug image')
      .populate('subCategory', 'name slug image parentCategory')
      .populate('subCategories', 'name slug image parentCategory')
      .exec();
  }

  async findAll(filter = {}, options = {}) {
    const { page = 1, limit = 20, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const queryFilter = { is_deleted: false, ...filter };

    const [recipes, total] = await Promise.all([
      Recipe.find(queryFilter)
        .populate('category', 'name slug image')
        .populate('categories', 'name slug image')
        .populate('subCategory', 'name slug image parentCategory')
        .populate('subCategories', 'name slug image parentCategory')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      Recipe.countDocuments(queryFilter),
    ]);

    return { recipes, total };
  }

  /**
   * Aggregate Pagination for Admin Recipe Listing
   */
  async aggregatePaginateAdmin(matchFilter = {}, options = {}) {
    const pipeline = [
      { $match: { is_deleted: false, ...matchFilter } },
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
      // Join Categories
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories',
        },
      },
      // Join SubCategory
      {
        $lookup: {
          from: 'categories',
          localField: 'subCategory',
          foreignField: '_id',
          as: 'subCategory',
        },
      },
      {
        $unwind: {
          path: '$subCategory',
          preserveNullAndEmptyArrays: true,
        },
      },
      // Join SubCategories
      {
        $lookup: {
          from: 'categories',
          localField: 'subCategories',
          foreignField: '_id',
          as: 'subCategories',
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

  async findFeatured(filter = {}, limit = 8) {
    return await Recipe.find({ is_deleted: false, isFeatured: true, ...filter })
      .populate('category', 'name slug image')
      .populate('categories', 'name slug image')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findLatest(filter = {}, limit = 8) {
    return await Recipe.find({ is_deleted: false, ...filter })
      .populate('category', 'name slug image')
      .populate('categories', 'name slug image')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findRelated(recipe, extraFilter = {}, limit = 4) {
    return await Recipe.find({
      _id: { $ne: recipe._id },
      is_deleted: false,
      ...extraFilter,
      $or: [
        { categories: { $in: recipe.categories && recipe.categories.length ? recipe.categories : [recipe.category] } },
        { category: recipe.category },
        { difficulty: recipe.difficulty },
        { tags: { $in: recipe.tags || [] } },
      ],
    })
      .populate('category', 'name slug image')
      .populate('categories', 'name slug image')
      .limit(limit)
      .exec();
  }

  async countByCategory(categoryId) {
    return await Recipe.countDocuments({
      is_deleted: false,
      $or: [{ category: categoryId }, { categories: categoryId }],
    });
  }

  async updateById(id, updateData) {
    return await Recipe.findOneAndUpdate({ _id: id, is_deleted: false }, updateData, { new: true, runValidators: true })
      .populate('category', 'name slug image')
      .populate('categories', 'name slug image')
      .exec();
  }

  async deleteById(id) {
    return await Recipe.findOneAndUpdate({ _id: id, is_deleted: false }, { is_deleted: true }, { new: true }).exec();
  }
}

module.exports = new RecipeRepository();

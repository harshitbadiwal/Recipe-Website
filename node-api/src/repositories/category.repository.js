const Category = require('../models/Category.model');
const aggregatePaginate = require('../utils/aggregatePaginate');

class CategoryRepository {
  async create(categoryData) {
    return await Category.create(categoryData);
  }

  async findBySlug(slug) {
    return await Category.findOne({ slug: slug.toLowerCase() }).exec();
  }

  async findById(id) {
    return await Category.findById(id).exec();
  }

  async findByName(name) {
    return await Category.findOne({ name: new RegExp(`^${name}$`, 'i') }).exec();
  }

  async findAll(filter = {}, options = {}) {
    const { page, limit, sort = { name: 1 } } = options;
    let query = Category.find(filter).sort(sort);

    if (page && limit) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const [categories, total] = await Promise.all([
      query.exec(),
      Category.countDocuments(filter),
    ]);

    return { categories, total };
  }

  /**
   * Aggregate Pagination for Admin Category Listing with associated recipe counts
   */
  async aggregatePaginateAdmin(matchFilter = {}, options = {}) {
    const pipeline = [
      { $match: matchFilter },
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'category',
          as: 'recipes',
        },
      },
      {
        $addFields: {
          recipeCount: { $size: '$recipes' },
        },
      },
      {
        $project: {
          recipes: 0,
        },
      },
    ];

    const sort = options.sort || { createdAt: -1 };
    return await aggregatePaginate(Category, pipeline, { ...options, sort });
  }

  async updateById(id, updateData) {
    return await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  }

  async deleteById(id) {
    return await Category.findByIdAndDelete(id).exec();
  }
}

module.exports = new CategoryRepository();

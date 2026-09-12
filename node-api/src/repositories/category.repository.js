const Category = require('../models/Category.model');
const aggregatePaginate = require('../utils/aggregatePaginate');

class CategoryRepository {
  async create(categoryData) {
    return await Category.create(categoryData);
  }

  async findBySlug(slug) {
    return await Category.findOne({ slug: slug.toLowerCase() })
      .populate('parentCategory', 'name slug image')
      .populate('subcategories', 'name slug image description')
      .exec();
  }

  async findById(id) {
    return await Category.findById(id)
      .populate('parentCategory', 'name slug image')
      .populate('subcategories', 'name slug image description')
      .exec();
  }

  async findByName(name) {
    return await Category.findOne({ name: new RegExp(`^${name}$`, 'i') })
      .populate('parentCategory', 'name slug image')
      .populate('subcategories', 'name slug image description')
      .exec();
  }

  async findAll(filter = {}, options = {}) {
    const { page, limit, sort = { name: 1 } } = options;
    let query = Category.find(filter)
      .populate('parentCategory', 'name slug image')
      .populate('subcategories', 'name slug image description')
      .sort(sort);

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
   * Aggregate Pagination for Admin Category Listing with associated recipe counts and parent details
   */
  async aggregatePaginateAdmin(matchFilter = {}, options = {}) {
    const pipeline = [
      { $match: matchFilter },
      {
        $lookup: {
          from: 'categories',
          localField: 'parentCategory',
          foreignField: '_id',
          as: 'parentCategoryDoc',
        },
      },
      {
        $unwind: {
          path: '$parentCategoryDoc',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'parentCategory',
          as: 'childSubcategories',
        },
      },
      {
        $lookup: {
          from: 'recipes',
          let: { catId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$category', '$$catId'] },
                    { $in: ['$$catId', { $ifNull: ['$categories', []] }] },
                    { $eq: ['$subCategory', '$$catId'] },
                    { $in: ['$$catId', { $ifNull: ['$subCategories', []] }] },
                  ],
                },
              },
            },
          ],
          as: 'recipes',
        },
      },
      {
        $addFields: {
          parentCategoryName: { $ifNull: ['$parentCategoryDoc.name', '$parentCategoryName'] },
          subcategoriesCount: { $size: '$childSubcategories' },
          recipeCount: { $size: '$recipes' },
        },
      },
      {
        $project: {
          recipes: 0,
          childSubcategories: 0,
          parentCategoryDoc: 0,
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

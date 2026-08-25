const Blog = require('../models/Blog.model');

class BlogRepository {
  async create(blogData) {
    return await Blog.create(blogData);
  }

  async findBySlug(slug) {
    return await Blog.findOne({ slug: slug.toLowerCase() }).exec();
  }

  async findById(id) {
    return await Blog.findById(id).exec();
  }

  async findAll(filter = {}, options = {}) {
    const { page = 1, limit = 20, sort = { publishedAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      Blog.countDocuments(filter),
    ]);

    return { blogs, total };
  }

  async findRelated(blog, limit = 3) {
    return await Blog.find({
      _id: { $ne: blog._id },
      isPublished: true,
      $or: [{ category: blog.category }, { tags: { $in: blog.tags || [] } }],
    })
      .limit(limit)
      .exec();
  }

  async updateById(id, updateData) {
    return await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  }

  async deleteById(id) {
    return await Blog.findByIdAndDelete(id).exec();
  }
}

module.exports = new BlogRepository();

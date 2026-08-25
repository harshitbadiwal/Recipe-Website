const blogRepository = require('../repositories/blog.repository');
const createSlug = require('../utils/slugify');
const { NotFoundError, ConflictError } = require('../utils/apiError');
const mongoose = require('mongoose');

class BlogService {
  async getBlogs(queryParams = {}) {
    const { page = 1, limit = 20, q, category } = queryParams;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const filter = { isPublished: true };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    const { blogs, total } = await blogRepository.findAll(filter, {
      page: pageNum,
      limit: limitNum,
      sort: { publishedAt: -1 },
    });

    return {
      blogs,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  async getBlogBySlugOrId(slugOrId) {
    let blog = null;
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      blog = await blogRepository.findById(slugOrId);
    }
    if (!blog) {
      blog = await blogRepository.findBySlug(slugOrId);
    }
    if (!blog || !blog.isPublished) {
      throw new NotFoundError('Article not found');
    }
    return blog;
  }

  async getRelatedBlogs(blogIdOrSlug, limit = 3) {
    const blog = await this.getBlogBySlugOrId(blogIdOrSlug);
    return await blogRepository.findRelated(blog, limit);
  }

  // Admin CRUD
  async createBlog(blogData) {
    let slug = blogData.slug ? createSlug(blogData.slug) : createSlug(blogData.title);

    const existing = await blogRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    return await blogRepository.create({
      ...blogData,
      slug,
    });
  }

  async getAllBlogsAdmin(queryParams = {}) {
    const { page = 1, limit = 20 } = queryParams;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const { blogs, total } = await blogRepository.findAll({}, {
      page: pageNum,
      limit: limitNum,
      sort: { createdAt: -1 },
    });

    return {
      blogs,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  async getBlogByIdAdmin(id) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundError('Article not found');
    }
    return blog;
  }

  async updateBlog(id, blogData) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundError('Article not found');
    }

    if (blogData.title && !blogData.slug) {
      blogData.slug = createSlug(blogData.title);
    } else if (blogData.slug) {
      blogData.slug = createSlug(blogData.slug);
    }

    if (blogData.slug && blogData.slug !== blog.slug) {
      const existing = await blogRepository.findBySlug(blogData.slug);
      if (existing && existing._id.toString() !== id.toString()) {
        throw new ConflictError('Article slug already exists');
      }
    }

    return await blogRepository.updateById(id, blogData);
  }

  async deleteBlog(id) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundError('Article not found');
    }
    return await blogRepository.deleteById(id);
  }
}

module.exports = new BlogService();

import api from './api';

// Purge any legacy static mock blog data from local storage
try {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('recipe_admin_stored_blogs');
  }
} catch (e) {}

export const blogService = {
  // Public blog fetch
  getPublicBlogs: async (params = {}) => {
    const res = await api.get('/blogs', { params });
    const data = res?.data || res;
    return Array.isArray(data) ? data : [];
  },

  // Admin: Get all blogs with search and pagination
  getAllBlogs: async (params = {}) => {
    const res = await api.get('/admin/blogs', { params });
    const blogs = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.blogs)
      ? res.data.blogs
      : Array.isArray(res?.blogs)
      ? res.blogs
      : [];
    const meta = res?.meta || res?.data?.meta || { total: blogs.length, page: 1, limit: 50 };
    return { blogs, meta };
  },

  getBlogById: async (id) => {
    const res = await api.get(`/admin/blogs/${id}`);
    return res?.data || res;
  },

  createBlog: async (blogData, imageFile) => {
    let payload;
    let headers = {};

    if (imageFile) {
      payload = new FormData();
      payload.append('image', imageFile);
      Object.keys(blogData).forEach((key) => {
        const val = blogData[key];
        if (key === 'tags') {
          payload.append(key, JSON.stringify(val));
        } else if (val !== undefined && val !== null) {
          payload.append(key, val);
        }
      });
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = { ...blogData };
    }

    const res = await api.post('/admin/blogs', payload, { headers });
    return res?.data || res;
  },

  updateBlog: async (id, blogData, imageFile) => {
    let payload;
    let headers = {};

    if (imageFile) {
      payload = new FormData();
      payload.append('image', imageFile);
      Object.keys(blogData).forEach((key) => {
        const val = blogData[key];
        if (key === 'tags') {
          payload.append(key, JSON.stringify(val));
        } else if (val !== undefined && val !== null) {
          payload.append(key, val);
        }
      });
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = { ...blogData };
    }

    const res = await api.patch(`/admin/blogs/${id}`, payload, { headers });
    return res?.data || res;
  },

  deleteBlog: async (id) => {
    const res = await api.delete(`/admin/blogs/${id}`);
    return res?.data || res;
  },
};

export default blogService;

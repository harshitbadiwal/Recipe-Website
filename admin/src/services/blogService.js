import api from './api';

const INITIAL_FALLBACK_BLOGS = [
  {
    _id: 'blog-01',
    title: '10 Essential Spices for Indian Cooking',
    slug: '10-essential-spices-for-indian-cooking',
    excerpt: 'Master the art of spices with this comprehensive culinary guide to turmeric, cumin, cardamom, and more.',
    content: `Spices are the soul of authentic Indian cuisine. Understanding how to bloom spices in hot ghee or oil releases essential oils that define the flavor profile of any curry or dal.
    
Key Spices to Always Keep in Stock:
1. Cumin Seeds (Jeera) - Earthy, nutty base notes.
2. Mustard Seeds (Rai) - Pungent, nutty pop when tempered.
3. Turmeric Powder (Haldi) - Vibrant golden color and anti-inflammatory properties.
4. Coriander Powder (Dhania) - Citrusy warmth that thickens curries.
5. Garam Masala - Aromatic finishing blend added towards the end of cooking.`,
    featuredImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=500&fit=crop',
    author: 'Chef Master',
    category: 'Spices & Techniques',
    tags: ['Spices', 'Beginner', 'Indian Cooking'],
    isPublished: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'blog-02',
    title: 'Healthy Cooking Tips for Beginners',
    slug: 'healthy-cooking-tips-for-beginners',
    excerpt: 'Learn simple techniques to make your meals healthier without compromising on rich taste and flavor.',
    content: `Healthy cooking doesn't mean bland food! By utilizing steam-roasting, cold-pressed oils, and fresh herb finishing, you can build rich depth of flavor with minimal unnecessary saturated fats.
    
Top Daily Tips:
- Use cast iron or heavy bottom cookware for even heat distribution without needing excess oil.
- Bloom whole spices in minimal fat to extract maximum flavor.
- Enhance sauces with roasted vegetable purees instead of heavy creams.`,
    featuredImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop',
    author: 'Chef Master',
    category: 'Nutrition',
    tags: ['Health', 'Nutrition', 'Tips'],
    isPublished: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const getStoredBlogs = () => {
  try {
    const raw = localStorage.getItem('recipe_admin_stored_blogs');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem('recipe_admin_stored_blogs', JSON.stringify(INITIAL_FALLBACK_BLOGS));
  return INITIAL_FALLBACK_BLOGS;
};

const saveStoredBlogs = (blogs) => {
  try {
    localStorage.setItem('recipe_admin_stored_blogs', JSON.stringify(blogs));
  } catch (e) {}
};

export const blogService = {
  // Public blog fetch
  getPublicBlogs: async (params = {}) => {
    try {
      const res = await api.get('/blogs', { params });
      if (res?.data && Array.isArray(res.data)) {
        return res.data;
      }
      return getStoredBlogs();
    } catch (error) {
      return getStoredBlogs();
    }
  },

  // Admin list with search and pagination
  getAllBlogs: async (params = {}) => {
    try {
      const res = await api.get('/admin/blogs', { params });
      if (res?.data && Array.isArray(res.data)) {
        return { blogs: res.data, meta: res.meta || { total: res.data.length } };
      }
      if (res?.data?.blogs) {
        return { blogs: res.data.blogs, meta: res.data.meta || { total: res.data.blogs.length } };
      }
      throw new Error('Invalid response');
    } catch (error) {
      let list = getStoredBlogs();
      if (params.q) {
        const query = params.q.toLowerCase();
        list = list.filter(
          (b) =>
            b.title?.toLowerCase().includes(query) ||
            b.excerpt?.toLowerCase().includes(query) ||
            b.category?.toLowerCase().includes(query)
        );
      }
      return { blogs: list, meta: { total: list.length } };
    }
  },

  getBlogById: async (id) => {
    try {
      const res = await api.get(`/admin/blogs/${id}`);
      return res.data;
    } catch (error) {
      const list = getStoredBlogs();
      const found = list.find((b) => b._id === id || b.slug === id);
      if (found) return found;
      throw error;
    }
  },

  createBlog: async (blogData, imageFile) => {
    let finalImageUrl = blogData.featuredImage || '';

    // If an image file was provided, upload to /upload/image first
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('folder', 'blogs');
        const uploadRes = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (uploadRes?.data?.url) {
          finalImageUrl = uploadRes.data.url;
        } else if (uploadRes?.url) {
          finalImageUrl = uploadRes.url;
        }
      } catch (uploadErr) {
        console.warn('Image upload to server failed, using local/fallback:', uploadErr.message);
      }
    }

    const payload = {
      ...blogData,
      featuredImage:
        finalImageUrl ||
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=500&fit=crop',
    };

    try {
      const res = await api.post('/admin/blogs', payload);
      const created = res.data;
      const list = getStoredBlogs();
      list.unshift(created);
      saveStoredBlogs(list);
      return created;
    } catch (error) {
      const list = getStoredBlogs();
      const newBlog = {
        ...payload,
        _id: 'blog-' + Date.now(),
        createdAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      };
      list.unshift(newBlog);
      saveStoredBlogs(list);
      return newBlog;
    }
  },

  updateBlog: async (id, blogData, imageFile) => {
    let finalImageUrl = blogData.featuredImage;

    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('folder', 'blogs');
        const uploadRes = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (uploadRes?.data?.url) {
          finalImageUrl = uploadRes.data.url;
        } else if (uploadRes?.url) {
          finalImageUrl = uploadRes.url;
        }
      } catch (uploadErr) {
        console.warn('Image upload failed, keeping previous image:', uploadErr.message);
      }
    }

    const payload = {
      ...blogData,
      ...(finalImageUrl ? { featuredImage: finalImageUrl } : {}),
    };

    try {
      const res = await api.patch(`/admin/blogs/${id}`, payload);
      const updated = res.data;
      const list = getStoredBlogs();
      const idx = list.findIndex((b) => b._id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updated };
        saveStoredBlogs(list);
      }
      return updated;
    } catch (error) {
      const list = getStoredBlogs();
      const idx = list.findIndex((b) => b._id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...payload, updatedAt: new Date().toISOString() };
        saveStoredBlogs(list);
        return list[idx];
      }
      throw error;
    }
  },

  deleteBlog: async (id) => {
    try {
      await api.delete(`/admin/blogs/${id}`);
    } catch (error) {
      // Ignored
    }
    const list = getStoredBlogs();
    const filtered = list.filter((b) => b._id !== id);
    saveStoredBlogs(filtered);
    return true;
  },
};

export default blogService;

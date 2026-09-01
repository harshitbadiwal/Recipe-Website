import api from './api';

const INITIAL_FALLBACK_CATEGORIES = [
  {
    _id: 'cat-01',
    name: 'Non-Veg',
    slug: 'non-veg',
    description: 'Succulent chicken, mutton, and seafood specialties cooked to perfection.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    isActive: true,
    recipesCount: 14,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-02',
    name: 'Veg',
    slug: 'veg',
    description: 'Fresh and wholesome vegetarian dishes packed with nutrients and vibrant spices.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    isActive: true,
    recipesCount: 22,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-03',
    name: 'Desserts',
    slug: 'desserts',
    description: 'Decadent sweet treats, traditional Indian mithai, and heavenly desserts.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
    isActive: true,
    recipesCount: 8,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-04',
    name: 'Snacks',
    slug: 'snacks',
    description: 'Crispy finger foods, street food favorites, and quick bite-sized snacks.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    isActive: true,
    recipesCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'cat-05',
    name: 'Beverages',
    slug: 'beverages',
    description: 'Refreshing drinks, traditional lassis, herbal teas, and specialty coolers.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
    isActive: true,
    recipesCount: 6,
    createdAt: new Date().toISOString(),
  },
];

const getStoredCategories = () => {
  try {
    const raw = localStorage.getItem('recipe_admin_stored_categories');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem('recipe_admin_stored_categories', JSON.stringify(INITIAL_FALLBACK_CATEGORIES));
  return INITIAL_FALLBACK_CATEGORIES;
};

const saveStoredCategories = (cats) => {
  try {
    localStorage.setItem('recipe_admin_stored_categories', JSON.stringify(cats));
  } catch (e) {}
};

export const categoryService = {
  // Public & dropdown category fetch
  getCategories: async () => {
    try {
      const res = await api.get('/categories');
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return getStoredCategories();
    } catch (error) {
      return getStoredCategories();
    }
  },

  // Admin list with search and pagination
  getAllCategories: async (params = {}) => {
    try {
      const res = await api.get('/admin/categories', { params });
      if (res?.data && Array.isArray(res.data)) {
        return { categories: res.data, meta: res.meta || { total: res.data.length } };
      }
      if (res?.data?.categories) {
        return { categories: res.data.categories, meta: res.data.meta || { total: res.data.categories.length } };
      }
      throw new Error('Invalid response');
    } catch (error) {
      let list = getStoredCategories();
      if (params.q) {
        const query = params.q.toLowerCase();
        list = list.filter(
          (c) =>
            c.name?.toLowerCase().includes(query) ||
            c.description?.toLowerCase().includes(query) ||
            c.slug?.toLowerCase().includes(query)
        );
      }
      return { categories: list, meta: { total: list.length } };
    }
  },

  getCategoryById: async (id) => {
    try {
      const res = await api.get(`/admin/categories/${id}`);
      return res.data;
    } catch (error) {
      const list = getStoredCategories();
      const found = list.find((c) => c._id === id || c.slug === id);
      if (found) return found;
      throw error;
    }
  },

  createCategory: async (categoryData, imageFile) => {
    let payload;
    let headers = {};

    if (imageFile) {
      payload = new FormData();
      payload.append('image', imageFile);
      Object.keys(categoryData).forEach((key) => {
        if (categoryData[key] !== undefined && categoryData[key] !== null) {
          payload.append(key, categoryData[key]);
        }
      });
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = { ...categoryData };
    }

    try {
      const res = await api.post('/admin/categories', payload, { headers });
      const created = res.data;
      const list = getStoredCategories();
      list.unshift(created);
      saveStoredCategories(list);
      return created;
    } catch (error) {
      const list = getStoredCategories();
      const newCat = {
        ...categoryData,
        _id: 'cat-' + Date.now(),
        image:
          categoryData.image ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        recipesCount: 0,
        createdAt: new Date().toISOString(),
      };
      list.unshift(newCat);
      saveStoredCategories(list);
      return newCat;
    }
  },

  updateCategory: async (id, categoryData, imageFile) => {
    let payload;
    let headers = {};

    if (imageFile) {
      payload = new FormData();
      payload.append('image', imageFile);
      Object.keys(categoryData).forEach((key) => {
        if (categoryData[key] !== undefined && categoryData[key] !== null) {
          payload.append(key, categoryData[key]);
        }
      });
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = { ...categoryData };
    }

    try {
      const res = await api.patch(`/admin/categories/${id}`, payload, { headers });
      const updated = res.data;
      const list = getStoredCategories();
      const idx = list.findIndex((c) => c._id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updated };
        saveStoredCategories(list);
      }
      return updated;
    } catch (error) {
      const list = getStoredCategories();
      const idx = list.findIndex((c) => c._id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...categoryData, updatedAt: new Date().toISOString() };
        saveStoredCategories(list);
        return list[idx];
      }
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      await api.delete(`/admin/categories/${id}`);
    } catch (error) {
      // Ignored
    }
    const list = getStoredCategories();
    const filtered = list.filter((c) => c._id !== id);
    saveStoredCategories(filtered);
    return true;
  },

  getCategoryRecipes: async (slug) => {
    try {
      const res = await api.get(`/categories/${slug}/recipes`);
      return res.data;
    } catch (error) {
      return [];
    }
  },
};

export default categoryService;

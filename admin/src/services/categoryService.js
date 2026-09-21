import api from './api';

// Purge any legacy static mock category data from local storage
try {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('recipe_admin_stored_categories');
  }
} catch (e) {}

export const categoryService = {
  // Public & dropdown category fetch
  getCategories: async () => {
    const res = await api.get('/categories');
    const data = res?.data || res;
    return Array.isArray(data) ? data : [];
  },

  // Admin list with search and pagination
  getAllCategories: async (params = {}) => {
    const res = await api.get('/admin/categories', { params });
    const categories = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.categories)
      ? res.data.categories
      : Array.isArray(res?.categories)
      ? res.categories
      : [];
    const meta = res?.meta || res?.data?.meta || { total: categories.length, page: 1, limit: 50 };
    return { categories, meta };
  },

  getCategoryById: async (id) => {
    const res = await api.get(`/admin/categories/${id}`);
    return res?.data || res;
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

    const res = await api.post('/admin/categories', payload, { headers });
    return res?.data || res;
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

    const res = await api.patch(`/admin/categories/${id}`, payload, { headers });
    return res?.data || res;
  },

  deleteCategory: async (id) => {
    const res = await api.delete(`/admin/categories/${id}`);
    return res?.data || res;
  },

  getCategoryRecipes: async (slug) => {
    const res = await api.get(`/categories/${slug}/recipes`);
    const data = res?.data || res;
    return Array.isArray(data) ? data : [];
  },

  // Sub-Categories API helpers
  getSubCategories: async (params = {}) => {
    return categoryService.getAllCategories({ ...params, type: 'subcategory' });
  },

  createSubCategory: async (subCategoryData, imageFile) => {
    return categoryService.createCategory(subCategoryData, imageFile);
  },

  updateSubCategory: async (id, subCategoryData, imageFile) => {
    return categoryService.updateCategory(id, subCategoryData, imageFile);
  },

  deleteSubCategory: async (id) => {
    return categoryService.deleteCategory(id);
  },
};

export default categoryService;

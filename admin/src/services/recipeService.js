import api from './api';

// Purge any legacy static mock recipe data from local storage
try {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('recipe_admin_stored_recipes');
  }
} catch (e) {}

export const recipeService = {
  /**
   * Fetch all recipes with search, filtering, and pagination from real API
   */
  getAllRecipes: async (params = {}) => {
    const response = await api.get('/admin/recipes', { params });
    const recipes = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.recipes)
      ? response.data.recipes
      : Array.isArray(response?.recipes)
      ? response.recipes
      : [];
    const meta = response?.meta || response?.data?.meta || { total: recipes.length, page: 1, limit: 50 };
    return {
      recipes,
      meta,
    };
  },

  /**
   * Fetch a single recipe by its ID or slug from real API
   */
  getRecipeById: async (id) => {
    const response = await api.get(`/admin/recipes/${id}`);
    return response?.data || response;
  },

  /**
   * Create a new recipe via real API (supports multipart/form-data for image uploads)
   */
  createRecipe: async (recipeData, imageFile) => {
    let payload;
    let headers = {};

    if (imageFile) {
      payload = new FormData();
      payload.append('image', imageFile);

      Object.keys(recipeData).forEach((key) => {
        const val = recipeData[key];
        if (['ingredients', 'instructions', 'nutrition', 'tags'].includes(key)) {
          payload.append(key, JSON.stringify(val));
        } else if (val !== undefined && val !== null) {
          payload.append(key, val);
        }
      });
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = { ...recipeData };
    }

    const response = await api.post('/admin/recipes', payload, { headers });
    return response?.data || response;
  },

  /**
   * Update an existing recipe via real API
   */
  updateRecipe: async (id, recipeData, imageFile) => {
    let payload;
    let headers = {};

    if (imageFile) {
      payload = new FormData();
      payload.append('image', imageFile);

      Object.keys(recipeData).forEach((key) => {
        const val = recipeData[key];
        if (['ingredients', 'instructions', 'nutrition', 'tags'].includes(key)) {
          payload.append(key, JSON.stringify(val));
        } else if (val !== undefined && val !== null) {
          payload.append(key, val);
        }
      });
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = { ...recipeData };
    }

    const response = await api.patch(`/admin/recipes/${id}`, payload, { headers });
    return response?.data || response;
  },

  /**
   * Delete a recipe by ID via real API
   */
  deleteRecipe: async (id) => {
    const response = await api.delete(`/admin/recipes/${id}`);
    return response?.data || response;
  },

  /**
   * Duplicate a recipe via real API
   */
  duplicateRecipe: async (id) => {
    const response = await api.post(`/admin/recipes/${id}/duplicate`);
    return response?.data || response;
  },

  /**
   * Toggle published / draft status directly via real API
   */
  togglePublishStatus: async (id, isPublished) => {
    const response = await api.patch(`/admin/recipes/${id}`, { isPublished });
    return response?.data || response;
  },
};

export default recipeService;

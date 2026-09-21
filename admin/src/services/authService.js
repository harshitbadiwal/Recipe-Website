import api, { setAuthToken, getAuthToken } from './api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const payload = response?.data || response;
      const token = payload?.accessToken || payload?.token;
      const user = payload?.user;

      if (token) {
        setAuthToken(token);
      }
      if (user) {
        localStorage.setItem('recipe_admin_user', JSON.stringify(user));
      }

      // Clear any legacy mock caches
      try {
        localStorage.removeItem('recipe_admin_stored_recipes');
        localStorage.removeItem('recipe_admin_stored_categories');
        localStorage.removeItem('recipe_admin_stored_blogs');
        localStorage.removeItem('recipe_admin_stored_users');
        localStorage.removeItem('recipe_admin_stored_subscribers');
      } catch (e) {}

      return { user, token };
    } catch (error) {
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      const payload = response?.data || response;
      return payload?.user || payload;
    } catch (error) {
      const token = getAuthToken();
      const savedUser = localStorage.getItem('recipe_admin_user');
      if (token && savedUser) {
        return JSON.parse(savedUser);
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout request errors
    } finally {
      setAuthToken(null);
      localStorage.removeItem('recipe_admin_user');
      localStorage.removeItem('recipe-admin-recipe-admin-auth');
    }
  },
};

export default authService;

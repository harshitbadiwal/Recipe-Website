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

      return { user, token };
    } catch (error) {
      // Fallback for offline demo mode
      if (
        (email === 'admin@recipe.com' && password === 'admin123') ||
        (email === 'admin@foodie-admin.io' && password === 'Password@123')
      ) {
        const fallbackUser = {
          id: '6a8dcbc0807151f6bec6a9a6',
          name: 'Admin User',
          email,
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
          bio: 'Head Culinary Master & System Administrator.',
        };
        const fallbackToken = 'demo-admin-jwt-token-2026';
        setAuthToken(fallbackToken);
        localStorage.setItem('recipe_admin_user', JSON.stringify(fallbackUser));
        return { user: fallbackUser, token: fallbackToken };
      }
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

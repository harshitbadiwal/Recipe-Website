import api from './api';

// Purge any legacy static mock user data from local storage
try {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('recipe_admin_stored_users');
  }
} catch (e) {}

export const userService = {
  // Admin: Get all users with query params
  getAllUsers: async (params = {}) => {
    const res = await api.get('/admin/users', { params });
    const users = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.users)
      ? res.data.users
      : Array.isArray(res?.users)
      ? res.users
      : [];
    const meta = res?.meta || res?.data?.meta || { total: users.length, page: 1, limit: 50 };
    return { users, meta };
  },

  getUserById: async (id) => {
    const res = await api.get(`/admin/users/${id}`);
    return res?.data || res;
  },

  updateUser: async (id, userData) => {
    const res = await api.patch(`/admin/users/${id}`, userData);
    return res?.data || res;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res?.data || res;
  },

  toggleUserStatus: async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const res = await api.patch(`/admin/users/${id}/status`, { status: newStatus });
    return res?.data || res;
  },
};

export default userService;

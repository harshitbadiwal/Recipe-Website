import api from './api';

const INITIAL_FALLBACK_USERS = [
  {
    _id: '6a8dcbc0807151f6bec6a9a6',
    name: 'Admin User',
    email: 'admin@recipe.com',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    status: 'ACTIVE',
    bio: 'Lead System Administrator & Master Chef.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '6a8e59c7e340e6ef8508f62f',
    name: 'Harshit',
    email: 'harshit@mailinator.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    status: 'ACTIVE',
    bio: 'Food enthusiast and amateur baker.',
    createdAt: new Date().toISOString(),
  },
];

const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem('recipe_admin_stored_users');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem('recipe_admin_stored_users', JSON.stringify(INITIAL_FALLBACK_USERS));
  return INITIAL_FALLBACK_USERS;
};

const saveStoredUsers = (users) => {
  try {
    localStorage.setItem('recipe_admin_stored_users', JSON.stringify(users));
  } catch (e) {}
};

export const userService = {
  // Admin: Get all users with query params
  getAllUsers: async (params = {}) => {
    try {
      const res = await api.get('/admin/users', { params });
      if (res?.data && Array.isArray(res.data)) {
        return { users: res.data, meta: res.meta || { total: res.data.length } };
      }
      if (res?.data?.users) {
        return { users: res.data.users, meta: res.data.meta || { total: res.data.users.length } };
      }
      throw new Error('Invalid users response');
    } catch (error) {
      let list = getStoredUsers();
      if (params.q) {
        const query = params.q.toLowerCase();
        list = list.filter(
          (u) =>
            u.name?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query) ||
            u.role?.toLowerCase().includes(query)
        );
      }
      return { users: list, meta: { total: list.length } };
    }
  },

  // Admin: Get single user by ID
  getUserById: async (id) => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      return res.data;
    } catch (error) {
      const list = getStoredUsers();
      const found = list.find((u) => u._id === id);
      if (found) return found;
      throw error;
    }
  },

  // Admin: Update user role or status (ACTIVE / INACTIVE, USER / ADMIN)
  updateUser: async (id, data) => {
    try {
      const res = await api.patch(`/admin/users/${id}`, data);
      const updated = res.data;
      const list = getStoredUsers();
      const idx = list.findIndex((u) => u._id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updated };
        saveStoredUsers(list);
      }
      return updated;
    } catch (error) {
      const list = getStoredUsers();
      const idx = list.findIndex((u) => u._id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
        saveStoredUsers(list);
        return list[idx];
      }
      throw error;
    }
  },

  // User: Get personal profile
  getProfile: async () => {
    try {
      const res = await api.get('/users/me');
      return res.data;
    } catch (error) {
      return getStoredUsers()[0];
    }
  },

  // User: Update personal profile
  updateProfile: async (data) => {
    try {
      const res = await api.patch('/users/me', data);
      return res.data;
    } catch (error) {
      return data;
    }
  },
};

export default userService;

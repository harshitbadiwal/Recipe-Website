import api from './api';

const INITIAL_FALLBACK_SUBSCRIBERS = [
  {
    _id: 'sub-01',
    email: 'foodie.fan@example.com',
    isSubscribed: true,
    subscribedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    _id: 'sub-02',
    email: 'gourmet.chef@example.com',
    isSubscribed: true,
    subscribedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    _id: 'sub-03',
    email: 'baking.daily@example.com',
    isSubscribed: false,
    subscribedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    unsubscribedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

const getStoredSubscribers = () => {
  try {
    const raw = localStorage.getItem('recipe_admin_stored_subscribers');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem('recipe_admin_stored_subscribers', JSON.stringify(INITIAL_FALLBACK_SUBSCRIBERS));
  return INITIAL_FALLBACK_SUBSCRIBERS;
};

const saveStoredSubscribers = (subs) => {
  try {
    localStorage.setItem('recipe_admin_stored_subscribers', JSON.stringify(subs));
  } catch (e) {}
};

export const newsletterService = {
  // Admin: Get all subscribers
  getSubscribers: async (params = {}) => {
    try {
      const res = await api.get('/admin/newsletter/subscribers', { params });
      if (res?.data && Array.isArray(res.data)) {
        return { subscribers: res.data, meta: res.meta || { total: res.data.length } };
      }
      if (res?.data?.subscribers) {
        return {
          subscribers: res.data.subscribers,
          meta: res.data.meta || { total: res.data.subscribers.length },
        };
      }
      throw new Error('Invalid subscribers response');
    } catch (error) {
      let list = getStoredSubscribers();
      if (params.q) {
        const query = params.q.toLowerCase();
        list = list.filter((s) => s.email?.toLowerCase().includes(query));
      }
      return { subscribers: list, meta: { total: list.length } };
    }
  },

  // Public/Admin: Subscribe an email
  subscribe: async (email) => {
    try {
      const res = await api.post('/newsletter/subscribe', { email });
      const created = res.data;
      const list = getStoredSubscribers();
      const existingIdx = list.findIndex((s) => s.email.toLowerCase() === email.toLowerCase());
      if (existingIdx !== -1) {
        list[existingIdx].isSubscribed = true;
        list[existingIdx].unsubscribedAt = null;
      } else {
        list.unshift(created || {
          _id: 'sub-' + Date.now(),
          email,
          isSubscribed: true,
          subscribedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
      }
      saveStoredSubscribers(list);
      return res.data;
    } catch (error) {
      const list = getStoredSubscribers();
      const newSub = {
        _id: 'sub-' + Date.now(),
        email,
        isSubscribed: true,
        subscribedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      list.unshift(newSub);
      saveStoredSubscribers(list);
      return newSub;
    }
  },

  // Public/Admin: Unsubscribe an email
  unsubscribe: async (email) => {
    try {
      await api.post('/newsletter/unsubscribe', { email });
    } catch (e) {
      // Ignore errors
    }
    const list = getStoredSubscribers();
    const idx = list.findIndex((s) => s.email.toLowerCase() === email.toLowerCase());
    if (idx !== -1) {
      list[idx].isSubscribed = false;
      list[idx].unsubscribedAt = new Date().toISOString();
      saveStoredSubscribers(list);
    }
    return true;
  },
};

export default newsletterService;

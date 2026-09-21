import api from './api';

// Purge any legacy static mock subscriber data from local storage
try {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('recipe_admin_stored_subscribers');
  }
} catch (e) {}

export const newsletterService = {
  // Admin: Get all subscribers
  getSubscribers: async (params = {}) => {
    const res = await api.get('/admin/newsletter/subscribers', { params });
    const subscribers = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.subscribers)
      ? res.data.subscribers
      : Array.isArray(res?.subscribers)
      ? res.subscribers
      : [];
    const meta = res?.meta || res?.data?.meta || { total: subscribers.length, page: 1, limit: 50 };
    return { subscribers, meta };
  },

  deleteSubscriber: async (id) => {
    const res = await api.delete(`/admin/newsletter/subscribers/${id}`);
    return res?.data || res;
  },

  sendNewsletter: async (newsletterData) => {
    const res = await api.post('/admin/newsletter/send', newsletterData);
    return res?.data || res;
  },
};

export default newsletterService;

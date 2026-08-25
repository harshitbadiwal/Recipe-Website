const newsletterRepository = require('../repositories/newsletter.repository');

class NewsletterService {
  async subscribe(email) {
    return await newsletterRepository.subscribe(email);
  }

  async unsubscribe(email) {
    return await newsletterRepository.unsubscribe(email);
  }

  async getSubscribersAdmin(queryParams = {}) {
    const { page = 1, limit = 20 } = queryParams;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const { subscribers, total } = await newsletterRepository.findAll({}, {
      page: pageNum,
      limit: limitNum,
    });

    return {
      subscribers,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }
}

module.exports = new NewsletterService();

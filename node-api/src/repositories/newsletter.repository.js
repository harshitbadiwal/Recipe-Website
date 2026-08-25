const NewsletterSubscriber = require('../models/NewsletterSubscriber.model');

class NewsletterRepository {
  async subscribe(email) {
    let subscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    if (subscriber) {
      if (!subscriber.isSubscribed) {
        subscriber.isSubscribed = true;
        subscriber.subscribedAt = new Date();
        subscriber.unsubscribedAt = null;
        await subscriber.save();
      }
      return subscriber;
    }
    return await NewsletterSubscriber.create({ email: email.toLowerCase() });
  }

  async unsubscribe(email) {
    const subscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    if (subscriber) {
      subscriber.isSubscribed = false;
      subscriber.unsubscribedAt = new Date();
      await subscriber.save();
    }
    return subscriber;
  }

  async findByEmail(email) {
    return await NewsletterSubscriber.findOne({ email: email.toLowerCase() }).exec();
  }

  async findAll(filter = {}, options = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      NewsletterSubscriber.find(filter)
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      NewsletterSubscriber.countDocuments(filter),
    ]);

    return { subscribers, total };
  }
}

module.exports = new NewsletterRepository();

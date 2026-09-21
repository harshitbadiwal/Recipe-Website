const cron = require('node-cron');
const Recipe = require('../models/Recipe.model');

/**
 * Check and publish all scheduled recipes whose scheduledAt time has arrived
 */
const checkAndPublishScheduledRecipes = async () => {
  try {
    const now = new Date();
    const result = await Recipe.updateMany(
      {
        isScheduled: true,
        scheduledAt: { $lte: now },
      },
      {
        $set: {
          isPublished: true,
          isScheduled: false,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ [Cron] Published ${result.modifiedCount} scheduled recipe(s) at ${now.toISOString()}`);
    }
    return result;
  } catch (error) {
    console.error('❌ [Cron Error] Failed to publish scheduled recipes:', error.message);
  }
};

/**
 * Initialize recurring cron job (runs every minute: * * * * *)
 */
const initScheduledRecipeCron = () => {
  // Check immediately on startup
  checkAndPublishScheduledRecipes();

  // Run every minute
  cron.schedule('* * * * *', async () => {
    await checkAndPublishScheduledRecipes();
  });

  console.log('⏰ [Cron] Scheduled recipe publisher running every minute (* * * * *)');
};

module.exports = {
  checkAndPublishScheduledRecipes,
  initScheduledRecipeCron,
};

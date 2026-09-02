const cron = require('node-cron');
const Recipe = require('../models/Recipe.model');

/**
 * Check and publish all scheduled recipes whose scheduledAt time has arrived
 */
const checkAndPublishScheduledRecipes = async () => {
  try {
    const now = new Date();
    console.log(`⏰ [Cron Job] Running 5-minute scheduled recipe check at ${now.toLocaleString()} (${now.toISOString()})...`);

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
      console.log(`✅ [Cron Job] Successfully published ${result.modifiedCount} scheduled recipe(s) at ${now.toISOString()}`);
    } else {
      console.log(`ℹ️ [Cron Job] Check complete: No due scheduled recipes to publish.`);
    }
    return result;
  } catch (error) {
    console.error('❌ [Cron Job Error] Failed to publish scheduled recipes:', error);
    throw error;
  }
};

/**
 * Initialize the recurring cron schedule (runs every 5 minutes)
 */
const initScheduledRecipeCron = () => {
  // Schedule to run every 5 minutes: '*/5 * * * *'
  cron.schedule('* * * * *', async () => {
    await checkAndPublishScheduledRecipes();
  });
  console.log('[Cron Job] Scheduled recipe publisher service initialized (Runs every 5 minutes: */5 * * * *)');
};

module.exports = {
  checkAndPublishScheduledRecipes,
  initScheduledRecipeCron,
};

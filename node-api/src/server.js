const app = require('./app');
const config = require('./config/env.config');
const { connectDB, disconnectDB } = require('./config/db.config');
const logger = require('./utils/logger');
const User = require('./models/User.model');
const seedDB = require('./seed/seeder');

let server;

const startServer = async () => {
  try {
    await connectDB();

    // Check if database needs initial seeding
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      logger.info('Database empty. Running initial auto-seeding...');
      await seedDB();
    }

    server = app.listen(config.port, () => {
      logger.info(`🚀 Server running in ${config.env} mode on http://localhost:${config.port}`);
      logger.info(`📚 Swagger Documentation available at http://localhost:${config.port}/api-docs`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

const handleShutdown = async (signal) => {
  logger.info(`${signal} received. Closing HTTP server and database connections...`);
  if (server) {
    server.close(async () => {
      await disconnectDB();
      logger.info('HTTP server closed cleanly.');
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

if (require.main === module) {
  startServer();
}

module.exports = { startServer };

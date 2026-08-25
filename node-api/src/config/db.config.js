const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('./env.config');

let memServer = null;

const connectDB = async () => {
  mongoose.set('strictQuery', false);

  // 1. Attempt Primary Connection (e.g., MongoDB Atlas or specified DATABASE_URL)
  if (config.databaseUrl) {
    try {
      const maskedUrl = config.databaseUrl.replace(/:([^@]+)@/, ':****@');
      logger.info(`Attempting primary MongoDB connection: ${maskedUrl}...`);
      
      const conn = await mongoose.connect(config.databaseUrl, {
        serverSelectionTimeoutMS: 5000,
      });
      logger.info(`✅ Connected to Primary MongoDB Cluster: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (err) {
      logger.warn(`⚠️ Primary MongoDB Connection Failed (${err.message}).`);
      logger.warn(`👉 To fix Atlas: Go to MongoDB Atlas -> Security -> Database Access -> Create/update user credentials in DATABASE_URL.`);
    }
  }

  // 2. Fallback to Local MongoDB (if local mongod service is running)
  const localUri = 'mongodb://127.0.0.1:27017/recipe_db';
  if (config.databaseUrl !== localUri) {
    try {
      logger.info(`Attempting fallback to local MongoDB instance (${localUri})...`);
      const conn = await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 3000,
      });
      logger.info(`✅ Connected to Local MongoDB: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (localErr) {
      logger.warn(`⚠️ Local MongoDB instance not available at ${localUri}.`);
    }
  }

  // 3. Fallback to In-Memory MongoMemoryServer (Zero-setup development fallback)
  try {
    logger.info('Starting fallback In-Memory MongoDB instance (MongoMemoryServer)...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memServer = await MongoMemoryServer.create();
    const mongoUri = memServer.getUri();
    const conn = await mongoose.connect(mongoUri);
    logger.info(`✅ Connected to In-Memory MongoDB at ${mongoUri}`);
    return conn;
  } catch (memErr) {
    logger.error('❌ Critical: Failed to start any database engine:', memErr.message);
    throw memErr;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memServer) {
    await memServer.stop();
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};

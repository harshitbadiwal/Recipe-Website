const { connectDB, disconnectDB } = require('../config/db.config');
const User = require('../models/User.model');
const Category = require('../models/Category.model');
const Recipe = require('../models/Recipe.model');
const Blog = require('../models/Blog.model');
const logger = require('../utils/logger');
const { defaultUsers, defaultCategories, defaultRecipes, defaultBlogs } = require('./seedData');

const seedDB = async () => {
  try {
    await connectDB();
    logger.info('Clearing existing database collections for seeding...');

    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Recipe.deleteMany({}),
      Blog.deleteMany({}),
    ]);

    logger.info('Seeding default users...');
    const createdUsers = [];
    for (const u of defaultUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    const adminUser = createdUsers.find((u) => u.role === 'ADMIN') || createdUsers[0];

    logger.info('Seeding default categories...');
    const categoryMap = {};
    for (const c of defaultCategories) {
      const cat = await Category.create(c);
      categoryMap[cat.name] = cat;
    }

    logger.info('Seeding default recipes...');
    for (const r of defaultRecipes) {
      const catObj = categoryMap[r.categoryName] || Object.values(categoryMap)[0];
      await Recipe.create({
        ...r,
        category: catObj._id,
        categoryName: catObj.name,
        author: adminUser._id,
      });
    }

    logger.info('Seeding default blogs...');
    for (const b of defaultBlogs) {
      await Blog.create(b);
    }

    logger.info('✅ Seeding completed successfully!');
    if (process.argv[1].includes('seeder.js')) {
      await disconnectDB();
      process.exit(0);
    }
  } catch (err) {
    logger.error('❌ Seeding failed:', err);
    if (process.argv[1].includes('seeder.js')) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = seedDB;

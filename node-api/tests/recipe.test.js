const request = require('supertest');
const app = require('../src/app');
const Category = require('../src/models/Category.model');
const Recipe = require('../src/models/Recipe.model');
const User = require('../src/models/User.model');
const ROLES = require('../src/constants/roles');
const { checkAndPublishScheduledRecipes } = require('../src/services/cron.service');

describe('Recipe API Endpoints', () => {
  let adminToken;
  let category1;
  let category2;

  beforeEach(async () => {
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@recipe.com',
      password: 'admin123',
      role: ROLES.ADMIN,
    });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@recipe.com',
      password: 'admin123',
    });
    adminToken = loginRes.body.data.accessToken;

    // Create Categories
    category1 = await Category.create({
      name: 'Veg',
      slug: 'veg',
      description: 'Vegetarian recipes',
    });

    category2 = await Category.create({
      name: 'Snacks',
      slug: 'snacks',
      description: 'Quick bites and snacks',
    });
  });

  test('POST /api/v1/admin/recipes - Should allow admin to create a recipe with multiple categories', async () => {
    const res = await request(app)
      .post('/api/v1/admin/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Paneer Tikka',
        description: 'Grilled spiced cottage cheese cubes',
        categories: [category1._id, category2._id],
        prepTime: 15,
        cookTime: 20,
        difficulty: 'Easy',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('paneer-tikka');
    expect(res.body.data.categories.length).toBe(2);
    expect(res.body.data.categoryNames).toContain('Veg');
    expect(res.body.data.categoryNames).toContain('Snacks');
  });

  test('GET /api/v1/recipes - Should list published recipes and exclude future scheduled recipes', async () => {
    // Regular published recipe
    await Recipe.create({
      title: 'Butter Chicken',
      slug: 'butter-chicken',
      description: 'Rich and creamy chicken curry',
      category: category1._id,
      categoryName: 'Veg',
      isPublished: true,
      isScheduled: false,
    });

    // Future scheduled recipe
    const futureDate = new Date(Date.now() + 86400000); // 1 day in future
    await Recipe.create({
      title: 'Future Scheduled Recipe',
      slug: 'future-scheduled-recipe',
      description: 'Coming soon recipe',
      category: category1._id,
      categoryName: 'Veg',
      isPublished: false,
      isScheduled: true,
      scheduledDate: futureDate.toISOString().split('T')[0],
      scheduledTime: '12:00',
      scheduledAt: futureDate,
    });

    const res = await request(app).get('/api/v1/recipes');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Butter Chicken');
  });

  test('GET /api/v1/recipes/search - Should search recipes by query term', async () => {
    await Recipe.create({
      title: 'Special Biryani',
      slug: 'special-biryani',
      description: 'Aromatic rice dish',
      category: category1._id,
      isPublished: true,
    });

    const res = await request(app).get('/api/v1/recipes/search?q=biryani');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Special Biryani');
  });

  test('Cron Job - Should publish due scheduled recipes', async () => {
    const pastDate = new Date(Date.now() - 600000); // 10 minutes in past
    const scheduledRecipe = await Recipe.create({
      title: 'Past Scheduled Dish',
      slug: 'past-scheduled-dish',
      description: 'Scheduled recipe that is due now',
      category: category1._id,
      isPublished: false,
      isScheduled: true,
      scheduledDate: pastDate.toISOString().split('T')[0],
      scheduledTime: '00:00',
      scheduledAt: pastDate,
    });

    expect(scheduledRecipe.isPublished).toBe(false);

    await checkAndPublishScheduledRecipes();

    const updated = await Recipe.findById(scheduledRecipe._id);
    expect(updated.isPublished).toBe(true);
    expect(updated.isScheduled).toBe(false);
  });

  test('POST /api/v1/admin/recipes - Should accept multipart/form-data with stringified JSON fields', async () => {
    const res = await request(app)
      .post('/api/v1/admin/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('title', 'Chicken Biryani Dum')
      .field('slug', 'chicken-biryani-dum')
      .field('description', 'Aromatic layered basmati rice')
      .field('category', category1._id.toString())
      .field('prepTime', '20')
      .field('cookTime', '40')
      .field('servings', '4')
      .field('difficulty', 'Medium')
      .field('tags', JSON.stringify(['Indian', 'Spiced']))
      .field('ingredients', JSON.stringify([{ item: 'Basmati Rice', qty: '500g', note: 'soaked' }]))
      .field('instructions', JSON.stringify(['Marinate chicken in yogurt', 'Cook on dum']))
      .field('nutrition', JSON.stringify({ calories: '550 kcal', protein: '35g' }))
      .attach('image', Buffer.from('fake image content'), 'test.jpg');

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Chicken Biryani Dum');
    expect(res.body.data.tags).toContain('Indian');
    expect(res.body.data.ingredients.length).toBe(1);
    expect(res.body.data.instructions.length).toBe(2);
    expect(res.body.data.nutrition.calories).toBe('550 kcal');
  });
});

const request = require('supertest');
const app = require('../src/app');
const Category = require('../src/models/Category.model');
const Recipe = require('../src/models/Recipe.model');
const User = require('../src/models/User.model');
const ROLES = require('../src/constants/roles');

describe('Recipe API Endpoints', () => {
  let adminToken;
  let category;

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

    // Create Category
    category = await Category.create({
      name: 'Veg',
      slug: 'veg',
      description: 'Vegetarian recipes',
    });
  });

  test('POST /api/v1/admin/recipes - Should allow admin to create a recipe', async () => {
    const res = await request(app)
      .post('/api/v1/admin/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Paneer Butter Masala',
        description: 'Rich tomato based cottage cheese gravy',
        category: category._id,
        prepTime: 15,
        cookTime: 20,
        difficulty: 'Easy',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('paneer-butter-masala');
  });

  test('GET /api/v1/recipes - Should list published recipes', async () => {
    await Recipe.create({
      title: 'Butter Chicken',
      slug: 'butter-chicken',
      description: 'Rich and creamy chicken curry',
      category: category._id,
      categoryName: 'Veg',
      isPublished: true,
    });

    const res = await request(app).get('/api/v1/recipes');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.meta.total).toBe(1);
  });

  test('GET /api/v1/recipes/search - Should search recipes by query term', async () => {
    await Recipe.create({
      title: 'Special Biryani',
      slug: 'special-biryani',
      description: 'Aromatic rice dish',
      category: category._id,
      isPublished: true,
    });

    const res = await request(app).get('/api/v1/recipes/search?q=biryani');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Special Biryani');
  });
});

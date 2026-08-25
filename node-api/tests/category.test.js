const request = require('supertest');
const app = require('../src/app');
const Category = require('../src/models/Category.model');
const Recipe = require('../src/models/Recipe.model');
const User = require('../src/models/User.model');
const ROLES = require('../src/constants/roles');

describe('Category API Endpoints', () => {
  let adminToken;

  beforeEach(async () => {
    await User.create({
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
  });

  test('GET /api/v1/categories - Should return public active categories', async () => {
    await Category.create({ name: 'Desserts', slug: 'desserts' });

    const res = await request(app).get('/api/v1/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  test('DELETE /api/v1/admin/categories/:id - Should block deletion if recipes rely on it', async () => {
    const cat = await Category.create({ name: 'Snacks', slug: 'snacks' });
    await Recipe.create({
      title: 'Samosa',
      slug: 'samosa',
      description: 'Crispy potato snack',
      category: cat._id,
    });

    const res = await request(app)
      .delete(`/api/v1/admin/categories/${cat._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe('CATEGORY_IN_USE');
  });
});

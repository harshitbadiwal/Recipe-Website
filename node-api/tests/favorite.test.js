const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User.model');
const Category = require('../src/models/Category.model');
const Recipe = require('../src/models/Recipe.model');

describe('Favorites API Endpoints', () => {
  let userToken;
  let recipe;

  beforeEach(async () => {
    const regRes = await request(app).post('/api/v1/auth/register').send({
      name: 'User One',
      email: 'user1@example.com',
      password: 'password123',
    });
    userToken = regRes.body.data.accessToken;

    const cat = await Category.create({ name: 'Veg', slug: 'veg' });
    recipe = await Recipe.create({
      title: 'Butter Paneer',
      slug: 'butter-paneer',
      description: 'Tasty curry',
      category: cat._id,
    });
  });

  test('POST /api/v1/users/me/favorites/:recipeId - Should add recipe to favorites', async () => {
    const res = await request(app)
      .post(`/api/v1/users/me/favorites/${recipe._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/v1/users/me/favorites/:recipeId - Should prevent duplicate favorites', async () => {
    await request(app)
      .post(`/api/v1/users/me/favorites/${recipe._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    const res = await request(app)
      .post(`/api/v1/users/me/favorites/${recipe._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(409);
  });
});

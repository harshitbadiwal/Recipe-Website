const request = require('supertest');
const app = require('../src/app');

describe('Newsletter API Endpoints', () => {
  test('POST /api/v1/newsletter/subscribe - Should subscribe email', async () => {
    const res = await request(app).post('/api/v1/newsletter/subscribe').send({
      email: 'subscriber@example.com',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('subscriber@example.com');
  });

  test('POST /api/v1/newsletter/unsubscribe - Should unsubscribe email', async () => {
    await request(app).post('/api/v1/newsletter/subscribe').send({
      email: 'subscriber@example.com',
    });

    const res = await request(app).post('/api/v1/newsletter/unsubscribe').send({
      email: 'subscriber@example.com',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isSubscribed).toBe(false);
  });
});

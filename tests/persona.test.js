const request= require('supertest');
const app= require('../app');

describe('GET /personas', () => {
  it('debería devolver 200 y un array', async () => {
    const res = await request(app).get('/personas');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

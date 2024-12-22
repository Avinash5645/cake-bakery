import request from 'supertest';
import app from '../pages/api/products/index'; // Update the path if necessary

describe('Product API Endpoints', () => {
  it('GET /api/products - should fetch all products', async () => {
    const response = await request(app).get('/api/products').query({ page: 1, limit: 5 });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('products');
    expect(Array.isArray(response.body.products)).toBe(true);
  });

  it('POST /api/products - should create a new product', async () => {
    const newProduct = {
      name: 'Test Cake',
      description: 'A delicious test cake',
      price: 15.99,
      image: 'https://example.com/image.jpg',
      category: 'Test Category',
      stock: 10,
    };

    const response = await request(app).post('/api/products').send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', newProduct.name);
  });
});

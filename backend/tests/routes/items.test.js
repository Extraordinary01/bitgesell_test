const request = require('supertest');
const express = require('express');
const fs = require('fs/promises');

// Mock fs so tests don't touch real file system
jest.mock('fs/promises');

const router = require('../../src/routes/items');

const app = express();
app.use(express.json());
app.use('/api/items', router);

// Helper sample data
const sampleData = [
  { id: 1, name: 'Apple', price: 10 },
  { id: 2, name: 'Banana', price: 5 }
];

describe('Items API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fs.readFile.mockResolvedValue(JSON.stringify(sampleData));
  });

  describe('GET /api/items', () => {
    it('should return all items', async () => {
      const res = await request(app).get('/api/items');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(sampleData);
    });

    it('should filter items by query q', async () => {
      const res = await request(app).get('/api/items').query({ q: 'apple' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ id: 1, name: 'Apple', price: 10 }]);
    });

    it('should limit items', async () => {
      const res = await request(app).get('/api/items').query({ limit: 1 });
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return an item by id', async () => {
      const res = await request(app).get('/api/items/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(sampleData[0]);
    });

    it('should return 404 if item not found', async () => {
      const res = await request(app).get('/api/items/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Item not found' });
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item', async () => {
      fs.writeFile.mockResolvedValue();
      const newItem = { name: 'Cherry', price: 15 };

      const res = await request(app)
        .post('/api/items')
        .send(newItem);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe(newItem.name);
      expect(res.body.price).toBe(newItem.price);
      expect(res.body.id).toBeDefined();
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should return 400 if validation fails', async () => {
      const badItem = { name: '', price: -5 };
      const res = await request(app).post('/api/items').send(badItem);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/Validation error/);
    });
  });
});

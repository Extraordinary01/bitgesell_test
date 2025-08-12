const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const Joi = require('joi');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Joi schema for an item (without id, which we assign)
const itemSchema = Joi.object({
  name: Joi.string().min(1).required(),
  price: Joi.number().positive().required()
});

// Utility to read data
async function readData() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { limit = 10, page = 1, q } = req.query;
    let results = data;

    // Search filter
    if (q) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(q.toLowerCase())
      );
    }

    const total = results.length;
    const perPage = parseInt(limit, 10);
    const currentPage = parseInt(page, 10);

    // Pagination slice
    const start = (currentPage - 1) * perPage;
    const paginated = results.slice(start, start + perPage);

    res.json({
      total,
      page: currentPage,
      limit: perPage,
      items: paginated
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id, 10));
    if (!item) {
      res.status(404).send({'error': 'Item not found'})
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const { error, value } = itemSchema.validate(req.body);
    if (error) {
      res.status(400).send({'error': `Validation error: ${error.details[0].message}`})
    }
    const data = await readData();
    const newItem = { id: Date.now(), ...value };
    data.push(newItem);
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

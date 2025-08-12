const { setupServer } = require('msw/node');
const { rest } = require('msw');

const mockItems = [
  { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 },
  { id: 2, name: 'Ergonomic Chair', category: 'Furniture', price: 799 },
];

const server = setupServer(
  rest.get('/api/items', (req, res, ctx) => {
    const q = req.url.searchParams.get('q');
    let filtered = mockItems;
    if (q) filtered = filtered.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
    return res(ctx.json({ total: filtered.length, page: 1, limit: filtered.length, items: filtered }));
  }),

  rest.get('/api/items/:id', (req, res, ctx) => {
    const item = mockItems.find(i => i.id === parseInt(req.params.id, 10));
    if (!item) return res(ctx.status(404));
    return res(ctx.json(item));
  })
);

module.exports = { server, rest };

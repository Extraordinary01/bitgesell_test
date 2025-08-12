const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json');

let statsCache = null;
let lastUpdated = null;


function calculateStats(callback) {
  fs.readFile(DATA_PATH, 'utf-8', (err, raw) => {
    if (err) return callback(err);

    const items = JSON.parse(raw);
    statsCache = {
      total: items.length,
      averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length
    };
    lastUpdated = new Date();
    callback(null, statsCache);
  });
}

fs.watch(DATA_PATH, { persistent: false }, () => {
  console.log('Data file changed, recalculating stats...');
  calculateStats((err) => {
    if (err) console.error('Failed to recalc stats:', err);
  });
});

calculateStats((err) => {
  if (err) console.error('Failed to load initial stats:', err);
});

// GET /api/stats
router.get('/', (req, res, next) => {
  if (statsCache) {
    return res.json(statsCache);
  }

  calculateStats((err, stats) => {
    if (err) return next(err);
    res.json(stats);
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/stats - Dashboard summary metrics
router.get('/', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/reset - Reset sample demo data
router.post('/reset', (req, res) => {
  try {
    db.resetToSeedData();
    res.json({ success: true, message: 'Database reset to initial demo seeds successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

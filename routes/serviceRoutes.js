const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/services - Retrieve all services
router.get('/', (req, res) => {
  try {
    const services = db.getAllServices();
    res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/services/:id - Retrieve single service by ID
router.get('/:id', (req, res) => {
  try {
    const service = db.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

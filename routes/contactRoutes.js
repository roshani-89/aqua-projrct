const express = require('express');
const router = express.Router();
const db = require('../database/db');

// POST /api/contact - Submit inquiry message
router.post('/', (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    db.createInquiry({ name, phone, email, subject: subject || 'General Inquiry', message });
    res.status(201).json({ success: true, message: 'Inquiry submitted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/contact - Retrieve all inquiries (for admin)
router.get('/', (req, res) => {
  try {
    const inquiries = db.getAllInquiries();
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

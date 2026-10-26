const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/bookings - List all bookings with optional query filters (search, status)
router.get('/', (req, res) => {
  try {
    const { search = '', status = 'All' } = req.query;
    const bookings = db.getAllBookings(search, status);
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/:identifier - Search single booking by Request ID or Phone
router.get('/:identifier', (req, res) => {
  try {
    const booking = db.getBookingByIdOrPhone(req.params.identifier);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/bookings - Create new service booking
router.post('/', (req, res) => {
  try {
    const { serviceId, serviceName, customerName, phone, address, preferredDate, preferredTime, price } = req.body;

    // Basic Validation
    if (!serviceName || !customerName || !phone || !address || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking fields (serviceName, customerName, phone, address, preferredDate, preferredTime)'
      });
    }

    const newBooking = db.createBooking(req.body);
    res.status(201).json({
      success: true,
      message: 'Service booking request created successfully',
      data: newBooking
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/bookings/:id/status - Update booking status and technician
router.patch('/:id/status', (req, res) => {
  try {
    const { status, technician } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status field is required' });
    }

    const updated = db.updateBookingStatus(req.params.id, status, technician);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/bookings/:id - Delete a booking
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.deleteBooking(req.params.id);
    res.json({ success: true, message: `Booking ${req.params.id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../database/db');

// POST /api/auth/register - Register new user
router.post('/register', (req, res) => {
  try {
    const { name, email, phone, password, address, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone number, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const newUser = db.registerUser({
      name,
      email,
      phone,
      password,
      address,
      role: role || 'customer'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to AquaCare.',
      user: newUser
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login - Login user
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and password.'
      });
    }

    const user = db.authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password. Please try again.'
      });
    }

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/user/:id - Get user profile
router.get('/user/:id', (req, res) => {
  try {
    const user = db.getUserById(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

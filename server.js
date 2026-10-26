/**
 * AquaCare - Online Water Service Booking Website
 * Backend Server Application (Express + SQLite)
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statsRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'AquaCare Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: 'SQLite (aquacare.db)'
  });
});

// Fallback 404 for API requests
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('\n======================================================');
  console.log('💧 AquaCare - Online Water Service Booking Backend 💧');
  console.log('======================================================');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`🌐 Website Home:      http://localhost:${PORT}/index.html`);
  console.log(`📋 Service Catalog:   http://localhost:${PORT}/services.html`);
  console.log(`📅 Online Booking:    http://localhost:${PORT}/booking.html`);
  console.log(`📍 Request Tracker:   http://localhost:${PORT}/track.html`);
  console.log(`🛡️  Admin Dashboard:   http://localhost:${PORT}/admin.html`);
  console.log(`🩺 Health API:        http://localhost:${PORT}/api/health`);
  console.log('======================================================\n');
});

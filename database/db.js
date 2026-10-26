const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Ensure data folder exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbFilePath = path.join(dataDir, 'aquacare.db');

// Use Node's built-in SQLite (DatabaseSync)
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync(dbFilePath);

// Initialize Tables
function initDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
  seedInitialData();
}

// Initial Services
const SEED_SERVICES = [
  {
    id: "ro-repair",
    category: "repair",
    name: "RO Water Purifier Repair",
    price: 399,
    original_price: 499,
    tag: "Most Popular",
    duration: "45 - 60 mins",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=600&q=80",
    description: "Complete diagnosis, leak fixes, pump repair, motor issues, and electrical troubleshooting for all RO models.",
    features: JSON.stringify([
      "Full internal system health check",
      "Leakage detection & joint sealing",
      "Water pressure & TDS check",
      "30-day service warranty"
    ])
  },
  {
    id: "filter-replacement",
    category: "maintenance",
    name: "Complete Filter Replacement",
    price: 1299,
    original_price: 1599,
    tag: "Recommended",
    duration: "30 - 45 mins",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80",
    description: "Replacement of Sediment filter, Pre-Carbon, Post-Carbon, and RO Membrane with certified genuine components.",
    features: JSON.stringify([
      "100% genuine certified filters",
      "Removal of bad odor and taste",
      "TDS calibration and water purity audit",
      "Old filter disposal & sanitization"
    ])
  },
  {
    id: "ro-installation",
    category: "installation",
    name: "RO Purifier Installation / Uninstallation",
    price: 549,
    original_price: 699,
    tag: "Quick Service",
    duration: "45 mins",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    description: "Safe and secure wall mounting, plumbing connection, inlet valve setup, and initial run test by certified experts.",
    features: JSON.stringify([
      "Neat wall-mount alignment",
      "Plumbing pipe connector installation",
      "Inlet pressure adjustment",
      "Complete operational safety check"
    ])
  },
  {
    id: "tank-cleaning",
    category: "cleaning",
    name: "Water Tank Deep Cleaning",
    price: 899,
    original_price: 1199,
    tag: "Hygiene Special",
    duration: "60 - 90 mins",
    image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80",
    description: "High-pressure motorized sludge removal, anti-bacterial UV treatment, and chemical-free tank sanitization.",
    features: JSON.stringify([
      "Sludge and sediment extraction",
      "High-pressure jet wash",
      "Eco-friendly anti-bacterial spray",
      "Suitable for up to 1000L tanks"
    ])
  },
  {
    id: "annual-maintenance",
    category: "maintenance",
    name: "AquaCare Annual Maintenance (AMC)",
    price: 2499,
    original_price: 3200,
    tag: "Best Value",
    duration: "1 Year Plan",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    description: "Peace of mind year-round. Includes 3 free routine services, free filter changes, and zero labor charges.",
    features: JSON.stringify([
      "3 Scheduled maintenance visits",
      "1 Complete set of replacement filters",
      "Unlimited emergency breakdown calls",
      "Priority customer support"
    ])
  },
  {
    id: "water-quality-test",
    category: "inspection",
    name: "Water Quality & TDS Lab Testing",
    price: 199,
    original_price: 299,
    tag: "Essential",
    duration: "20 mins",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80",
    description: "Scientific testing of Total Dissolved Solids (TDS), pH balance, hardness, and chlorine levels at your doorstep.",
    features: JSON.stringify([
      "Digital calibrated TDS measurement",
      "pH alkalinity test",
      "Instant printed/digital purity report",
      "Expert filter recommendation"
    ])
  }
];

// Initial Bookings for Demo / Academic Viva
const SEED_BOOKINGS = [
  {
    request_id: "AQ-84920",
    service_id: "ro-repair",
    service_name: "RO Water Purifier Repair",
    customer_name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul.sharma@example.com",
    address: "Flat 402, Sunshine Heights, MG Road, Pune",
    purifier_brand: "Kent Grand Plus",
    preferred_date: "2026-10-27",
    preferred_time: "10:00 AM - 12:00 PM",
    notes: "Continuous water dripping from the bottom valve.",
    price: 399,
    status: "In Progress",
    technician: "Amit Verma (+91 91234 56789)",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    request_id: "AQ-71204",
    service_id: "filter-replacement",
    service_name: "Complete Filter Replacement",
    customer_name: "Priya Nair",
    phone: "9811223344",
    email: "priya.nair@example.com",
    address: "B-12, Green Glen Layout, Bellandur, Bengaluru",
    purifier_brand: "Aquaguard Geneus",
    preferred_date: "2026-10-25",
    preferred_time: "02:00 PM - 04:00 PM",
    notes: "Water taste has changed and alarm is beeping.",
    price: 1299,
    status: "Completed",
    technician: "Suresh Patil (+91 99887 76655)",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    request_id: "AQ-93451",
    service_id: "annual-maintenance",
    service_name: "AquaCare Annual Maintenance (AMC)",
    customer_name: "Deepak Mehta",
    phone: "9944556677",
    email: "deepak.mehta@example.com",
    address: "Plot 88, Sector 15, Vashi, Navi Mumbai",
    purifier_brand: "Pureit Ultima",
    preferred_date: "2026-10-28",
    preferred_time: "04:00 PM - 06:00 PM",
    notes: "Want complete yearly servicing coverage.",
    price: 2499,
    status: "Requested",
    technician: "Pending assignment",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date().toISOString()
  }
];

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + '_aquacare_salt').digest('hex');
}

function seedUsers() {
  const count = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO users (name, email, phone, password_hash, address, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    insert.run(
      'AquaCare Administrator',
      'admin@aquacare.com',
      '18001234567',
      hashPassword('admin123'),
      'AquaCare HQ, Pune',
      'admin',
      now
    );
    insert.run(
      'Rahul Sharma',
      'rahul.sharma@example.com',
      '9876543210',
      hashPassword('customer123'),
      'Flat 402, Sunshine Heights, MG Road, Pune',
      'customer',
      now
    );
  }
}

function seedInitialData() {
  seedUsers();
  // Check if services already exist
  const serviceCount = db.prepare("SELECT COUNT(*) as count FROM services").get().count;
  if (serviceCount === 0) {
    const insertService = db.prepare(`
      INSERT INTO services (id, category, name, price, original_price, tag, duration, image, description, features)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const s of SEED_SERVICES) {
      insertService.run(s.id, s.category, s.name, s.price, s.original_price, s.tag, s.duration, s.image, s.description, s.features);
    }
  }

  // Check if bookings already exist
  const bookingCount = db.prepare("SELECT COUNT(*) as count FROM bookings").get().count;
  if (bookingCount === 0) {
    const insertBooking = db.prepare(`
      INSERT INTO bookings (request_id, service_id, service_name, customer_name, phone, email, address, purifier_brand, preferred_date, preferred_time, notes, price, status, technician, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const b of SEED_BOOKINGS) {
      insertBooking.run(b.request_id, b.service_id, b.service_name, b.customer_name, b.phone, b.email, b.address, b.purifier_brand, b.preferred_date, b.preferred_time, b.notes, b.price, b.status, b.technician, b.created_at, b.updated_at);
    }
  }
}

// Service Methods
function getAllServices() {
  const rows = db.prepare("SELECT * FROM services").all();
  return rows.map(r => ({
    ...r,
    originalPrice: r.original_price,
    features: JSON.parse(r.features)
  }));
}

function getServiceById(id) {
  const r = db.prepare("SELECT * FROM services WHERE id = ?").get(id);
  if (!r) return null;
  return {
    ...r,
    originalPrice: r.original_price,
    features: JSON.parse(r.features)
  };
}

// Booking Methods
function getAllBookings(search = '', status = 'All') {
  let sql = "SELECT * FROM bookings WHERE 1=1";
  const params = [];

  if (status && status !== 'All') {
    sql += " AND status = ?";
    params.push(status);
  }

  if (search) {
    sql += " AND (request_id LIKE ? OR customer_name LIKE ? OR phone LIKE ?)";
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  sql += " ORDER BY datetime(created_at) DESC";

  const rows = db.prepare(sql).all(...params);
  return rows.map(formatBookingRow);
}

function getBookingByIdOrPhone(identifier) {
  const clean = identifier.trim();
  const row = db.prepare(`
    SELECT * FROM bookings 
    WHERE UPPER(request_id) = UPPER(?) OR phone LIKE ?
    ORDER BY datetime(created_at) DESC LIMIT 1
  `).get(clean, `%${clean}%`);

  return row ? formatBookingRow(row) : null;
}

function createBooking(data) {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const requestId = `AQ-${randomNum}`;
  const now = new Date().toISOString();

  const insert = db.prepare(`
    INSERT INTO bookings (request_id, service_id, service_name, customer_name, phone, email, address, purifier_brand, preferred_date, preferred_time, notes, price, status, technician, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run(
    requestId,
    data.serviceId,
    data.serviceName,
    data.customerName,
    data.phone,
    data.email || 'Not Provided',
    data.address,
    data.purifierBrand || 'Standard RO',
    data.preferredDate,
    data.preferredTime,
    data.notes || 'None',
    Number(data.price) || 399,
    'Requested',
    'Assigning Technician...',
    now,
    now
  );

  return getBookingByIdOrPhone(requestId);
}

function updateBookingStatus(requestId, status, technician) {
  const now = new Date().toISOString();
  let sql = "UPDATE bookings SET status = ?, updated_at = ?";
  const params = [status, now];

  if (technician) {
    sql += ", technician = ?";
    params.push(technician);
  }

  sql += " WHERE UPPER(request_id) = UPPER(?)";
  params.push(requestId.trim());

  db.prepare(sql).run(...params);
  return getBookingByIdOrPhone(requestId);
}

function deleteBooking(requestId) {
  db.prepare("DELETE FROM bookings WHERE UPPER(request_id) = UPPER(?)").run(requestId.trim());
  return true;
}

// Summary Metrics for Admin
function getStats() {
  const total = db.prepare("SELECT COUNT(*) as count FROM bookings").get().count;
  const active = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status IN ('Requested', 'Assigned', 'In Progress')").get().count;
  const completed = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'Completed'").get().count;
  const revenueRow = db.prepare("SELECT SUM(price) as total FROM bookings").get();
  const revenue = revenueRow.total || 0;

  return { total, active, completed, revenue };
}

// Contact Inquiries
function createInquiry(data) {
  const now = new Date().toISOString();
  const insert = db.prepare(`
    INSERT INTO inquiries (name, phone, email, subject, message, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insert.run(data.name, data.phone, data.email, data.subject, data.message, now);
  return { success: true };
}

function getAllInquiries() {
  return db.prepare("SELECT * FROM inquiries ORDER BY datetime(created_at) DESC").all();
}

// User Authentication Methods
function registerUser(data) {
  const existing = db.prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(?)").get(data.email.trim());
  if (existing) {
    throw new Error("An account with this email address already exists.");
  }

  const now = new Date().toISOString();
  const insert = db.prepare(`
    INSERT INTO users (name, email, phone, password_hash, address, role, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run(
    data.name.trim(),
    data.email.trim().toLowerCase(),
    data.phone.trim(),
    hashPassword(data.password),
    data.address ? data.address.trim() : '',
    data.role || 'customer',
    now
  );

  return getUserByEmail(data.email.trim());
}

function authenticateUser(email, password) {
  const user = db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)").get(email.trim());
  if (!user) {
    return null;
  }
  const expectedHash = hashPassword(password);
  if (user.password_hash !== expectedHash) {
    return null;
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    createdAt: user.created_at
  };
}

function getUserByEmail(email) {
  const user = db.prepare("SELECT id, name, email, phone, address, role, created_at FROM users WHERE LOWER(email) = LOWER(?)").get(email.trim());
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    createdAt: user.created_at
  };
}

function getUserById(id) {
  const user = db.prepare("SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = ?").get(id);
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    createdAt: user.created_at
  };
}

// Reset data to seeds
function resetToSeedData() {
  db.exec("DELETE FROM bookings");
  db.exec("DELETE FROM inquiries");
  db.exec("DELETE FROM users");
  seedInitialData();
  return true;
}

// Helper to format DB columns into camelCase matching frontend expectations
function formatBookingRow(r) {
  return {
    requestId: r.request_id,
    serviceId: r.service_id,
    serviceName: r.service_name,
    customerName: r.customer_name,
    phone: r.phone,
    email: r.email,
    address: r.address,
    purifierBrand: r.purifier_brand,
    preferredDate: r.preferred_date,
    preferredTime: r.preferred_time,
    notes: r.notes,
    price: r.price,
    status: r.status,
    technician: r.technician,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

// Initialize on require
initDatabase();

module.exports = {
  getAllServices,
  getServiceById,
  getAllBookings,
  getBookingByIdOrPhone,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  getStats,
  createInquiry,
  getAllInquiries,
  resetToSeedData,
  registerUser,
  authenticateUser,
  getUserByEmail,
  getUserById
};

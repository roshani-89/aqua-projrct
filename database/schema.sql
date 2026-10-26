-- AquaCare SQLite Database Schema

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  original_price REAL NOT NULL,
  tag TEXT,
  duration TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT NOT NULL -- JSON string of feature bullet points
);

CREATE TABLE IF NOT EXISTS bookings (
  request_id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  purifier_brand TEXT,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  notes TEXT,
  price REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'Requested', -- Requested, Assigned, In Progress, Completed, Cancelled
  technician TEXT DEFAULT 'Assigning Technician...',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);

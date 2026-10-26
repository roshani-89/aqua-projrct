# AquaCare – Online Water Service Booking Website (Full-Stack)

**AquaCare** is a full-stack web application designed for booking and managing water purifier and water-related doorstep services for residential and commercial customers.

---

## 🏗️ Architecture & Technology Stack

- **Frontend:**
  - **HTML5 & CSS3:** Semantic structure, custom aqua-blue palette, glassmorphism cards, and print invoice styling.
  - **Bootstrap 5.3 & Bootstrap Icons:** Mobile-responsive grid, modals, badges, and alerts.
  - **JavaScript (Vanilla ES6):** Asynchronous API fetch integration, price calculation, timeline stepper, and LocalStorage offline fallback.
- **Backend:**
  - **Node.js (v24.x):** Fast, asynchronous server runtime.
  - **Express.js (v5.x):** RESTful API routing, middleware (CORS, Morgan, JSON parser).
- **Database:**
  - **SQLite (`data/aquacare.db`):** Serverless, transactional SQL database with prepared statements and foreign-key integrity.

---

## 🔐 User Authentication & Roles

The system supports full user registration, login, session management, and role-based permissions:

| Role | Demo Email | Demo Password | Capabilities |
|---|---|---|---|
| **Customer** | `rahul.sharma@example.com` | `customer123` | Book services, track orders, auto-fill address, view profile |
| **Administrator** | `admin@aquacare.com` | `admin123` | Access admin dashboard, update request statuses, assign field engineers, export CSV |

### Auth API Endpoints:
- `POST /api/auth/register` — Register new customer account (hashes password with salt)
- `POST /api/auth/login` — Authenticate customer or administrator
- `GET /api/auth/user/:id` — Retrieve user profile info

---

## 🔌 RESTful API Documentation

| Method | Endpoint | Description | Sample Payload / Params |
|---|---|---|---|
| `GET` | `/api/health` | Server & database health status | — |
| `GET` | `/api/services` | Retrieve list of all water services | — |
| `GET` | `/api/services/:id` | Get details of a single service | `id`: e.g. `ro-repair` |
| `GET` | `/api/bookings` | List all bookings (supports search & filter) | `?search=Rahul&status=In Progress` |
| `GET` | `/api/bookings/:id` | Lookup booking by Request ID or Phone | `id`: e.g. `AQ-84920` or `9876543210` |
| `POST` | `/api/bookings` | Create a new service booking | `{"serviceId":"ro-repair","serviceName":"...","customerName":"...","phone":"...","address":"...","preferredDate":"...","preferredTime":"...","price":399}` |
| `PATCH`| `/api/bookings/:id/status` | Update booking status & assign technician | `{"status":"In Progress","technician":"Amit Verma (+91 91234 56789)"}` |
| `DELETE`| `/api/bookings/:id` | Delete booking record | `id`: e.g. `AQ-84920` |
| `GET` | `/api/stats` | Dashboard metrics (total, active, completed, revenue) | — |
| `POST` | `/api/contact` | Submit customer support inquiry | `{"name":"...","phone":"...","email":"...","subject":"...","message":"..."}` |
| `GET` | `/api/contact` | View all customer inquiries | — |
| `POST` | `/api/stats/reset` | Reset database to initial sample records | — |

---

## 🗄️ Database Schema (`data/aquacare.db`)

1. **`services`** table:
   - `id` (TEXT, PK)
   - `category` (TEXT)
   - `name` (TEXT)
   - `price` (REAL)
   - `original_price` (REAL)
   - `tag` (TEXT)
   - `duration` (TEXT)
   - `image` (TEXT)
   - `description` (TEXT)
   - `features` (TEXT, JSON array)

2. **`bookings`** table:
   - `request_id` (TEXT, PK — e.g. `AQ-84920`)
   - `service_id` (TEXT)
   - `service_name` (TEXT)
   - `customer_name` (TEXT)
   - `phone` (TEXT)
   - `email` (TEXT)
   - `address` (TEXT)
   - `purifier_brand` (TEXT)
   - `preferred_date` (TEXT)
   - `preferred_time` (TEXT)
   - `notes` (TEXT)
   - `price` (REAL)
   - `status` (TEXT — `Requested`, `Assigned`, `In Progress`, `Completed`, `Cancelled`)
   - `technician` (TEXT)
   - `created_at` (TEXT, ISO 8601)
   - `updated_at` (TEXT, ISO 8601)

3. **`inquiries`** table:
   - `id` (INTEGER, PK AUTOINCREMENT)
   - `name`, `phone`, `email`, `subject`, `message`, `created_at`

---

## 📁 Project Directory Structure

```
aqua project/
├── server.js               # Express backend application server
├── start-server.bat        # Windows 1-click batch launcher
├── package.json            # Node.js dependencies and run scripts
├── database/
│   ├── schema.sql          # SQL table definitions
│   └── db.js               # SQLite connection, CRUD methods & auto-seeding
├── data/
│   └── aquacare.db         # Persistent SQLite database file
├── routes/
│   ├── serviceRoutes.js    # Routes for services catalog
│   ├── bookingRoutes.js    # Routes for booking lifecycle & status updates
│   ├── contactRoutes.js    # Routes for contact inquiries
│   └── statsRoutes.js      # Routes for admin summary metrics
├── index.html              # Home page with quick booking & tracking
├── services.html           # Full services catalog & comparison matrix
├── booking.html            # Online booking workflow with live pricing
├── track.html              # Real-time tracking timeline & printable invoice
├── contact.html            # Contact & support channels
├── admin.html              # Admin operations dashboard & CSV export
├── css/
│   └── style.css           # Custom styling & responsive layouts
└── js/
    └── app.js              # Client JS integrating with Backend API + LocalStorage fallback
```

---

## 🚀 How to Run the Project

### Option A: Using the 1-Click Launcher (Windows)
Double-click [**`start-server.bat`**](file:///c:/Users/roshani/OneDrive/Desktop/aqua project/start-server.bat). It will launch the Express server and display:
```
======================================================
💧 AquaCare - Online Water Service Booking Backend 💧
======================================================
🚀 Server running on: http://localhost:5000
🌐 Website Home:      http://localhost:5000/index.html
📋 Service Catalog:   http://localhost:5000/services.html
📅 Online Booking:    http://localhost:5000/booking.html
📍 Request Tracker:   http://localhost:5000/track.html
🛡️  Admin Dashboard:   http://localhost:5000/admin.html
🩺 Health API:        http://localhost:5000/api/health
======================================================
```

### Option B: Using the Command Line
```bash
# Start server
node server.js
```
Then open your browser and navigate to:
**`http://localhost:5000`**

### Option C: Offline Standalone Mode
If opened directly by double-clicking `index.html` without running Node.js, the website continues to work using built-in HTML5 `localStorage` fallback.

---

## 🧪 Testing Live Data & Status Transitions

1. Visit **`http://localhost:5000/booking.html`** and submit a new water service request.
2. Note your generated Request ID (e.g. `AQ-84920`).
3. Open **`http://localhost:5000/track.html`** to see your booking status live on the animated progress stepper.
4. Open **`http://localhost:5000/admin.html`** in another tab to view the new booking in the database, assign a technician, update the status from *Requested* ➔ *Assigned* ➔ *In Progress* ➔ *Completed*, and watch the tracker update in real time!

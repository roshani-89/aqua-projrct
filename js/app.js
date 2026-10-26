/**
 * AquaCare - Online Water Service Booking Website
 * Shared Frontend Logic with Full Backend API Support & LocalStorage Fallback
 */

// Service Catalog Data
const AQUA_SERVICES = [
  {
    id: "ro-repair",
    category: "repair",
    name: "RO Water Purifier Repair",
    price: 399,
    originalPrice: 499,
    tag: "Most Popular",
    duration: "45 - 60 mins",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=600&q=80",
    description: "Complete diagnosis, leak fixes, pump repair, motor issues, and electrical troubleshooting for all RO models.",
    features: [
      "Full internal system health check",
      "Leakage detection & joint sealing",
      "Water pressure & TDS check",
      "30-day service warranty"
    ]
  },
  {
    id: "filter-replacement",
    category: "maintenance",
    name: "Complete Filter Replacement",
    price: 1299,
    originalPrice: 1599,
    tag: "Recommended",
    duration: "30 - 45 mins",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80",
    description: "Replacement of Sediment filter, Pre-Carbon, Post-Carbon, and RO Membrane with certified genuine components.",
    features: [
      "100% genuine certified filters",
      "Removal of bad odor and taste",
      "TDS calibration and water purity audit",
      "Old filter disposal & sanitization"
    ]
  },
  {
    id: "ro-installation",
    category: "installation",
    name: "RO Purifier Installation / Uninstallation",
    price: 549,
    originalPrice: 699,
    tag: "Quick Service",
    duration: "45 mins",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    description: "Safe and secure wall mounting, plumbing connection, inlet valve setup, and initial run test by certified experts.",
    features: [
      "Neat wall-mount alignment",
      "Plumbing pipe connector installation",
      "Inlet pressure adjustment",
      "Complete operational safety check"
    ]
  },
  {
    id: "tank-cleaning",
    category: "cleaning",
    name: "Water Tank Deep Cleaning",
    price: 899,
    originalPrice: 1199,
    tag: "Hygiene Special",
    duration: "60 - 90 mins",
    image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80",
    description: "High-pressure motorized sludge removal, anti-bacterial UV treatment, and chemical-free tank sanitization.",
    features: [
      "Sludge and sediment extraction",
      "High-pressure jet wash",
      "Eco-friendly anti-bacterial spray",
      "Suitable for up to 1000L tanks"
    ]
  },
  {
    id: "annual-maintenance",
    category: "maintenance",
    name: "AquaCare Annual Maintenance (AMC)",
    price: 2499,
    originalPrice: 3200,
    tag: "Best Value",
    duration: "1 Year Plan",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    description: "Peace of mind year-round. Includes 3 free routine services, free filter changes, and zero labor charges.",
    features: [
      "3 Scheduled maintenance visits",
      "1 Complete set of replacement filters",
      "Unlimited emergency breakdown calls",
      "Priority customer support"
    ]
  },
  {
    id: "water-quality-test",
    category: "inspection",
    name: "Water Quality & TDS Lab Testing",
    price: 199,
    originalPrice: 299,
    tag: "Essential",
    duration: "20 mins",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80",
    description: "Scientific testing of Total Dissolved Solids (TDS), pH balance, hardness, and chlorine levels at your doorstep.",
    features: [
      "Digital calibrated TDS measurement",
      "pH alkalinity test",
      "Instant printed/digital purity report",
      "Expert filter recommendation"
    ]
  }
];

// Offline Seed Bookings (fallback)
const SAMPLE_BOOKINGS = [
  {
    requestId: "AQ-84920",
    serviceId: "ro-repair",
    serviceName: "RO Water Purifier Repair",
    customerName: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul.sharma@example.com",
    address: "Flat 402, Sunshine Heights, MG Road, Pune",
    purifierBrand: "Kent Grand Plus",
    preferredDate: "2026-10-27",
    preferredTime: "10:00 AM - 12:00 PM",
    notes: "Continuous water dripping from the bottom valve.",
    price: 399,
    status: "In Progress",
    technician: "Amit Verma (+91 91234 56789)",
    createdAt: "2026-10-26T14:30:00.000Z"
  },
  {
    requestId: "AQ-71204",
    serviceId: "filter-replacement",
    serviceName: "Complete Filter Replacement",
    customerName: "Priya Nair",
    phone: "9811223344",
    email: "priya.nair@example.com",
    address: "B-12, Green Glen Layout, Bellandur, Bengaluru",
    purifierBrand: "Aquaguard Geneus",
    preferredDate: "2026-10-25",
    preferredTime: "02:00 PM - 04:00 PM",
    notes: "Water taste has changed and alarm is beeping.",
    price: 1299,
    status: "Completed",
    technician: "Suresh Patil (+91 99887 76655)",
    createdAt: "2026-10-24T10:15:00.000Z"
  },
  {
    requestId: "AQ-93451",
    serviceId: "annual-maintenance",
    serviceName: "AquaCare Annual Maintenance (AMC)",
    customerName: "Deepak Mehta",
    phone: "9944556677",
    email: "deepak.mehta@example.com",
    address: "Plot 88, Sector 15, Vashi, Navi Mumbai",
    purifierBrand: "Pureit Ultima",
    preferredDate: "2026-10-28",
    preferredTime: "04:00 PM - 06:00 PM",
    notes: "Want complete yearly servicing coverage.",
    price: 2499,
    status: "Requested",
    technician: "Pending assignment",
    createdAt: "2026-10-26T17:00:00.000Z"
  }
];

// Determine API Base URL
const API_BASE = window.location.protocol.startsWith('http') 
  ? window.location.origin 
  : 'http://localhost:5000';

let backendAvailable = false;

// Check backend availability on load
async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { method: 'GET', signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      backendAvailable = true;
      console.log("Connected to AquaCare Backend (Express + SQLite)");
    }
  } catch (e) {
    backendAvailable = false;
    console.log("AquaCare Backend offline; using LocalStorage mode.");
  }
}

// LocalStorage Fallback Helpers
function initStorage() {
  if (!localStorage.getItem("aquacare_bookings")) {
    localStorage.setItem("aquacare_bookings", JSON.stringify(SAMPLE_BOOKINGS));
  }
}

function getLocalBookings() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem("aquacare_bookings")) || [];
  } catch (e) {
    return [];
  }
}

function saveLocalBookings(bookings) {
  localStorage.setItem("aquacare_bookings", JSON.stringify(bookings));
}

// Async API & LocalStorage Unification
async function getBookingsAsync(search = '', status = 'All') {
  if (backendAvailable) {
    try {
      const url = new URL(`${API_BASE}/api/bookings`);
      if (search) url.searchParams.append('search', search);
      if (status && status !== 'All') url.searchParams.append('status', status);
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) return data.data;
    } catch (e) {
      console.warn("Backend error, falling back to local storage", e);
    }
  }

  // LocalStorage Fallback
  let list = getLocalBookings();
  if (status && status !== 'All') {
    list = list.filter(b => b.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(b => 
      b.requestId.toLowerCase().includes(q) || 
      b.customerName.toLowerCase().includes(q) || 
      b.phone.includes(q)
    );
  }
  return list;
}

async function findBookingAsync(query) {
  if (!query) return null;
  const clean = query.trim().toUpperCase();

  if (backendAvailable) {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      console.warn("Backend lookup failed, checking local", e);
    }
  }

  const list = getLocalBookings();
  return list.find(b => 
    b.requestId.toUpperCase() === clean || 
    b.phone.includes(query.trim())
  ) || null;
}

async function createBookingAsync(data) {
  if (backendAvailable) {
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success && resData.data) {
        return resData.data;
      }
    } catch (e) {
      console.warn("Backend creation failed, creating locally", e);
    }
  }

  // Fallback Local
  const list = getLocalBookings();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const newBooking = {
    requestId: `AQ-${randomNum}`,
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    customerName: data.customerName,
    phone: data.phone,
    email: data.email || "Not Provided",
    address: data.address,
    purifierBrand: data.purifierBrand || "Standard RO",
    preferredDate: data.preferredDate,
    preferredTime: data.preferredTime,
    notes: data.notes || "None",
    price: Number(data.price) || 399,
    status: "Requested",
    technician: "Assigning Technician...",
    createdAt: new Date().toISOString()
  };

  list.unshift(newBooking);
  saveLocalBookings(list);
  return newBooking;
}

async function updateBookingStatusAsync(requestId, newStatus, technicianName) {
  if (backendAvailable) {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${encodeURIComponent(requestId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, technician: technicianName })
      });
      const data = await res.json();
      if (data.success) return true;
    } catch (e) {
      console.warn("Backend status update failed, saving locally", e);
    }
  }

  // Fallback Local
  const list = getLocalBookings();
  const index = list.findIndex(b => b.requestId === requestId);
  if (index !== -1) {
    list[index].status = newStatus;
    if (technicianName) list[index].technician = technicianName;
    saveLocalBookings(list);
    return true;
  }
  return false;
}

async function deleteBookingAsync(requestId) {
  if (backendAvailable) {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${encodeURIComponent(requestId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) return true;
    } catch (e) {
      console.warn("Backend delete failed, deleting locally", e);
    }
  }

  let list = getLocalBookings();
  list = list.filter(b => b.requestId !== requestId);
  saveLocalBookings(list);
  return true;
}

async function getStatsAsync() {
  if (backendAvailable) {
    try {
      const res = await fetch(`${API_BASE}/api/stats`);
      const data = await res.json();
      if (data.success && data.data) return data.data;
    } catch (e) {
      console.warn("Backend stats failed, computing locally", e);
    }
  }

  const list = getLocalBookings();
  const total = list.length;
  const active = list.filter(b => ['Requested', 'Assigned', 'In Progress'].includes(b.status)).length;
  const completed = list.filter(b => b.status === 'Completed').length;
  const revenue = list.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
  return { total, active, completed, revenue };
}

async function resetDataAsync() {
  if (backendAvailable) {
    try {
      const res = await fetch(`${API_BASE}/api/stats/reset`, { method: 'POST' });
      const data = await res.json();
      if (data.success) return true;
    } catch (e) {
      console.warn("Backend reset failed", e);
    }
  }

  localStorage.removeItem("aquacare_bookings");
  initStorage();
  return true;
}

async function submitInquiryAsync(data) {
  if (backendAvailable) {
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) return true;
    } catch (e) {
      console.warn("Inquiry submission fallback", e);
    }
  }
  return true;
}

// Synchronous Backward Compatibility Wrappers
function getBookings() { return getLocalBookings(); }
function findBooking(query) {
  const clean = (query || "").trim().toUpperCase();
  return getLocalBookings().find(b => b.requestId.toUpperCase() === clean || b.phone.includes(query.trim()));
}
function createBooking(data) {
  // Sync fallback
  const list = getLocalBookings();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const newBooking = {
    requestId: `AQ-${randomNum}`,
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    customerName: data.customerName,
    phone: data.phone,
    email: data.email || "Not Provided",
    address: data.address,
    purifierBrand: data.purifierBrand || "Standard RO",
    preferredDate: data.preferredDate,
    preferredTime: data.preferredTime,
    notes: data.notes || "None",
    price: Number(data.price) || 399,
    status: "Requested",
    technician: "Assigning Technician...",
    createdAt: new Date().toISOString()
  };
  list.unshift(newBooking);
  saveLocalBookings(list);
  return newBooking;
}
function updateBookingStatus(requestId, newStatus, technicianName) {
  const list = getLocalBookings();
  const index = list.findIndex(b => b.requestId === requestId);
  if (index !== -1) {
    list[index].status = newStatus;
    if (technicianName) list[index].technician = technicianName;
    saveLocalBookings(list);
    return true;
  }
  return false;
}
function deleteBooking(requestId) {
  let list = getLocalBookings();
  list = list.filter(b => b.requestId !== requestId);
  saveLocalBookings(list);
}

// Toast Helper
function showToast(message, type = "success") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3";
    toastContainer.style.zIndex = "1090";
    document.body.appendChild(toastContainer);
  }

  const toastEl = document.createElement("div");
  const bgClass = type === "success" ? "text-bg-primary" : (type === "danger" ? "text-bg-danger" : "text-bg-dark");
  toastEl.className = `toast align-items-center ${bgClass} border-0 shadow-lg`;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");

  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body fs-6 py-3">
        <i class="bi bi-info-circle-fill me-2"></i> ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  toastContainer.appendChild(toastEl);
  const bsToast = new bootstrap.Toast(toastEl, { delay: 4000 });
  bsToast.show();

  toastEl.addEventListener("hidden.bs.toast", () => {
    toastEl.remove();
  });
}

// Auto Initialize
document.addEventListener("DOMContentLoaded", async () => {
  initStorage();
  await checkBackendHealth();
});

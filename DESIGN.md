# 🩸 BloodBridge — Complete Frontend Specification

> React + Vite + Tailwind CSS + React Router + Axios + Leaflet
> Mobile first, English/French bilingual, Clean medical UI

---

## 🎨 Design System

### Colors
```
Primary Red:     #DC2626  (blood red - main CTAs)
Dark Red:        #991B1B  (hover states)
Light Red:       #FEE2E2  (backgrounds, alerts)
White:           #FFFFFF  (cards, backgrounds)
Gray 50:         #F9FAFB  (page backgrounds)
Gray 100:        #F3F4F6  (input backgrounds)
Gray 600:        #4B5563  (body text)
Gray 900:        #111827  (headings)
Green:           #16A34A  (success, available status)
Amber:           #D97706  (warning, pending status)
```

### Typography
```
Font:      Inter (Google Fonts)
Headings:  font-bold text-gray-900
Body:      text-gray-600
Small:     text-sm text-gray-500
```

### Components Style
```
Buttons:   rounded-lg px-4 py-2 font-medium
Cards:     bg-white rounded-2xl shadow-sm border border-gray-100 p-6
Inputs:    bg-gray-100 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500
Badge:     rounded-full px-3 py-1 text-sm font-medium
```

---

## 📁 Complete Folder Structure

```
client/
├── public/
│   ├── favicon.ico
│   └── bloodbridge-logo.svg
│
├── src/
│   ├── main.jsx                    # Entry point
│   ├── App.jsx                     # Router setup
│   ├── index.css                   # Tailwind imports
│   │
│   ├── api/                        # All API calls
│   │   ├── axios.js                # Base axios instance
│   │   ├── auth.api.js             # Auth service calls
│   │   ├── donor.api.js            # Donor service calls
│   │   ├── hospital.api.js         # Hospital service calls
│   │   ├── request.api.js          # Blood request calls
│   │   ├── location.api.js         # Location service calls
│   │   └── notification.api.js     # Notification calls
│   │
│   ├── context/                    # Global state
│   │   ├── AuthContext.jsx         # User auth state
│   │   └── NotificationContext.jsx # Toast notifications
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.js              # Auth hook
│   │   ├── useDonor.js             # Donor data hook
│   │   ├── useHospital.js          # Hospital data hook
│   │   ├── useRequests.js          # Blood requests hook
│   │   └── useLocation.js          # GPS location hook
│   │
│   ├── components/                 # Reusable components
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Top navigation
│   │   │   ├── Sidebar.jsx         # Dashboard sidebar
│   │   │   ├── Footer.jsx          # Footer
│   │   │   └── Layout.jsx          # Page wrapper
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.jsx          # Button component
│   │   │   ├── Input.jsx           # Input component
│   │   │   ├── Card.jsx            # Card component
│   │   │   ├── Badge.jsx           # Status badge
│   │   │   ├── Modal.jsx           # Modal dialog
│   │   │   ├── Toast.jsx           # Notifications
│   │   │   ├── Loader.jsx          # Loading spinner
│   │   │   ├── Avatar.jsx          # User avatar
│   │   │   └── EmptyState.jsx      # Empty data state
│   │   │
│   │   ├── map/
│   │   │   ├── BloodMap.jsx        # Leaflet map component
│   │   │   ├── DonorMarker.jsx     # Donor map marker
│   │   │   └── HospitalMarker.jsx  # Hospital map marker
│   │   │
│   │   ├── donor/
│   │   │   ├── DonorCard.jsx       # Donor info card
│   │   │   ├── DonorList.jsx       # List of donors
│   │   │   ├── AvailabilityToggle.jsx  # Available/unavailable switch
│   │   │   └── BloodTypeSelect.jsx # Blood type dropdown
│   │   │
│   │   ├── hospital/
│   │   │   ├── HospitalCard.jsx    # Hospital info card
│   │   │   └── HospitalList.jsx    # List of hospitals
│   │   │
│   │   └── request/
│   │       ├── RequestCard.jsx     # Blood request card
│   │       ├── RequestList.jsx     # List of requests
│   │       ├── RequestForm.jsx     # New request form
│   │       └── UrgencyBadge.jsx    # Urgency level badge
│   │
│   ├── pages/                      # All pages
│   │   ├── Landing.jsx             # Home/landing page
│   │   ├── auth/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx        # Register page
│   │   │   └── ForgotPassword.jsx  # Forgot password
│   │   │
│   │   ├── donor/
│   │   │   ├── DonorDashboard.jsx  # Donor home
│   │   │   ├── DonorProfile.jsx    # Donor profile
│   │   │   ├── DonorHistory.jsx    # Donation history
│   │   │   └── NearbyRequests.jsx  # Requests near donor
│   │   │
│   │   ├── hospital/
│   │   │   ├── HospitalDashboard.jsx  # Hospital home
│   │   │   ├── HospitalProfile.jsx    # Hospital profile
│   │   │   ├── NewRequest.jsx         # Post blood request
│   │   │   ├── ActiveRequests.jsx     # Current requests
│   │   │   └── RequestDetails.jsx     # Single request view
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx  # Admin home
│   │       ├── ManageDonors.jsx    # All donors list
│   │       ├── ManageHospitals.jsx # All hospitals list
│   │       └── ManageRequests.jsx  # All requests list
│   │
│   ├── utils/                      # Utility functions
│   │   ├── bloodTypes.js           # Blood type constants
│   │   ├── formatters.js           # Date, distance formatters
│   │   ├── validators.js           # Form validation
│   │   └── storage.js              # LocalStorage helpers
│   │
│   └── tests/                      # Test files
│       ├── components/
│       │   ├── Button.test.jsx
│       │   ├── Input.test.jsx
│       │   └── RequestCard.test.jsx
│       └── pages/
│           ├── Login.test.jsx
│           └── Register.test.jsx
│
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 📄 Pages — Full Specification

---

### 1. Landing Page (`/`)

**Purpose:** First page visitors see. Converts them to register.

**Sections:**
```
┌─────────────────────────────────────┐
│  NAVBAR: Logo | About | Login | Register
├─────────────────────────────────────┤
│  HERO SECTION                        │
│  "Save Lives. Donate Blood."         │
│  Subtitle: Connect donors & hospitals│
│  [Register as Donor] [I'm a Hospital]│
│  Hero image: blood donation          │
│─────────────────────────────────────┤
│  STATS BAR                           │
│  🩸 1,240 Donors  🏥 48 Hospitals   │
│  ❤️  320 Lives Saved                 │
├─────────────────────────────────────┤
│  HOW IT WORKS (3 steps)             │
│  1. Hospital posts urgent request    │
│  2. System finds nearby donors       │
│  3. Donor responds & saves a life    │
├─────────────────────────────────────┤
│  BLOOD TYPES SECTION                 │
│  Show all 8 blood types              │
│  "All blood types needed"            │
├─────────────────────────────────────┤
│  MAP PREVIEW                         │
│  Leaflet map showing Yaoundé         │
│  with sample donor/hospital markers  │
├─────────────────────────────────────┤
│  CTA SECTION                         │
│  "Ready to save a life?"             │
│  [Join as Donor] [Register Hospital] │
├─────────────────────────────────────┤
│  FOOTER                              │
│  BloodBridge © 2026 | ICT University│
└─────────────────────────────────────┘
```

**Functions:**
- `fetchStats()` — get total donors, hospitals, lives saved
- `initMap()` — initialize Leaflet map centered on Yaoundé (3.8480, 11.5021)

---

### 2. Register Page (`/register`)

**Purpose:** Register as donor or hospital

**Sections:**
```
┌─────────────────────────────────────┐
│  BloodBridge Logo                    │
├─────────────────────────────────────┤
│  ROLE SELECTOR                       │
│  [🩸 I'm a Donor] [🏥 I'm a Hospital]│
│  (tab switcher)                      │
├─────────────────────────────────────┤
│  DONOR FORM (when donor selected)    │
│  - Full Name *                       │
│  - Email *                           │
│  - Phone *                           │
│  - Password *                        │
│  - Confirm Password *                │
│  - Blood Type * (dropdown)           │
│  - Date of Birth *                   │
│  - City/Location *                   │
│  [Create Account]                    │
├─────────────────────────────────────┤
│  HOSPITAL FORM (when hospital selected)
│  - Hospital Name *                   │
│  - Email *                           │
│  - Phone *                           │
│  - Password *                        │
│  - Address *                         │
│  - City *                            │
│  - Registration Number *             │
│  [Register Hospital]                 │
├─────────────────────────────────────┤
│  Already have account? Login         │
└─────────────────────────────────────┘
```

**Functions:**
- `handleRoleSwitch(role)` — switch between donor/hospital form
- `validateForm()` — check all required fields
- `handleRegister()` — call auth.api.js register function
- `handleSuccess()` — redirect to correct dashboard

---

### 3. Login Page (`/login`)

**Purpose:** Login for all user types

**Sections:**
```
┌─────────────────────────────────────┐
│  BloodBridge Logo                    │
│  "Welcome back"                      │
├─────────────────────────────────────┤
│  Email *                             │
│  Password *                          │
│  [Forgot password?]                  │
│  [Login]                             │
├─────────────────────────────────────┤
│  Don't have account? Register        │
└─────────────────────────────────────┘
```

**Functions:**
- `handleLogin()` — call auth API, store JWT token
- `redirectByRole()` — donor → /donor, hospital → /hospital, admin → /admin

---

### 4. Donor Dashboard (`/donor`)

**Purpose:** Donor's home — see requests near them, toggle availability

**Sections:**
```
┌─────────────────────────────────────┐
│  SIDEBAR                             │
│  🏠 Dashboard                        │
│  👤 My Profile                       │
│  🗺️  Nearby Requests                 │
│  📋 My History                       │
│  🔔 Notifications                    │
│  🚪 Logout                           │
├─────────────────────────────────────┤
│  HEADER                              │
│  "Hello, John Doe"                   │
│  Status: [Available/Unavailable]     │
├─────────────────────────────────────┤
│  QUICK STATS                         │
│  [Donations: 4] [Lives Saved: 12]    │
│  [Last Donation: Jan 12]             │
├─────────────────────────────────────┤
│  ACTIVE REQUESTS NEARBY              │
│  List of 3 most urgent requests      │
│  - Hospital A (2.4km) - O+ needed    │
│  - Hospital B (5.1km) - O+ needed    │
│  [I Can Help] [View Map]             │
├─────────────────────────────────────┤
│  DONATION ELIGIBILITY                │
│  "You are eligible to donate today!" │
│  or "Eligible in 42 days"            │
└─────────────────────────────────────┘
```

**Functions:**
- `fetchDonorProfile()` — get name, blood type, stats
- `toggleAvailability()` — call donor API to switch status
- `fetchNearbyRequests()` — get requests within 10km
- `handleAcceptRequest(id)` — respond to a request

---

### 10. Active Requests Page (`/hospital/requests`)

**Purpose:** See all current blood requests

**Sections:**
```
┌─────────────────────────────────────┐
│  FILTER: [All] [Critical] [Urgent]   │
│  [Standard] [Fulfilled] [Cancelled]  │
├─────────────────────────────────────┤
│  REQUEST CARDS                       │
│  Each card shows:                    │
│  - Blood type badge                  │
│  - Urgency badge                     │
│  - Donors notified count             │
│  - Responses received                │
│  - Time elapsed                      │
│  - Progress bar (responses/needed)   │
│  [View Details] [Cancel Request]     │
└─────────────────────────────────────┘
```

**Functions:**
- `fetchMyRequests()` — get hospital's requests
- `filterRequests(status)` — filter by status
- `cancelRequest(id)` — cancel a request
- `viewDetails(id)` — navigate to request details

---

### 11. Request Details (`/hospital/requests/:id`)

**Purpose:** Full details of one blood request

**Sections:**
```
┌─────────────────────────────────────┐
│  REQUEST INFO                        │
│  Blood Type: O+  |  Urgency: Critical│
│  Posted: 2 hours ago                 │
│  Status: Active                      │
├─────────────────────────────────────┤
│  PROGRESS                            │
│  Needed: 3 units                     │
│  Responded: 1 unit                   │
│  [████░░░] 33%                       │
├─────────────────────────────────────┤
│  DONORS NOTIFIED LIST                │
│  John Doe - O+ - 3.2km - Pending    │
│  Jane Smith - O+ - 5.1km - Accepted  │
│  Mark Brown - O+ - 8.4km - Declined  │
├─────────────────────────────────────┤
│  MAP                                 │
│  Show hospital + all notified donors │
└─────────────────────────────────────┘
```

**Functions:**
- `fetchRequestDetails(id)` — get full request data
- `fetchNotifiedDonors(id)` — get donors list
- `markFulfilled(id)` — mark request as complete

---

### 12. Admin Dashboard (`/admin`)

**Purpose:** Oversee entire platform

**Sections:**
```
┌─────────────────────────────────────┐
│  STATS OVERVIEW                      │
│  [Total Donors: 1,240]               │
│  [Total Hospitals: 48]               │
│  [Active Requests: 12]               │
│  [Lives Saved: 320]                  │
├─────────────────────────────────────┤
│  TABS                                │
│  [Donors] [Hospitals] [Requests]     │
├─────────────────────────────────────┤
│  TABLE (based on active tab)         │
│  Search bar + filters                │
│  Data table with actions             │
│  [Approve] [Suspend] [Delete]        │
└─────────────────────────────────────┘
```

---

## 🔌 API Files

### `src/api/axios.js`
```javascript
import axios from 'axios'

const API_BASE = 'http://64.225.100.80'

export const authAPI = axios.create({ baseURL: `${API_BASE}:30001` })
export const donorAPI = axios.create({ baseURL: `${API_BASE}:30002` })
export const hospitalAPI = axios.create({ baseURL: `${API_BASE}:30003` })
export const requestAPI = axios.create({ baseURL: `${API_BASE}:30004` })
export const locationAPI = axios.create({ baseURL: `${API_BASE}:30005` })
export const notificationAPI = axios.create({ baseURL: `${API_BASE}:30006` })

// Add JWT token to all requests
const addAuth = (instance) => {
    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    })
}

[authAPI, donorAPI, hospitalAPI, requestAPI, locationAPI, notificationAPI]
    .forEach(addAuth)
```

### `src/api/auth.api.js`
```javascript
import { authAPI } from './axios'

export const register = (data) => authAPI.post('/auth/register', data)
export const login = (data) => authAPI.post('/auth/login', data)
export const verify = (token) => authAPI.post('/auth/verify', { token })
export const getHealth = () => authAPI.get('/health')
```

### `src/api/donor.api.js`
```javascript
import { donorAPI } from './axios'

export const createDonor = (data) => donorAPI.post('/donors', data)
export const getDonor = (id) => donorAPI.get(`/donors/${id}`)
export const updateDonor = (id, data) => donorAPI.put(`/donors/${id}`, data)
export const toggleAvailability = (id, status) => 
    donorAPI.put(`/donors/${id}/availability`, { available: status })
export const getDonorsByBloodType = (type) => 
    donorAPI.get(`/donors/blood/${type}`)
export const getDonationHistory = (id) => 
    donorAPI.get(`/donors/${id}/history`)
```

### `src/api/hospital.api.js`
```javascript
import { hospitalAPI } from './axios'

export const createHospital = (data) => hospitalAPI.post('/hospitals', data)
export const getHospital = (id) => hospitalAPI.get(`/hospitals/${id}`)
export const updateHospital = (id, data) => hospitalAPI.put(`/hospitals/${id}`, data)
export const updateBeds = (id, beds) => 
    hospitalAPI.put(`/hospitals/${id}/beds`, { beds })
```

### `src/api/request.api.js`
```javascript
import { requestAPI } from './axios'

export const createRequest = (data) => requestAPI.post('/requests', data)
export const getRequests = () => requestAPI.get('/requests')
export const getRequest = (id) => requestAPI.get(`/requests/${id}`)
export const updateRequest = (id, data) => requestAPI.put(`/requests/${id}`, data)
export const cancelRequest = (id) => 
    requestAPI.put(`/requests/${id}`, { status: 'cancelled' })
export const fulfillRequest = (id) => 
    requestAPI.put(`/requests/${id}`, { status: 'fulfilled' })
```

### `src/api/location.api.js`
```javascript
import { locationAPI } from './axios'

export const findNearbyDonors = (lat, lng, bloodType, radius) =>
    locationAPI.post('/location/nearby', { lat, lng, bloodType, radius })

export const getDistance = (lat1, lng1, lat2, lng2) =>
    locationAPI.get('/location/distance', { params: { lat1, lng1, lat2, lng2 } })
```

---

## 🎣 Custom Hooks

### `src/hooks/useAuth.js`
```javascript
// Functions:
// - login(email, password)
// - logout()
// - register(data, role)
// - getUser() → returns { id, name, email, role, bloodType }
// - isAuthenticated() → boolean
// - isRole(role) → boolean
```

### `src/hooks/useDonor.js`
```javascript
// Functions:
// - getProfile()
// - updateProfile(data)
// - toggleAvailability()
// - getHistory()
// - checkEligibility() → { eligible: bool, daysUntilEligible: number }
```

### `src/hooks/useRequests.js`
```javascript
// Functions:
// - getNearbyRequests(radius)
// - getMyRequests() → for hospitals
// - createRequest(data)
// - acceptRequest(id) → for donors
// - cancelRequest(id)
// - fulfillRequest(id)
```

### `src/hooks/useLocation.js`
```javascript
// Functions:
// - getCurrentPosition() → { lat, lng }
// - findNearbyDonors(bloodType, radius)
// - calculateDistance(lat1, lng1, lat2, lng2)
```

---

## 🧰 Utility Files

### `src/utils/bloodTypes.js`
```javascript
export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const COMPATIBLE_TYPES = {
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'O-': ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    'A+': ['A+', 'AB+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'AB+': ['AB+'],
    'AB-': ['AB+', 'AB-'],
}

export const BLOOD_TYPE_COLORS = {
    'A+': 'bg-red-100 text-red-700',
    'A-': 'bg-red-200 text-red-800',
    'B+': 'bg-blue-100 text-blue-700',
    'B-': 'bg-blue-200 text-blue-800',
    'AB+': 'bg-purple-100 text-purple-700',
    'AB-': 'bg-purple-200 text-purple-800',
    'O+': 'bg-green-100 text-green-700',
    'O-': 'bg-green-200 text-green-800',
}
```

### `src/utils/formatters.js`
```javascript
// formatDate(date) → "April 29, 2026"
// formatTimeAgo(date) → "2 hours ago"
// formatDistance(meters) → "3.2 km"
// formatBloodType(type) → styled badge
// formatUrgency(level) → { label, color, icon }
```

### `src/utils/validators.js`
```javascript
// validateEmail(email) → boolean
// validatePhone(phone) → boolean (Cameroon format)
// validatePassword(password) → { valid, message }
// validateBloodType(type) → boolean
// validateAge(dob) → { valid, age } (must be 18+)
```

---

## 🗺️ React Router Setup (`App.jsx`)

```
Routes:
/ → Landing
/login → Login
/register → Register
/forgot-password → ForgotPassword

/donor → DonorDashboard (protected - donor only)
/donor/profile → DonorProfile
/donor/history → DonorHistory
/donor/requests → NearbyRequests

/hospital → HospitalDashboard (protected - hospital only)
/hospital/profile → HospitalProfile
/hospital/request/new → NewRequest
/hospital/requests → ActiveRequests
/hospital/requests/:id → RequestDetails

/admin → AdminDashboard (protected - admin only)
/admin/donors → ManageDonors
/admin/hospitals → ManageHospitals
/admin/requests → ManageRequests

* → 404 Not Found page
```

---

## 🔒 Protected Routes

```javascript
// ProtectedRoute component checks:
// 1. Is user logged in? (token in localStorage)
// 2. Does user have correct role?
// If not → redirect to /login
```

---

## 📱 Responsive Breakpoints

```
Mobile:   < 768px   (default - donor app)
Tablet:   768px+    (hospital dashboard)
Desktop:  1024px+   (admin panel, full map view)
```

---

## 🧪 Tests to Write

```
Button.test.jsx:
- renders correctly
- calls onClick when clicked
- disabled state works

Login.test.jsx:
- renders form fields
- shows error with empty fields
- shows error with invalid email
- submits with valid data

Register.test.jsx:
- switches between donor/hospital form
- validates all required fields
- submits correctly

RequestCard.test.jsx:
- displays blood type correctly
- shows urgency badge
- I Can Help button works
```

---

## 📋 Development Order (Priority)

```
Day 1 (Start here):
1. Set up App.jsx with all routes
2. Create AuthContext
3. Build Login page + Register page
4. Connect to Auth API

Day 2:
5. Build Donor Dashboard
6. Build Availability Toggle
7. Build Nearby Requests page with map

Day 3:
8. Build Hospital Dashboard
9. Build New Request form
10. Build Active Requests page

Day 4:
11. Build Request Details with map
12. Build Admin Dashboard
13. Write tests
```

---

*BloodBridge SOA — SEN3244 Software Architecture — ICT University Yaoundé*

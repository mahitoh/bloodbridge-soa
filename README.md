# 🩸 BloodBridge SOA — Blood Donation Platform

[![Build Status](https://img.shields.io/jenkins/build?jobUrl=https%3A%2F%2Fjenkins.example.com%2Fjob%2Fboodbridge-soa)](https://jenkins.example.com/job/bloodbridge-soa)
[![Coverage](https://img.shields.io/badge/coverage-90%25-green)](https://jenkins.example.com/job/bloodbridge-soa)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

A robust **Service-Oriented Architecture (SOA)** platform built for managing blood donations and connecting donors with hospitals in real-time. Designed to save lives by streamlining emergency blood requests, donor matching, and logistics in Cameroon and beyond.

**Course Project**: SEN3244 Software Architecture — ICT University Yaoundé

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Services](#services)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)

## 📖 Overview

BloodBridge SOA is a microservices-based application that revolutionizes blood donation management. Hospitals can post urgent blood requests, the system matches nearby eligible donors based on blood type and location, and notifications ensure quick responses. Donors track their history and availability, while admins oversee the platform.

**Key Goals**:
- Reduce blood shortage crises in hospitals.
- Empower donors with real-time notifications.
- Provide scalable, maintainable architecture for future expansions.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based login for donors, hospitals, and admins.
- **🩸 Smart Matching**: Location-based donor search with blood type compatibility.
- **📍 Real-Time Location**: GPS integration for proximity calculations.
- **🔔 Instant Notifications**: SMS/email alerts for requests and updates.
- **📊 Dashboard Analytics**: Stats for donors, hospitals, and admins.
- **🔄 Microservices Design**: Independent, scalable services with Docker.
- **🧪 Comprehensive Testing**: 90%+ code coverage with automated CI/CD.

## 🏗️ Architecture

The platform follows a **microservices architecture** with independent services communicating via REST APIs and shared databases (in-memory for demo, scalable to PostgreSQL/MongoDB).

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  API Gateway    │◄──►│  Microservices  │
│   (Frontend)    │    │  (Nginx/Envoy)  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                        ┌───────────────────────────────┼───────────────────────────────┐
                        │                               │                               │
                ┌───────▼───────┐               ┌───────▼───────┐               ┌───────▼───────┐
                │ Auth Service  │               │ Donor Service  │               │ Hosp Service  │
                │ (Port 30001)  │               │ (Port 30002)   │               │ (Port 30003)  │
                └───────────────┘               └───────────────┘               └───────────────┘
                        │                               │                               │
                ┌───────▼───────┐               ┌───────▼───────┐               ┌───────▼───────┐
                │ Req Service   │               │ Loc Service    │               │ Notif Service │
                │ (Port 30004)  │               │ (Port 30005)   │               │ (Port 30006)  │
                └───────────────┘               └───────────────┘               └───────────────┘
```

- **Client**: Mobile-first React app with maps and dashboards.
- **Services**: Node.js/Express with JWT auth and CORS.
- **Database**: In-memory arrays (upgrade to Redis/PostgreSQL for production).
- **CI/CD**: Jenkins pipeline with Husky pre-commit hooks.

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite + Tailwind CSS + Leaflet (maps) + Axios
- **Backend**: Node.js + Express.js + JWT + Bcrypt + CORS
- **Testing**: Jest + Supertest (90% coverage)
- **Deployment**: Docker + Kubernetes + Jenkins CI/CD
- **Tools**: Git, Husky, ESLint, Prettier

## 📦 Services

1. **Auth Service** (Port 30001): User registration, login, JWT verification.
2. **Donor Service** (Port 30002): Manage donors, availability, history, blood type search.
3. **Hospital Service** (Port 30003): CRUD hospitals, bed management.
4. **Request Service** (Port 30004): Blood requests, status updates (active/cancelled/fulfilled).
5. **Location Service** (Port 30005): Nearby donor search, distance calculations.
6. **Notification Service** (Port 30006): Send/receive notifications, mark as read.

Each service includes health checks, error handling, and unit tests.

## 📋 Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**
- **Docker** (for containerized deployment)
- **Git** (for cloning)
- **Jenkins** (for CI/CD, optional for local dev)

## 🚀 Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mahitoh/bloodbridge-soa.git
   cd bloodbridge-soa
   ```

2. **Install Client Dependencies**:
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Install Service Dependencies** (for each service):
   ```bash
   for service in auth-service donor-service hospital-service request-service location-service notification-service; do
     cd services/$service
     npm install
     cd ../..
   done
   ```
   Or manually for each:
   ```bash
   cd services/auth-service && npm install && cd ../..
   # Repeat for others
   ```

4. **Environment Variables** (create `.env` in root):
   ```env
   JWT_SECRET=your-super-secret-key
   NODE_ENV=development
   ```

## 🏃 Usage

1. **Start Services** (each in separate terminals):
   ```bash
   # Auth Service
   cd services/auth-service && npm start

   # Donor Service
   cd services/donor-service && npm start

   # And so on for all 6 services...
   ```

2. **Start Client**:
   ```bash
   cd client
   npm run dev  # Runs on http://localhost:5173
   ```

3. **Access the App**:
   - Register as donor/hospital.
   - Hospitals: Post blood requests.
   - Donors: Receive notifications, toggle availability.
   - Admins: Manage users/requests.

4. **Production Build**:
   ```bash
   cd client
   npm run build
   ```

## 📚 API Documentation

### Auth Service (Base: http://localhost:30001)
- `POST /auth/register` — Register user (email, password, role)
- `POST /auth/login` — Login and get JWT
- `POST /auth/verify` — Verify JWT token

### Donor Service (Base: http://localhost:30002)
- `POST /donors` — Create donor
- `GET /donors/:id` — Get donor details
- `PUT /donors/:id` — Update donor
- `PUT /donors/:id/availability` — Toggle availability
- `GET /donors/blood/:type` — Search by blood type
- `GET /donors/:id/history` — Donation history

### Hospital Service (Base: http://localhost:30003)
- `POST /hospitals` — Create hospital
- `GET /hospitals/:id` — Get hospital
- `PUT /hospitals/:id` — Update hospital
- `PUT /hospitals/:id/beds` — Update bed count

### Request Service (Base: http://localhost:30004)
- `POST /requests` — Create blood request
- `GET /requests` — List all requests
- `GET /requests/:id` — Get request details
- `PUT /requests/:id` — Update request
- `PUT /requests/:id/cancel` — Cancel request
- `PUT /requests/:id/fulfill` — Mark fulfilled

### Location Service (Base: http://localhost:30005)
- `POST /location/nearby` — Find nearby donors (lat, lng, bloodType, radius)
- `GET /location/distance` — Calculate distance between points

### Notification Service (Base: http://localhost:30006)
- `POST /notifications` — Send notification
- `GET /notifications/:userId` — Get user notifications
- `PUT /notifications/:id/read` — Mark as read

All endpoints require `Authorization: Bearer <JWT>` (except auth routes) and return JSON.

## 🧪 Testing

Run all tests with coverage:
```bash
./test-all.sh
```

Or per service:
```bash
cd services/auth-service
npm test  # Includes coverage report
```

- **Coverage**: >=90% for all services.
- **CI/CD**: Jenkins runs tests on push; Husky blocks commits without passing tests.

## 🚢 Deployment

1. **Docker Build**:
   ```bash
   docker build -t bloodbridge-client ./client
   docker build -t bloodbridge-auth ./services/auth-service
   # Build for each service
   ```

2. **Docker Compose** (create `docker-compose.yml`):
   ```yaml
   version: '3.8'
   services:
     client:
       image: bloodbridge-client
       ports: ["3000:80"]
     auth-service:
       image: bloodbridge-auth
       ports: ["30001:30001"]
     # Add others...
   ```

3. **Kubernetes** (use provided `k8s/` manifests):
   ```bash
   kubectl apply -f k8s/
   ```

4. **Jenkins Pipeline**: Automates builds, tests, and deploys on merge to main.

## 🤝 Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m "Add your feature"`.
4. Push and create a PR.
5. Jenkins will test; merge after approval.

**Guidelines**:
- Follow ESLint/Prettier.
- Write tests for new code.
- Update README/docs for changes.

## 📄 License

Licensed under MIT License. See [LICENSE](LICENSE) for details.

## 👥 Authors

- **Mahito** — Developer (ICT University Yaoundé)
- Course: SEN3244 Software Architecture

---

*Built with ❤️ to save lives. Contribute and help make a difference!* 🚀</content>
<parameter name="path">./bloodbridge-soa/README.md
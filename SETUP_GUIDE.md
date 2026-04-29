# 🩸 BloodBridge SOA — Complete Setup Guide
> Course: SEN3244 — Software Architecture | ICT University Yaoundé
> Everything you need to know, explained simply. If you're lost, start here.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [VPS Details](#vps-details)
4. [Tools Installed & Why](#tools-installed--why)
5. [How to Access Everything](#how-to-access-everything)
6. [All Commands Reference](#all-commands-reference)
7. [How the CI/CD Pipeline Works](#how-the-cicd-pipeline-works)
8. [Microservices Explained](#microservices-explained)
9. [Kubernetes Files Explained](#kubernetes-files-explained)
10. [Ansible Playbooks Explained](#ansible-playbooks-explained)
11. [Jenkinsfile Explained](#jenkinsfile-explained)
12. [How to Continue Development](#how-to-continue-development)
13. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**BloodBridge** is a Blood Donor Finder platform built using a **microservices architecture**. When a hospital needs blood urgently, they post a request. The system finds nearby donors with the right blood type and notifies them instantly via SMS/email.

### The Problem It Solves
In Cameroon, patients visit multiple hospitals looking for blood. Hospitals have no way to quickly find available donors nearby. BloodBridge connects hospitals and donors in real time.

### Architecture Style
**Microservices** — each feature runs as a completely separate service (its own code, its own container, its own port). If one crashes, the others keep running.

---

## 📁 Project Structure

```
bloodbridge-soa/
├── 📄 Jenkinsfile                    # CI/CD pipeline instructions for Jenkins
├── 📄 README.md                      # Project description
├── 📄 .gitignore                     # Files git should ignore
│
├── 📂 services/                      # All microservices live here
│   ├── 📂 auth-service/              # Handles login, register, JWT tokens
│   │   ├── src/
│   │   │   ├── index.js              # Main app file
│   │   │   └── index.test.js         # Tests
│   │   ├── Dockerfile                # How to build the Docker container
│   │   └── package.json              # Node.js dependencies
│   │
│   ├── 📂 donor-service/             # Donor profiles, blood type, availability
│   │   ├── src/index.js
│   │   └── Dockerfile
│   │
│   ├── 📂 hospital-service/          # Hospital profiles, bed availability
│   │   ├── src/index.js
│   │   └── Dockerfile
│   │
│   ├── 📂 request-service/           # Urgent blood requests from hospitals
│   │   ├── src/index.js
│   │   └── Dockerfile
│   │
│   ├── 📂 location-service/          # GPS — finds donors near the hospital
│   │   ├── src/index.js
│   │   └── Dockerfile
│   │
│   └── 📂 notification-service/      # Sends SMS/email alerts to donors
│       ├── src/index.js
│       └── Dockerfile
│
├── 📂 k8s/                           # Kubernetes deployment files
│   ├── auth-service.yaml
│   ├── donor-service.yaml
│   ├── hospital-service.yaml
│   ├── request-service.yaml
│   ├── location-service.yaml
│   └── notification-service.yaml
│
└── 📂 infra/                         # Infrastructure as Code
    ├── inventory.ini                 # Tells Ansible where the VPS is
    └── playbooks/
        ├── 01-install-core.yml       # Installs Docker + K3s
        └── 02-install-services.yml   # Installs Jenkins + Grafana
```

---

## 🖥️ VPS Details

| Detail | Value |
|--------|-------|
| Provider | DigitalOcean |
| IP Address | `64.225.100.80` |
| OS | Ubuntu 24.04 LTS |
| Region | Frankfurt, Germany |
| RAM | 4GB |
| vCPU | 2 |
| Disk | 80GB SSD |
| Root Password | `BloodBridge@2026!d` |
| Monthly Cost | $24/month (paid by GitHub Student credit) |

### How to SSH into the VPS
```bash
ssh root@64.225.100.80
# Type password: BloodBridge@2026!d
# Press Enter (you won't see the characters as you type)
```

---

## 🛠️ Tools Installed & Why

| Tool | Where | Why |
|------|--------|-----|
| **Docker** | VPS | Packages each microservice into a container |
| **K3s (Kubernetes)** | VPS | Runs and manages all containers, auto-restarts crashed ones |
| **Jenkins** | VPS | Watches GitHub, runs tests, deploys automatically |
| **Prometheus** | VPS (K8s pod) | Collects metrics from all services |
| **Grafana** | VPS (K8s pod) | Displays beautiful dashboards of your metrics |
| **Helm** | VPS | Package manager for Kubernetes (used to install Grafana/Prometheus) |
| **Ansible** | VPS | Automates server setup with playbooks |
| **Node.js** | VPS + WSL | Runtime for all microservices |
| **Git** | VPS + WSL | Version control |
| **kubectl** | WSL | Controls Kubernetes from your laptop |

### Simple Analogy
- **Docker** = boxes that contain your code
- **Kubernetes (K3s)** = warehouse manager that keeps all boxes running
- **Jenkins** = quality control — only accepts good code (tests passing)
- **Grafana** = CCTV monitoring everything
- **Ansible** = construction crew that built the warehouse

---

## 🌐 How to Access Everything

| Tool | URL | Username | Password |
|------|-----|----------|----------|
| **Jenkins** | `http://64.225.100.80:8080` | admin | (set during setup) |
| **Grafana** | `http://64.225.100.80:32000` | admin | (run command below) |
| **Prometheus** | `http://64.225.100.80:31000` | - | - |

### Get Grafana Password
```bash
# SSH into VPS first
ssh root@64.225.100.80

# Then run this
kubectl get secret --namespace monitoring grafana \
  -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```

### Microservice Ports (accessible from browser)
| Service | Port |
|---------|------|
| auth-service | `http://64.225.100.80:30001` |
| donor-service | `http://64.225.100.80:30002` |
| hospital-service | `http://64.225.100.80:30003` |
| request-service | `http://64.225.100.80:30004` |
| location-service | `http://64.225.100.80:30005` |
| notification-service | `http://64.225.100.80:30006` |

### Test a service is running
```bash
curl http://64.225.100.80:30001/health
# Should return: {"status":"healthy","service":"auth-service"}
```

---

## 📝 All Commands Reference

### WSL (Your Laptop) Commands

```bash
# Navigate to project
cd ~/bloodbridge-soa

# See all files
ls

# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "your message here"

# Push to GitHub (triggers Jenkins automatically)
git push origin main

# Pull latest changes
git pull origin main
```

### VPS Commands (after SSH-ing in)

```bash
# ── KUBERNETES ──────────────────────────────

# See all running pods (services)
kubectl get pods

# See all services and their ports
kubectl get services

# See logs of a specific service
kubectl logs deployment/auth-service
kubectl logs deployment/donor-service

# Restart a specific service
kubectl rollout restart deployment/auth-service

# Restart ALL services
kubectl rollout restart deployment --all

# Delete a pod (Kubernetes will auto-restart it — self-healing demo!)
kubectl delete pod -l app=donor-service

# Watch pods in real time (Ctrl+C to stop)
kubectl get pods -w

# Apply Kubernetes config files
kubectl apply -f k8s/

# Delete a deployment
kubectl delete deployment auth-service

# ── DOCKER ──────────────────────────────────

# See all Docker images
docker images

# Build an image manually
docker build -t bloodbridge-auth:latest services/auth-service

# Import Docker image into K3s
docker save bloodbridge-auth:latest | k3s ctr images import -

# ── JENKINS ─────────────────────────────────

# Check Jenkins status
systemctl status jenkins

# Restart Jenkins
systemctl restart jenkins

# Get Jenkins initial admin password
cat /root/.jenkins/secrets/initialAdminPassword

# ── MONITORING ──────────────────────────────

# Check Grafana and Prometheus pods
kubectl get pods -n monitoring

# Get Grafana password
kubectl get secret --namespace monitoring grafana \
  -o jsonpath="{.data.admin-password}" | base64 --decode ; echo

# ── SYSTEM ──────────────────────────────────

# Check memory usage
free -h

# Check disk usage
df -h

# Check firewall rules
ufw status

# Check what's running on a port
ss -tlnp | grep 8080
```

---

## 🔄 How the CI/CD Pipeline Works

```
You write code on WSL
        ↓
git push origin main
        ↓
GitHub receives the push
        ↓
GitHub webhook fires → hits Jenkins at http://64.225.100.80:8080/github-webhook/
        ↓
Jenkins automatically starts a new build
        ↓
Stage 1: Checkout — pulls your code from GitHub
        ↓
Stage 2: Install & Test — runs npm install + npm test
        ↓
Stage 3: Check Coverage — must be 80%+ to continue
        ↓
Stage 4: Build Docker Images — builds all 6 service images
        ↓
Stage 5: Import into K3s — makes images available to Kubernetes
        ↓
Stage 6: Deploy to Kubernetes — kubectl apply -f k8s/
        ↓
✅ All 6 services updated and running!
```

### What happens if tests fail?
Jenkins stops the pipeline and does NOT deploy. Your running services stay untouched. This protects production from broken code.

### GitHub Repository
```
https://github.com/mahitoh/bloodbridge-soa
```

### GitHub Webhook URL (already configured)
```
http://64.225.100.80:8080/github-webhook/
```

---

## 🔬 Microservices Explained

### 1. Auth Service (Port 3001 → NodePort 30001)
Handles all authentication. Every other service checks with this one before doing anything.

**Endpoints to build:**
```
POST /auth/register   → Register new user (donor or hospital)
POST /auth/login      → Login, returns JWT token
POST /auth/verify     → Verify a JWT token is valid
GET  /health          → Health check (already built)
```

**File:** `services/auth-service/src/index.js`

---

### 2. Donor Service (Port 3000 → NodePort 30002)
Manages donor profiles — blood type, availability, donation history.

**Endpoints to build:**
```
POST /donors          → Register as a donor
GET  /donors/:id      → Get donor profile
PUT  /donors/:id      → Update availability status
GET  /donors/blood/:type → Get all donors of a blood type
GET  /health          → Health check (already built)
```

**File:** `services/donor-service/src/index.js`

---

### 3. Hospital Service (Port 3000 → NodePort 30003)
Manages hospital profiles and bed availability.

**Endpoints to build:**
```
POST /hospitals       → Register a hospital
GET  /hospitals/:id   → Get hospital profile
PUT  /hospitals/:id/beds → Update available beds
GET  /health          → Health check (already built)
```

**File:** `services/hospital-service/src/index.js`

---

### 4. Request Service (Port 3000 → NodePort 30004)
Handles urgent blood requests from hospitals.

**Endpoints to build:**
```
POST /requests        → Hospital posts urgent blood need
GET  /requests        → Get all active requests
GET  /requests/:id    → Get specific request
PUT  /requests/:id    → Update request status (fulfilled/cancelled)
GET  /health          → Health check (already built)
```

**File:** `services/request-service/src/index.js`

---

### 5. Location Service (Port 3000 → NodePort 30005)
Finds donors near a hospital using GPS coordinates.

**Endpoints to build:**
```
POST /location/nearby → Find donors within X km of hospital
GET  /health          → Health check (already built)
```

**File:** `services/location-service/src/index.js`

---

### 6. Notification Service (Port 3000 → NodePort 30006)
Sends SMS and email alerts to matched donors.

**Endpoints to build:**
```
POST /notify/donor    → Send SMS/email to a donor
POST /notify/hospital → Notify hospital of donor response
GET  /health          → Health check (already built)
```

**File:** `services/notification-service/src/index.js`

---

## ☸️ Kubernetes Files Explained

Every service has a YAML file in the `k8s/` folder. Here's what each section means using `auth-service.yaml` as example:

```yaml
apiVersion: apps/v1
kind: Deployment           # Type: we want a Deployment (keeps pods running)
metadata:
  name: auth-service       # Name of this deployment
spec:
  replicas: 1              # Run 1 copy of this service
  selector:
    matchLabels:
      app: auth-service    # Match pods with this label
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: bloodbridge-auth:latest   # Docker image to use
        imagePullPolicy: IfNotPresent    # Use local image if available
        ports:
        - containerPort: 3001           # Port the service runs on
        
        # SELF-HEALING: Kubernetes checks this endpoint
        # If it fails 3 times → Kubernetes RESTARTS the pod automatically
        livenessProbe:
          httpGet:
            path: /health     # Must return 200 OK
            port: 3001
          initialDelaySeconds: 15   # Wait 15s before first check
          periodSeconds: 10         # Check every 10 seconds
          
        # READINESS: Only send traffic when this passes
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service              # Exposes the deployment to the network
metadata:
  name: auth-service
spec:
  selector:
    app: auth-service
  ports:
    - port: 3001           # Internal cluster port
      targetPort: 3001     # Container port
      nodePort: 30001      # External port (access from browser)
  type: NodePort           # Makes it accessible from outside the cluster
```

> **Key concept:** The `livenessProbe` is what enables **self-healing**. If your service crashes, Kubernetes detects it through the health check and automatically restarts it. This is what you demonstrate to your lecturer!

---

## 📜 Ansible Playbooks Explained

Ansible playbooks are like shopping lists for your server. You run them once and they install everything automatically.

### Playbook 1: `infra/playbooks/01-install-core.yml`
Installs Docker and K3s (Kubernetes) on the VPS.

```yaml
---
- name: Install Core Infrastructure
  hosts: vps          # Run on the VPS defined in inventory.ini
  become: yes         # Run as root (sudo)
  tasks:
    - name: Update apt packages
      ...
    - name: Install Docker
      ...
    - name: Install K3s
      ...
```

### Playbook 2: `infra/playbooks/02-install-services.yml`
Installs Jenkins, Grafana, Prometheus, and Node.js.

### How to Run Ansible Playbooks
```bash
# From your WSL laptop:
cd ~/bloodbridge-soa/infra

# Test connection to VPS first
ansible -i inventory.ini vps -m ping

# Run playbook 1
ansible-playbook -i inventory.ini playbooks/01-install-core.yml

# Run playbook 2
ansible-playbook -i inventory.ini playbooks/02-install-services.yml
```

### inventory.ini
```ini
[vps]
64.225.100.80 ansible_user=root ansible_ssh_pass=BloodBridge@2026!d

[vps:vars]
ansible_python_interpreter=/usr/bin/python3
```
This tells Ansible: "The VPS is at 64.225.100.80, login as root with this password."

---

## 🔧 Jenkinsfile Explained

The Jenkinsfile is in the root of your project. Jenkins reads it every time you push code.

```groovy
pipeline {
    agent any    // Run on any available Jenkins agent

    environment {
        KUBECONFIG = '/etc/rancher/k3s/k3s.yaml'  // K3s config file
    }

    stages {

        stage('Checkout') {
            // Pull the latest code from GitHub
        }

        stage('Install & Test Auth Service') {
            // npm install — install dependencies
            // npm test — run all test files
            // --coverage — measure how much code is tested
        }

        stage('Check Coverage') {
            // Read coverage report
            // If below 80% → FAIL (don't deploy broken/untested code)
        }

        stage('Build Docker Images') {
            // docker build for all 6 services
            // Creates Docker images from Dockerfiles
        }

        stage('Import Images into K3s') {
            // K3s uses its own image store (not Docker's)
            // This imports the built images into K3s
        }

        stage('Deploy to Kubernetes') {
            // kubectl apply -f k8s/
            // Kubernetes reads the YAML files and updates running services
        }
    }

    post {
        success { echo '✅ BloodBridge deployed successfully!' }
        failure { echo '❌ Pipeline failed! Check logs above.' }
    }
}
```

---

## 🚀 How to Continue Development

### Step 1 — Work on your WSL laptop, NOT on the VPS
```bash
cd ~/bloodbridge-soa
```

### Step 2 — Pick a service to work on
```bash
cd services/donor-service/src
code index.js    # Open in VS Code
```

### Step 3 — Write your code in index.js
Replace the placeholder health-check-only code with real routes and business logic.

### Step 4 — Write tests
Every function you write needs a test file. Create `index.test.js` next to your `index.js`.

Example test structure:
```javascript
const request = require('supertest');
const app = require('./index');

describe('Donor Service', () => {
    test('GET /health returns healthy', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('healthy');
    });

    test('POST /donors creates a donor', async () => {
        const res = await request(app)
            .post('/donors')
            .send({ name: 'John', bloodType: 'O+', phone: '677000000' });
        expect(res.statusCode).toBe(201);
    });
});
```

### Step 5 — Push and Jenkins does the rest
```bash
cd ~/bloodbridge-soa
git add .
git commit -m "feat: add donor registration endpoint"
git push origin main
# Jenkins automatically tests, builds, and deploys!
```

### Step 6 — Watch it deploy on Jenkins
Open: `http://64.225.100.80:8080`

### Step 7 — Verify it's running on VPS
```bash
ssh root@64.225.100.80
kubectl get pods
```

---

## 🎬 Self-Healing Demo (for your lecturer!)

This is the most impressive thing to show. Kubernetes automatically restarts crashed services.

```bash
# SSH into VPS
ssh root@64.225.100.80

# Step 1 — Show all services running
kubectl get pods

# Step 2 — Kill the donor service pod
kubectl delete pod -l app=donor-service

# Step 3 — Watch it come back automatically (within seconds!)
kubectl get pods -w

# You will see:
# donor-service-xxx   0/1   Terminating   ...
# donor-service-yyy   0/1   ContainerCreating ...
# donor-service-yyy   1/1   Running  ← automatically restarted!
```

Press `Ctrl+C` to stop watching.

---

## 🔥 Troubleshooting

### Jenkins not accessible at :8080
```bash
ssh root@64.225.100.80
systemctl status jenkins
systemctl restart jenkins
```

### Pod stuck in CrashLoopBackOff
```bash
# Check the logs to see the error
kubectl logs deployment/auth-service

# Most common cause: no src/index.js file or syntax error in code
```

### Pod stuck in ImagePullBackOff
```bash
# The Docker image wasn't imported into K3s
# Run the Jenkins pipeline again — it imports automatically
# OR manually import:
docker save bloodbridge-auth:latest | k3s ctr images import -
kubectl rollout restart deployment/auth-service
```

### Grafana not loading at :32000
```bash
kubectl get pods -n monitoring
# If grafana pod is not Running:
kubectl rollout restart deployment/grafana -n monitoring
```

### Jenkins pipeline failing on coverage
```bash
# Make sure each service has a test file: src/index.test.js
# Make sure package.json has: "test": "jest --coverage"
# Make sure jest is installed: npm install --save-dev jest supertest
```

### SSH connection dropped
```bash
# Just reconnect:
ssh root@64.225.100.80
# Password: BloodBridge@2026!d
```

---

## 📊 Marks Checklist

| Section | Marks | Status |
|---------|-------|--------|
| 1. Infrastructure Setup | 15 | ✅ VPS, Docker, K3s, Firewall |
| 2. Scrum | 5 | ⏳ Document sprints in GitHub Projects |
| 3. Jenkins CI/CD | 10 | ✅ Pipeline fully working |
| 4. Prometheus & Grafana | 2.5 | ✅ Both running |
| 5. Ansible Playbooks | 2.5 | ✅ 2 playbooks created |
| 6. Testing 80% coverage | 10 | ⏳ Write real tests when coding |
| 7. Docker + Kubernetes | 15 | ✅ All 6 services deployed |
| 8. Architecture Document | 20 | ⏳ Write report |
| 9. Innovation | 10 | ⏳ Highlight matching algorithm |
| 10. Documentation | 15 | ⏳ README + Swagger |
| **Total done** | **45/100** | 🔥 |

---

## 👥 Team

| Name | GitHub | Role |
|------|--------|------|
| Mahito | @mahitoh | DevOps + Backend |
| Randy Lanjo | - | Backend + Frontend |

---

*Generated during setup session — April 29, 2026*
*BloodBridge SOA — SEN3244 Software Architecture — ICT University*

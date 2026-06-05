# BloodBridge Deployment and Operations Guide

# 1. Introduction

This guide describes the deployment, monitoring, maintenance, and operation of the BloodBridge platform.

---

# 2. Infrastructure Overview

Provider:
DigitalOcean

Region:
Frankfurt

Server:

- 4GB RAM
- 2 vCPU
- 80GB SSD

Operating System:

Ubuntu Server 24.04 LTS

---

# 3. Software Stack

Runtime:

- Node.js
- npm

Containers:

- Docker

Orchestration:

- Kubernetes (K3s)

Messaging:

- RabbitMQ

Caching:

- Redis

Database:

- PostgreSQL

CI/CD:

- Jenkins

Monitoring:

- Prometheus
- Grafana

---

# 4. Installation Procedures

## Update System

```bash
sudo apt update
sudo apt upgrade -y

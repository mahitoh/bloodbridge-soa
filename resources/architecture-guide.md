# BloodBridge Architecture Guide

## 1. Introduction

BloodBridge is a Service-Oriented Architecture (SOA) platform designed to coordinate blood donation workflows between hospitals and blood donors. The platform provides real-time donor discovery, emergency request management, notification delivery, and location-aware matching.

The system adopts a microservices architecture deployed on Kubernetes to ensure scalability, fault isolation, maintainability, and high availability.

---

# 2. Architectural Vision

The primary objective of BloodBridge is to reduce the time required to locate compatible blood donors during emergencies.

Key goals:

- Fast donor discovery
- High availability
- Fault tolerance
- Independent service deployment
- Scalability
- Observability
- Security

---

# 3. Architecture Overview

BloodBridge follows a hybrid architecture combining:

- Microservices Architecture
- Event Driven Architecture
- Layered Architecture

Each service owns its domain and database responsibilities.

---

# 4. System Components

## Auth Service

Responsibilities:

- User registration
- Authentication
- Authorization
- JWT issuance
- Password hashing

Technologies:

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt

---

## Donor Service

Responsibilities:

- Donor registration
- Blood group management
- Availability tracking
- Donor search

---

## Hospital Service

Responsibilities:

- Hospital registration
- Hospital profile management
- Emergency request creation

---

## Request Service

Responsibilities:

- Blood request creation
- Request lifecycle management
- Event publishing

---

## Location Service

Responsibilities:

- GPS coordinate storage
- Haversine calculations
- Radius-based matching

---

## Notification Service

Responsibilities:

- SMS delivery
- Email delivery
- Notification history

---

# 5. Communication Model

REST Communication

Used for:

- CRUD operations
- Authentication
- Service interaction

RabbitMQ Communication

Used for:

- Blood request notifications
- Event processing
- Asynchronous workflows

---

# 6. Event Flow

1. Hospital creates request
2. Request service validates request
3. Event published to RabbitMQ
4. Notification service receives event
5. Donors notified
6. Request status updated

---

# 7. CAP Theorem Analysis

BloodBridge prioritizes:

Availability + Partition Tolerance

Reason:

Emergency healthcare systems must continue operating during network failures.

Consistency is eventual.

---

# 8. Security Architecture

Mechanisms:

- JWT Authentication
- bcrypt Password Hashing
- HTTPS
- Kubernetes Secrets
- Environment Variables
- API Validation

---

# 9. Scalability Strategy

Horizontal scaling via Kubernetes.

Services may be scaled independently.

Examples:

- donor-service: 5 replicas
- notification-service: 10 replicas
- auth-service: 2 replicas

---

# 10. Fault Tolerance

Techniques:

- Pod restart policies
- Health checks
- Liveness probes
- Readiness probes
- Service isolation

---

# 11. Monitoring Strategy

Tools:

- Prometheus
- Grafana
- Node Exporter
- cAdvisor
- kube-state-metrics

Metrics:

- CPU
- Memory
- Pod health
- Request latency
- Error rates

---

# 12. Architecture Decision Records

ADR-001

Decision:
Use Microservices

Reason:
Independent deployment.

ADR-002

Decision:
Use RabbitMQ

Reason:
Asynchronous notifications.

ADR-003

Decision:
Use Kubernetes

Reason:
Self-healing and scaling.

ADR-004

Decision:
Use PostgreSQL

Reason:
Relational consistency.

---

# 13. Future Enhancements

- Mobile application
- AI donor prediction
- Multi-region deployment
- Blockchain audit trails
- Advanced analytics

---

# Conclusion

BloodBridge demonstrates a production-ready Service-Oriented Architecture capable of supporting real-time blood donation coordination at scale.

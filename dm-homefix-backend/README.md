# DM HomeFix Backend

**Version:** 1.0.0  
**Target Market:** Debre Markos, Ethiopia  
**Architecture:** Microservices (NestJS monorepo)

A home-repair marketplace connecting customers with verified local technicians. Supports **Amharic (አማርኛ)** and **English** throughout.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Services](#services)
3. [Quick Start](#quick-start)
4. [Environment Variables](#environment-variables)
5. [Running Services](#running-services)
6. [Database Migrations](#database-migrations)
7. [Testing](#testing)
8. [API Documentation](#api-documentation)
9. [Development Workflow](#development-workflow)
10. [Production Deployment](#production-deployment)
11. [Architecture Principles](#architecture-principles)
12. [Troubleshooting](#troubleshooting)

---

## Project Structure

```
dm-homefix-backend/
├── services/                  # All microservices
│   ├── api-gateway/           # Public entry point, reverse proxy
│   ├── account-service/       # Auth, registration, profiles
│   ├── technician-verification-service/  # Technician approval workflow
│   ├── service-catalog-service/          # Bilingual service categories
│   ├── booking-service/                  # Booking requests, cancellation
│   ├── pricing-quote-service/            # Quotes and pricing
│   ├── job-management-service/           # Job execution workflow
│   ├── payment-service/                  # Payment records, mock adapter
│   ├── review-complaint-service/         # Reviews and complaints
│   └── notification-service/             # Notifications (mock adapter)
├── libs/                      # Shared libraries
│   ├── contracts/             # Event types, enums (no business logic)
│   ├── config/                # Env validation, RabbitMQ constants
│   └── observability/         # Health checks, logging, correlation IDs
├── infrastructure/
│   ├── docker/                # init-db.sql for PostgreSQL
│   ├── nginx/                 # (Future: HTTPS termination)
│   └── monitoring/            # (Future: Prometheus, Grafana)
├── docs/
│   ├── architecture/decisions/
│   └── api/
├── docker-compose.yml         # PostgreSQL, RabbitMQ, all services
├── .env.example               # Env template (copy to .env)
├── package.json               # Monorepo root
├── nest-cli.json              # NestJS monorepo config
└── README.md                  # This file
```

---

## Services

| Service | Port | Responsibility |
|---------|------|----------------|
| **API Gateway** | 3000 | Public entry point, JWT validation, routing, rate limiting |
| **Account Service** | 3001 | Registration, login, OTP verification, profiles, roles |
| **Technician Verification Service** | 3002 | Application submission, admin review, eligibility |
| **Service Catalog Service** | 3003 | Bilingual service categories (admin CRUD, public read) |
| **Booking Service** | 3004 | Booking requests, cancellation, technician assignment |
| **Pricing & Quote Service** | 3005 | Technician quotes, customer acceptance/decline |
| **Job Management Service** | 3006 | Job execution workflow, status tracking |
| **Payment Service** | 3007 | Payment records, mock provider adapter |
| **Review & Complaint Service** | 3008 | Reviews, complaints, admin dispute handling |
| **Notification Service** | 3009 | Notifications (mock adapter logs to console) |

---

## Quick Start

### Prerequisites

- **Node.js** 20+ (you have v20.20.2 ✅)
- **npm** 10+ (you have v10.8.2 ✅)
- **Docker** + **Docker Compose** (you have Docker 29.9.3, Compose v5.7.0 ✅)
- **Git** (you have 2.56.1 ✅)

### 1. Clone & Setup

```powershell
cd C:\Users\benjamin\Desktop\DBM-Home-Fix\dm-homefix-backend
cp .env.example .env
# Edit .env with real secrets (see Environment Variables section below)
npm install
```

### 2. Generate JWT Secrets

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Paste output into .env as JWT_ACCESS_SECRET

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Paste output into .env as JWT_REFRESH_SECRET
```

### 3. Start Infrastructure

```powershell
docker-compose up -d postgres rabbitmq
```

Wait ~10 seconds for health checks to pass.

### 4. Run Database Migrations

Each service has its own database. Run Prisma migrations for all:

```powershell
# Account Service
cd services/account-service
npx prisma migrate dev --name init
cd ../..

# Technician Verification Service
cd services/technician-verification-service
npx prisma migrate dev --name init
cd ../..

# Service Catalog Service
cd services/service-catalog-service
npx prisma migrate dev --name init
cd ../..

# Booking Service
cd services/booking-service
npx prisma migrate dev --name init
cd ../..

# Pricing & Quote Service
cd services/pricing-quote-service
npx prisma migrate dev --name init
cd ../..

# Job Management Service
cd services/job-management-service
npx prisma migrate dev --name init
cd ../..

# Payment Service
cd services/payment-service
npx prisma migrate dev --name init
cd ../..

# Review & Complaint Service
cd services/review-complaint-service
npx prisma migrate dev --name init
cd ../..

# Notification Service
cd services/notification-service
npx prisma migrate dev --name init
cd ../..
```

### 5. Start All Services (Local Dev — without Docker)

```powershell
# Terminal 1 — Account Service
nest start account-service --watch

# Terminal 2 — Technician Verification Service
nest start technician-verification-service --watch

# Terminal 3 — Service Catalog Service
nest start service-catalog-service --watch

# Terminal 4 — Booking Service
nest start booking-service --watch

# Terminal 5 — Pricing & Quote Service
nest start pricing-quote-service --watch

# Terminal 6 — Job Management Service
nest start job-management-service --watch

# Terminal 7 — Payment Service
nest start payment-service --watch

# Terminal 8 — Review & Complaint Service
nest start review-complaint-service --watch

# Terminal 9 — Notification Service
nest start notification-service --watch

# Terminal 10 — API Gateway
nest start api-gateway --watch
```

**Or use Docker Compose for all services** (after building images):

```powershell
docker-compose up --build
```

### 6. Verify Health

```powershell
curl http://localhost:3000/api/v1/health    # API Gateway
curl http://localhost:3001/api/v1/health    # Account Service
curl http://localhost:3002/api/v1/health    # Technician Verification Service
# ... repeat for ports 3003 through 3009
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in secrets:

### Required Secrets

| Variable | How to Generate | Purpose |
|----------|----------------|---------|
| `JWT_ACCESS_SECRET` | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` | Signs access tokens (15m exp) |
| `JWT_REFRESH_SECRET` | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` | Signs refresh tokens (7d exp) |
| `OTP_SECRET` | Any random string | OTP generation seed |
| `POSTGRES_PASSWORD` | Strong password | PostgreSQL root password |
| `RABBITMQ_PASS` | Strong password | RabbitMQ password |

### Mock Adapters (Dev Only)

| Variable | Current | Production Replacement |
|----------|---------|------------------------|
| `OTP_CHANNEL` | `mock` | `email` or `sms` (configure provider) |
| `STORAGE_PROVIDER` | `local` | `s3` (configure S3-compatible storage) |
| `PAYMENT_PROVIDER` | `mock` | `chapa` (configure Chapa API keys) |
| `NOTIFICATION_CHANNEL` | `mock` | `email` / `sms` (configure provider) |

**⚠️ Never commit `.env` to version control. It contains secrets.**

---

## Running Services

### Local Development (Hot Reload)

```powershell
nest start <service-name> --watch
# Example: nest start account-service --watch
```

### Build Production Assets

```powershell
npm run build:all
# Or build individually:
nest build account-service
```

### Docker Compose (Full Stack)

```powershell
docker-compose up --build
```

Stops all services:

```powershell
docker-compose down
```

Stops and removes volumes (⚠️ deletes databases):

```powershell
docker-compose down -v
```

---

## Database Migrations

Each service has a Prisma schema under `services/<service-name>/prisma/schema.prisma`.

### Create a New Migration

```powershell
cd services/account-service
npx prisma migrate dev --name add_new_field
```

### Apply Migrations in Production

```powershell
npx prisma migrate deploy
```

### Reset Database (Dev Only — ⚠️ Data Loss)

```powershell
npx prisma migrate reset
```

---

## Testing

### Run All Tests

```powershell
npm test
```

### Run Tests for One Service

```powershell
npm test -- account-service
```

### Coverage

```powershell
npm run test:cov
```

---

## API Documentation

Each service exposes Swagger docs at:

```
http://localhost:<PORT>/api/v1/docs
```

| Service | Swagger URL |
|---------|-------------|
| API Gateway | http://localhost:3000/api/v1/docs |
| Account Service | http://localhost:3001/api/v1/docs |
| Technician Verification Service | http://localhost:3002/api/v1/docs |
| Service Catalog Service | http://localhost:3003/api/v1/docs |
| Booking Service | http://localhost:3004/api/v1/docs |
| Pricing & Quote Service | http://localhost:3005/api/v1/docs |
| Job Management Service | http://localhost:3006/api/v1/docs |
| Payment Service | http://localhost:3007/api/v1/docs |
| Review & Complaint Service | http://localhost:3008/api/v1/docs |
| Notification Service | http://localhost:3009/api/v1/docs |

**Production:** Route all requests through the API Gateway (`http://localhost:3000`). Do not expose internal service ports publicly.

---

## Development Workflow

### 1. Create a Feature Branch

```powershell
git checkout -b feature/add-booking-filters
```

### 2. Make Changes

Edit service code under `services/<service-name>/src/`.

### 3. Run Locally & Test

```powershell
nest start <service-name> --watch
npm test
```

### 4. Commit

```powershell
git add .
git commit -m "feat(booking): add filter by date range"
```

### 5. Push & Create PR

```powershell
git push origin feature/add-booking-filters
# Open PR on GitHub: https://github.com/yodnabin-1995/dm-homefix-backend
```

### Code Style

- **Linter:** `npm run lint`
- **Formatter:** `npm run format`

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Replace mock OTP adapter with real SMS/email provider
- [ ] Replace mock payment adapter with Chapa (or chosen provider)
- [ ] Replace mock notification adapter with real SMS/email provider
- [ ] Configure S3-compatible storage for document uploads
- [ ] Set strong secrets in production `.env`
- [ ] Run all migrations: `npx prisma migrate deploy` (each service)
- [ ] Enable HTTPS with Nginx reverse proxy
- [ ] Configure CORS to allow only your frontend domain
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Set up centralized logging (Loki)
- [ ] Configure automated backups for PostgreSQL
- [ ] Review security: Helmet, rate limits, input validation

### Deployment Options

1. **Docker Compose** (small-scale): Run `docker-compose up -d` on a VPS
2. **Kubernetes** (scale-ready): Write K8s manifests, deploy to EKS/GKE/AKS
3. **Cloud PaaS**: Deploy each service to AWS Fargate, Google Cloud Run, or Azure Container Instances

---

## Architecture Principles

1. **Microservices:** Each service is independently deployable.
2. **Data Ownership:** Each service owns its database. No cross-service DB queries.
3. **Communication:**
   - **Synchronous:** HTTP APIs (e.g., API Gateway → Account Service)
   - **Asynchronous:** RabbitMQ events (e.g., `technician_verification.approved`)
4. **API Gateway:** Single public entry point. Internal services are private.
5. **Security:** JWT tokens, Argon2 password hashing, role-based access, audit logs.
6. **Bilingual:** Amharic and English system messages, service categories, and notifications.
7. **Observability:** Health checks, structured JSON logs, correlation IDs.

---

## Troubleshooting

### Services Won't Start

**Check ports:**

```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :3001
# ... check 3000–3009, 5432, 5672
```

Kill conflicting processes or change ports in `.env`.

**Check database connection:**

```powershell
docker-compose logs postgres
```

Ensure `DATABASE_URL` in each service `.env` matches the container name and credentials.

### Database Migrations Fail

**Reset Prisma (dev only):**

```powershell
cd services/account-service
npx prisma migrate reset
```

**Check PostgreSQL logs:**

```powershell
docker-compose logs postgres
```

### RabbitMQ Not Receiving Events

Event publishing is currently **stubbed** (logs only). Full RabbitMQ integration will be wired in a later stage. Check logs for `[EVENT]` entries.

**RabbitMQ Management UI:**

```
http://localhost:15672
Username: dmhomefix
Password: (from .env RABBITMQ_PASS)
```

### Docker Compose Build Errors

**Rebuild from scratch:**

```powershell
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### OTP / Notifications Not Sending

**Mock adapters** log to console. Check service logs for `[DEV MOCK OTP]` or `[DEV MOCK NOTIFICATION]`.

For production, configure real providers:

- **SMS:** Twilio, Africa's Talking
- **Email:** SendGrid, AWS SES

---

## Next Steps

1. **Run initial migrations** (see step 4 in Quick Start)
2. **Start all services**
3. **Test registration flow:**
   - POST `/api/v1/accounts/auth/register`
   - Check console for mock OTP
   - POST `/api/v1/accounts/auth/verify-otp`
   - POST `/api/v1/accounts/auth/login`
4. **Create admin account** (manually set role to `ADMIN` in DB)
5. **Add service categories** (via Service Catalog Service admin endpoints)
6. **Test technician verification workflow**
7. **Test booking → quote → job → payment → review flow**

---

## Contributing

1. Follow [SRS requirements](DM-HomeFix-SRS-and-Backend-Development-Guide.md)
2. Write tests for new features
3. Run linter before committing: `npm run lint`
4. Use semantic commit messages: `feat:`, `fix:`, `docs:`, `chore:`
5. Open PR against `main` branch

---

## License

UNLICENSED (private project)

---

## Support

For issues or questions:
- **GitHub Issues:** https://github.com/yodnabin-1995/dm-homefix-backend/issues
- **Email:** [your team email]

---

**Built with ❤️ for Debre Markos, Ethiopia**

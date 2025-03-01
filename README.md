# Work Order Management System

A manufacturing work order management system built with Next.js and PostgreSQL.

## Features

🔐 Role-Based Access Control (RBAC)
- Production Manager: create work orders, assign operators
- Operator: view & update assigned work order status

📋 Work Order Management
- Work order creation with automatic numbering
- Status tracking (Pending, In Progress, Completed, Canceled)
- Status change history

📊 Dashboard
- Work order list with filters
- Real-time status
- Responsive interface

## Tech Stack

- Framework: Next.js 15 (App Router)
- Database: PostgreSQL
- ORM: Prisma
- Styling: Tailwind CSS
- Authentication: JWT (jose)
- Container: Docker & Docker Compose

## Usage

1. Docker Setup:

   ```bash
   docker-compose up -d --build
   docker-compose exec app sh
   npx prisma migrate deploy
   npx prisma db seed
   ```

2. Manual Setup:

   ```bash
   npm install
   cp .env.example .env
   npx prisma migrate dev
   npm run seed
   npm run dev
   ```

3. Open ```http://localhost:3000```

## Login Credentials

Production Manager:
- Email: manager@example.com
- Password: password123

Operator:
- Email: operator@example.com
- Password: password123

## Important Commands

Database:
- Migration: ```npx prisma migrate dev```
- Seed: ```npm run seed```

Docker:
- Start: ```docker-compose up -d```
- Stop: ```docker-compose down```
- Logs: ```docker-compose logs -f app```
- Reset DB: ```docker-compose down -v```

Development:
- Dev server: ```npm run dev```
- Build: ```npm run build```
- Lint: ```npm run lint```
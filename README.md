# SaaS Company Management System Backend

Production-ready multi-tenant backend built with Go, Gin, GORM, and PostgreSQL.

## Features
- Clean layered architecture (controllers, services, repositories)
- JWT authentication with role-based authorization
- Single-database multi-tenancy using `company_id`
- CRUD APIs for employees and tasks
- Attendance management
- Request validation and consistent error responses
- Pagination for list endpoints

## Quick Start
1. Copy `.env.example` to `.env` and update values.
2. Run:
   ```bash
   go mod tidy
   go run ./cmd/server
   ```

## API Base
- `http://localhost:8080/api`

## Authentication
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`

Use `Authorization: Bearer <token>` for protected APIs.

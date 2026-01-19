# Automated Test Report
Date: 2026-01-19
Project: NewsProject
Test Suite: Backend API Automation

## Summary
- **Total Tests:** 33
- **Passed:** 33
- **Failed:** 0
- **Status:** PASS

## Test Environment
- **Database:** MongoDB (Local)
- **Framework:** Jest + Supertest
- **Admin User:** admin@example.com
- **Writer User:** nibir@gmail.com

## Detailed Test Results

### 1. Authentication & Authorization (5 tests)
- Admin login with valid credentials
- Writer login with valid credentials
- Login fails with invalid password
- Login fails when email is missing
- Login fails when password is missing

### 2. Admin Functionality (11 tests)
- Admin can create a new writer
- Admin cannot create writer with duplicate email
- Admin can get writer by id
- Admin can update writer details
- Admin can delete writer
- Admin can get writers list
- Admin can view news statistics
- Admin can view dashboard news
- Admin can update news status when news exists
- Admin can fetch dashboard news details by id
- Admin can fetch edit dashboard news details by id

### 3. Writer Functionality (3 tests)
- Writer can view own news statistics
- Writer can view own news list
- Admin cannot access writer-only statistics

### 4. Profile API (2 tests)
- Admin can fetch own profile by id
- Writer can fetch own profile by id

### 5. Security & Middleware (2 tests)
- Protected route without token returns 401
- Protected route with invalid token returns 401

### 6. Public API Endpoints (10 tests)
- Latest news returns list
- Popular news returns list
- All news grouped by category
- Categories summary returns list
- Recent news returns list
- Images news returns images
- Search without query value returns 400
- Search with value returns 200
- News detail by slug when news exists
- Category news by category when category exists

---
**End of Report**

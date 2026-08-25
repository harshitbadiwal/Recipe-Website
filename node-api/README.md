# Recipe Master REST API (`node-api`)

Production-ready, high-performance Express.js REST API for the Recipe Master platform with JWT authentication, Role-Based Access Control (USER/ADMIN), Mongoose database models, layered architecture, Swagger OpenAPI documentation (`/api-docs`), input validation, rate limiting, and an automated Jest test suite.

---

## Architecture Overview

```text
HTTP Request
     ↓
Rate Limiter & CORS & Helmet Security
     ↓
Swagger Docs (/api-docs) & API Versioning (/api/v1)
     ↓
Router Layer (src/routes)
     ↓
Validation Middleware (express-validator)
     ↓
Authentication & Authorization Middleware (JWT + Roles)
     ↓
Controller Layer (src/controllers)
     ↓
Service Layer (Business Logic in src/services)
     ↓
Repository Layer (Database queries in src/repositories)
     ↓
Mongoose Models (MongoDB / Memory Server in src/models)
```

---

## API Documentation & Base URLs

* **Base API URL**: `http://localhost:5000/api/v1`
* **Swagger OpenAPI UI**: `http://localhost:5000/api-docs`

---

## Key Features

1. **Layered Architecture**: Separation of concerns across Routes, Controllers, Services, Repositories, and Models.
2. **Authentication**: JWT-based access and refresh tokens with password hashing (`bcryptjs`).
3. **Role-Based Authorization**: Enforced roles (`USER`, `ADMIN`) protecting administrative endpoints.
4. **Complete Recipe Features**: Search, pagination, category filtering, difficulty filters, ratings, comments moderation, favorites, and collections.
5. **Interactive Swagger Docs**: Test all endpoints directly via `/api-docs` with the "Authorize" button for Bearer JWT.
6. **Zero-Setup Database Fallback**: Connects to your local/remote MongoDB or seamlessly starts `mongodb-memory-server` if local MongoDB is unavailable.

---

## Setup & Running Instructions

### 1. Installation

Navigate to the `node-api` directory and install dependencies:

```bash
cd node-api
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default configuration in `.env`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://127.0.0.1:27017/recipe_db
JWT_SECRET=recipe_jwt_secret_key_production_2026_super_secure
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=recipe_refresh_token_secret_key_2026_super_secure
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:5173
```

### 3. Database Seeding

Populate the database with initial admin/user accounts, categories, recipes, and articles:

```bash
npm run seed
```

Default Seed Accounts:
* **Admin**: `admin@recipe.com` / `admin123`
* **User**: `user@recipe.com` / `user123`

### 4. Running Development Server

```bash
npm run dev
```

### 5. Running Production Server

```bash
npm start
```

### 6. Testing

Execute automated unit and integration tests:

```bash
npm test
```

---

## Example API Requests

### 1. User Registration
`POST /api/v1/auth/register`
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

### 2. User Login
`POST /api/v1/auth/login`
```json
{
  "email": "admin@recipe.com",
  "password": "admin123"
}
```
*Response includes `accessToken` and `refreshToken`.*

### 3. Fetch Recipes (Public)
`GET /api/v1/recipes?category=veg&difficulty=Easy&sort=rating_desc&page=1&limit=20`

### 4. Admin Create Recipe (Protected)
`POST /api/v1/admin/recipes`
Headers: `Authorization: Bearer <ADMIN_ACCESS_TOKEN>`
```json
{
  "title": "Paneer Butter Masala",
  "description": "Rich cottage cheese gravy in tomato sauce.",
  "category": "Veg",
  "prepTime": 15,
  "cookTime": 20,
  "difficulty": "Easy"
}
```

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Recipes fetched successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Recipe not found",
  "error": {
    "code": "RECIPE_NOT_FOUND"
  }
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

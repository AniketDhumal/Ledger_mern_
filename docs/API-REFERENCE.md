# Ledgerlite API Reference

<p align="center">
  <b>Backend API documentation for Ledgerlite MERN Expense Manager</b>
</p>

---

## 🚀 Overview

This document lists all available API endpoints for the **Ledgerlite MERN** backend.  
All routes are prefixed with `/api`.

---

## 🩺 1. Health Check

**Endpoint:** `GET /api/health`  
**Description:** Returns a JSON object confirming that the API is running.

**Headers:** None

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/health
```

**Example Response:**
```json
{ "ok": true }
```

---

## 👤 2. User Registration

**Endpoint:** `POST /api/auth/register`  
**Description:** Creates a new user account.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

**Example Response (201 Created):**
```json
{
  "id": "689f46349b1f2a47d29ff902",
  "name": "Test User",
  "email": "test@example.com"
}
```

---

## 🔑 3. User Login

**Endpoint:** `POST /api/auth/login`  
**Description:** Authenticates a user and returns a JWT token.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

**Example Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "689f46349b1f2a47d29ff902",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

---

## ➕ 4. Create Expense

**Endpoint:** `POST /api/expenses`  
**Description:** Creates a new expense record for the logged-in user.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "title": "Lunch",
  "category": "Food",
  "reimbursable": true,
  "amount": 200,
  "taxRate": 5
}
```

**Example Response (201 Created):**
```json
{
  "userId": "689f46349b1f2a47d29ff902",
  "title": "Lunch",
  "category": "Food",
  "reimbursable": true,
  "amount": 200,
  "taxRate": 5,
  "_id": "689f46c09b1f2a47d29ff905",
  "total": 210,
  "createdAt": "2025-08-15T14:40:00.071Z",
  "updatedAt": "2025-08-15T14:40:00.071Z",
  "__v": 0
}
```

---

## 📄 5. Get Expenses

**Endpoint:** `GET /api/expenses`  
**Description:** Retrieves a paginated list of the user’s expenses.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page` → Page number (default: 1)  
- `limit` → Number of items per page (default: 10)  
- `category` → Filter by category  
- `reimbursable` → Filter by reimbursable status (`true` or `false`)  
- `q` → Search term (case-insensitive)  
- `sort` → Sorting order (e.g., `-createdAt` for newest first)  

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/expenses?page=1&limit=5" -H "Authorization: Bearer <JWT_TOKEN>"
```

**Example Response (200 OK):**
```json
{
  "items": [
    {
      "_id": "689f46c09b1f2a47d29ff905",
      "title": "Lunch",
      "category": "Food",
      "reimbursable": true,
      "amount": 200,
      "taxRate": 5,
      "total": 210,
      "createdAt": "2025-08-15T14:40:00.071Z",
      "updatedAt": "2025-08-15T14:40:00.071Z",
      "__v": 0
    }
  ],
  "total": 1,
  "pages": 1,
  "page": 1,
  "limit": 5
}
```

---

## 🔍 6. Get Single Expense

**Endpoint:** `GET /api/expenses/:id`  
**Description:** Retrieves a single expense by its ID.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Example Response (200 OK):**
```json
{
  "_id": "689f46c09b1f2a47d29ff905",
  "title": "Lunch",
  "category": "Food",
  "reimbursable": true,
  "amount": 200,
  "taxRate": 5,
  "total": 210,
  "createdAt": "2025-08-15T14:40:00.071Z",
  "updatedAt": "2025-08-15T14:40:00.071Z",
  "__v": 0
}
```

---

## ✏️ 7. Update Expense

**Endpoint:** `PUT /api/expenses/:id`  
**Description:** Updates an existing expense.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "title": "Dinner",
  "amount": 250
}
```

**Example Response (200 OK):**
```json
{
  "_id": "689f46c09b1f2a47d29ff905",
  "title": "Dinner",
  "category": "Food",
  "reimbursable": true,
  "amount": 250,
  "taxRate": 5,
  "total": 262.5,
  "createdAt": "2025-08-15T14:40:00.071Z",
  "updatedAt": "2025-08-15T15:20:00.071Z",
  "__v": 0
}
```

---

## 🗑 8. Delete Expense

**Endpoint:** `DELETE /api/expenses/:id`  
**Description:** Deletes an expense by its ID.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Example Response (204 No Content):**
```
(no body)
```

---

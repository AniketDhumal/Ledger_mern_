# Ledgerlite API — Postman Documentation Setup

## Overview
This project uses **Postman** for API testing and documentation.  
We maintain a Postman collection that covers core API endpoints for **Auth** and **Expenses**.

---

## Postman Collection
- **File:** `ledgerlite.postman_collection.json`
- **Location:** Not stored in repo (can be generated from Postman export at any time)
- **Environment Variable Required:**
  - `baseUrl` → `http://localhost:5000`
  - `token` (auto-set after login)

---

## API Endpoints in Collection
1. **GET** `/api/health` → Health check
2. **POST** `/api/auth/register` → User registration
3. **POST** `/api/auth/login` → Login & receive JWT token  
   - Automatically saves token to environment
4. **POST** `/api/expenses` → Create new expense  
   - Requires `Authorization: Bearer {{token}}`
5. **GET** `/api/expenses` → Get paginated expenses list

---

## How to Import & Use
1. Open Postman → `File` → `Import`
2. Select `ledgerlite.postman_collection.json`
3. Create a **New Environment**:
   - Name: `Ledgerlite Dev`
   - Variables:
     - `baseUrl` → `http://localhost:5000`
4. Select this environment before running requests.
5. **Register** → **Login** → Use other endpoints.

---

## Notes
- Always run `/api/auth/login` before protected routes to refresh `{{token}}`.
- Documentation can be auto-generated from this collection using **Postman’s API Docs** export feature.
- For production deployment, update `baseUrl` in environment.

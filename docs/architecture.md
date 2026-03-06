# LedgerLite — Architecture

## Overview
LedgerLite is a small Expense Manager built with MERN. It demonstrates auth, CRUD, derived fields, and list management (pagination + filter; bonus: sort + search).

## Tech Stack
- Backend: Node.js, Express, Mongoose, JWT
- DB: MongoDB Atlas
- Frontend: React (Vite) + Tailwind (lean UI)
- Hosting: API on Render, UI on Vercel

## Data Model
**User**
- name: String
- email: String (unique)
- password: String (hashed)

**Expense**
- userId: ObjectId → User
- title: String
- category: Enum {Food, Travel, Office, Other}
- reimbursable: Boolean
- amount: Number
- taxRate: Number (0–100)
- total: Number (derived = amount + amount*taxRate/100)
- timestamps

Indexes:
- (userId, createdAt), (userId, category), (userId, reimbursable), (userId, title)

## API Endpoints
- `POST /api/auth/register` → {name,email,password}
- `POST /api/auth/login` → {email,password} → {token}
- `GET /api/expenses` (JWT)
  - Query: page, limit, category, reimbursable, q, sort
  - Returns: {items, total, pages, page, limit}
- `POST /api/expenses` (JWT) → create (total derived on validate)
- `GET /api/expenses/:id` (JWT)
- `PUT /api/expenses/:id` (JWT)
- `DELETE /api/expenses/:id` (JWT)

## Request Flow (Backend)
Client → Axios → `Authorization: Bearer <token>` → Express → `auth` middleware → route handler → Mongoose → MongoDB.

## Security & Config
- JWT secret via env
- CORS `origin` set via env (local: `http://localhost:5173`)
- Never commit real `.env`; commit `.env.example`.

## Deployment Notes
- Render service root: `/server` (start: `npm start`)
- Vercel project root: `/client` (build: `npm run build`, output: `dist`)
- Frontend env: `VITE_API_URL=<render_api>/api`

## Assignment Mapping
- Auth (username/password) ✅
- CRUD with required fields (text, enum, boolean, derived) ✅
- Listing: pagination + a useful filter ✅
- Bonus: sort + search ⭐
- Docs: commits screenshot, AI prompts, video link, architecture write-up ✅

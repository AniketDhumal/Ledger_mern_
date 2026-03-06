<h1 align="center">Ledgerlite — MERN Expense Manager</h1>
<p align="center">A minimalist, fast expense manager with JWT auth, server-side filters (including date range), and clean analytics.</p>

<!-- Live links row -->
<p align="center">
  <a href="https://ledgerlite-zc0w.onrender.com" target="_blank"><b>🔥 Live Demo</b></a>
  &nbsp;•&nbsp;
  <a href="https://ledgerlite-mern.onrender.com/api/health" target="_blank">API Health</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Recharts-Analytics-888888?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Express-API-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens" />
  <img src="https://img.shields.io/badge/Deployed-Client/Server-brightgreen?style=for-the-badge" />
</p>



## 🚀 Features

- 🔐 **JWT Authentication** — Register/Login with bcrypt-hashed passwords
- 💾 **MongoDB (Mongoose)** models: `User`, `Expense` (timestamps)
- ✍️ **Expenses CRUD** — Create, List (with pagination), Delete (edit-ready)
- 🔎 **Filtering & Search** — `q` (title), `category`, `reimbursable`, `sort`
- 📅 **Date Range Filtering** — `from` / `to` (server-side on `createdAt`) for monthly/custom windows
- 📈 **Analytics Page** — Line (over time), Bar (by category), Pie (reimbursable split)
- 🧭 **Landing Page** — Hero + feature cards + CTA; protected `/dashboard` & `/analytics`
- ⚙️ **Configurable Envs** — `VITE_API_BASE` (client) · `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN` (server)
- 🧪 **Postman Collection** — Ready-made requests and token capture
- 🗂 **Docs** — API Reference, Prompts, Feature Log, Commits, Video outline

---

## 🛠 Tech Stack

| Frontend                        | Backend                         | Database        | Deployment |
|---------------------------------|---------------------------------|-----------------|-----------|
| React (Vite), React Router, Tailwind, Recharts *(+ optional TanStack Query)* | Node.js, Express, JWT, bcrypt | MongoDB Atlas (Mongoose) | Any static host + Node host |

---

## 📦 Local Setup

> Requires Node 18+ and a MongoDB Atlas URI.

### 1) Clone
```bash
git clone https://github.com/aryan1921/ledgerlite-mern.git
cd ledgerlite-mern

```
### 2)Server API
```bash
cd server
npm i
```
#### Create .env in server/:

```env
MONGO_URI=your-atlas-uri
JWT_SECRET=your-long-random-secret
PORT=5000
# during local dev, allow Vite dev origins
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```
#### Start (dev):
```bash
npm run dev

```
#### Health check:
```bash
curl -i http://localhost:5000/api/health
# -> { "ok": true }
```
### 3)Client (Web)
```bash
cd ../client
npm i
```
#### Create client/.env.local:
```env
VITE_API_BASE=http://localhost:5000/api
```
#### Run dev:
```env
npm run dev
# Vite on http://localhost:5173
```
## 🌐 Deployment (separate)

### Server (Render / Railway / Fly / …)
Set environment variables:
- `MONGO_URI`, `JWT_SECRET`
- `PORT` (if required by host)
- `CORS_ORIGIN=https://your-client-domain, http://localhost:5173` *(keep localhost during testing)*

### Client (Vercel / Netlify / CF Pages / Render static)
- **Build command:** `npm run build`
- **Publish / Output dir:** `dist`
- **Env:** `VITE_API_BASE=https://your-api-domain/api`
- **Netlify SPA:** add `public/_redirects`:
  ```txt
  /*  /index.html  200
  ```

 ### Postman (use environments, not code edits)

- **Dev:** `baseUrl = http://localhost:5000`  
- **Prod:** `baseUrl = https://your-api-domain`  
  *(collection paths already include `/api`)*

---

## 🔐 Authentication Flow

1. **Register** — `POST /api/auth/register` → creates user  
2. **Login** — `POST /api/auth/login` → returns `token`  
3. Client stores **token** and dispatches `authChange` to refresh UI  
4. Axios attaches `Authorization: Bearer <token>` to protected routes  
5. **Protected pages:** `/dashboard`, `/analytics` (redirect to `/login` if not authed)  
6. **Logout** clears token and redirects to **Landing** (`/`)

## 🧠 App Pages

- **Landing (`/`)** — Intro, feature cards, CTAs to login/register
- **Login / Register** — Auth forms; show server errors when present
- **Dashboard (`/dashboard`)**
  - Filters: **q** (title), **category**, **reimbursable**, **from/to** (date)
  - Stats: page total (₹), reimbursable count, pages
  - Quick Add: title, amount, tax%, category, reimbursable
  - Table: amount/tax/total/when + delete
- **Analytics (`/analytics`)**
  - Date pickers, “This month”, “Clear dates”
  - Line: spend over time
  - Bar: totals by category
  - Pie: reimbursable vs non-reimbursable (no clipping)

## 🔌 API Overview

**Base path:** `http://localhost:5000/api` (dev) · `https://your-api-domain/api` (prod)

### Auth
- `POST /auth/register` — body `{ email, password }` → **201 Created**
- `POST /auth/login` — body `{ email, password }` → response `{ token, user }`

### Expenses (JWT required)
- `POST /expenses` — create `{ title, amount, taxRate, category, reimbursable }`
- `GET /expenses` — list with filters:
  - `page`, `limit`, `q`, `category`, `reimbursable`, `sort`
  - `from`, `to` *(ISO or `YYYY-MM-DD`; server validates and filters by `createdAt`)*
- `DELETE /expenses/:id` — delete

> Full examples in `/docs/API-REFERENCE.md`.
## 🧪 Postman

- **Import:** `/docs/postman_collection.json`
- **Create environment:**
  - **Ledgerlite Dev** → `baseUrl = http://localhost:5000`
  - **Ledgerlite Prod** → `baseUrl = https://your-api-domain`
- **Run:** Health → Register → Login → Expenses _(Login “Tests” step stores `{{token}}` automatically)_

---

## 🧭 Quick Smoke (PowerShell)

```powershell
$BASE = "http://localhost:5000/api"

# Health
irm "$BASE/health"

# Register a random user
$email = "test$(Get-Random)@example.com"
$pwd   = "123456"
irm "$BASE/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body (@{ email = $email; password = $pwd } | ConvertTo-Json)

# Login and capture token
$login = irm "$BASE/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body (@{ email = $email; password = $pwd } | ConvertTo-Json)
$token = $login.token

# Authenticated request
irm "$BASE/expenses" -Headers @{ Authorization = "Bearer $token" }
```

## 📁 Folder Structure

```txt
ledgerlite-mern/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Expense.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── expenses.js
│   │   └── index.js
│   └── .env           # MONGO_URI, JWT_SECRET, PORT, CORS_ORIGIN
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   └── expenses.js
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Analytics.jsx
│   │   └── components/
│   │       ├── StatCard.jsx
│   │       ├── Badge.jsx
│   │       ├── Spinner.jsx
│   │       └── EmptyState.jsx
│   └── .env.local     # VITE_API_BASE
└── docs/
    ├── API-REFERENCE.md
    ├── postman_collection.json
    ├── commits.md         # with screenshots
    ├── FEATURE_LOG.md
    ├── prompts.md         # AI prompts with reasoning
    └── video.md

```
## 🔄 Development Tracking

- **Commit Frequency:** push at least hourly
- Commits history & screenshots: see `/docs/commits.md`
- Milestones & video/README outline: see `/docs/FEATURE_LOG.md`

---

## ✨ Future Enhancements

- Edit modal for expenses
- Aggregation summaries endpoint (`/expenses/summary?from&to&granularity=month`)
- CSV export & import
- Category management UI
- Better auth UX (password reset, email verification)

---

## 🌍 Links

- **Demo Video:** see `/docs/video.md`
- **API Docs:** `/docs/API-REFERENCE.md`
- **AI Prompts:** `/docs/prompts.md`
- **Postman:** `/docs/postman_collection.json`

<p align="center"><b>Spend smarter — with less clutter. 💸</b></p>


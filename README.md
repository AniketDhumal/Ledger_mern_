<h1 align="center">Ledgerlite AI — MERN Expense Manager with AI Insights</h1>

<p align="center">
A modern AI-powered expense management platform built using the MERN stack with analytics, AI insights, and smart financial assistant integration.
</p>

<p align="center">
  <a href="https://ledger-mern-4.onrender.com/" target="_blank"><b>🔥 Live Demo</b></a>
  &nbsp;•&nbsp;
  <a href="https://ledgerlite-mern.onrender.com/api/health" target="_blank">API Health</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-Styling-38BDF8?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Recharts-Analytics-888888?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-API-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens" />
  <img src="https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge" />
</p>

---

# 🚀 Features

- 🔐 JWT Authentication (Login/Register)
- 🔒 Secure password hashing using bcrypt
- 💾 MongoDB database with Mongoose models
- ✍️ Expense CRUD operations
- 📅 Date-based filtering and analytics
- 📈 Interactive analytics dashboard
- 📊 Category-wise expense analysis
- 💬 AI Chat Assistant for financial help
- 🤖 AI Expense Insights and recommendations
- 🔎 Expense search and filters
- 📱 Fully responsive UI
- 🌐 REST API architecture
- ⚡ Fast frontend using Vite
- 🧪 Postman API collection support
- 🚀 Deployment-ready architecture

---

# 🛠 Tech Stack

| Frontend | Backend | Database | Authentication | Charts |
|----------|----------|-----------|----------------|--------|
| React + Vite | Node.js + Express | MongoDB Atlas | JWT + bcrypt | Recharts |

---

# 📦 Project Structure

```txt
ledgerlite-mern/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   ├── expenses.js
│   │   │   └── chat.js
│   │   │
│   │   ├── components/
│   │   │   ├── ChatPopup.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── AIInsights.jsx
│   │   │
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   │
│   │   ├── models/
│   │   │   ├── Expense.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── expenses.js
│   │   │   ├── ai.js
│   │   │   └── chat.js
│   │   │
│   │   ├── services/
│   │   │
│   │   └── app.js
│   │
│   ├── checkModel.js
│   └── package.json
│
└── docs/
    ├── API-REFERENCE.md
    ├── FEATURE_LOG.md
    ├── prompts.md
    └── postman_collection.json
```

---

# ⚙️ Environment Variables

## Server `.env`

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

## Client `.env.local`

```env
VITE_API_BASE=http://localhost:5000/api
```

---

# 🚀 Local Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/AniketDhumal/Ledger_mern_.git
cd ledgerlite-mern
```

---

## 2️⃣ Setup Backend

```bash
cd server
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

## 3️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# 🔐 Authentication Flow

1. User registers account
2. Password stored securely using bcrypt
3. User logs in
4. JWT token generated
5. Protected routes verify token
6. Authenticated users access dashboard and analytics

---

# 📊 Analytics Features

- 📈 Expense trends over time
- 📊 Category-wise expense charts
- 🥧 Reimbursable vs non-reimbursable analysis
- 📅 Monthly and custom date filtering
- 💹 Spending insights visualization

---

# 🤖 AI Features

## 💬 AI Chat Assistant

Users can:
- Ask finance-related questions
- Understand spending patterns
- Get budgeting suggestions
- Receive smart financial guidance

## 🧠 AI Insights

- Expense analysis
- Smart recommendations
- Financial behavior tracking
- AI-generated spending summaries

---

# 🔌 API Routes

## Authentication

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

---

## Expenses

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/expenses` | Get expenses |
| POST | `/api/expenses` | Add expense |
| DELETE | `/api/expenses/:id` | Delete expense |

---

## AI Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai` | Generate AI insights |
| POST | `/api/chat` | AI chat assistant |

---

# 🌐 Deployment

## Frontend Deployment

- Vercel
- Netlify
- Render Static

## Backend Deployment

- Render
- Railway
- Fly.io

---

# 🧪 Postman Support

Import:

```txt
/docs/postman_collection.json
```

Environment setup:

```txt
baseUrl=http://localhost:5000
```

---

# 🔄 Git Workflow

```bash
git add .
git commit -m "your message"
git push origin main
```

---

# ✨ Future Enhancements

- 📤 CSV export/import
- 📧 Email notifications
- 🎤 Voice-enabled AI assistant
- 📱 Mobile application
- 📉 Predictive expense forecasting
- 🧾 AI-generated monthly reports
- 🔔 Budget alerts and reminders

---

# 👨‍💻 Developed By

## Aniket Dhumal

### Mentor
Dr. Aishwarya Anana Ukey

---

# 🌍 Project Links

- 🔥 Live Demo: https://ledger-mern-4.onrender.com/
- 📡 API Health: https://ledgerlite-mern.onrender.com/api/health

---

<p align="center">
<b>Spend smarter with AI-powered financial management 💸🤖</b>
</p>

# ExpenseManager - Expense Management System

A production-ready, full-stack personal finance web application built using the **MERN Stack** (MongoDB, Express.js, React, Node.js) with Tailwind CSS, Lucide Icons, and Recharts. Designed with a custom warm aesthetic (Cream, Sand, Dusty Pink, and Burgundy) supporting both Light and Dark modes, responsive mobile-first views, multi-account ledger balances, trip & place budgeting, bill reminders, savings milestones, and CSV/PDF export.

---

## 🌟 Key Features

### 1. Main Financial Dashboard
- **Financial Metric Cards**: Real-time Total Balance, Income (+growth %), Expenses (-growth %), and Total Savings.
- **Money Flow Analytics**: 12-month dynamic Bar Chart comparing Income vs Expenses with rounded gradient bars.
- **Budget Donut Breakdown**: Category expenditure distribution with center sum and category allocation dots.
- **Recent Transactions Ledger**: Compact list with merchant logos, payment methods, and color-coded amounts.
- **Saving Goals**: Progress bars tracking items like MacBook Pro, New EV Car, and Dream House.
- **Upcoming Bills Widget**: Immediate notices for due and overdue bills with one-click "Pay" action.

### 2. Transaction Management (Income & Expenses)
- Comprehensive fields: Title, Amount, Date & Time, Category, Subcategory, Source Account, Destination Account (for transfers), Payment Method (UPI, Cash, Cards, Net Banking), Merchant, Place/Location, Notes, Tags, and Receipt attachments.
- **Quick Add Form**: Optimized 1-tap presets for micro-expenses (Tea ₹20, Breakfast ₹60, Lunch ₹120, Bus Fare ₹40, Bike Petrol ₹500).
- **IDOR Protection**: Strict user isolation ensures users can never access or mutate each other's transactions.
- **Account Transfer Ledger**: Transfers adjust source and destination balances without distorting income or expense statistics.

### 3. Trips & Places
- Plan and manage trips (e.g. *Lucknow Visit*, *Goa Beach Vacation*).
- Track planned travel budgets, remaining funds, daily average spend, and places visited.
- Link individual expense transactions to a specific trip.

### 4. Smart Budgeting & Threshold Alerts
- Set monthly or weekly caps for overall spending or specific categories.
- Real-time spending calculation and warning alerts at **75%**, **90%**, and **100%+** limit breaches.
- In-app notification triggers.

### 5. Recurring Bills & Due Reminders
- Track Electricity, Mobile Recharge, WiFi, EMI, Rent, Subscriptions, and Insurance.
- Recurring frequencies: Monthly, Weekly, Quarterly, Yearly, or Daily.
- "Mark as Paid" workflow that creates an expense entry and debits account balance automatically.

### 6. Savings Goals
- Save towards targets with deposit and withdrawal histories.
- Visual percentage completion and celebratory confetti animations upon milestone achievement.

### 7. Loans & Peer Lending Tracker
- Privately track money lent to friends ("Owed to me") and money borrowed ("I owe to others").
- Partial and full repayment settlements without skewing regular income/expense reports.

### 8. CSV Import, Export & PDF Reports
- **CSV Importer**: Downloadable CSV template, dry-run validation preview, duplicate detection, and formula injection sanitization.
- **Reports**: Printable PDF report views and CSV exports with custom date ranges.
- **Full JSON Backup**: One-click complete account export.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18 with Vite
  - Tailwind CSS with custom FinSet color tokens and dark mode support
  - React Router v6
  - Recharts for financial visual analytics
  - Lucide React icons
  - Canvas Confetti for goal celebrations
  - Axios with Bearer JWT interceptors

- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose
  - In-Memory MongoDB Server fallback (`mongodb-memory-server`) for zero-configuration instant local development
  - Bcrypt.js (12 salt rounds) & JSON Web Tokens (JWT)
  - Helmet security headers & Express Rate Limiter
  - Fast-CSV for RFC 4180 streaming exports
  - Multer for secure receipt uploads

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- Node.js v18+ installed
- npm installed

### 2. Installation
Clone or navigate to the project root directory:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration
Backend `.env` file is located at `backend/.env`:
```env
PORT=5000
NODE_ENV=development
# Leave empty for zero-setup in-memory database, or provide your MongoDB Atlas URI:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/expense_tracker
JWT_SECRET=finset_jwt_super_secret_production_key_safe_hash_2026_xyz
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
```

### 4. Running the Development Servers
In two separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server will start on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Frontend will start on http://localhost:5173
```

### 5. Instant Demo Login Credentials
For rapid evaluation, the application includes pre-seeded demo fixtures:
- **Email**: `adaline@finset.com`
- **Password**: `password123`
*(Or click the "One-Click Demo Login" button directly on the login screen!)*

---

## 🧪 Automated Testing

Automated test suites test authentication, user data isolation (IDOR protection), account balance calculations, transfer arithmetic, transaction mutations, and budget threshold calculations.

Run the test suite:
```bash
cd backend
npm test
```

Test Results:
```
PASS tests/api.test.js
  1. Authentication & Security
    √ should login an existing user and return a JWT token (492 ms)
    √ should reject login with wrong password (413 ms)
    √ should reject unauthenticated requests to protected endpoints (11 ms)
  2. Account Balances & Transfers
    √ should initialize account with opening balance and allow updating balance (35 ms)
    √ should accurately transfer money between accounts without altering income or expense (139 ms)
  3. Transactions & IDOR Isolation
    √ should create an expense and automatically deduct from account balance (79 ms)
    √ should create income and automatically increase account balance (73 ms)
    √ CRITICAL IDOR TEST: User 2 must NOT be able to view, edit, or delete User 1 transactions (94 ms)
    √ should recalculate account balance when editing a transaction amount (105 ms)
    √ should restore balance when deleting a transaction (72 ms)
  4. Budgets & Calculations
    √ should calculate budget spent, remaining, and percentage correctly (172 ms)

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
```

---

## 🌐 Production Deployment Guide

### Deploying Frontend to Vercel
1. Set the root directory to `frontend`.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Set environment variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://expense-api.onrender.com/api`).

### Deploying Backend to Render or Railway
1. Set the root directory to `backend`.
2. Build command: `npm install`.
3. Start command: `node server.js`.
4. Configure environment variables in the Render dashboard:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI`: Your MongoDB Atlas connection URI
   - `JWT_SECRET`: A secure random cryptographic key
   - `CLIENT_URL`: Your deployed Vercel frontend URL

---

## 🛡️ Security & Privacy Checklist

- [x] **No Plaintext Passwords**: Passwords hashed with `bcryptjs` using 12 salt rounds.
- [x] **Strict IDOR Mitigation**: Every single database query enforces `{ user: req.user._id }`.
- [x] **Security Headers**: Configured via `helmet` with cross-origin resource policies.
- [x] **Rate Limiting**: Express rate limiters protect authentication and public endpoints against brute force attacks.
- [x] **Safe CSV Export**: Prepends single quotes to cells starting with `=`, `+`, `-`, or `@` to neutralize formula injection in Microsoft Excel.
- [x] **No Sensitive Data Leaks**: Database credentials, passwords, and tokens are omitted from JSON serialization.

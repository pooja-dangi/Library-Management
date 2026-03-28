# Library Management System (MERN)

Production-ready **Library Management System** built with **MongoDB + Express + React + Node.js** with **JWT auth** and **role-based access control** (Admin/User).

## Folder Structure

```
Library Management System 1/
  backend/
    .env.example
    package.json
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
  frontend/
    .env.example
    package.json
    vite.config.js
    src/
      api/
      components/
      layouts/
      pages/
      routing/
      state/
      utils/
```

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and update:

- **`MONGO_URI`**: MongoDB connection string
- **`JWT_SECRET`**: secret for JWT signing
- **`FINE_PER_DAY`**: fine per late day

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env` and update:

- **`VITE_API_BASE_URL`**: `http://localhost:5000/api`

## Installation & Run

### 1) Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

Backend runs on `http://localhost:5000`.

Seed logins:
- **Admin**: `admin001` / `Admin@123`
- **User**: `user001` / `User@123`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Key Routes (API)

- **Auth**
  - `POST /api/auth/login`
  - `POST /api/auth/register` (admin only)
- **Memberships** (admin)
  - `GET/POST /api/memberships`
  - `PUT/DELETE /api/memberships/:id`
- **Books**
  - `GET /api/books` (admin + user)
  - `POST/PUT/DELETE /api/books` (admin)
- **Users** (admin)
  - `GET /api/users`
  - `PUT /api/users/:id`
- **Transactions**
  - `GET /api/transactions/availability?name=&author=`
  - `POST /api/transactions/issue`
  - `POST /api/transactions/return`
  - `POST /api/transactions/payfine`
- **Reports**
  - `GET /api/reports/master/books`
  - `GET /api/reports/master/memberships`
  - `GET /api/reports/active-issues`
  - `GET /api/reports/overdue-returns`
  - `GET /api/reports/pending-issue-requests`


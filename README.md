# Muhammad Rohail — Portfolio

Full-stack portfolio with a React + Three.js frontend, Express MVC API, MongoDB, and a secure admin panel to upload featured projects with multiple images.

## Features

- Dark / light theme
- Three.js hero with 3D animation
- Animated text and project cards (Framer Motion)
- Admin-only project uploads (multiple project-related pictures)
- Projects auto-fetch on the public portfolio
- Admin account auto-created from `.env` on server start
- MVC backend with Helmet, rate limiting, sanitization, JWT cookies, bcrypt

## Project structure

```
portfolio/
├── backend/          # Express + MongoDB (MVC)
│   ├── .env.example
│   └── src/
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       └── services/
└── frontend/         # React (Vite) + Three.js
    └── .env.example
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas (online) or any MongoDB URI in `backend/.env`

## Setup

### 1. Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

On first start the API creates the admin user from:

```env
ADMIN_EMAIL=admin@rohail.dev
ADMIN_PASSWORD=RohailAdmin@2026
```

Change these values in `backend/.env` before deploying. Never commit `.env`.

### 2. Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`

Admin login: `http://localhost:5173/admin`

## Security notes

- Secrets live only in `.env` (ignored by git)
- Passwords hashed with bcrypt
- JWT stored in httpOnly cookie
- Login + API rate limiting
- Helmet, HPP, mongo sanitize
- Image upload type / size limits
- Admin routes protected by JWT middleware

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Admin login |
| POST | `/api/auth/logout` | Yes | Logout |
| GET | `/api/auth/me` | Yes | Current admin |
| GET | `/api/projects` | No | Featured projects |
| GET | `/api/projects/admin/all` | Yes | All projects |
| POST | `/api/projects` | Yes | Create project + images |
| PUT | `/api/projects/:id` | Yes | Update project |
| DELETE | `/api/projects/:id` | Yes | Delete project |

## Default local env

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/rohail_portfolio
JWT_SECRET=rohail_portfolio_jwt_secret_change_in_production_32chars
ADMIN_EMAIL=admin@rohail.dev
ADMIN_PASSWORD=RohailAdmin@2026
CLIENT_URL=http://localhost:5173
```

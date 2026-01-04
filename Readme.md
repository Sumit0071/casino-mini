# Sports & Casino Mini Platform

A full-stack web application for browsing casino games with user authentication, favorites system, and filtering capabilities.

**Assessment Period:** January 1-4, 2026

---

## 🎯 Features

### Core Features
- ✅ User Registration & Login (JWT Authentication)
- ✅ Secure password hashing with bcrypt
- ✅ Browse casino games with pagination
- ✅ Search games by name, provider, or category
- ✅ Filter games by provider and category
- ✅ Add/remove games to favorites
- ✅ View favorites collection
- ✅ Responsive design (mobile-friendly)

### Bonus Features
- ✅ Beautiful landing page
- ✅ Docker setup with Docker Compose
- ✅ Protected routes
- ✅ Loading and error states
- ✅ Real-time search

---

## 🛠️ Tech Stack

**Backend:** Node.js, Express, TypeScript, PostgreSQL, Prisma, JWT, bcrypt  
**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Context API  
**DevOps:** Docker, Docker Compose, Nginx

---

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# 1. Clone repository
git clone <repository-url>
cd project-root

# 2. Create backend environment file
cp backend/.env.example backend/.env

# 3. Start all services
docker-compose up --build

# 4. Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Manual Setup

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/v1/auth/register | Register new user | No |
| POST | /api/v1/auth/login | Login user | No |
| POST | /api/v1/auth/logout | Logout user | Yes |
| GET | /api/v1/games | Get games list | Yes |
| GET | /api/v1/favorites | Get user favorites | Yes |
| POST | /api/v1/favorites/:gameId | Add to favorites | Yes |
| DELETE | /api/v1/favorites/:gameId | Remove from favorites | Yes |

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sports_casino
JWT_SECRET=your-secret-key-change-this
SALT=10
FRONTEND_URL=http://localhost:5173
```

---

## 📁 Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth middleware
│   │   └── app.ts           # Express server
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Auth context
│   │   └── config/          # API config
│   └── Dockerfile
└── docker-compose.yml
```

---

## 🧪 Testing

1. Register a new account
2. Login with credentials
3. Browse games on the dashboard
4. Use search to find specific games
5. Filter by provider or category
6. Click heart icon to add favorites
7. Click "Favorites" button to view saved games
8. Logout and verify authentication

---

## 💡 Design Decisions

- **Cookie-based Auth**: JWT stored in httpOnly cookies for security
- **Prisma ORM**: Type-safe database queries
- **Context API**: Simple state management for auth
- **Tailwind CSS**: Utility-first styling for rapid development
- **Docker**: Consistent development and deployment environment

---

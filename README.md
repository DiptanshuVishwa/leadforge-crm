# Smart Leads Dashboard

A production-ready full-stack MERN application for managing leads in a CRM system.

## 🚀 Features

- **Authentication**: Secure JWT-based auth with role-based access control (Admin & Sales)
- **Dashboard**: High-level overview with analytics and recent activities
- **Lead Management**: Full CRUD operations for leads
- **Advanced Filtering & Search**: Debounced search, status/source filters
- **Export to CSV**: Download leads data in CSV format
- **Dark Mode**: Persistent dark mode support
- **Responsive UI**: Built with Tailwind CSS and Framer Motion for a premium look
- **Dockerized**: Ready to be deployed with Docker and Docker Compose

## 🛠️ Tech Stack

### Frontend
- React.js + TypeScript
- Vite
- TailwindCSS
- React Router DOM
- TanStack Query (React Query)
- Zustand
- React Hook Form + Zod
- Framer Motion

### Backend
- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Zod (Validation)

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- Docker (optional)

### Environment Variables

**Backend (`server/.env`)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**Frontend (`client/.env`)**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Manual Setup

1. **Clone and Install dependencies**
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd client
   npm install
   ```

2. **Run Backend Seed (Optional)**
   ```bash
   cd server
   npm run seed
   ```
   *Creates an Admin (admin@example.com) and a Sales user (sales@example.com) with password `password123`.*

3. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

### Docker Setup

Simply run:
```bash
docker-compose up --build
```
This will start the backend, frontend (Nginx), and MongoDB in containers.

## 📖 API Documentation

### Auth Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current logged in user profile

### Leads Endpoints
- `GET /api/leads` - Get all leads (Supports `page`, `limit`, `search`, `status`, `source`, `sort`)
- `GET /api/leads/:id` - Get a single lead
- `POST /api/leads` - Create a new lead (Admin only)
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead (Admin only)
- `GET /api/leads/export/csv` - Export filtered leads to CSV (Admin only)

## 🚀 Deployment Guide

### Backend (Render/Railway)
1. Set up a new Node.js Web Service
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables.

### Frontend (Vercel)
1. Import the project and select the `client` directory.
2. Build command: `npm run build`
3. Add `VITE_API_BASE_URL` pointing to your deployed backend URL.

### Database
1. Create a cluster on MongoDB Atlas
2. Add connection string to backend environment variables.

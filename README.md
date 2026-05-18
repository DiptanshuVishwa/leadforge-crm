# LeadForge CRM

A full-stack Lead Management Dashboard built using the MERN stack with TypeScript, JWT authentication, RBAC, advanced filtering, pagination, CSV export, and production-ready deployment.

## Live Demo

Frontend: [https://leadforge-crm-azure.vercel.app/](https://leadforge-crm-azure.vercel.app/)

Backend: [https://leadforge-crm.onrender.com](https://leadforge-crm.onrender.com)

---

# Demo Credentials

## Admin

* Email: [diptanshu@gmail.com](mailto:diptanshu@gmail.com)
* Password: 123456789

## Employee

* Email: [employee@gmail.com](mailto:employee@gmail.com)
* Password: 123456789

---

# Features

* JWT Authentication
* Role-Based Access Control (Admin & Employee)
* Lead CRUD Operations
* Search & Filtering
* Backend Pagination
* CSV Export
* Responsive UI
* Dark Mode
* Protected Routes
* Docker Setup

---

# Tech Stack

## Frontend

* React.js
* TypeScript
* Tailwind CSS
* React Query
* Zustand
* Axios

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs

## Deployment

* Vercel
* Render
* MongoDB Atlas

---

# Environment Variables

## Backend (`server/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## Frontend (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

# Local Setup

## Clone Repository

```bash
git clone https://github.com/DiptanshuVishwa/leadforge-crm.git
cd leadforge-crm
```

## Backend

```bash
cd server
npm install
npm run dev
```

## Frontend

```bash
cd client
npm install
npm run dev
```

---

# Docker Setup

```bash
docker-compose up --build
```

---

# API Endpoints

## Auth

* POST `/api/auth/register`
* POST `/api/auth/login`
* POST `/api/auth/logout`
* GET `/api/auth/me`

## Leads

* GET `/api/leads`
* GET `/api/leads/:id`
* POST `/api/leads`
* PUT `/api/leads/:id`
* DELETE `/api/leads/:id`
* GET `/api/leads/export/csv`

---

# Author

## Diptanshu Vishwa

GitHub: [https://github.com/DiptanshuVishwa](https://github.com/DiptanshuVishwa)

LinkedIn: [https://www.linkedin.com/in/diptanshu-vishwa-0548b0341/](https://www.linkedin.com/in/diptanshu-vishwa-0548b0341/)

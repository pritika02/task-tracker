# Task Tracker — MERN Stack

A full-stack task management app built with **MongoDB, Express, React, and Node.js**.
Create, update, complete, and delete tasks with live filtering, sorting, search,
and instant UI feedback — no page refreshes.

```
task-tracker/
├── backend/     Express REST API + MongoDB (Mongoose)
└── frontend/    React app (Vite)
```

## Features

- Full CRUD on tasks (title, description, status, priority, due date)
- Server-side **and** client-side form validation with field-level error messages
- REST API with filtering (`status`, `priority`), search, and sorting
- Optimistic UI updates (status toggle, delete) with automatic rollback on failure
- Toast notifications for every create/update/delete action
- Responsive layout, keyboard-accessible modals, visible focus states
- Reusable components (modal form, confirm dialog, toast stack, task card)
- Environment-variable driven config on both frontend and backend

## Tech Stack

| Layer    | Tech                                    |
|----------|------------------------------------------|
| Frontend | React 19, Vite, Axios, plain CSS (no framework) |
| Backend  | Node.js, Express 4                        |
| Database | MongoDB with Mongoose ODM                 |

---

## 1. Local Setup

### Prerequisites
- Node.js 18+
- A MongoDB connection string — either:
  - a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (recommended), or
  - a local MongoDB instance (`mongodb://localhost:27017/task-tracker`)

### Backend

```bash
cd backend
npm install
cp .env.example .env      # then fill in MONGO_URI
npm run dev                # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000
npm run dev                 # starts on http://localhost:5173
```

Open `http://localhost:5173` — the app talks to the API automatically.

---

## 2. API Reference

Base URL: `/api/tasks`

| Method | Endpoint          | Description                                  |
|--------|-------------------|-----------------------------------------------|
| GET    | `/api/tasks`      | List tasks. Query params: `status`, `priority`, `search`, `sortBy`, `order` |
| GET    | `/api/tasks/:id`  | Get a single task                             |
| POST   | `/api/tasks`      | Create a task                                 |
| PUT    | `/api/tasks/:id`  | Update a task (partial updates supported)     |
| DELETE | `/api/tasks/:id`  | Delete a task                                 |

Task shape:
```json
{
  "title": "Ship the assignment",
  "description": "Deploy backend + frontend",
  "status": "todo | in-progress | done",
  "priority": "low | medium | high",
  "dueDate": "2026-07-10"
}
```

All error responses use a consistent shape:
```json
{ "success": false, "message": "Validation failed", "errors": { "title": "Title is required" } }
```

---

## 3. Deploying to a Public URL

The easiest free combination: **MongoDB Atlas** (database) + **Render** (backend) + **Vercel** (frontend).

### Step 1 — MongoDB Atlas
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register).
2. Database Access → add a user with a password.
3. Network Access → add `0.0.0.0/0` (allow access from anywhere) so Render can connect.
4. Get your connection string (Connect → Drivers) — it looks like:
   `mongodb+srv://<user>:<password>@cluster0.mongodb.net/task-tracker?retryWrites=true&w=majority`

### Step 2 — Backend on Render
1. Push this project to a GitHub repo.
2. On [render.com](https://render.com) → New → Web Service → connect the repo.
3. Set **Root Directory** to `backend`.
4. Build command: `npm install` · Start command: `npm start`.
5. Add environment variables:
   - `MONGO_URI` = your Atlas connection string
   - `CLIENT_ORIGIN` = your frontend URL (you'll get this in Step 3 — you can add it after)
   - `PORT` = `5000` (Render sets its own `PORT` automatically, but Express reads `process.env.PORT` either way)
6. Deploy. Note the resulting URL, e.g. `https://task-tracker-api.onrender.com`.

### Step 3 — Frontend on Vercel
1. On [vercel.com](https://vercel.com) → New Project → import the same repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset: Vite (auto-detected).
4. Add environment variable: `VITE_API_URL` = your Render backend URL from Step 2.
5. Deploy. You'll get a URL like `https://task-tracker.vercel.app`.

### Step 4 — Close the loop
Go back to Render → your backend's environment variables → set `CLIENT_ORIGIN` to your
Vercel URL, then redeploy the backend so CORS allows requests from the live frontend.

> Alternative hosts that work the same way: **Railway** or **Fly.io** for the backend,
> **Netlify** for the frontend. The steps are equivalent — set the root directory,
> the build/start commands, and the environment variables above.

---

## 4. Project Structure

```
backend/
├── config/db.js              MongoDB connection
├── models/Task.js             Mongoose schema + validation
├── controllers/taskController.js   CRUD logic, filtering, sorting
├── routes/taskRoutes.js       REST routes
├── middleware/validateTask.js Request validation
├── middleware/errorHandler.js Centralized error responses
└── server.js                  App entry point

frontend/src/
├── api/taskApi.js             Axios client for the REST API
├── components/                Header, Toolbar, TaskList, TaskItem,
│                               TaskFormModal, ConfirmDialog, ToastStack
├── hooks/useToasts.js          Toast notification state
└── App.jsx                     Top-level state + data flow
```

## 5. Design Notes

- **Validation happens twice, on purpose**: instantly in the browser for good UX,
  and again on the server (Mongoose schema + middleware) because the client can
  never be trusted.
- **Optimistic updates**: toggling a task's status or deleting it updates the UI
  immediately, then reconciles with the server — if the request fails, the change
  is rolled back and a toast explains why.
- **No global state library**: the app is small enough that React state lifted
  into `App.jsx` is simpler and easier to review than Redux/Context for this scope.

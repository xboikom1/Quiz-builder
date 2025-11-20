# Quiz Builder

Quiz Builder is a full-stack application for creating, managing, and reviewing custom quizzes. It provides a modern React UI backed by an Express/Prisma API, allowing users to compose questions of multiple types (boolean, input, checkbox) and persist them in a SQLite database.

## Deployments

- **Frontend**: https://quiz-builder-six-red.vercel.app
- **Backend**: https://quiz-builder-backend-ie8z.onrender.com

## Features

- Create quizzes with mixed question types, validation, and ordering.
- Browse the quiz catalog, inspect quiz details, and delete quizzes.
- Centralized state management with Redux Toolkit (async thunks, selectors, typed hooks).
- Backend API with request validation, structured controllers/services, and Prisma ORM persistence.
- Shared validation rules via Zod to keep payloads consistent.

## Tech Stack

### Frontend

- React with Vite
- Redux Toolkit + React Redux
- React Router for routing
- React Hook Form + Zodfor form handling and validation
- Tailwind CSS utility classes for styling
- TypeScript-first setup with strict compiler settings

### Backend

- Express 5 with modular routing & middleware
- Prisma ORM with SQLite datasource
- Zod for input validation
- Centralized error and not-found handlers for consistent API responses

## Local Development
### 1. Clone & install root deps

```bash
git clone <repo-url>
cd Quiz-builder
```

### 2. Backend setup

```bash
cd backend
```

Install dependencies, run migrations, and start the API:

```bash
npm install
npx prisma migrate deploy   # or npx prisma migrate dev for local iteration
npm run dev                 # hot-reload server via tsx
# production build
npm run build
npm start
```

### 3. Frontend setup

```bash
cd ../frontend
```

Install dependencies and start Vite:

```bash
npm install
npm run dev
npm run build
npm run preview
```

## API Overview

The Express API exposes RESTful quiz endpoints under `/quizzes`:

| Method | Path           | Description                     |
| ------ | -------------- | ------------------------------- |
| GET    | `/quizzes`     | List quizzes (id, title, count) |
| GET    | `/quizzes/:id` | Retrieve quiz with questions    |
| POST   | `/quizzes`     | Create a new quiz               |
| DELETE | `/quizzes/:id` | Remove a quiz                   |

## Development Notes

- The repo is split into `backend/` and `frontend/` workspaces. Each has its own ESLint/TypeScript config.
- Prisma migrations live in `backend/prisma/migrations`. Run `npx prisma migrate dev` when editing the schema locally.
- Redux logic lives under `frontend/src/redux`, with operations (thunks), slices, selectors, and store setup.
- Update `VITE_API_BASE_URL` when deploying the frontend to point at your API host.

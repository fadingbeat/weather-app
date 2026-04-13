# Weather Web App

A full-stack weather application built with React/Vite (frontend), .NET (backend), PostgreSQL (database), and the OpenWeather API. Includes JWT authentication.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [.NET SDK](https://dotnet.microsoft.com/download) (v8+)
- [PostgreSQL](https://www.postgresql.org/) (v14+)
- An [OpenWeather API key](https://openweathermap.org/api)

---

## Environment Variables

### Backend (`/backend` or root `.env` / `appsettings.json`)

| Variable                               | Description                                  |
| -------------------------------------- | -------------------------------------------- |
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string                 |
| `Jwt__Secret`                          | Secret key used to sign JWT tokens           |
| `Jwt__Issuer`                          | JWT issuer (e.g. `https://localhost:5065`)   |
| `Jwt__Audience`                        | JWT audience (e.g. `https://localhost:5173`) |
| `OpenWeather__ApiKey`                  | Your OpenWeather API key                     |

### Frontend (`/frontend/.env`)

| Variable            | Description                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Base URL of the backend API (e.g. `http://localhost:5065`) — Swagger available at `/swagger` |

---

## Project Structure

```
/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.jsx
│   └── .env
│
├── backend/           # .NET Web API
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── Migrations/
│   └── appsettings.json
│
└── README.md
```

---

## Running Locally

### 1. Clone the repository

```bash
git clone <repo-url>
cd <repo-name>
```

### 2. Set up the database

Make sure PostgreSQL is running, then create your database:

```bash
createdb weatherapp
```

### 3. Configure environment variables

Copy and fill in your values:

- **Backend:** update `backend/appsettings.json` or set environment variables as listed above
- **Frontend:** create `frontend/.env` and set `VITE_API_BASE_URL`

### 4. Run database migrations

```bash
cd backend
dotnet ef database update
```

### 5. Start the backend

```bash
cd backend
dotnet run
```

The API will be available at `http://localhost:5065`.

### 6. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Notes

- The frontend Vite dev server proxies API requests — make sure `VITE_API_BASE_URL` matches the port your backend is running on.
- JWT tokens are required for protected routes. Register or log in through the app to obtain a token.
- OpenWeather free tier is sufficient for development use.

---

## Refactoring Notes

These improvements were identified during development as next steps for a cleaner, more maintainable codebase. They will be evaluated and implemented where they add clear value.

**Custom hooks** — extract fetch logic, loading, and error state out of components into dedicated hooks: `useForecast`, `useHistory`, `useStats`. Components become declarative and focused on rendering only.

**React Query** — replace `useEffect` + `useState` fetch patterns with React Query. Handles caching, loading states, refetching, and stale data automatically. The stale-while-revalidate pattern already implemented in `WeatherWidget` is what React Query does natively across the whole app.

**Error boundaries** — catch runtime errors at the component level and render fallback UI instead of a blank screen.

**Context optimization** — `AuthContext` currently re-renders everything on token change. Wrap context values in `useMemo` and callbacks in `useCallback` to prevent unnecessary downstream renders.

**Axios interceptor extension** — the token expiry interceptor is in place; extend it to attempt a silent token refresh before redirecting to login.

**DTOs with AutoMapper** — instead of manual mapping in services, AutoMapper handles object-to-object mapping automatically.

**FluentValidation** — replace Data Annotations with FluentValidation for cleaner, more powerful validation rules.

**Repository pattern** — abstract EF Core behind repository interfaces. Makes testing and swapping data sources easier.

**Global exception middleware** — the folder structure is in place; implementing it returns consistent JSON error responses instead of .NET's default HTML error pages.

**API versioning** — prefix routes with `/api/v1/` for future-proofing.

**Refresh tokens** — extend JWT auth with refresh token rotation.

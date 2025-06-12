# Traqtion

This repository includes an ASP.NET Core API (under `Tq.Api`) and a simple TypeScript front‑end located in `frontend/`.

## Frontend

The front end is a small demo that consumes all API endpoints using AJAX calls. It uses **Tailwind CSS** via CDN and **tsParticles** for a dynamic background.

### Building

Compile the TypeScript sources:

```bash
npx tsc -p frontend
```

This will output JavaScript files to `frontend/dist/`.

### Running

Open `frontend/index.html` in a browser. Ensure the API is running on the same host/port or adjust `API_BASE` in `frontend/src/main.ts`.

## Backend

Run the ASP.NET Core API using the standard `dotnet run` command inside `Tq.Api`.

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

Copy the resulting files to the API's `wwwroot` folder so they are served alongside the back end:

```bash
cp frontend/index.html Tq.Api/wwwroot/index.html
cp frontend/dist/main.js Tq.Api/wwwroot/main.js
```

Start the API (which will also serve the front end) and browse to the API's root URL (typically `https://localhost:5001` when running locally). The front end makes AJAX calls relative to the same host, so no further configuration is required.

## Backend

Run the ASP.NET Core API using the standard `dotnet run` command inside `Tq.Api`.

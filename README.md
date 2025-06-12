# Traqtion

This repository includes an ASP.NET Core API (under `Tq.Api`) and a demo TypeScript front‑end in `frontend/`.

## Frontend

The front end now demonstrates all of the API endpoints. It allows you to:

- log in via the `/api/login` endpoint
- search for persons
- create persons, accounts and transactions
- view lists of persons, accounts and transactions

It uses **Tailwind CSS** via CDN for styling and **tsParticles** for a fun background effect.

### Building

Compile the TypeScript sources:

```bash
npx tsc -p frontend
```

This writes JavaScript to `frontend/dist/`.

### Running

Copy the output to the API's `wwwroot` folder so it can be served alongside the back end:

```bash
cp frontend/index.html Tq.Api/wwwroot/index.html
cp frontend/dist/main.js Tq.Api/wwwroot/main.js
```

Start the API (which also serves the front end) and browse to the API root (usually `https://localhost:5001`). The front end uses AJAX relative to the same host, so no further configuration is needed.

## Backend

Run the ASP.NET Core API using the standard `dotnet run` command inside `Tq.Api`.

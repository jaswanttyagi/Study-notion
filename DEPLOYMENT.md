# Deployment Guide

## Backend on Render
1. Push this repo to GitHub.
2. In Render, create a new `Web Service` from this repo.
3. Render will detect `render.yaml` and use the `Server` directory.
4. Set secret env values in Render for all keys from `Server/.env.example`.
5. Set `FRONTEND_BASE_URL` to your Vercel frontend URL (for example `https://your-app.vercel.app`).

## Frontend on Vercel
1. In Vercel, create a new project from this repo.
2. Set `Root Directory` to `client`.
3. Add env var `VITE_BASE_URL` with your Render backend URL + `/api/v1`.
   Example: `https://your-backend.onrender.com/api/v1`
4. Deploy. `client/vercel.json` is included to support SPA routing.

## Order to deploy
1. Deploy backend on Render first.
2. Copy backend URL into Vercel `VITE_BASE_URL`.
3. Deploy frontend on Vercel.
4. Update Render `FRONTEND_BASE_URL` with final Vercel domain and redeploy backend.
# React frontend

A Vite + React interface for dealership browsing, state filtering, dealer review viewing, login/logout, and review submission.

## Local startup
1. Install Node.js LTS.
2. From this folder run:
   ```bash
   npm install
   npm run dev
   ```
3. The UI defaults to calling Django at `http://localhost:8000/api`.
4. To change the API address, copy `.env.example` to `.env` and set `VITE_API_URL`.

The backend and dealer records must be running/loaded for data to appear.

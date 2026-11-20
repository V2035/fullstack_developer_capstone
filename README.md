# Dealership Review Application

IBM Full Stack Software Developer Capstone repository.

## Project
A dealership review web application with a React frontend and Django REST API. Browse dealerships, filter by state, view dealer information and reviews, and submit customer reviews.

## Stack
- React + Vite (frontend)
- Django + Django REST Framework (backend)
- SQLite development database
- GitHub Actions CI workflow

## Run the backend
```bash
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Backend API base URL: `http://localhost:8000/api`

## Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend API setting can be configured with `frontend/.env` using `VITE_API_URL`.

## API endpoints
- `GET /api/dealers/` — list dealers
- `GET /api/dealers/?state=Kansas` — filter dealers by state
- `GET /api/dealers/{id}/` — dealer detail
- `GET /api/dealers/{id}/reviews/` — dealer reviews
- `POST /api/reviews/` — submit review
- `GET /api/car-makes/` — car makes endpoint (dataset integration pending)
- `POST /api/sentiment/` — review sentiment endpoint
- `POST /api/login/` and `POST /api/logout/` — session login/logout endpoints

## CI
GitHub Actions runs Django tests on pushes and pull requests to `main`.

## Evidence and coursework
See [evidence/answers.md](evidence/answers.md) for the task checklist and evidence filenames. Runtime screenshots, API outputs, test results, and deployment details are pending verification and should be captured from the real app.

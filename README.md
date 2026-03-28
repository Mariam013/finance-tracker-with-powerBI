# Finance Tracker with Power BI

A full-stack personal finance tracker for logging income and expenses across multiple currencies, with Power BI integration for data visualization.

## Live Demo

- **Frontend**: https://finance-tracker-with-power-bi.vercel.app
- **Backend API**: https://grateful-hope-production-9698.up.railway.app

---

## Features

- User registration and login with JWT authentication
- Track income and expenses separately
- Multi-currency support (USD, GHS, RWF)
- Categories for expenses (Food, Transport, Rent, etc.) and income (Salary, Gift, etc.)
- Payment method tracking (Cash, Card, Bank Transfer, Mobile Money)
- Dashboard with per-currency income, expense, and net balance summaries
- Power BI integration via export API endpoint

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL (SQLAlchemy ORM) |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Deployment | Vercel (frontend), Railway (backend + DB) |

---

## Project Structure

```
finance-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS config
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── crud.py          # Database operations
│   │   ├── auth.py          # JWT + password hashing
│   │   ├── database.py      # DB connection
│   │   └── routers/
│   │       ├── auth.py      # /auth/register, /auth/login
│   │       └── expenses.py  # /expenses, /categories, /payment-methods, /export
│   ├── seed.py
│   ├── requirements.txt
│   └── Procfile
└── frontend/
    └── src/
        ├── api/client.js        # Axios instance with JWT interceptor
        ├── contexts/AuthContext.jsx
        ├── pages/DashboardPage.jsx
        └── components/
            ├── ExpenseForm.jsx
            ├── ExpenseTable.jsx
            └── Navbar.jsx
```

---

## Local Development

### Prerequisites
- Python 3.12
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your values:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5433/financedb
SECRET_KEY=your-secret-key
```

Set up the database:
```sql
CREATE DATABASE financedb;
```

Run the app:
```bash
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:
```
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

---

## Environment Variables

### Backend (Railway)
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing secret |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend URLs |
| `EXPORT_API_KEY` | API key for Power BI export endpoint |

### Frontend (Vercel)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## Power BI Integration

The backend exposes a flat JSON export endpoint for Power BI:

```
GET /export/transactions?api_key=YOUR_API_KEY
```

In Power BI Desktop:
1. **Get Data** → **Web** → **Advanced**
2. URL: `https://grateful-hope-production-9698.up.railway.app/export/transactions`
3. Add URL parameter: `api_key` = your export API key

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | None | Create account |
| POST | `/auth/login` | None | Login, returns JWT |
| GET | `/expenses/` | JWT | List user's transactions |
| POST | `/expenses/` | JWT | Create transaction |
| PUT | `/expenses/{id}` | JWT | Update transaction |
| DELETE | `/expenses/{id}` | JWT | Delete transaction |
| GET | `/categories/` | None | List categories |
| GET | `/payment-methods/` | None | List payment methods |
| GET | `/export/transactions` | API Key | Power BI data export |

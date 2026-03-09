# SeedHabit

> Gamified habit tracker that helps you build daily routines with streaks, XP, and analytics.

---

## Features

- **Habit Tracking** — Create daily/weekly habits with custom colors and icons
- **Streak System** — Auto-calculated streaks that start from day 1
- **XP & Leveling** — Earn 10 XP per completion, level up, and hit milestones
- **3000 XP Celebration** — Confetti and modal when you reach 3000 XP
- **Dashboard** — Today's quests, streak highlights, weekly chart, and stats
- **History** — Accordion-style flashcards grouped by day with waterfall animations
- **Glassmorphic UI** — Dark theme with blur effects, gradients, and glow accents
- **Framer Motion** — Smooth page transitions, staggered lists, and spring animations
- **Google OAuth** — Sign in with Google or email/password
- **Admin Panel** — User management and platform stats

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI + Python 3.11 |
| Frontend | React 18 + TypeScript + Vite |
| Database | PostgreSQL + SQLAlchemy + Alembic |
| Auth | JWT (access + refresh tokens) + Google OAuth |
| UI | Tailwind CSS v4 + Framer Motion + Lucide Icons |
| Extras | canvas-confetti, recharts, class-variance-authority |

---

## Project Structure

```
seedhabit/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + CORS + routers
│   │   ├── config.py            # Pydantic settings
│   │   ├── database.py          # Engine + SessionLocal
│   │   ├── models/              # User, Habit, HabitLog, Streak, RefreshToken
│   │   ├── schemas/             # Pydantic request/response models
│   │   ├── routers/             # auth, habits, streaks, dashboard, admin
│   │   ├── services/            # Business logic layer
│   │   └── auth/                # JWT, OAuth, dependencies
│   ├── alembic/                 # Database migrations
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ui/              # Button, Card, Input, CelebrationModal
│       │   ├── habits/          # HabitCard, HabitCheckbox, HabitForm, IconPicker
│       │   ├── dashboard/       # StatsCards, TodayChecklist, StreakOverview, Chart
│       │   └── layout/          # Layout, Sidebar, Navbar
│       ├── pages/               # Dashboard, Habits, History, Settings, Login, etc.
│       ├── hooks/               # useDashboard, useHabits, useXP
│       ├── services/            # api.ts, authService, habitService, dashboardService
│       ├── context/             # AuthContext, XPContext
│       ├── types/               # TypeScript interfaces
│       └── index.css            # Tailwind v4 theme + glassmorphism utilities
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 16

### Backend

```bash
cd backend
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=postgresql://user:password@localhost:5432/seedhabit
export SECRET_KEY=your-secret-key
export ALGORITHM=HS256
export ACCESS_TOKEN_EXPIRE_MINUTES=30

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --host 127.0.0.1 --port 8002 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Docker

```bash
docker-compose up -d
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Login (returns tokens) |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| GET | `/api/v1/auth/me` | Current user profile |
| PUT | `/api/v1/auth/me` | Update profile |
| GET | `/api/v1/auth/google` | Google OAuth redirect |

### Habits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/habits` | List all habits |
| POST | `/api/v1/habits` | Create habit |
| GET | `/api/v1/habits/{id}` | Get habit detail |
| PUT | `/api/v1/habits/{id}` | Update habit |
| DELETE | `/api/v1/habits/{id}` | Delete habit |
| POST | `/api/v1/habits/{id}/complete` | Mark complete |
| DELETE | `/api/v1/habits/{id}/complete` | Undo complete |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard` | Full dashboard summary |
| GET | `/api/v1/dashboard/weekly` | Weekly completion chart |
| GET | `/api/v1/dashboard/history` | Completion history (last N days) |

### Streaks & Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/streaks` | All streak data |
| GET | `/api/v1/stats/heatmap` | Yearly heatmap |
| GET | `/api/v1/stats/completion-rate` | Completion rate by period |
| GET | `/api/v1/stats/overview` | Overall statistics |

---

## Pages

| Route | Page |
|-------|------|
| `/login` | Login with email/password or Google |
| `/register` | Create new account |
| `/dashboard` | Today's quests, stats, streaks, weekly chart |
| `/habits` | List all habits with checkbox, streaks, XP |
| `/habits/new` | Create new habit form |
| `/habits/:id` | Habit detail with logs |
| `/habits/:id/edit` | Edit habit |
| `/history` | Completed habits grouped by day (flashcards) |
| `/settings` | Profile, XP progress, edit name, danger zone |
| `/admin` | Admin dashboard (admin only) |
| `/admin/users` | User management (admin only) |

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/seedhabit

# Auth
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Frontend
VITE_API_URL=http://localhost:8002
```

---

## License

MIT

# PRP: SeedHabit

> Implementation blueprint for parallel agent execution

---

## METADATA

| Field | Value |
|-------|-------|
| **Product** | SeedHabit |
| **Type** | SaaS |
| **Version** | 1.0 |
| **Created** | 2026-03-07 |
| **Complexity** | Medium |

---

## PRODUCT OVERVIEW

**Description:** SeedHabit is a micro-SaaS habit tracker that empowers individuals to build better daily routines. Users can create habits, track daily completions, build streaks, and visualize their progress through a dashboard with calendar heatmaps and analytics.

**Value Proposition:** Simple, motivating habit tracking with streak gamification and visual progress -- helping users plant the seeds of good habits and watch them grow.

**MVP Scope:**
- [x] User registration and login (email/password + Google OAuth)
- [x] Habit CRUD (create, read, update, delete habits)
- [x] Daily habit tracking (mark habits as complete/incomplete)
- [x] Streak tracking (current streak, longest streak)
- [x] Dashboard with today's habits, streaks, and basic stats

---

## TECH STACK

| Layer | Technology | Skill Reference |
|-------|------------|-----------------|
| Backend | FastAPI + Python 3.11+ | skills/BACKEND.md |
| Frontend | React + TypeScript + Vite | skills/FRONTEND.md |
| Database | PostgreSQL + SQLAlchemy | skills/DATABASE.md |
| Auth | JWT + bcrypt + Google OAuth | skills/BACKEND.md |
| UI | Tailwind CSS + shadcn/ui | skills/FRONTEND.md |
| Testing | pytest + React Testing Library | skills/TESTING.md |
| Deployment | Docker + docker-compose | skills/DEPLOYMENT.md |

---

## DATABASE MODELS

### User Model
```
User:
  - id: Integer, Primary Key, Auto-increment
  - email: String(255), Unique, Not Null, Indexed
  - hashed_password: String(255), Nullable (for OAuth users)
  - full_name: String(100), Not Null
  - avatar_url: String(500), Nullable
  - is_active: Boolean, Default True
  - is_verified: Boolean, Default False
  - is_admin: Boolean, Default False
  - oauth_provider: String(50), Nullable (e.g., "google")
  - created_at: DateTime, Default Now
  - updated_at: DateTime, Default Now, OnUpdate Now

Relationships:
  - habits: One-to-Many -> Habit
  - refresh_tokens: One-to-Many -> RefreshToken
```

### RefreshToken Model
```
RefreshToken:
  - id: Integer, Primary Key, Auto-increment
  - user_id: Integer, Foreign Key -> User.id, Not Null
  - token: String(500), Unique, Not Null, Indexed
  - expires_at: DateTime, Not Null
  - revoked: Boolean, Default False
  - created_at: DateTime, Default Now
```

### Habit Model
```
Habit:
  - id: Integer, Primary Key, Auto-increment
  - user_id: Integer, Foreign Key -> User.id, Not Null, Indexed
  - name: String(100), Not Null
  - description: String(500), Nullable
  - frequency: String(20), Not Null, Default "daily" (daily/weekly)
  - category: String(50), Nullable
  - color: String(7), Default "#6366f1" (hex color)
  - icon: String(50), Default "check"
  - reminder_time: Time, Nullable
  - is_archived: Boolean, Default False
  - created_at: DateTime, Default Now
  - updated_at: DateTime, Default Now, OnUpdate Now

Constraints:
  - UniqueConstraint(user_id, name) -- habit names unique per user

Relationships:
  - user: Many-to-One -> User
  - logs: One-to-Many -> HabitLog
  - streak: One-to-One -> Streak
```

### HabitLog Model
```
HabitLog:
  - id: Integer, Primary Key, Auto-increment
  - habit_id: Integer, Foreign Key -> Habit.id, Not Null, Indexed
  - user_id: Integer, Foreign Key -> User.id, Not Null, Indexed
  - completed_at: Date, Not Null
  - note: String(500), Nullable
  - created_at: DateTime, Default Now

Constraints:
  - UniqueConstraint(habit_id, completed_at) -- one log per habit per day
```

### Streak Model
```
Streak:
  - id: Integer, Primary Key, Auto-increment
  - habit_id: Integer, Foreign Key -> Habit.id, Unique, Not Null
  - user_id: Integer, Foreign Key -> User.id, Not Null, Indexed
  - current_streak: Integer, Default 0
  - longest_streak: Integer, Default 0
  - last_completed_at: Date, Nullable
```

---

## MODULES

### Module 1: Authentication
**Agents:** DATABASE-AGENT + BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/auth/register | Create new account | Public |
| POST | /api/v1/auth/login | Login, return JWT tokens | Public |
| POST | /api/v1/auth/refresh | Refresh access token | Public (refresh token) |
| POST | /api/v1/auth/logout | Revoke refresh token | Protected |
| GET | /api/v1/auth/me | Get current user profile | Protected |
| PUT | /api/v1/auth/me | Update user profile | Protected |
| POST | /api/v1/auth/forgot-password | Request password reset email | Public |
| POST | /api/v1/auth/reset-password | Reset password with token | Public |
| GET | /api/v1/auth/google | Initiate Google OAuth flow | Public |
| GET | /api/v1/auth/google/callback | Handle Google OAuth callback | Public |

**Frontend Pages:**
| Route | Page | Components |
|-------|------|------------|
| /login | LoginPage | LoginForm, GoogleOAuthButton, FormInput |
| /register | RegisterPage | RegisterForm, GoogleOAuthButton, FormInput |
| /forgot-password | ForgotPasswordPage | ForgotPasswordForm, FormInput |
| /profile | ProfilePage | ProfileForm, AvatarUpload |

**Business Logic:**
- Passwords hashed with bcrypt (min 8 chars, 1 uppercase, 1 number)
- Access token: JWT HS256, 30 min expiry
- Refresh token: opaque token, 7 days expiry, stored in DB
- Google OAuth: verify state param for CSRF protection
- Rate limit: 5 requests/minute on login and register endpoints

---

### Module 2: Habits
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/habits | List user's habits (excludes archived by default) | Protected |
| POST | /api/v1/habits | Create a new habit | Protected |
| GET | /api/v1/habits/{id} | Get habit details with streak info | Protected |
| PUT | /api/v1/habits/{id} | Update a habit | Protected |
| DELETE | /api/v1/habits/{id} | Delete a habit and all its logs | Protected |
| POST | /api/v1/habits/{id}/complete | Mark habit complete for today | Protected |
| POST | /api/v1/habits/{id}/uncomplete | Remove today's completion | Protected |
| PUT | /api/v1/habits/{id}/archive | Archive a habit | Protected |
| PUT | /api/v1/habits/{id}/unarchive | Unarchive a habit | Protected |

**Query Parameters (GET /habits):**
- `?include_archived=true` - Include archived habits
- `?category=health` - Filter by category
- `?frequency=daily` - Filter by frequency

**Frontend Pages:**
| Route | Page | Components |
|-------|------|------------|
| /habits | HabitListPage | HabitCard, HabitCheckbox, CategoryFilter, EmptyState |
| /habits/:id | HabitDetailPage | HabitHeader, CompletionCalendar, StreakCard, LogList |
| /habits/new | HabitCreatePage | HabitForm, ColorPicker, IconPicker |
| /habits/:id/edit | HabitEditPage | HabitForm (pre-filled), ColorPicker, IconPicker |

**Business Logic:**
- All habits scoped to authenticated user (user_id filter on all queries)
- Habit names must be unique per user (409 Conflict if duplicate)
- Deleting a habit cascades to HabitLog and Streak records
- Completing a habit creates a HabitLog entry and updates Streak
- Cannot complete a habit twice on the same day (409 Conflict)

---

### Module 3: Streaks & Tracking
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/habits/{id}/logs | Get completion logs (paginated) | Protected |
| GET | /api/v1/habits/{id}/streak | Get streak info for a habit | Protected |
| GET | /api/v1/streaks | Get all streaks for current user | Protected |
| GET | /api/v1/stats/heatmap | Get heatmap data for a year | Protected |
| GET | /api/v1/stats/completion-rate | Get overall completion rate | Protected |

**Query Parameters:**
- GET /habits/{id}/logs: `?start_date=2026-01-01&end_date=2026-12-31&limit=50&offset=0`
- GET /stats/heatmap: `?year=2026`
- GET /stats/completion-rate: `?period=week|month|year`

**Frontend Components (embedded, no standalone pages):**
| Component | Used In | Description |
|-----------|---------|-------------|
| CalendarHeatmap | HabitDetailPage, Dashboard | GitHub-style yearly heatmap |
| StreakCard | HabitDetailPage, Dashboard | Current/longest streak display |
| StreakBadge | HabitCard | Inline streak counter |
| CompletionChart | Dashboard | Line chart of completion rate |

**Business Logic:**
- Streak auto-calculated on habit completion:
  - If last_completed_at == yesterday: current_streak += 1
  - If last_completed_at == today: no change (already completed)
  - If last_completed_at < yesterday: current_streak = 1 (streak broken, restart)
  - If longest_streak < current_streak: longest_streak = current_streak
- On uncomplete: recalculate streak from logs
- Heatmap returns: `{ date: "2026-03-07", count: 3 }` (count = habits completed that day)
- Completion rate = completed_logs / (active_habits * days_in_period)

---

### Module 4: Dashboard
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/dashboard | Dashboard summary | Protected |
| GET | /api/v1/dashboard/weekly | Weekly completion summary | Protected |
| GET | /api/v1/stats/overview | Overall statistics | Protected |

**Dashboard Summary Response:**
```json
{
  "today": {
    "date": "2026-03-07",
    "habits": [
      { "id": 1, "name": "Exercise", "completed": true, "streak": 5 }
    ],
    "completed_count": 3,
    "total_count": 5,
    "completion_rate": 0.6
  },
  "streaks": {
    "best_current": { "habit_name": "Reading", "streak": 15 },
    "best_ever": { "habit_name": "Meditation", "streak": 42 }
  },
  "stats": {
    "total_habits": 5,
    "active_habits": 4,
    "total_completions": 127,
    "overall_completion_rate": 0.73
  }
}
```

**Frontend Pages:**
| Route | Page | Components |
|-------|------|------------|
| /dashboard | DashboardPage | TodayChecklist, StreakOverview, CalendarHeatmap, CompletionChart, StatsCards |
| /settings | SettingsPage | SettingsForm, DangerZone (delete account) |

**Business Logic:**
- Dashboard data aggregated server-side in a single query for performance
- Today's checklist includes completion status for each active habit
- Weekly summary: array of 7 days with completion counts
- All data scoped to authenticated user

---

### Module 5: Admin Panel (Post-MVP)
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/admin/users | List all users (paginated) | Admin |
| GET | /api/v1/admin/users/{id} | Get user details | Admin |
| PUT | /api/v1/admin/users/{id} | Update user status | Admin |
| DELETE | /api/v1/admin/users/{id} | Delete a user | Admin |
| GET | /api/v1/admin/stats | Platform statistics | Admin |

**Frontend Pages:**
| Route | Page | Components |
|-------|------|------------|
| /admin | AdminDashboardPage | PlatformStatsCards, UserGrowthChart |
| /admin/users | AdminUsersPage | UsersTable, UserStatusToggle, SearchBar |

**Business Logic:**
- Admin endpoints require is_admin=True on User model
- Return 403 Forbidden for non-admin users
- Platform stats: total users, active users (last 7 days), total habits, total completions

---

## PHASE EXECUTION PLAN

### Phase 1: Foundation (4 agents in parallel)

**DATABASE-AGENT:**
- Read: skills/DATABASE.md
- Create: backend/app/database.py (engine, session, Base)
- Create: backend/app/models/__init__.py
- Create: backend/app/models/user.py (User model)
- Create: backend/app/models/habit.py (Habit model)
- Create: backend/app/models/habit_log.py (HabitLog model)
- Create: backend/app/models/streak.py (Streak model)
- Create: backend/app/models/refresh_token.py (RefreshToken model)
- Setup: Alembic config + initial migration
- Run: alembic upgrade head

**BACKEND-AGENT:**
- Read: skills/BACKEND.md
- Create: backend/app/main.py (FastAPI app, CORS, routers)
- Create: backend/app/config.py (Settings with pydantic-settings)
- Create: backend/requirements.txt
- Create: backend/app/auth/__init__.py
- Create: backend/app/auth/jwt.py (create/verify tokens)
- Create: backend/app/auth/dependencies.py (get_current_user)
- Create: backend/app/schemas/__init__.py
- Create: backend/app/routers/__init__.py
- Create: backend/app/services/__init__.py

**FRONTEND-AGENT:**
- Read: skills/FRONTEND.md
- Create: Vite + React + TypeScript project
- Setup: Tailwind CSS + shadcn/ui
- Create: frontend/src/types/ (all TypeScript interfaces)
- Create: frontend/src/services/api.ts (axios instance with interceptors)
- Create: frontend/src/context/AuthContext.tsx
- Create: frontend/src/components/layout/ (Layout, Navbar, Sidebar)
- Create: frontend/src/hooks/useAuth.ts
- Setup: React Router with protected routes

**DEVOPS-AGENT:**
- Read: skills/DEPLOYMENT.md
- Create: docker-compose.yml (postgres, backend, frontend)
- Create: backend/Dockerfile
- Create: frontend/Dockerfile
- Create: .env.example
- Create: .gitignore

**Validation Gate 1:**
```bash
cd backend && pip install -r requirements.txt
alembic upgrade head
cd frontend && npm install
docker-compose config
```

---

### Phase 2: Core Modules (backend + frontend parallel per module)

**Phase 2A: Auth Module**

BACKEND-AGENT:
- Create: backend/app/schemas/user.py (UserCreate, UserLogin, UserResponse, TokenResponse)
- Create: backend/app/routers/auth.py (all auth endpoints)
- Create: backend/app/services/auth_service.py (register, login, refresh, OAuth)
- Create: backend/app/auth/oauth.py (Google OAuth handler)

FRONTEND-AGENT:
- Create: frontend/src/pages/LoginPage.tsx
- Create: frontend/src/pages/RegisterPage.tsx
- Create: frontend/src/pages/ForgotPasswordPage.tsx
- Create: frontend/src/pages/ProfilePage.tsx
- Create: frontend/src/components/auth/ (LoginForm, RegisterForm, GoogleOAuthButton)
- Create: frontend/src/services/authService.ts

**Phase 2B: Habits Module**

BACKEND-AGENT:
- Create: backend/app/schemas/habit.py (HabitCreate, HabitUpdate, HabitResponse)
- Create: backend/app/routers/habits.py (all habit endpoints)
- Create: backend/app/services/habit_service.py (CRUD + complete/archive)

FRONTEND-AGENT:
- Create: frontend/src/pages/HabitListPage.tsx
- Create: frontend/src/pages/HabitDetailPage.tsx
- Create: frontend/src/pages/HabitCreatePage.tsx
- Create: frontend/src/pages/HabitEditPage.tsx
- Create: frontend/src/components/habits/ (HabitCard, HabitCheckbox, HabitForm, ColorPicker, IconPicker)
- Create: frontend/src/services/habitService.ts
- Create: frontend/src/hooks/useHabits.ts

**Phase 2C: Streaks & Dashboard Module**

BACKEND-AGENT:
- Create: backend/app/schemas/streak.py (StreakResponse, HeatmapResponse)
- Create: backend/app/schemas/dashboard.py (DashboardResponse)
- Create: backend/app/routers/streaks.py (streak + stats endpoints)
- Create: backend/app/routers/dashboard.py (dashboard endpoints)
- Create: backend/app/services/streak_service.py (streak calculation logic)
- Create: backend/app/services/dashboard_service.py (aggregation queries)

FRONTEND-AGENT:
- Create: frontend/src/pages/DashboardPage.tsx
- Create: frontend/src/pages/SettingsPage.tsx
- Create: frontend/src/components/dashboard/ (TodayChecklist, StreakOverview, StatsCards, CompletionChart)
- Create: frontend/src/components/streaks/ (CalendarHeatmap, StreakCard, StreakBadge)
- Create: frontend/src/services/dashboardService.ts
- Create: frontend/src/hooks/useDashboard.ts

**Validation Gate 2:**
```bash
cd backend && ruff check .
cd frontend && npm run lint && npm run type-check
```

---

### Phase 3: Quality (3 agents in parallel)

**TEST-AGENT:**
- Read: skills/TESTING.md
- Create: backend/tests/conftest.py (test fixtures, test DB)
- Create: backend/tests/test_auth.py (auth endpoint tests)
- Create: backend/tests/test_habits.py (habit CRUD tests)
- Create: backend/tests/test_streaks.py (streak calculation tests)
- Create: backend/tests/test_dashboard.py (dashboard aggregation tests)
- Create: frontend/src/__tests__/ (component + page tests)
- Target: 80%+ backend coverage

**REVIEW-AGENT:**
- Security audit: check auth flows, SQL injection, XSS
- Performance review: check N+1 queries, missing indexes
- Code quality: check type hints, error handling, logging
- API consistency: check response formats, status codes

**DEVOPS-AGENT:**
- Verify Docker builds
- Add health check endpoint
- Verify environment variable handling
- Create production docker-compose.prod.yml

**Validation Gate 3:**
```bash
cd backend && pytest --cov --cov-fail-under=80 -v
cd frontend && npm test
```

---

### Final Validation
```bash
docker-compose up -d
curl http://localhost:8000/health
curl http://localhost:8000/docs  # OpenAPI docs
docker-compose down
```

---

## VALIDATION GATES

| Gate | Phase | Commands |
|------|-------|----------|
| 1 | Foundation | `pip install -r requirements.txt`, `alembic upgrade head`, `npm install`, `docker-compose config` |
| 2 | Modules | `ruff check backend/`, `npm run lint`, `npm run type-check` |
| 3 | Quality | `pytest --cov --cov-fail-under=80`, `npm test` |
| Final | Integration | `docker-compose up -d`, `curl localhost:8000/health` |

---

## ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL=postgresql://seedhabit:seedhabit@localhost:5432/seedhabit

# Auth
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback

# Frontend
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Email (Post-MVP)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email
# SMTP_PASSWORD=your-password
```

---

## FILE MANIFEST

### Backend (27 files)
```
backend/
├── Dockerfile
├── requirements.txt
├── alembic.ini
├── alembic/
│   ├── env.py
│   └── versions/
│       └── 001_initial.py
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── habit.py
│   │   ├── habit_log.py
│   │   ├── streak.py
│   │   └── refresh_token.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── habit.py
│   │   ├── streak.py
│   │   └── dashboard.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── habits.py
│   │   ├── streaks.py
│   │   ├── dashboard.py
│   │   └── admin.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── habit_service.py
│   │   ├── streak_service.py
│   │   └── dashboard_service.py
│   └── auth/
│       ├── __init__.py
│       ├── jwt.py
│       ├── oauth.py
│       └── dependencies.py
└── tests/
    ├── conftest.py
    ├── test_auth.py
    ├── test_habits.py
    ├── test_streaks.py
    └── test_dashboard.py
```

### Frontend (30+ files)
```
frontend/
├── Dockerfile
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types/
│   │   ├── user.ts
│   │   ├── habit.ts
│   │   ├── streak.ts
│   │   └── dashboard.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── habitService.ts
│   │   └── dashboardService.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useHabits.ts
│   │   └── useDashboard.ts
│   ├── components/
│   │   ├── ui/           (shadcn/ui)
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── GoogleOAuthButton.tsx
│   │   ├── habits/
│   │   │   ├── HabitCard.tsx
│   │   │   ├── HabitCheckbox.tsx
│   │   │   ├── HabitForm.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   └── IconPicker.tsx
│   │   ├── dashboard/
│   │   │   ├── TodayChecklist.tsx
│   │   │   ├── StreakOverview.tsx
│   │   │   ├── StatsCards.tsx
│   │   │   └── CompletionChart.tsx
│   │   └── streaks/
│   │       ├── CalendarHeatmap.tsx
│   │       ├── StreakCard.tsx
│   │       └── StreakBadge.tsx
│   └── pages/
│       ├── LoginPage.tsx
│       ├── RegisterPage.tsx
│       ├── ForgotPasswordPage.tsx
│       ├── ProfilePage.tsx
│       ├── DashboardPage.tsx
│       ├── HabitListPage.tsx
│       ├── HabitDetailPage.tsx
│       ├── HabitCreatePage.tsx
│       ├── HabitEditPage.tsx
│       └── SettingsPage.tsx
```

### Infrastructure (4 files)
```
docker-compose.yml
.env.example
.gitignore
```

---

## NEXT STEP

Execute with parallel agents:
```bash
/execute-prp PRPs/seedhabit-prp.md
```

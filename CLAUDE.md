# CLAUDE.md - SeedHabit Project Rules

> Project-specific rules for Claude Code. This file is read automatically.

---

## Project Overview

**Project Name:** SeedHabit
**Description:** A habit tracking app that helps users build and maintain daily routines with streaks and analytics.
**Tech Stack:**
- Backend: FastAPI + Python 3.11+
- Frontend: React + TypeScript + Vite
- Database: PostgreSQL + SQLAlchemy
- Auth: JWT + Email/Password + Google OAuth
- UI: Tailwind CSS + shadcn/ui

---

## Project Structure

```
seedhabit/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── habit.py
│   │   │   ├── habit_log.py
│   │   │   └── streak.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── habit.py
│   │   │   ├── habit_log.py
│   │   │   └── streak.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── habits.py
│   │   │   ├── streaks.py
│   │   │   ├── dashboard.py
│   │   │   └── admin.py
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── habit_service.py
│   │   │   ├── streak_service.py
│   │   │   └── dashboard_service.py
│   │   └── auth/
│   │       ├── jwt.py
│   │       ├── oauth.py
│   │       └── dependencies.py
│   ├── alembic/
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          (shadcn/ui components)
│   │   │   ├── habits/
│   │   │   ├── dashboard/
│   │   │   └── layout/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   └── types/
│   └── package.json
├── .claude/
│   └── commands/
├── skills/
├── agents/
└── PRPs/
```

---

## Code Standards

### Python (Backend)
```python
# ALWAYS use type hints
def get_habit(db: Session, habit_id: int) -> Habit:
    pass

# ALWAYS use async endpoints
@router.get("/habits/{id}")
async def get_habit(id: int, db: Session = Depends(get_db)):
    pass
```

### TypeScript (Frontend)
```typescript
// ALWAYS define interfaces for props and data
interface HabitProps {
  id: number;
  name: string;
  description: string;
  frequency: "daily" | "weekly";
  category: string;
  color: string;
  icon: string;
  isArchived: boolean;
}

// NO any types allowed
const fetchHabit = async (id: number): Promise<Habit> => {
  // ...
};
```

---

## Forbidden Patterns

### Backend
- `print()` -> use `logging` module
- Plain text passwords -> use bcrypt
- Hardcoded secrets -> use environment variables
- `SELECT *` -> specify columns
- Skip input validation

### Frontend
- `any` type in TypeScript
- `console.log` in production code
- Unhandled async errors
- Inline styles -> use Tailwind CSS

---

## Module-Specific Rules

### Habits Module
- All habits must belong to a user (user_id foreign key)
- Habit frequency must be one of: "daily", "weekly"
- Habit names must be unique per user
- Archived habits should not appear in the default list view

### Streaks Module
- Streak is auto-calculated when a habit is completed
- Missing a day resets current_streak to 0
- longest_streak is never decremented
- Streak records are created automatically with first completion

### Dashboard Module
- Dashboard data should be aggregated server-side for performance
- Today's habits endpoint should include completion status

---

## API Conventions

- All endpoints prefixed with `/api/v1/`
- Use plural nouns for resources: `/habits`, `/streaks`
- Return appropriate HTTP status codes:
  - 200: Success
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 409: Conflict

---

## Authentication

### JWT Configuration
- Access token expires: 30 minutes
- Refresh token expires: 7 days
- Algorithm: HS256

### OAuth Providers
- Google OAuth 2.0 enabled
- Always verify state parameter for CSRF protection

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/seedhabit

# Auth
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Frontend
VITE_API_URL=http://localhost:8000
```

---

## Development Commands

```bash
# Backend
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Docker
docker-compose up -d

# Tests
pytest backend/tests -v
cd frontend && npm test

# Linting
ruff check backend/
cd frontend && npm run lint
```

---

## Commit Message Format

```
feat(habits): add habit completion endpoint
fix(streaks): fix streak reset on missed day
refactor(dashboard): optimize aggregation query
test(auth): add OAuth callback tests
docs: update API documentation
```

---

## Skills Reference

| Task | Skill |
|------|-------|
| Database models | skills/DATABASE.md |
| API + Auth | skills/BACKEND.md |
| React + UI | skills/FRONTEND.md |
| Testing | skills/TESTING.md |
| Deployment | skills/DEPLOYMENT.md |

---

## Agents

| Agent | Role |
|-------|------|
| DATABASE-AGENT | Models + migrations |
| BACKEND-AGENT | API + auth |
| FRONTEND-AGENT | UI + pages |
| DEVOPS-AGENT | Docker + CI/CD |

---

## Validation

```bash
ruff check backend/ && pytest
npm run lint && npm run type-check
docker-compose build
```

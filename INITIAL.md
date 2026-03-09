# INITIAL.md - SeedHabit Product Definition

> A habit tracking app that helps users build and maintain daily routines with streaks and analytics.

---

## PRODUCT

### Name
SeedHabit

### Description
SeedHabit is a micro-SaaS habit tracker that empowers individuals to build better daily routines. Users can create habits, track daily completions, build streaks, and visualize their progress through a beautiful dashboard with calendar heatmaps and analytics. The app focuses on simplicity and motivation -- helping users plant the seeds of good habits and watch them grow.

### Target User
Individuals focused on self-improvement who want to build and maintain positive daily habits, track their consistency, and stay motivated through visual progress indicators and streak tracking.

### Type
- [x] SaaS (Software as a Service)

---

## TECH STACK

| Layer | Choice |
|-------|--------|
| Backend | FastAPI + Python 3.11+ |
| Frontend | React + TypeScript + Vite |
| Database | PostgreSQL + SQLAlchemy |
| Auth | JWT + Email/Password + Google OAuth |
| UI | Tailwind CSS + shadcn/ui |
| Payments | None |

---

## MODULES

### Module 1: Authentication (Required)

**Description:** User authentication and authorization

**Models:**
```
User:
  - id, email, hashed_password, full_name, avatar_url
  - is_active, is_verified, is_admin, oauth_provider
  - created_at, updated_at

RefreshToken:
  - id, user_id (FK), token, expires_at, revoked
```

**Endpoints:**
```
POST   /api/v1/auth/register         - Create new account
POST   /api/v1/auth/login            - Login with email/password
POST   /api/v1/auth/refresh          - Refresh access token
POST   /api/v1/auth/logout           - Revoke refresh token
GET    /api/v1/auth/me               - Get current user profile
PUT    /api/v1/auth/me               - Update profile
POST   /api/v1/auth/forgot-password  - Request password reset
POST   /api/v1/auth/reset-password   - Reset password with token
GET    /api/v1/auth/google           - Initiate Google OAuth flow
GET    /api/v1/auth/google/callback  - Google OAuth callback
```

**Pages:**
```
/login           - Login page
/register        - Registration page
/forgot-password - Forgot password page
/profile         - User profile page (protected)
```

---

### Module 2: Habits

**Description:** Create, manage, and organize daily habits

**Models:**
```
Habit:
  - id, user_id (FK)
  - name, description
  - frequency (daily/weekly)
  - category, color, icon
  - reminder_time
  - is_archived
  - created_at, updated_at
```

**Endpoints:**
```
GET    /api/v1/habits              - List all habits for current user
POST   /api/v1/habits              - Create a new habit
GET    /api/v1/habits/{id}         - Get habit details
PUT    /api/v1/habits/{id}         - Update a habit
DELETE /api/v1/habits/{id}         - Delete a habit
POST   /api/v1/habits/{id}/complete   - Mark habit as complete for today
POST   /api/v1/habits/{id}/uncomplete - Unmark habit completion for today
PUT    /api/v1/habits/{id}/archive    - Archive a habit
PUT    /api/v1/habits/{id}/unarchive  - Unarchive a habit
```

**Pages:**
```
/habits          - Habit list view (with today's checklist)
/habits/:id      - Individual habit detail with completion history
/habits/new      - Create new habit form
/habits/:id/edit - Edit habit form
```

---

### Module 3: Streaks & Tracking

**Description:** Track habit completions, calculate streaks, and provide historical data

**Models:**
```
HabitLog:
  - id, habit_id (FK), user_id (FK)
  - completed_at (date), note
  - created_at

Streak:
  - id, habit_id (FK), user_id (FK)
  - current_streak, longest_streak
  - last_completed_at
```

**Endpoints:**
```
GET    /api/v1/habits/{id}/logs                        - Get completion logs for a habit
GET    /api/v1/habits/{id}/logs?start_date=X&end_date=Y - Get logs in date range
GET    /api/v1/habits/{id}/streak                      - Get streak info for a habit
GET    /api/v1/streaks                                 - Get all streaks for current user
GET    /api/v1/stats/heatmap?year=2026                 - Get heatmap data for the year
GET    /api/v1/stats/completion-rate                   - Get overall completion rate
```

**Pages:**
```
(Components embedded in habit detail and dashboard)
- Calendar heatmap component (GitHub-style)
- Streak cards component (current streak, longest streak per habit)
```

---

### Module 4: Dashboard

**Description:** Overview of habits, streaks, and progress statistics

**Endpoints:**
```
GET    /api/v1/dashboard            - Get dashboard summary (today's habits, streaks, stats)
GET    /api/v1/dashboard/weekly     - Get weekly completion summary
GET    /api/v1/stats/overview       - Get overall statistics
```

**Pages:**
```
/dashboard - Main dashboard with:
  - Today's habits checklist
  - Streak overview cards
  - Calendar heatmap (year view)
  - Completion rate chart (weekly/monthly)
  - Best streaks leaderboard (personal)
/settings  - User settings and preferences
```

---

### Module 5: Admin Panel

**Description:** Admin-only management interface

**Endpoints:**
```
GET    /api/v1/admin/users          - List all users (paginated)
GET    /api/v1/admin/users/{id}     - Get user details
PUT    /api/v1/admin/users/{id}     - Update user status (activate/deactivate)
DELETE /api/v1/admin/users/{id}     - Delete a user
GET    /api/v1/admin/stats          - Platform statistics
```

**Pages:**
```
/admin       - Admin dashboard with platform stats (protected, admin only)
/admin/users - User management table
```

---

## ADDITIONAL FEATURES

### Email Notifications
- Welcome email on registration
- Password reset email
- Daily habit reminder emails (based on reminder_time)

### File Uploads
- Profile picture upload
- Custom habit icon upload

### Analytics Dashboard
- Completion rate over time (line chart)
- Habits by category (pie chart)
- Weekly/monthly trends
- Best and worst performing habits

---

## MVP SCOPE

### Must Have (MVP)
- [x] User registration and login (email/password + Google OAuth)
- [x] Habit CRUD (create, read, update, delete habits)
- [x] Daily habit tracking (mark habits as complete/incomplete)
- [x] Streak tracking (current streak, longest streak)
- [x] Dashboard with today's habits, streaks, and basic stats

### Nice to Have (Post-MVP)
- [ ] Admin panel
- [ ] Email notifications & reminders
- [ ] File uploads (profile pics, custom icons)
- [ ] Advanced analytics dashboard with charts
- [ ] Habit categories and filtering
- [ ] Archive/unarchive habits
- [ ] Calendar heatmap visualization
- [ ] Weekly frequency habits
- [ ] Export data (CSV)

---

## ACCEPTANCE CRITERIA

### Authentication
- [ ] User can register with email/password
- [ ] User can login with email/password
- [ ] User can login with Google OAuth
- [ ] JWT tokens work correctly with refresh
- [ ] Protected routes redirect to login
- [ ] User can view and update their profile

### Habits
- [ ] User can create a new habit with name, description, frequency, category, color, icon
- [ ] User can view all their habits in a list
- [ ] User can edit an existing habit
- [ ] User can delete a habit
- [ ] User can mark a habit as complete for today
- [ ] User can unmark a habit completion
- [ ] Habits are scoped to the authenticated user only

### Streaks & Tracking
- [ ] Completing a habit increments the current streak
- [ ] Missing a day resets the current streak
- [ ] Longest streak is tracked and persisted
- [ ] Completion logs are stored with dates

### Dashboard
- [ ] Dashboard shows today's habits with completion status
- [ ] Dashboard shows streak cards for active habits
- [ ] Dashboard shows overall completion rate

### Quality
- [ ] All API endpoints documented in OpenAPI
- [ ] Backend test coverage 80%+
- [ ] Frontend TypeScript strict mode passes
- [ ] Docker builds and runs successfully

---

## SPECIAL REQUIREMENTS

### Security
- [x] Rate limiting on auth endpoints
- [x] Input validation on all endpoints
- [x] SQL injection prevention (via SQLAlchemy ORM)
- [x] XSS prevention
- [x] CSRF protection for OAuth flows
- [x] All habits/logs scoped to authenticated user (no data leakage)

### Integrations
- [x] Google OAuth 2.0
- [ ] Email service for notifications (post-MVP)
- [ ] File upload service (post-MVP)

---

## AGENTS

> These 6 agents will build your product in parallel:

| Agent | Role | Works On |
|-------|------|----------|
| DATABASE-AGENT | Creates all models and migrations | User, Habit, HabitLog, Streak models |
| BACKEND-AGENT | Builds API endpoints and services | Auth, Habits, Streaks, Dashboard, Admin APIs |
| FRONTEND-AGENT | Creates UI pages and components | All pages, components, heatmap, charts |
| DEVOPS-AGENT | Sets up Docker, CI/CD, environments | Infrastructure |
| TEST-AGENT | Writes unit and integration tests | All code |
| REVIEW-AGENT | Security and code quality audit | All code |

---

# READY?

```bash
/generate-prp INITIAL.md
```

Then:

```bash
/execute-prp PRPs/seedhabit-prp.md
```

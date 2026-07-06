# Jobnet - Job Marketplace MVP (Frontend)

Phase 1 MVP frontend for a Canadian construction & general services job marketplace. Built with **React + JavaScript (JSX)**, **Vite**, **React Router**, and **Tailwind CSS**.

This frontend is wired to the **.NET 8 backend** at `../jobNetBackend`. All data, authentication, and notifications come from the API; the only thing kept in `localStorage` is the JWT (`jobnet.token.v1`).

---

## Tech stack

| Layer        | Choice                                  | Why                                                        |
| ------------ | --------------------------------------- | ---------------------------------------------------------- |
| Build tool   | Vite 5                                  | Fast HMR, simple config, instant dev server.               |
| UI library   | React 18                                | Required by the project brief.                             |
| Language     | JavaScript (JSX)                        | Required by the project brief.                             |
| Routing      | React Router 6                          | Standard nested routing with route guards.                 |
| Styling      | Tailwind CSS 3                          | Rapid, consistent UI without hand-rolled CSS.              |
| Icons        | lucide-react                            | Clean, tree-shakable icon set.                             |
| State / data | React Context + `localStorage`          | Lightweight, no extra deps for an MVP.                     |

---

## Installed modules (Phase 1)

1. **Authentication & Authorization** - login, register (Worker / Employer), forgot password, role-based route guards, suspended-account handling.
2. **Employer Management** - company profile (info, address, contact, verified badge, rating), employer dashboard with KPIs.
3. **Worker Management** - profile (headline, bio, skills, certifications, experience, hourly rate, availability), reviews received.
4. **Job Posting Management** - create / pause / reopen / delete jobs, required-skills tagging.
5. **Applications Management** - browse jobs (public + worker smart-match), apply with cover letter + expected rate, employer side: shortlist / not-a-fit / select candidate (auto-rejects everyone else and marks job as `filled`), worker side: track status / withdraw.
6. **Notifications** - in-app toast notifications, bell with unread count, full notifications page, persistent across reload.
7. **Admin Panel (basic)** - overview KPIs, users (search / suspend / reactivate), companies (verify), jobs (close / delete), reports (jobs by category / province, application funnel), reset demo data.
8. **Reviews (basic)** - employers can review selected workers; workers can review employers after being selected. Ratings auto-aggregate per company and per worker.

---

## Role design

| Role        | What they can do                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| `worker`    | Build a profile, browse jobs, apply, track applications, review employers, get hire notifications.    |
| `employer`  | Manage a company profile, post jobs, review applicants, shortlist / select / reject, review workers.  |
| `admin`     | Platform-wide view: users, companies, jobs, basic reports, verification, data reset.                  |
| `moderator` | *(reserved for Phase 2)* - subset of admin powers focused on content moderation.                       |

Route protection lives in `src/components/auth/RoleGuard.jsx` and is wired in `src/App.jsx`. Authenticated users without the correct role are redirected to `/forbidden`.

---

## Project structure

```
jobnet/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── src/
    ├── main.jsx                # App entry + provider tree
    ├── App.jsx                 # Routes
    ├── index.css               # Tailwind base + component classes
    ├── data/
    │   └── seed.js             # Seed users, companies, jobs, apps, reviews
    ├── contexts/
    │   ├── DataContext.jsx     # In-memory store + CRUD + localStorage persistence
    │   ├── AuthContext.jsx     # login / register / logout / current user
    │   └── NotificationContext.jsx  # Toast viewport + useToast()
    ├── components/
    │   ├── auth/RoleGuard.jsx
    │   ├── layout/             # Navbar, NotificationBell, Footer, AppLayout, DashboardLayout
    │   ├── jobs/JobCard.jsx
    │   └── ui/                 # Avatar, Modal, StarRating, StatusBadge, EmptyState
    └── pages/
        ├── public/             # Landing, Browse jobs, Job detail, Companies, How it works
        ├── auth/               # Login, Register, Forgot password
        ├── employer/           # Dashboard, Jobs, Job detail, Post job, Company profile, Reviews
        ├── worker/             # Dashboard, Profile, Jobs (smart-match), Applications
        ├── admin/              # Overview, Users, Companies, Jobs, Reports, Settings
        ├── shared/             # NotificationsPage
        └── system/             # 404, Forbidden
```

---

## Getting started

```bash
# 1. Start the backend first (see ../jobNetBackend/README.md)
#    Default URL: http://localhost:5080

# 2. Optional: configure the API URL
copy .env.example .env.local            # then edit VITE_API_BASE_URL if needed

# 3. Run the frontend
npm install
npm run dev
```

The dev server runs at <http://localhost:5173> (or the next free port).

If the backend is running on a non-default port, set `VITE_API_BASE_URL` in `.env.local`:

```
VITE_API_BASE_URL=http://localhost:5080/api
```

### Demo accounts

You can either click them on the Login page to autofill, or type them manually:

| Role     | Email                          | Password      |
| -------- | ------------------------------ | ------------- |
| Admin    | `admin@jobnet.ca`              | `admin123`    |
| Employer | `david@northbuild.ca`          | `employer123` |
| Worker   | `marcus@example.com`           | `worker123`   |

> You can also register fresh accounts from `/register`. New employer accounts automatically get a placeholder company that they can complete from **Employer -> Company Profile**.

### Resetting demo data

Sign in as `admin@jobnet.ca` and go to **Admin -> Settings -> Reset all data**. This calls `POST /api/admin/reset` on the backend which wipes the SQL tables and re-seeds them.

---

## End-to-end flow to try

1. Sign in as the **Worker** (`marcus@example.com`).
2. Go to **Find Jobs** and apply to `Site Supervisor - Retail Renovation`.
3. Sign out, then sign in as the **Employer** (`david@northbuild.ca`).
4. Open the new application from the bell or the dashboard.
5. Click **Shortlist**, then **Select candidate**. Other applicants on that job are auto-rejected and the job is marked `filled`.
6. Sign back in as the worker - you will see the in-app notification, and you'll be able to **Review employer** from the **My Applications** page.

---

## How the frontend talks to the backend

| File                                | Responsibility                                            |
| ----------------------------------- | --------------------------------------------------------- |
| `src/services/api.js`               | Tiny `fetch` wrapper + base URL + JWT bearer injection.   |
| `src/services/endpoints.js`         | One function per backend route (`authApi.login(...)`, ...). |
| `src/contexts/AuthContext.jsx`      | login / register / logout / `/auth/me` rehydration.       |
| `src/contexts/DataContext.jsx`      | Loads jobs / companies / notifications / applications via the API, exposes the same mutator names the pages used before. |

The wire format uses **camelCase enums** (`'worker'`, `'open'`, `'hourly'`, etc.) to match what the React components already expect.

## What is intentionally **out of scope** for Phase 1

- Real-time messaging / chat (placeholder buttons disabled in UI).
- Email delivery (the Forgot Password flow returns a friendly stub from the API).
- Payment / invoicing.
- Moderator role and audit-log viewer.

These are all stubbed in a way that makes them additive in later phases without restructuring the UI.

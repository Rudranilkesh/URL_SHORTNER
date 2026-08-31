# CronWatch — Product Requirements Document (PRD)

| | |
|---|---|
| **Product** | CronWatch *(working title — a "dead man's switch" for scheduled jobs)* |
| **Author** | Rudranil Kesh (`rudranilkesh`) |
| **Date** | 2026-08-26 |
| **Version** | 0.1 (Draft) |
| **Status** | MVP scoping |
| **Type** | Developer-tooling SaaS |

---

## 1. TL;DR

**CronWatch tells you when a scheduled job *didn't* run.**

Every backend has jobs that are supposed to run on a schedule — nightly database backups, hourly report generators, queue workers, cleanup crons. When one silently dies, nobody finds out until something downstream breaks. CronWatch fixes this: you register a **Check** with an expected schedule, you get a unique **ping URL**, your job calls that URL each time it runs, and if a ping is ever late or missing, CronWatch alerts you. It monitors the **absence** of an event, which is the opposite of normal request/response software — and that inversion is the whole point.

---

## 2. Background — how I arrived at this product

This project is the next step in a deliberate learning path: build real, "industry-level" backends by digitizing workflows people already do manually.

The decision funnel that led here:

1. **Goal:** build something *unique but genuinely needed*, not another to-do app.
2. **First direction explored:** India everyday-life apps (household staff attendance/salary, informal vendor billing, tiffin management). Strong ideas, but I wanted a **technology/developer problem**, not a home/consumer one.
3. **Chose the lane:** a **dev/infra SaaS** — because I'm my own first user, the domain is *pure backend*, and it teaches the exact patterns (schedulers, background workers, idempotent ingest, state machines) that separate a hobby project from a production system.
4. **Chose the product:** a **cron / background-job monitor**, over the two runner-up dev-tool ideas (a webhook gateway, and an uptime + status-page monitor). It has the smallest viable v1 but the longest, clearest runway toward an industry-grade system.
5. **Reuse advantage:** it maps almost 1:1 onto my existing URL-shortener repo — same auth, same layered architecture, and even the same `nanoid` trick (short-url codes → ping tokens).

---

## 3. Problem statement

Scheduled jobs fail **silently**. A cron that stops firing produces no error, no alert, no log line — just *nothing*. Teams typically discover a dead backup or a stuck worker days later, after the damage is done. The existing "solutions" are:

- **Nothing** — hope it's running (most common).
- **Home-grown scripts** that email on success (which trains you to ignore the emails, and still says nothing when the job never runs at all).
- **Full observability suites** (Datadog, etc.) that are overkill and expensive for "did my cron run?".

There's a clear gap for a **simple, focused, cheap** tool that answers exactly one question well: *did my scheduled job run on time?*

---

## 4. Goals & non-goals

### Goals
- Detect a missed/late scheduled job and alert the owner **within one grace window**.
- Make setup trivial: create a check, copy one URL, add it to your cron. Under 2 minutes.
- Zero false positives — an alert must always mean something is actually wrong.
- Be a **teaching vehicle** for production backend patterns (see §16).

### Non-goals (for now)
- Not an APM / full observability platform (no traces, no metrics ingestion).
- Not a general uptime/website monitor (that's a different product I deliberately set aside).
- Not a log aggregator.
- No mobile app in v1 (web only).

---

## 5. Target users & personas

| Persona | Need |
|---|---|
| **Solo developer / indie hacker** | "I have 3 side projects with nightly crons and no idea if they run." |
| **Small startup backend team** | "Our backup and billing jobs are critical; we need to know instantly if one skips." |
| **DevOps / SRE (small org)** | "I want a cheap dead-man's-switch layer without standing up Prometheus Alertmanager." |

Primary persona for v1: **the solo developer** (also = me, the builder).

---

## 6. What the product does

### Core concept
A **Check** represents one scheduled job. It knows how often the job *should* ping (`period`) and how much lateness is tolerable (`grace`). Each check exposes a unique **ping URL**. The job hits that URL when it runs. A background **evaluator** continuously checks whether each check has pinged in time; if not, it flips the check to **DOWN** and sends an alert. When pings resume, it flips back to **UP** and sends a recovery notice.

### Key features (MVP)
1. **Auth** — register / login (JWT), each user sees only their own checks.
2. **Check management** — create, edit, pause/resume, delete checks.
3. **Ping ingestion** — a fast, public, token-authenticated endpoint the user's job calls.
4. **Start / fail signals** — optional `/start` (to measure run duration) and `/fail` (to alert immediately on a job-reported failure).
5. **Evaluator** — background loop that flips overdue checks to DOWN.
6. **Alerting** — a single channel in v1: **Discord/Slack incoming webhook** (down + recovery).
7. **Dashboard** — list of checks with live status, last-ping time, and uptime %; a detail page with the recent ping-event log.

### Primary user flow
```
Sign up → Create check ("DB backup", every 24h, 30m grace)
       → Copy ping URL  /ping/aB3xK9dQ...
       → Add to cron:   0 2 * * *  pg_dump ... && curl -fsS https://api.cronwatch.app/ping/aB3xK9dQ
       → Job runs nightly → pings → check stays UP
       → One night the job fails to run → no ping → evaluator flips to DOWN
       → Alert fires to Discord within (period + grace) → developer investigates
```

---

## 7. How it works (technical concept)

- On **create**, a check gets `pingToken` (nanoid) and an initial `nextDueAt`.
- On **each ping** (`/ping/:token`): append a `PingEvent`, set `lastPingAt = now`, set `status = up`, and recompute `nextDueAt = now + periodSeconds + graceSeconds`. The hot path does the minimum work possible and is **idempotent**.
- The **evaluator** runs every ~30s: it queries for checks where `status = 'up'` **and** `nextDueAt < now`, flips them to `down`, and enqueues an alert. It also handles recovery (a ping arriving on a `down` check → `up` + recovery alert).
- **Alerts fire only on state *transitions*** (up→down, down→up), never on every tick — this is the alert-dedupe rule that keeps it from spamming.

The clever bit: instead of recomputing every check's schedule on every tick, we **denormalize the deadline** into an indexed `nextDueAt` field, so the evaluator is a single cheap indexed range query no matter how many checks exist.

---

## 8. Functional requirements (MVP scope)

| # | Requirement | In MVP? |
|---|---|---|
| F1 | User can register, log in, log out (JWT) | ✅ |
| F2 | User can CRUD checks (name, period, grace) | ✅ |
| F3 | User can pause/resume a check | ✅ |
| F4 | Public ping endpoint updates state + logs event | ✅ |
| F5 | `/start` and `/fail` ping variants | ✅ |
| F6 | Background evaluator flips overdue checks to DOWN | ✅ |
| F7 | Alert on DOWN and on recovery (one webhook channel) | ✅ |
| F8 | Dashboard: check list with status + uptime % | ✅ |
| F9 | Check detail: recent ping-event log | ✅ |
| F10 | Ping events auto-expire (TTL retention) | ✅ |
| — | Cron-expression schedules + timezones | ❌ (v1.1) |
| — | Multiple / prioritized alert channels, escalation | ❌ (v1.1) |
| — | Email alerts | ❌ (v1.1) |
| — | Teams / orgs / RBAC | ❌ (later) |
| — | Public REST API + API keys | ❌ (later) |
| — | Billing | ❌ (later) |
| — | Public status pages | ❌ (separate product) |

---

## 9. Tech stack

Reuses the stack already proven in the URL-shortener project, plus a small number of new pieces for scheduling and notifications.

### Backend
| Concern | Choice |
|---|---|
| Runtime | Node.js (ESM, `"type": "module"`) |
| Framework | Express 5 |
| Database | MongoDB |
| ODM | Mongoose 9 |
| Auth | JWT (`jsonwebtoken`) + `cookie-parser` |
| CORS | `cors` |
| Token generation | `nanoid` (ping tokens) |
| Config | `dotenv` |
| Scheduler (MVP) | in-process `setInterval` loop |
| Notifications (MVP) | Discord/Slack incoming webhook via `fetch` |
| Dev | `nodemon` |

### Frontend
| Concern | Choice |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Server state / caching | TanStack React Query 5 |
| HTTP client | axios |
| Linting | ESLint |

### Planned additions (post-MVP)
`cron-parser` (cron schedules) · `express-rate-limit` (protect ping endpoint) · BullMQ + Redis (durable job queue at scale) · Resend/Brevo/SMTP (email) · Vitest + supertest (tests) · Razorpay/Stripe (billing).

---

## 10. System architecture

```
                 ┌──────────────────────────────────────────────┐
   Browser  ───► │  FRONTEND (React 19 + Vite + Tailwind + RQ)   │
   (user)        └───────────────┬──────────────────────────────┘
                                  │ axios (JWT cookie)
                                  ▼
   Cron job  ──ping──►  ┌─────────────────────────────────────────┐
   (any server)         │  BACKEND (Express 5)                     │
                        │  • Auth routes (protected)               │
                        │  • Check routes (protected, CRUD)        │
                        │  • Ping routes (public, token auth) ◄────┼── the hot path
                        │  • Evaluator job (setInterval ~30s)      │
                        │  • Notification service ──► Discord/Slack │
                        └───────────────┬─────────────────────────┘
                                        │ Mongoose
                                        ▼
                              ┌───────────────────┐
                              │  MongoDB           │
                              │  users, checks,    │
                              │  pingEvents (TTL)  │
                              └───────────────────┘
```

---

## 11. Data model

### `User` (reused)
`name`, `email` (unique), `passwordHash`, `createdAt`

### `Check`
| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId → User | indexed |
| `name` | String | e.g. "Nightly DB backup" |
| `description` | String | optional |
| `pingToken` | String | **unique index**, nanoid |
| `periodSeconds` | Number | expected interval between pings |
| `graceSeconds` | Number | tolerated lateness before DOWN |
| `status` | Enum | `new` \| `up` \| `down` \| `paused` |
| `lastPingAt` | Date | last successful ping |
| `nextDueAt` | Date | **indexed** — deadline the evaluator scans |
| `lastDownAt` / `lastUpAt` | Date | for uptime calc |
| `alertChannel` | Object | `{ type: 'discord'\|'slack', target: url }` |
| `createdAt` / `updatedAt` | Date | timestamps |

**Indexes:** `{ pingToken: 1 }` unique · `{ status: 1, nextDueAt: 1 }` (evaluator scan).

### `PingEvent` (append-only log)
| Field | Type | Notes |
|---|---|---|
| `checkId` | ObjectId → Check | indexed |
| `kind` | Enum | `success` \| `start` \| `fail` |
| `receivedAt` | Date | **TTL index** (auto-delete after 30 days) |
| `source` | Object | `{ ip, userAgent }` |

### `AlertLog` (optional)
`checkId`, `transition` (`down`\|`up`), `channel`, `sentAt`, `deliveryStatus`

---

## 12. API surface

### Auth (existing pattern)
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in (set JWT cookie) |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Current user |

### Checks (protected)
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/checks` | Create a check |
| GET | `/api/checks` | List my checks |
| GET | `/api/checks/:id` | Check detail + recent events |
| PATCH | `/api/checks/:id` | Update (name/period/grace/pause/resume) |
| DELETE | `/api/checks/:id` | Delete a check |

### Ping ingestion (public, token-authenticated by URL)
| Method | Path | Purpose |
|---|---|---|
| GET/POST | `/ping/:token` | Job ran successfully |
| GET/POST | `/ping/:token/start` | Job started (measures duration) |
| GET/POST | `/ping/:token/fail` | Job reported failure → immediate alert |

---

## 13. File / folder structure

Monorepo, mirroring the existing `BACKEND/` + `FRONTEND/` layout. New files for CronWatch are marked ➕; reused-from-URL-shortener files are marked ♻️.

```
cronwatch/
├── BACKEND/
│   ├── app.js                          ♻️  (+ start evaluator)
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── config/
│       │   ├── config.js               ♻️
│       │   └── mongo.config.js         ♻️
│       ├── models/
│       │   ├── user.model.js           ♻️
│       │   ├── check.model.js          ➕
│       │   └── pingEvent.model.js      ➕
│       ├── dao/
│       │   ├── user.dao.js             ♻️
│       │   ├── check.dao.js            ➕
│       │   └── pingEvent.dao.js        ➕
│       ├── services/
│       │   ├── auth.service.js         ♻️
│       │   ├── check.service.js        ➕
│       │   ├── ping.service.js         ➕
│       │   └── notification.service.js ➕
│       ├── controller/
│       │   ├── auth.controller.js      ♻️
│       │   ├── check.controller.js     ➕
│       │   └── ping.controller.js      ➕
│       ├── routes/
│       │   ├── auth.routes.js          ♻️
│       │   ├── check.routes.js         ➕
│       │   └── ping.routes.js          ➕
│       ├── middleware/
│       │   └── auth.middleware.js      ♻️
│       ├── jobs/
│       │   └── evaluator.js            ➕  (the background loop)
│       └── utils/
│           ├── errorHandler.js         ♻️
│           ├── tryCatchWrapper.js      ♻️
│           ├── attachUser.js           ♻️
│           ├── schedule.js             ➕  (compute nextDueAt)
│           └── helper.js               ♻️
└── FRONTEND/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx                     ♻️
        ├── api/
        │   ├── axios.js
        │   ├── user.api.js             ♻️
        │   └── check.api.js            ➕
        ├── components/
        │   ├── RegisterForm.jsx        ♻️
        │   ├── LoginForm.jsx           ♻️
        │   ├── CheckCard.jsx           ➕
        │   ├── CheckForm.jsx           ➕
        │   └── StatusBadge.jsx         ➕
        ├── pages/
        │   ├── AuthPage.jsx            ♻️
        │   ├── DashboardPage.jsx       ➕
        │   └── CheckDetailPage.jsx     ➕
        └── hooks/
            └── useChecks.js            ➕  (React Query)
```

---

## 14. Non-functional requirements

- **Ping latency:** p95 < 100 ms — the hot path does minimal work (one write + one lightweight update).
- **Idempotency:** repeated pings are safe; no duplicate state changes.
- **Alert correctness:** alerts fire only on transitions → **no duplicate/spam alerts**.
- **Resilience:** the evaluator recomputes purely from persisted `lastPingAt`/`nextDueAt`, so a backend restart never loses or double-fires alerts.
- **Security:** ping tokens are unguessable (nanoid, 21+ chars); protected routes require JWT; ping endpoint gets rate-limiting (v1.1).
- **Retention:** ping events auto-expire via TTL (30 days MVP).

---

## 15. Roadmap (post-MVP)

- **v1.1** — cron-expression schedules + timezones; email alerts; rate-limiting on ping endpoint.
- **v1.2** — multiple + prioritized alert channels; escalation / on-call windows.
- **v2.0** — teams/orgs + RBAC; public REST API with API keys; job queue (BullMQ + Redis) and a distributed evaluator with locks (multi-instance safe).
- **v2.x** — public status pages; integrations (PagerDuty, Opsgenie, generic webhooks); billing (Razorpay for India / Stripe); uptime SLA reports.

---

## 16. Learning outcomes (why this project is worth building)

| Backend skill | Where it shows up |
|---|---|
| Background workers / schedulers | The evaluator loop |
| Denormalization + indexed time scans | `nextDueAt` index |
| Idempotent, high-write endpoints | The ping hot path |
| State machines | `new → up → down → up` with grace windows |
| Transition-based alerting (dedupe) | Notification service |
| TTL / data retention | `PingEvent` expiry |
| Token-based public auth | Ping URL (unguessable token) |
| *(later)* queues, rate limiting, RBAC, billing, observability | v1.1 → v2.x roadmap |

---

## 17. Success metrics

**Technical (MVP):** evaluator reliably detects a missed ping within `period + grace + tick`; ping p95 latency held; **zero duplicate alerts** across restarts.

**Product (if launched):** time-to-first-check < 2 min; number of active checks & users; alert accuracy (false-positive rate ≈ 0).

---

## 18. Open questions & risks

- **Evaluator scaling ceiling:** in-process `setInterval` is perfect for MVP but won't survive multiple backend instances (double alerts) — the v2 queue + distributed lock resolves this. *Documented, accepted for MVP.*
- **Hosting sleep:** free-tier hosts that idle the process (e.g. Render free) would pause the evaluator — pick a host that keeps the process alive, or run the evaluator as a separate always-on worker.
- **Email deliverability:** deferred by starting with Discord/Slack webhooks (no deliverability headaches).
- **Timezone/clock correctness:** only relevant once cron-expression schedules land (v1.1).

---

*End of PRD v0.1 — living document; update the version table on change.*

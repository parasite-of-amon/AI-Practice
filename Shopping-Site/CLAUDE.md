# TaskBoard — Multi-Agent Web Application

A full-stack task management app built with JavaScript, Node.js, Express, and DuckDB.
This project is developed by a team of specialized Claude Code agents.

## Tech Stack
- **Backend**: Node.js 20+, Express 4
- **Database**: DuckDB (embedded, file-based at `data/app.duckdb`)
- **Frontend**: HTML5, CSS3 (custom properties), Vanilla ES6 JS modules
- **Testing**: Jest (unit + integration), Playwright (E2E)
- **Dev**: nodemon, ESLint, Prettier

## Agent Roles & Commands

| Command | Agent | Responsibility |
|---------|-------|---------------|
| `/pm` | Product Manager | Requirements, user stories, backlog |
| `/eng-mgr` | Engineering Manager | Task breakdown, coordination, architecture |
| `/swe` | Software Engineer | Node.js backend, DuckDB models, REST API |
| `/qa` | QA Engineer | Test plans, Jest tests, Playwright E2E, bug reports |
| `/ui` | UI Engineer | HTML/CSS/JS frontend, responsive design, accessibility |
| `/build-app` | Orchestrator | Full pipeline: PM → Eng Mgr → SWE+UI (parallel) → QA |

## How Agents Collaborate

```
User Request
     │
     ▼
  /pm  ──── writes user stories ──────────────────────────────► docs/backlog.json
     │
     ▼
/eng-mgr ── breaks into tasks ─────────────────────────────────► docs/tasks.json
     │
     ├──── spawns /swe (backend tasks) ─────► src/routes/, src/models/, src/db/
     │
     ├──── spawns /ui  (frontend tasks) ────► src/public/
     │
     └──── spawns /qa  (after above) ───────► tests/, docs/bugs.json
```

Use `/build-app <feature description>` to run the full pipeline automatically.

## Project Structure
```
.claude/commands/     — Agent skill definitions (pm, eng-mgr, swe, qa, ui, build-app)
src/
  app.js              — Express app (no server.listen)
  server.js           — Entry point
  db/database.js      — DuckDB singleton + migrations
  routes/tasks.js     — REST API routes
  models/tasks.js     — Data access layer
  middleware/         — errorHandler, validate
  public/             — Static frontend (HTML, CSS, JS)
tests/
  unit/               — Jest model tests
  integration/        — Jest + supertest API tests
  e2e/                — Playwright browser tests
  helpers/            — Shared test utilities
docs/
  backlog.json        — Product backlog (managed by /pm)
  tasks.json          — Engineering tasks (managed by /eng-mgr)
  bugs.json           — Bug reports (managed by /qa)
  adr.md              — Architecture decisions
data/                 — DuckDB database file (gitignored)
```

## Running the App
```bash
npm install
npm run dev        # development with auto-reload
npm start          # production
npm test           # unit + integration tests
npm run test:e2e   # Playwright E2E (requires server running on :3000)
```

## API Reference
```
GET    /api/tasks?status=&priority=   List tasks (filterable)
POST   /api/tasks                     Create task { title, body, status, priority }
GET    /api/tasks/:id                 Get single task
PUT    /api/tasks/:id                 Update task
DELETE /api/tasks/:id                 Delete task
GET    /health                        Health check
```

## Code Conventions
- All DB queries go through `src/models/` — no raw SQL in routes
- Routes handle only HTTP: parse → call model → respond
- Response shape: `{ data: ..., error: null }` or `{ data: null, error: "..." }`
- Frontend: all API calls go through `src/public/js/api.js`
- No `console.log` in production code

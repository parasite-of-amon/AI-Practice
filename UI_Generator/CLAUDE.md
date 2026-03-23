# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server (Next.js + Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm run test         # Run all Vitest tests
npx vitest run src/path/to/__tests__/file.test.ts  # Run a single test file

# Database
npm run setup        # Initial setup: install deps + Prisma generate + migrate
npm run db:reset     # Reset database (destructive)
npx prisma studio    # Open Prisma database GUI
```

## Architecture

**UIGen** is an AI-powered React component generator. Users describe components in natural language; Claude generates them with live preview — no files written to disk.

### Request Flow

```
User message → ChatInterface → POST /api/chat
    → Claude (claude-haiku-4-5) with streaming
    → Tools: str_replace_editor + file_manager update VirtualFileSystem
    → FileSystemContext broadcasts changes
    → CodeEditor reflects new files
    → PreviewFrame re-transpiles via Babel standalone → iframe refresh
    → If authenticated: project auto-saved to SQLite
```

### Key Modules

| Path | Purpose |
|------|---------|
| `src/app/api/chat/route.ts` | Streaming AI endpoint — receives messages + VFS state, calls Claude, saves project |
| `src/lib/file-system.ts` | In-memory VirtualFileSystem class — all file operations go through here |
| `src/lib/contexts/file-system-context.tsx` | React context wrapping VFS; drives editor and preview |
| `src/lib/contexts/chat-context.tsx` | Chat state, calls `/api/chat`, handles streaming |
| `src/lib/tools/str-replace.ts` | Claude tool: create/edit files via str-replace semantics |
| `src/lib/tools/file-manager.ts` | Claude tool: delete/rename files |
| `src/lib/transform/jsx-transformer.ts` | Converts virtual JSX files to renderable HTML for iframe preview |
| `src/lib/provider.ts` | Returns Anthropic or mock provider depending on `ANTHROPIC_API_KEY` |
| `src/lib/prompts/generation.tsx` | System prompt sent to Claude for component generation |
| `src/lib/auth.ts` | JWT session management (7-day, httpOnly cookies) |
| `src/actions/` | Server Actions for auth (sign up/in/out) and project CRUD |
| `src/middleware.ts` | Protects routes; redirects unauthenticated users |

### Data Persistence

- **Database:** SQLite via Prisma (`prisma/dev.db`)
- **Schema:** `User` (email + bcrypt password) → `Project` (messages as JSON, VFS snapshot as JSON)
- Anonymous users can generate without an account; projects only persist for authenticated users

### Environment

- `ANTHROPIC_API_KEY` — optional; app falls back to a mock provider if absent
- Node compatibility shim loaded via `NODE_OPTIONS='--require ./node-compat.cjs'` in all scripts

### Testing

Tests live in `__tests__/` directories co-located with source files. Uses Vitest + React Testing Library + jsdom. Key test areas: VirtualFileSystem, JSX transformer, chat/file-system contexts.

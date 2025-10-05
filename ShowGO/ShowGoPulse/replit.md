# ShowGo - Music Events Discovery Platform

## Overview

ShowGo is a modern web application for discovering and browsing music events. Built as a full-stack TypeScript application, it features a React frontend with a Node.js/Express backend. The platform displays curated music events across different genres (Rock, Jazz, Classical, India) with detailed information including venue, date, time, location, and descriptive tags. Users can filter events by category using an intuitive button interface. The application uses a clean, dark-themed UI with smooth animations and responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing instead of React Router
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- shadcn/ui component library (New York style variant) built on Radix UI primitives
- Tailwind CSS for utility-first styling with CSS variables for theming
- Custom dark theme with purple primary color (`hsl(271 81% 56%)`)
- Comprehensive component library including dialogs, toasts, forms, carousels, and data displays

**State Management**
- TanStack Query handles all server state (events data)
- React hooks for local component state
- Custom toast notification system via `use-toast` hook

**Design Patterns**
- Component composition using Radix UI's slot pattern for flexible, accessible components
- Intersection Observer API for scroll-triggered fade-in animations on event cards
- Custom utility functions (`cn`) for conditional className merging with tailwind-merge

### Backend Architecture

**Server Framework**
- Express.js as the web server framework
- TypeScript throughout for type safety
- ESM (ES Modules) instead of CommonJS

**API Structure**
- RESTful API endpoints under `/api` prefix:
  - `GET /api/events` - Retrieve all events
  - `GET /api/events/:id` - Retrieve single event
  - `POST /api/events` - Create new event (admin functionality)
- Zod schemas for request validation using `drizzle-zod` integration

**Data Storage Pattern**
- Storage interface pattern (`IStorage`) for abstraction and testability
- Currently implements `MemStorage` (in-memory storage) with hardcoded sample events
- Designed to be swappable with database-backed implementation (PostgreSQL ready via Drizzle ORM)
- Pre-populated with 8 sample events across Rock, Jazz, Classical, and India categories
- Each event includes descriptive tags for better discoverability

**Development Features**
- Custom logging middleware tracking API request duration and responses (truncated to 80 chars)
- Raw body preservation for webhook integrations
- Vite middleware integration in development mode for HMR
- Replit-specific plugins for development (cartographer, dev banner, runtime error overlay)

### Data Layer

**ORM & Database**
- Drizzle ORM configured for PostgreSQL dialect
- Schema defined in `shared/schema.ts` for code sharing between client and server
- Database migrations output to `./migrations` directory
- Connection via `@neondatabase/serverless` for Neon PostgreSQL

**Schema Design**
- **Users Table**: Basic authentication with username/password (UUID primary keys)
- **Events Table**: Comprehensive event data including:
  - Descriptive fields: name, description, category, tags (text array)
  - Location data: location, venue
  - Temporal data: date (text), time (text)
  - Media: imageUrl for event imagery
  - Metadata: createdAt timestamp, UUID primary key

**Type Safety**
- Drizzle generates TypeScript types from schema
- Zod schemas created from Drizzle schemas for runtime validation
- Shared type definitions between frontend and backend via `shared/` directory

### Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # React components (UI library + custom)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities (queryClient, utils)
│   │   ├── pages/       # Route components
│   │   └── index.css    # Global styles and CSS variables
│   └── index.html       # Entry HTML
├── server/              # Backend Express application
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Data storage abstraction
│   └── vite.ts          # Vite dev server integration
├── shared/              # Shared code between client and server
│   └── schema.ts        # Database schema and types
└── migrations/          # Database migration files (generated)
```

**Path Aliases**
- `@/` → `client/src/` (frontend imports)
- `@shared/` → `shared/` (shared types and schemas)
- `@assets/` → `attached_assets/` (static assets)

### Build & Deployment

**Development**
- Single command starts both Vite dev server and Express server
- Vite middleware integrated into Express for seamless HMR
- TypeScript compilation via `tsx` for instant server restarts

**Production Build**
- Frontend: Vite builds optimized bundle to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js` (ESM format, external packages)
- Static file serving from built frontend in production mode

**Database Management**
- `db:push` command for schema synchronization (Drizzle Kit push)
- No automated migrations in current setup (push-based workflow)

## External Dependencies

### Core Services
- **Database**: PostgreSQL via Neon serverless (`@neondatabase/serverless`)
- **Image Hosting**: Unsplash for event imagery (hardcoded URLs in sample data)

### Key Third-Party Libraries

**Frontend**
- `@radix-ui/*` - Headless UI primitives for accessibility
- `@tanstack/react-query` - Server state management
- `wouter` - Lightweight routing
- `react-hook-form` with `@hookform/resolvers` - Form management
- `zod` - Runtime type validation
- `date-fns` - Date manipulation
- `embla-carousel-react` - Carousel functionality
- `cmdk` - Command palette component
- `class-variance-authority` - CSS variant management
- `tailwindcss` - Utility-first CSS framework

**Backend**
- `express` - Web server framework
- `drizzle-orm` - Type-safe ORM
- `drizzle-zod` - Zod schema generation from Drizzle
- `connect-pg-simple` - PostgreSQL session store (included but not actively used)

**Development**
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React plugin for Vite
- `typescript` - Type checking
- `tsx` - TypeScript execution
- `esbuild` - Production bundling
- `@replit/*` plugins - Replit platform integration

### Future Integration Points
- Authentication system (users table exists but not implemented)
- PostgreSQL database connection (schema ready, currently using in-memory storage)
- Session management (connect-pg-simple installed)
- Admin panel for event management (POST endpoint exists but no UI)
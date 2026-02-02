# Next.js Starter Skeleton – Specification

## Purpose

Create a **production-ready Next.js skeleton application** that can be reused as the starting point for _any future Next.js project_. This repository should establish consistent architecture, conventions, and best practices, so new projects start from a solid, opinionated baseline rather than a blank slate.

This document is intended to be passed directly to **Claude Code** as implementation instructions.

---

## Core Technology Stack (Mandatory)

Claude **must** use the following technologies and patterns:

- **Next.js**
  - App Router (`/app` directory)
  - Server Components by default
  - Route Handlers for APIs

- **TypeScript** (strict mode enabled)
- **Tailwind CSS**
- **shadcn/ui** for UI primitives
- **NextAuth (Auth.js)**
- **Prisma ORM**
- **PostgreSQL** (local dev via connection string)

> When selecting dependency versions, choose **stable, well‑proven versions that work well together**. Avoid bleeding‑edge releases unless clearly stable and widely adopted.

---

## Project Goals

- Act as a **clean, extensible foundation** for future apps
- Sensible defaults, not over‑engineered
- Clear separation of concerns
- Easy to reason about, easy to extend
- Opinionated but not restrictive

---

## Authentication & Authorization

### Authentication Requirements

- Implement **username/email + password authentication** using **NextAuth**
- Credentials validated against a **local PostgreSQL database** via Prisma
- Passwords **must be securely hashed** (e.g. bcrypt)

### Auth Screens

Create the following routes and pages:

- `/login`
- `/register`

Requirements:

- Clean, accessible UI using shadcn components
- Shared layout and styling
- Validation with helpful error messages
- Loading and disabled states

### Session Handling

- Protected routes must require authentication
- Unauthenticated users attempting access should be redirected to `/login`
- Session available via server components and client hooks

---

## Database & Prisma

### Prisma Setup

- Prisma configured for PostgreSQL
- Schema written clearly and idiomatically
- Migrations enabled

### Required Models

At minimum:

```prisma
User
Role
```

Suggested relationships:

- Users belong to one Role
- Roles can be reused across users

Fields should include (at minimum):

- User
  - id
  - email / username
  - hashed password
  - roleId
  - timestamps

- Role
  - id
  - name (e.g. "user", "admin")

Claude may add additional sensible fields if justified.

---

## Seed Script

### Seed Script Requirements

- A Prisma seed script must be provided
- Script must:
  - **Delete all existing data**
  - Reset the database to known fixtures
  - Create:
    - 1 standard user
    - 1 admin user

- Credentials should be clearly documented (non‑production)

### Execution

- Seed script must be runnable via a **single npm script**, e.g.:

```bash
npm run db:seed
```

- Script should be idempotent and safe for local development

---

## Application Layout

### Protected App Layout

All authenticated pages should share a common layout.

Layout requirements:

- **Top Navigation Bar**
- **Side Navigation (Sidebar)**
- **Main Content Area**

### Sidebar

- Collapsible (expand / collapse)
- Contains example navigation sections and items
- Icons + labels when expanded
- Icons only when collapsed

### Top Navigation

Must include:

- App / project title or logo placeholder
- **Theme toggle** (dark / light)
- **User avatar**
- User dropdown menu containing:
  - Preferences (placeholder route)
  - Logout

---

## Theme & Styling

### Dark / Light Mode

- App must support **dark and light modes**
- **Default to dark mode**
- Mode switchable via button in top nav
- Theme preference should persist (e.g. localStorage)

### Theme Configuration

- Provide a **central, easy‑to‑edit theme configuration file**
- Define semantic colors for both themes, e.g.:
  - background
  - surface
  - primary
  - secondary
  - accent
  - muted
  - border

### Tailwind Usage Rules

- Avoid raw utility colors like `red-500`, `blue-600`, etc.
- Prefer **named semantic tokens**, e.g.:
  - `bg-background`
  - `text-primary`
  - `border-border`

- Colors must be used **consistently across the app**

---

## Content Area Behavior

- Main content area should be scrollable
- Include a **sticky page header/title area** within the content region
- Header area intended for:
  - Page title
  - Optional actions (buttons, filters, etc.)

---

## Code Quality & Conventions

### Formatting

- All files must follow **Prettier** defaults
- Consistent formatting across:
  - TypeScript
  - React components
  - Prisma schema

### Best Practices

Claude should:

- Use idiomatic Next.js App Router patterns
- Keep server and client components clearly separated
- Avoid unnecessary client components
- Use environment variables correctly
- Provide sensible folder structure
- Write readable, maintainable code

---

## Configuration & Environment

- Provide `.env.example` with all required variables
- Clear instructions in `README.md` for:
  - Installing dependencies
  - Setting up database
  - Running migrations
  - Seeding the database
  - Starting the dev server

---

## Documentation

A concise but clear `README.md` must be included covering:

- What this project is
- Tech stack overview
- Setup steps
- Available npm scripts
- Authentication notes
- Seeding instructions

---

## Suggested Extras (If Sensible)

If you believe they add value without over‑complicating the starter, consider including:

- Basic **route-based authorization** example (admin-only page)
- ESLint configuration aligned with Next.js + TypeScript best practices
- Example protected dashboard page
- Example empty public page
- Reusable layout components (AppShell, Sidebar, TopNav)
- Typed Prisma client exports

Do **not** add features that significantly increase complexity or opinionation without strong justification.

---

## Final Notes

This project should feel like a **solid internal starter kit** used by a professional team:

- Predictable
- Clean
- Boring in the best possible way

Prioritise clarity, maintainability, and real‑world usability over cleverness.

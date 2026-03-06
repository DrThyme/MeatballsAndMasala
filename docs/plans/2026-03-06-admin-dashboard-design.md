# Admin Dashboard Design

## Goal

A hidden admin page where Priya and Tim can view, export, and manage RSVP responses. Not linked from the public site.

## Approach

Server-rendered Astro page with API routes (Approach A). No new dependencies. Uses the existing Astro + better-sqlite3 stack.

## Authentication

- Password stored as `ADMIN_PASSWORD` environment variable
- `POST /api/admin/login`: receives `{ password }`, compares against env var, sets `admin_session` cookie (HttpOnly, SameSite=Strict, 24h expiry) with HMAC-signed token
- Token: HMAC-SHA256 of a timestamp using the password as key
- `GET /api/admin/logout`: clears cookie, redirects to `/admin`
- `/admin` page checks cookie server-side; renders login form if invalid/missing
- Helper module: `src/lib/admin-auth.ts` with `createToken()`, `verifyToken()`, `isAuthenticated(cookie)`

## Admin Dashboard Page

**Route:** `/admin` (`src/pages/admin/index.astro`)

Server-side logic:
- Check cookie auth; if invalid, render login form
- If authenticated, query `SELECT * FROM rsvps ORDER BY created_at DESC`
- Pass data as props to the template

### Summary Cards

Displayed at the top:
- Total responses
- Attending / Declining count
- Total guests (sum of guest_count)
- Total rooms needed (single + double)

### RSVP Table

Columns: Name, Email, Attending (Yes/No), Guests, Events, Dietary, Lodging, Rooms, Date

Each row has a delete button with a confirmation prompt.

### Action Bar

- "Export CSV" button (hits `GET /api/admin/export`)
- "Logout" button

### Styling

Matches the wedding site: dark teal background, gold accents, cream text. Table uses subtle gold borders. Summary cards use gold-bordered styling. Delete buttons in muted red.

## API Endpoints

All under `src/pages/api/admin/`:

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/admin/login` | POST | No | Validate password, set session cookie |
| `/api/admin/logout` | GET | Yes | Clear session cookie, redirect to `/admin` |
| `/api/admin/export` | GET | Yes | Return all RSVPs as CSV download |
| `/api/admin/rsvp/[id]` | DELETE | Yes | Delete a single RSVP by ID |

Protected endpoints verify the `admin_session` cookie HMAC token. Return 401 if invalid.

## Files to Create

- `src/lib/admin-auth.ts` — token creation, verification, cookie helpers
- `src/pages/admin/index.astro` — admin dashboard page (login + dashboard)
- `src/pages/api/admin/login.ts` — login endpoint
- `src/pages/api/admin/logout.ts` — logout endpoint
- `src/pages/api/admin/export.ts` — CSV export endpoint
- `src/pages/api/admin/rsvp/[id].ts` — delete RSVP endpoint

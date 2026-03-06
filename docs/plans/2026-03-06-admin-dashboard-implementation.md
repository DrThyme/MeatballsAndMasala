# Admin Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a password-protected admin page to view, export, and delete RSVP responses.

**Architecture:** Server-rendered Astro page at `/admin` with cookie-based auth. API routes handle login, logout, CSV export, and deletion. Auth helper module signs/verifies HMAC tokens stored in HttpOnly cookies.

**Tech Stack:** Astro 5 (SSR with @astrojs/node), better-sqlite3, Node.js crypto (HMAC-SHA256). No new dependencies.

---

### Task 1: Auth Helper Module

**Files:**
- Create: `src/lib/admin-auth.ts`

**Step 1: Create the auth helper**

```typescript
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'admin_session';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error('ADMIN_PASSWORD env var is not set');
  return secret;
}

export function checkPassword(input: string): boolean {
  const expected = getSecret();
  if (input.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(input), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function createToken(): string {
  const timestamp = Date.now().toString();
  const hmac = createHmac('sha256', getSecret()).update(timestamp).digest('hex');
  return `${timestamp}.${hmac}`;
}

export function verifyToken(token: string): boolean {
  const [timestamp, hmac] = token.split('.');
  if (!timestamp || !hmac) return false;

  const age = Date.now() - Number(timestamp);
  if (isNaN(age) || age < 0 || age > TOKEN_TTL_MS) return false;

  const expected = createHmac('sha256', getSecret()).update(timestamp).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isAuthenticated(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return false;
  return verifyToken(match[1]);
}

export function sessionCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400`;
}

export function clearCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}
```

**Step 2: Verify**

Run: `npx astro check` (or `npx tsc --noEmit` if available) to confirm no type errors.

**Step 3: Commit**

```bash
git add src/lib/admin-auth.ts
git commit -m "feat: add admin auth helper with HMAC token signing"
```

---

### Task 2: Login API Endpoint

**Files:**
- Create: `src/pages/api/admin/login.ts`

**Step 1: Create the login endpoint**

```typescript
import type { APIRoute } from 'astro';
import { checkPassword, createToken, sessionCookie } from '../../../lib/admin-auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { password } = await request.json();

    if (!password || !checkPassword(password)) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = createToken();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': sessionCookie(token),
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

**Step 2: Commit**

```bash
git add src/pages/api/admin/login.ts
git commit -m "feat: add POST /api/admin/login endpoint"
```

---

### Task 3: Logout API Endpoint

**Files:**
- Create: `src/pages/api/admin/logout.ts`

**Step 1: Create the logout endpoint**

```typescript
import type { APIRoute } from 'astro';
import { clearCookie } from '../../../lib/admin-auth';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/admin',
      'Set-Cookie': clearCookie(),
    },
  });
};
```

**Step 2: Commit**

```bash
git add src/pages/api/admin/logout.ts
git commit -m "feat: add GET /api/admin/logout endpoint"
```

---

### Task 4: Delete RSVP API Endpoint

**Files:**
- Create: `src/pages/api/admin/rsvp/[id].ts`

**Step 1: Create the delete endpoint**

```typescript
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/admin-auth';
import db from '../../../../lib/db';

export const prerender = false;

export const DELETE: APIRoute = async ({ params, request }) => {
  if (!isAuthenticated(request.headers.get('cookie'))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = db.prepare('DELETE FROM rsvps WHERE id = ?').run(id);

  if (result.changes === 0) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

**Step 2: Commit**

```bash
git add src/pages/api/admin/rsvp/\[id\].ts
git commit -m "feat: add DELETE /api/admin/rsvp/[id] endpoint"
```

---

### Task 5: CSV Export API Endpoint

**Files:**
- Create: `src/pages/api/admin/export.ts`

**Step 1: Create the export endpoint**

```typescript
import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/admin-auth';
import db from '../../../lib/db';

export const prerender = false;

interface RsvpRow {
  id: number;
  name: string;
  email: string;
  attending: number;
  guest_count: number | null;
  events: string | null;
  dietary: string | null;
  lodging: number | null;
  single_rooms: number | null;
  double_rooms: number | null;
  created_at: string;
}

function escapeCsv(value: string | number | null): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const GET: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request.headers.get('cookie'))) {
    return new Response('Unauthorized', { status: 401 });
  }

  const rows = db.prepare('SELECT * FROM rsvps ORDER BY created_at DESC').all() as RsvpRow[];

  const headers = ['ID', 'Name', 'Email', 'Attending', 'Guests', 'Events', 'Dietary', 'Lodging', 'Single Rooms', 'Double Rooms', 'Date'];
  const csvRows = rows.map((r) =>
    [r.id, r.name, r.email, r.attending ? 'Yes' : 'No', r.guest_count, r.events, r.dietary, r.lodging ? 'Yes' : 'No', r.single_rooms, r.double_rooms, r.created_at]
      .map(escapeCsv)
      .join(',')
  );

  const csv = [headers.join(','), ...csvRows].join('\n');

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="rsvp-export-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
};
```

**Step 2: Commit**

```bash
git add src/pages/api/admin/export.ts
git commit -m "feat: add GET /api/admin/export CSV endpoint"
```

---

### Task 6: Admin Dashboard Page

**Files:**
- Create: `src/pages/admin/index.astro`

**Step 1: Create the admin page**

This is the largest file. It renders either a login form or the dashboard based on auth state.

Key sections:
- **Frontmatter:** check `isAuthenticated()`, if yes query all RSVPs and compute summary stats
- **Login form:** simple password input + submit button, inline `<script>` POSTs to `/api/admin/login`, redirects on success
- **Dashboard:** summary cards (total, attending, declining, guests, rooms), RSVP table, export + logout buttons
- **Delete handling:** inline `<script>` that calls `DELETE /api/admin/rsvp/{id}` with a `confirm()` prompt, reloads on success
- **Styling:** dark teal background, gold accents, cream text — matching the wedding site. Use CSS variables from `global.css`

The page imports `global.css` for the base variables and fonts. No `BaseLayout` wrapper (no nav/footer needed for admin).

```astro
---
import '../styles/global.css';
import { isAuthenticated } from '../../lib/admin-auth';
import db from '../../lib/db';

export const prerender = false;

interface RsvpRow {
  id: number;
  name: string;
  email: string;
  attending: number;
  guest_count: number | null;
  events: string | null;
  dietary: string | null;
  lodging: number | null;
  single_rooms: number | null;
  double_rooms: number | null;
  created_at: string;
}

const authed = isAuthenticated(Astro.request.headers.get('cookie'));

let rsvps: RsvpRow[] = [];
let stats = { total: 0, attending: 0, declining: 0, guests: 0, singleRooms: 0, doubleRooms: 0 };

if (authed) {
  rsvps = db.prepare('SELECT * FROM rsvps ORDER BY created_at DESC').all() as RsvpRow[];
  stats.total = rsvps.length;
  stats.attending = rsvps.filter(r => r.attending).length;
  stats.declining = stats.total - stats.attending;
  stats.guests = rsvps.reduce((sum, r) => sum + (r.guest_count || 0), 0);
  stats.singleRooms = rsvps.reduce((sum, r) => sum + (r.single_rooms || 0), 0);
  stats.doubleRooms = rsvps.reduce((sum, r) => sum + (r.double_rooms || 0), 0);
}
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin — RSVP Dashboard</title>
    <meta name="robots" content="noindex, nofollow" />
  </head>
  <body class="admin-body">
    {!authed ? (
      <div class="login-container">
        <h1 class="login-title">Admin Login</h1>
        <form id="login-form" class="login-form">
          <input type="password" id="login-password" placeholder="Password" required />
          <button type="submit">Log In</button>
          <p id="login-error" class="login-error" hidden>Invalid password</p>
        </form>
      </div>
    ) : (
      <div class="dashboard">
        <header class="dashboard-header">
          <h1>RSVP Dashboard</h1>
          <div class="header-actions">
            <a href="/api/admin/export" class="btn btn-export">Export CSV</a>
            <a href="/api/admin/logout" class="btn btn-logout">Logout</a>
          </div>
        </header>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">{stats.total}</span>
            <span class="stat-label">Total Responses</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{stats.attending}</span>
            <span class="stat-label">Attending</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{stats.declining}</span>
            <span class="stat-label">Declining</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{stats.guests}</span>
            <span class="stat-label">Total Guests</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{stats.singleRooms} / {stats.doubleRooms}</span>
            <span class="stat-label">Single / Double Rooms</span>
          </div>
        </div>

        <div class="table-container">
          {rsvps.length === 0 ? (
            <p class="no-data">No RSVP responses yet.</p>
          ) : (
            <table class="rsvp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Attending</th>
                  <th>Guests</th>
                  <th>Events</th>
                  <th>Dietary</th>
                  <th>Lodging</th>
                  <th>Rooms</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((r) => (
                  <tr>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.attending ? 'Yes' : 'No'}</td>
                    <td>{r.guest_count ?? '—'}</td>
                    <td>{r.events ?? '—'}</td>
                    <td>{r.dietary || '—'}</td>
                    <td>{r.lodging ? 'Yes' : r.lodging === 0 ? 'No' : '—'}</td>
                    <td>{r.lodging ? `${r.single_rooms}S / ${r.double_rooms}D` : '—'}</td>
                    <td>{r.created_at}</td>
                    <td>
                      <button class="btn-delete" data-id={r.id}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )}
  </body>
</html>

<!-- see Step 2 for <style> and Step 3 for <script> -->
```

**Step 2: Add styles**

Add a `<style>` block at the end of the file. Key styles:
- `.admin-body`: `background-color: var(--color-base-dark); color: var(--color-cream); font-family: var(--font-body); padding: 2rem;`
- `.login-container`: centered, max-width 400px, vertically centered with flexbox
- `.login-title`: `font-family: var(--font-script); color: var(--color-cream);`
- Login input: styled like RSVP form inputs (dark bg, gold border)
- Login button: styled like RSVP submit (gold bg, dark text)
- `.dashboard-header`: flex row, space-between, margin-bottom
- `.stats-grid`: CSS grid, `repeat(auto-fit, minmax(150px, 1fr))`, gap 1rem
- `.stat-card`: gold border, padding, centered text, `stat-value` in gold large font
- `.rsvp-table`: width 100%, border-collapse, gold borders `rgba(200,150,62,0.3)`
- `th`: gold-light color, left-aligned, border-bottom
- `td`: cream color, border-bottom `rgba(200,150,62,0.15)`
- `.btn-export`: gold bg, dark text
- `.btn-logout`: transparent, gold border
- `.btn-delete`: muted red `rgba(139,45,45,0.8)`, small
- `.table-container`: `overflow-x: auto` for mobile

**Step 3: Add scripts**

Add `<script>` blocks:

Login script (only rendered when `!authed`):
```javascript
const form = document.getElementById('login-form');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('login-password').value;
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (res.ok) {
    window.location.reload();
  } else {
    document.getElementById('login-error').hidden = false;
  }
});
```

Delete script (only rendered when `authed`):
```javascript
document.querySelectorAll('.btn-delete').forEach((btn) => {
  btn.addEventListener('click', async () => {
    if (!confirm('Delete this RSVP response?')) return;
    const id = btn.dataset.id;
    const res = await fetch(`/api/admin/rsvp/${id}`, { method: 'DELETE' });
    if (res.ok) window.location.reload();
    else alert('Failed to delete');
  });
});
```

**Step 4: Verify manually**

1. Set env var: `ADMIN_PASSWORD=test123`
2. Run: `npm run dev`
3. Visit `/admin` — should see login form
4. Enter wrong password — should show error
5. Enter correct password — should see dashboard
6. If RSVPs exist, check table renders. Try delete, try export.

**Step 5: Commit**

```bash
git add src/pages/admin/index.astro
git commit -m "feat: add admin dashboard page with login, stats, table, and delete"
```

---

### Task 7: Add .env.example Entry

**Files:**
- Modify: `.env.example` (create if it doesn't exist)

**Step 1: Document the required env var**

Add to `.env.example`:
```
ADMIN_PASSWORD=changeme
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add ADMIN_PASSWORD to .env.example"
```

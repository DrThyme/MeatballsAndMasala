# RSVP Implementation Design

## Summary

Replace the RSVP placeholder with a working form that collects guest responses and stores them in a self-hosted SQLite database, using Astro API routes.

## Form Fields

| Field | Type | Required | Condition |
|-------|------|----------|-----------|
| Name | text | yes | always |
| Email | email | yes | always |
| Attending | yes/no radio | yes | always |
| Number of guests | number (1-10) | yes | if attending |
| Events attending | checkboxes: Haldi & Mehendi, Wedding | yes | if attending |
| Dietary restrictions | text area | no | if attending |
| Lodging needed | yes/no radio | no | if attending |
| Single rooms | number (0-5) | yes | if lodging = yes |
| Double rooms | number (0-5) | yes | if lodging = yes |

At least one of single/double rooms must be > 0 if lodging is selected.

## Database Schema

SQLite, stored at `data/rsvp.db` (auto-created on first request).

```sql
CREATE TABLE rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  attending INTEGER NOT NULL,
  guest_count INTEGER,
  events TEXT,
  dietary TEXT,
  lodging INTEGER,
  single_rooms INTEGER,
  double_rooms INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);
```

No unique constraint on email — duplicate submissions are kept.

## Architecture

- **Astro adapter:** `@astrojs/node` with `output: 'hybrid'` (pages stay static, only API routes are server-rendered)
- **API route:** `POST /api/rsvp` at `src/pages/api/rsvp.ts`
  - Validates input server-side (required fields, email format, number ranges)
  - Inserts into SQLite via `better-sqlite3`
  - Returns `{ success: true }` on 200, or `{ errors: [...] }` on 400
- **Client form:** Vanilla JS `fetch()` on submit, no framework
  - Client-side validation for immediate feedback
  - Conditional field visibility via JS
- **No auth** — open to anyone with the link

## UI/UX Flow

1. **Default** — form visible
2. **Not attending** — hides all fields except name, email, submit
3. **Attending** — reveals guest count, events, dietary, lodging
4. **Lodging = yes** — reveals single/double room fields
5. **Submitting** — button disabled, "Sending..." text
6. **Success** — form replaced with thank-you message (varies by attending yes/no)
7. **Error** — inline error messages per field

## Styling

Matches existing site: dark teal background, gold borders on inputs, cream text. Submit button same style as venue "Get directions" button.

## i18n

All form labels, validation messages, and success/error messages translated in en/sv/hi.

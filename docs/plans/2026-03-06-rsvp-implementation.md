# RSVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a working RSVP form to the wedding site that stores responses in a self-hosted SQLite database via Astro API routes.

**Architecture:** Switch Astro to hybrid SSR mode with the Node adapter. Add a `POST /api/rsvp` endpoint that validates form data and writes to SQLite via `better-sqlite3`. The Rsvp.astro component gets a real form with conditional fields and client-side JS for submission.

**Tech Stack:** Astro 5 (hybrid SSR), @astrojs/node, better-sqlite3, vanilla JS

**Design doc:** `docs/plans/2026-03-06-rsvp-design.md`

---

### Task 1: Install dependencies and configure Astro for SSR

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`

**Step 1: Install the Node adapter and better-sqlite3**

```bash
npm install @astrojs/node better-sqlite3
npm install -D @types/better-sqlite3
```

**Step 2: Update astro.config.mjs**

Replace the entire file with:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'hybrid',
  adapter: node({
    mode: 'standalone',
  }),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sv', 'hi'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

**Step 3: Verify the build still works**

```bash
npm run build
```

Expected: Build succeeds. Output now includes a `dist/server/` directory alongside `dist/client/`.

**Step 4: Commit**

```bash
git add package.json package-lock.json astro.config.mjs
git commit -m "feat: add @astrojs/node adapter and better-sqlite3 for RSVP backend"
```

---

### Task 2: Create the database module

**Files:**
- Create: `src/lib/db.ts`

**Step 1: Create the data directory gitkeep**

```bash
mkdir -p data
echo "*.db" > data/.gitignore
```

**Step 2: Create `src/lib/db.ts`**

```typescript
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbDir = join(__dirname, '..', '..', 'data');
const dbPath = join(dbDir, 'rsvp.db');

mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS rsvps (
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
  )
`);

export default db;
```

**Step 3: Verify it compiles**

```bash
npm run build
```

Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/lib/db.ts data/.gitignore
git commit -m "feat: add SQLite database module with RSVP schema"
```

---

### Task 3: Create the API route

**Files:**
- Create: `src/pages/api/rsvp.ts`

**Step 1: Create `src/pages/api/rsvp.ts`**

```typescript
import type { APIRoute } from 'astro';
import db from '../../lib/db';

interface RsvpBody {
  name?: string;
  email?: string;
  attending?: boolean;
  guestCount?: number;
  events?: string[];
  dietary?: string;
  lodging?: boolean;
  singleRooms?: number;
  doubleRooms?: number;
}

function validate(body: RsvpBody): string[] {
  const errors: string[] = [];

  if (!body.name || body.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('Valid email is required');
  }

  if (body.attending === undefined || body.attending === null) {
    errors.push('Please indicate if you are attending');
  }

  if (body.attending) {
    if (!body.guestCount || body.guestCount < 1 || body.guestCount > 10) {
      errors.push('Number of guests must be between 1 and 10');
    }

    if (!body.events || body.events.length === 0) {
      errors.push('Please select at least one event');
    }

    if (body.lodging) {
      const single = body.singleRooms ?? 0;
      const double = body.doubleRooms ?? 0;
      if (single + double < 1) {
        errors.push('Please select at least one room');
      }
      if (single < 0 || single > 5 || double < 0 || double > 5) {
        errors.push('Room count must be between 0 and 5');
      }
    }
  }

  return errors;
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: RsvpBody = await request.json();
    const errors = validate(body);

    if (errors.length > 0) {
      return new Response(JSON.stringify({ success: false, errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stmt = db.prepare(`
      INSERT INTO rsvps (name, email, attending, guest_count, events, dietary, lodging, single_rooms, double_rooms)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      body.name!.trim(),
      body.email!.trim().toLowerCase(),
      body.attending ? 1 : 0,
      body.attending ? body.guestCount : null,
      body.attending && body.events ? body.events.join(',') : null,
      body.attending && body.dietary ? body.dietary.trim() : null,
      body.attending ? (body.lodging ? 1 : 0) : null,
      body.attending && body.lodging ? (body.singleRooms ?? 0) : null,
      body.attending && body.lodging ? (body.doubleRooms ?? 0) : null,
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('RSVP error:', err);
    return new Response(JSON.stringify({ success: false, errors: ['Server error. Please try again.'] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

**Step 2: Verify the build**

```bash
npm run build
```

Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/pages/api/rsvp.ts
git commit -m "feat: add POST /api/rsvp endpoint with validation"
```

---

### Task 4: Add i18n strings for the RSVP form

**Files:**
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/sv.json`
- Modify: `src/i18n/hi.json`

**Step 1: Add English strings**

Add these keys to `src/i18n/en.json` (replace the existing `rsvp.message` key):

```json
"rsvp.message": "RSVP form coming soon! Please check back later.",
"rsvp.name": "Your name",
"rsvp.email": "Email address",
"rsvp.attending": "Will you be attending?",
"rsvp.attending.yes": "Joyfully accepts!",
"rsvp.attending.no": "Regretfully declines",
"rsvp.guestCount": "Number of guests (including yourself)",
"rsvp.events": "Which events will you attend?",
"rsvp.events.haldi": "Haldi & Mehendi (Sep 4)",
"rsvp.events.wedding": "Wedding Day (Sep 5)",
"rsvp.dietary": "Dietary restrictions or allergies",
"rsvp.dietary.placeholder": "e.g. vegetarian, nut allergy...",
"rsvp.lodging": "Do you need lodging at the venue?",
"rsvp.lodging.yes": "Yes, please!",
"rsvp.lodging.no": "No, thank you",
"rsvp.singleRooms": "Single rooms",
"rsvp.doubleRooms": "Double rooms",
"rsvp.submit": "Send RSVP",
"rsvp.submitting": "Sending...",
"rsvp.success.attending": "Thank you! We can't wait to celebrate with you!",
"rsvp.success.declining": "We'll miss you! Thank you for letting us know.",
"rsvp.error.server": "Something went wrong. Please try again."
```

**Step 2: Add Swedish strings**

Add these keys to `src/i18n/sv.json`:

```json
"rsvp.name": "Ditt namn",
"rsvp.email": "E-postadress",
"rsvp.attending": "Kommer du?",
"rsvp.attending.yes": "Tackar ja med glädje!",
"rsvp.attending.no": "Tackar tyvärr nej",
"rsvp.guestCount": "Antal gäster (inklusive dig själv)",
"rsvp.events": "Vilka evenemang kommer du på?",
"rsvp.events.haldi": "Haldi & Mehendi (4 sep)",
"rsvp.events.wedding": "Bröllopsdagen (5 sep)",
"rsvp.dietary": "Kostbehov eller allergier",
"rsvp.dietary.placeholder": "t.ex. vegetarian, nötallergi...",
"rsvp.lodging": "Behöver du boende vid slottet?",
"rsvp.lodging.yes": "Ja, tack!",
"rsvp.lodging.no": "Nej, tack",
"rsvp.singleRooms": "Enkelrum",
"rsvp.doubleRooms": "Dubbelrum",
"rsvp.submit": "Skicka OSA",
"rsvp.submitting": "Skickar...",
"rsvp.success.attending": "Tack! Vi kan inte vänta med att fira med dig!",
"rsvp.success.declining": "Vi kommer att sakna dig! Tack för att du meddelade oss.",
"rsvp.error.server": "Något gick fel. Försök igen."
```

**Step 3: Add Hindi strings**

Add these keys to `src/i18n/hi.json`:

```json
"rsvp.name": "आपका नाम",
"rsvp.email": "ईमेल पता",
"rsvp.attending": "क्या आप आ रहे हैं?",
"rsvp.attending.yes": "खुशी से स्वीकार है!",
"rsvp.attending.no": "दुख के साथ मना करते हैं",
"rsvp.guestCount": "मेहमानों की संख्या (आप सहित)",
"rsvp.events": "आप किन कार्यक्रमों में शामिल होंगे?",
"rsvp.events.haldi": "हल्दी और मेहंदी (4 सितंबर)",
"rsvp.events.wedding": "विवाह का दिन (5 सितंबर)",
"rsvp.dietary": "खानपान संबंधी प्रतिबंध या एलर्जी",
"rsvp.dietary.placeholder": "जैसे शाकाहारी, मूंगफली एलर्जी...",
"rsvp.lodging": "क्या आपको स्थान पर आवास चाहिए?",
"rsvp.lodging.yes": "हाँ, कृपया!",
"rsvp.lodging.no": "नहीं, धन्यवाद",
"rsvp.singleRooms": "सिंगल कमरे",
"rsvp.doubleRooms": "डबल कमरे",
"rsvp.submit": "RSVP भेजें",
"rsvp.submitting": "भेजा जा रहा है...",
"rsvp.success.attending": "धन्यवाद! हम आपके साथ जश्न मनाने के लिए बेसब्र हैं!",
"rsvp.success.declining": "हम आपकी कमी महसूस करेंगे! बताने के लिए धन्यवाद।",
"rsvp.error.server": "कुछ गड़बड़ हो गई। कृपया पुनः प्रयास करें।"
```

**Step 4: Commit**

```bash
git add src/i18n/en.json src/i18n/sv.json src/i18n/hi.json
git commit -m "feat: add RSVP form i18n strings for en/sv/hi"
```

---

### Task 5: Rewrite the Rsvp component with the form

**Files:**
- Modify: `src/components/Rsvp.astro` (full rewrite)

**Step 1: Rewrite `src/components/Rsvp.astro`**

```astro
---
import { t } from "../i18n/utils";
import LotusCorner from "./motifs/LotusCorner.astro";
import LotusVineBorder from "./motifs/LotusVineBorder.astro";
import GoldFrame from "./GoldFrame.astro";

interface Props {
  lang: string;
}

const { lang } = Astro.props;
---

<section id="rsvp" class="rsvp reveal">
  <GoldFrame>
    <div class="rsvp-motif-left">
      <LotusCorner size="100px" color="var(--color-gold)" opacity={0.18} />
    </div>
    <div class="rsvp-motif-right">
      <LotusCorner size="100px" color="var(--color-gold)" opacity={0.18} flip />
    </div>

    <h2 class="section-title">{t(lang, "rsvp.title")}</h2>
    <div class="rsvp-divider">
      <LotusVineBorder width="200px" />
    </div>

    <form id="rsvp-form" class="rsvp-form" data-lang={lang}>
      <div class="form-group">
        <label for="rsvp-name">{t(lang, "rsvp.name")}</label>
        <input type="text" id="rsvp-name" name="name" required />
      </div>

      <div class="form-group">
        <label for="rsvp-email">{t(lang, "rsvp.email")}</label>
        <input type="email" id="rsvp-email" name="email" required />
      </div>

      <div class="form-group">
        <label>{t(lang, "rsvp.attending")}</label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" name="attending" value="yes" required />
            <span>{t(lang, "rsvp.attending.yes")}</span>
          </label>
          <label class="radio-label">
            <input type="radio" name="attending" value="no" required />
            <span>{t(lang, "rsvp.attending.no")}</span>
          </label>
        </div>
      </div>

      <div id="attending-fields" class="conditional-fields" hidden>
        <div class="form-group">
          <label for="rsvp-guests">{t(lang, "rsvp.guestCount")}</label>
          <input type="number" id="rsvp-guests" name="guestCount" min="1" max="10" value="1" />
        </div>

        <div class="form-group">
          <label>{t(lang, "rsvp.events")}</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" name="events" value="haldi" />
              <span>{t(lang, "rsvp.events.haldi")}</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="events" value="wedding" />
              <span>{t(lang, "rsvp.events.wedding")}</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="rsvp-dietary">{t(lang, "rsvp.dietary")}</label>
          <textarea id="rsvp-dietary" name="dietary" rows="2" placeholder={t(lang, "rsvp.dietary.placeholder")}></textarea>
        </div>

        <div class="form-group">
          <label>{t(lang, "rsvp.lodging")}</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" name="lodging" value="yes" />
              <span>{t(lang, "rsvp.lodging.yes")}</span>
            </label>
            <label class="radio-label">
              <input type="radio" name="lodging" value="no" />
              <span>{t(lang, "rsvp.lodging.no")}</span>
            </label>
          </div>
        </div>

        <div id="lodging-fields" class="conditional-fields" hidden>
          <div class="room-row">
            <div class="form-group">
              <label for="rsvp-single">{t(lang, "rsvp.singleRooms")}</label>
              <input type="number" id="rsvp-single" name="singleRooms" min="0" max="5" value="0" />
            </div>
            <div class="form-group">
              <label for="rsvp-double">{t(lang, "rsvp.doubleRooms")}</label>
              <input type="number" id="rsvp-double" name="doubleRooms" min="0" max="5" value="0" />
            </div>
          </div>
        </div>
      </div>

      <div class="form-errors" id="form-errors" hidden></div>

      <button type="submit" class="rsvp-submit" id="rsvp-submit">
        {t(lang, "rsvp.submit")}
      </button>
    </form>

    <div id="rsvp-success" class="rsvp-success" hidden>
      <p id="rsvp-success-message"></p>
    </div>
  </GoldFrame>
</section>

<style>
  .rsvp {
    padding: var(--section-padding);
    position: relative;
  }

  .rsvp-motif-left {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    pointer-events: none;
  }

  .rsvp-motif-right {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    pointer-events: none;
  }

  .rsvp-divider {
    text-align: center;
    margin-top: -1rem;
    margin-bottom: 2rem;
  }

  .rsvp-form {
    max-width: 500px;
    margin: 0 auto;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-gold-light);
    font-weight: 500;
  }

  .form-group input[type="text"],
  .form-group input[type="email"],
  .form-group input[type="number"],
  .form-group textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(200, 150, 62, 0.4);
    border-radius: 6px;
    color: var(--color-cream);
    font-family: var(--font-body);
    font-size: 1rem;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--color-gold);
    box-shadow: 0 0 0 2px rgba(200, 150, 62, 0.2);
  }

  .form-group input[type="number"] {
    max-width: 120px;
  }

  .form-group textarea {
    resize: vertical;
  }

  .radio-group,
  .checkbox-group {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .radio-label,
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: var(--color-cream);
  }

  .radio-label input,
  .checkbox-label input {
    accent-color: var(--color-gold);
  }

  .room-row {
    display: flex;
    gap: 2rem;
  }

  .conditional-fields {
    transition: opacity 0.2s;
  }

  .conditional-fields[hidden] {
    display: none;
  }

  .form-errors {
    background: rgba(139, 45, 45, 0.3);
    border: 1px solid rgba(139, 45, 45, 0.6);
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    color: #f0a0a0;
    font-size: 0.9rem;
  }

  .form-errors[hidden] {
    display: none;
  }

  .form-errors ul {
    margin: 0;
    padding-left: 1.2rem;
  }

  .rsvp-submit {
    display: block;
    width: 100%;
    padding: 0.8rem 2rem;
    background-color: var(--color-gold);
    color: var(--color-base-dark);
    border: none;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    font-family: var(--font-body);
  }

  .rsvp-submit:hover {
    background-color: var(--color-gold-light);
  }

  .rsvp-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .rsvp-success {
    text-align: center;
    padding: 3rem 2rem;
    color: var(--color-cream);
    font-size: 1.2rem;
  }

  .rsvp-success[hidden] {
    display: none;
  }

  @media (max-width: 600px) {
    .rsvp-motif-left,
    .rsvp-motif-right {
      display: none;
    }

    .room-row {
      flex-direction: column;
      gap: 0;
    }
  }
</style>

<script>
  const form = document.getElementById('rsvp-form') as HTMLFormElement;
  const attendingFields = document.getElementById('attending-fields')!;
  const lodgingFields = document.getElementById('lodging-fields')!;
  const errorsDiv = document.getElementById('form-errors')!;
  const submitBtn = document.getElementById('rsvp-submit') as HTMLButtonElement;
  const successDiv = document.getElementById('rsvp-success')!;
  const successMsg = document.getElementById('rsvp-success-message')!;

  // Show/hide attending fields
  form.querySelectorAll('input[name="attending"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const val = (e.target as HTMLInputElement).value;
      attendingFields.hidden = val !== 'yes';
    });
  });

  // Show/hide lodging fields
  form.querySelectorAll('input[name="lodging"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const val = (e.target as HTMLInputElement).value;
      lodgingFields.hidden = val !== 'yes';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorsDiv.hidden = true;

    const formData = new FormData(form);
    const attending = formData.get('attending') === 'yes';

    const body: Record<string, unknown> = {
      name: formData.get('name'),
      email: formData.get('email'),
      attending,
    };

    if (attending) {
      body.guestCount = Number(formData.get('guestCount')) || 1;
      body.events = formData.getAll('events');
      body.dietary = formData.get('dietary') || '';
      body.lodging = formData.get('lodging') === 'yes';

      if (body.lodging) {
        body.singleRooms = Number(formData.get('singleRooms')) || 0;
        body.doubleRooms = Number(formData.get('doubleRooms')) || 0;
      }
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = submitBtn.closest('form')?.dataset.lang === 'sv'
      ? 'Skickar...'
      : submitBtn.closest('form')?.dataset.lang === 'hi'
        ? 'भेजा जा रहा है...'
        : 'Sending...';

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        errorsDiv.innerHTML = '<ul>' + data.errors.map((e: string) => `<li>${e}</li>`).join('') + '</ul>';
        errorsDiv.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }

      form.hidden = true;

      const lang = form.dataset.lang || 'en';
      const messages: Record<string, Record<string, string>> = {
        en: {
          attending: "Thank you! We can't wait to celebrate with you!",
          declining: "We'll miss you! Thank you for letting us know.",
        },
        sv: {
          attending: 'Tack! Vi kan inte vänta med att fira med dig!',
          declining: 'Vi kommer att sakna dig! Tack för att du meddelade oss.',
        },
        hi: {
          attending: 'धन्यवाद! हम आपके साथ जश्न मनाने के लिए बेसब्र हैं!',
          declining: 'हम आपकी कमी महसूस करेंगे! बताने के लिए धन्यवाद।',
        },
      };

      const msgSet = messages[lang] || messages.en;
      successMsg.textContent = attending ? msgSet.attending : msgSet.declining;
      successDiv.hidden = false;
    } catch {
      errorsDiv.innerHTML = '<ul><li>Something went wrong. Please try again.</li></ul>';
      errorsDiv.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
</script>
```

**Step 2: Verify the build**

```bash
npm run build
```

Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/Rsvp.astro
git commit -m "feat: replace RSVP placeholder with working form and client-side logic"
```

---

### Task 6: End-to-end test

**Step 1: Start the production server**

```bash
npm run build && node dist/server/entry.mjs &
```

**Step 2: Test submitting an RSVP (attending)**

```bash
curl -X POST http://localhost:4321/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Guest","email":"test@example.com","attending":true,"guestCount":2,"events":["haldi","wedding"],"dietary":"vegetarian","lodging":true,"singleRooms":1,"doubleRooms":1}'
```

Expected: `{"success":true}`

**Step 3: Test submitting an RSVP (declining)**

```bash
curl -X POST http://localhost:4321/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name":"Absent Friend","email":"absent@example.com","attending":false}'
```

Expected: `{"success":true}`

**Step 4: Test validation errors**

```bash
curl -X POST http://localhost:4321/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"bad","attending":true,"guestCount":0,"events":[]}'
```

Expected: `{"success":false,"errors":[...]}` with 400 status

**Step 5: Verify data is in the database**

```bash
sqlite3 data/rsvp.db "SELECT * FROM rsvps;"
```

Expected: 2 rows — one attending, one declining.

**Step 6: Kill the server and clean up test data**

```bash
kill %1
rm data/rsvp.db
```

**Step 7: Commit (only if any fixes were needed)**

---

### Task 7: Update RSVP i18n strings

**Files:**
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/sv.json`
- Modify: `src/i18n/hi.json`

**Step 1: Add RSVP form strings to all 3 i18n files**

See Task 4 for the exact strings to add. Remove the old `rsvp.message` key from all 3 files (it's replaced by the form).

**Step 2: Commit**

```bash
git add src/i18n/en.json src/i18n/sv.json src/i18n/hi.json
git commit -m "feat: add RSVP form i18n strings for en/sv/hi"
```

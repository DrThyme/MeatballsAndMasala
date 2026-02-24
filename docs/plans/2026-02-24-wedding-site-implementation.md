# Wedding Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a trilingual (EN/SV/HI) single-page wedding site with warm fusion aesthetics using Astro.

**Architecture:** Astro static site with built-in i18n routing (`prefix-other-locales`). Translation strings in JSON files, consumed via a `t()` helper. Section components composed into a single page per locale.

**Tech Stack:** Astro, TypeScript, CSS custom properties, Google Fonts (Noto family)

---

### Task 1: Initialize Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`

**Step 1: Scaffold Astro project**

Run:
```bash
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

**Step 2: Install dependencies**

Run:
```bash
npm install
```

**Step 3: Verify dev server starts**

Run:
```bash
npm run dev -- --host 0.0.0.0 &
sleep 3
curl -s http://localhost:4321 | head -20
kill %1
```
Expected: HTML output from the default Astro page.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: initialize Astro project with minimal template"
```

---

### Task 2: Configure i18n and create translation files

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/i18n/en.json`
- Create: `src/i18n/sv.json`
- Create: `src/i18n/hi.json`
- Create: `src/i18n/utils.ts`

**Step 1: Configure Astro i18n**

In `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sv', 'hi'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

**Step 2: Create English translation file**

`src/i18n/en.json`:
```json
{
  "nav.hero": "Home",
  "nav.venue": "Venue",
  "nav.schedule": "Schedule",
  "nav.rsvp": "RSVP",
  "hero.welcome": "We're getting married!",
  "hero.names": "[Name] & [Name]",
  "hero.date": "[Date]",
  "hero.tagline": "A celebration of love across cultures",
  "venue.title": "Venue",
  "venue.name": "[Venue Name]",
  "venue.address": "[Address]",
  "venue.description": "Join us at this beautiful location for our special day.",
  "venue.directions": "Get directions",
  "schedule.title": "Schedule",
  "schedule.ceremony.time": "[Time]",
  "schedule.ceremony.title": "Ceremony",
  "schedule.ceremony.description": "The wedding ceremony",
  "schedule.dinner.time": "[Time]",
  "schedule.dinner.title": "Dinner",
  "schedule.dinner.description": "Dinner and toasts",
  "schedule.party.time": "[Time]",
  "schedule.party.title": "Party",
  "schedule.party.description": "Dancing and celebration",
  "rsvp.title": "RSVP",
  "rsvp.message": "RSVP form coming soon! Please check back later.",
  "footer.message": "We can't wait to celebrate with you!"
}
```

**Step 3: Create Swedish translation file**

`src/i18n/sv.json`:
```json
{
  "nav.hero": "Hem",
  "nav.venue": "Plats",
  "nav.schedule": "Schema",
  "nav.rsvp": "OSA",
  "hero.welcome": "Vi ska gifta oss!",
  "hero.names": "[Namn] & [Namn]",
  "hero.date": "[Datum]",
  "hero.tagline": "En fest som firar kärlek mellan kulturer",
  "venue.title": "Plats",
  "venue.name": "[Platsnamn]",
  "venue.address": "[Adress]",
  "venue.description": "Välkomna till denna vackra plats för vår speciella dag.",
  "venue.directions": "Vägbeskrivning",
  "schedule.title": "Schema",
  "schedule.ceremony.time": "[Tid]",
  "schedule.ceremony.title": "Vigsel",
  "schedule.ceremony.description": "Vigselceremonin",
  "schedule.dinner.time": "[Tid]",
  "schedule.dinner.title": "Middag",
  "schedule.dinner.description": "Middag och tal",
  "schedule.party.time": "[Tid]",
  "schedule.party.title": "Fest",
  "schedule.party.description": "Dans och firande",
  "rsvp.title": "OSA",
  "rsvp.message": "OSA-formuläret kommer snart! Kolla tillbaka senare.",
  "footer.message": "Vi kan inte vänta med att fira med er!"
}
```

**Step 4: Create Hindi translation file**

`src/i18n/hi.json`:
```json
{
  "nav.hero": "होम",
  "nav.venue": "स्थान",
  "nav.schedule": "कार्यक्रम",
  "nav.rsvp": "आर.एस.वी.पी.",
  "hero.welcome": "हमारी शादी हो रही है!",
  "hero.names": "[नाम] और [नाम]",
  "hero.date": "[तारीख]",
  "hero.tagline": "संस्कृतियों के मिलन का जश्न",
  "venue.title": "स्थान",
  "venue.name": "[स्थान का नाम]",
  "venue.address": "[पता]",
  "venue.description": "हमारे इस खास दिन पर इस खूबसूरत जगह पर हमारे साथ शामिल हों।",
  "venue.directions": "दिशा-निर्देश",
  "schedule.title": "कार्यक्रम",
  "schedule.ceremony.time": "[समय]",
  "schedule.ceremony.title": "विवाह संस्कार",
  "schedule.ceremony.description": "विवाह समारोह",
  "schedule.dinner.time": "[समय]",
  "schedule.dinner.title": "रात्रिभोज",
  "schedule.dinner.description": "रात्रिभोज और भाषण",
  "schedule.party.time": "[समय]",
  "schedule.party.title": "पार्टी",
  "schedule.party.description": "नृत्य और उत्सव",
  "rsvp.title": "आर.एस.वी.पी.",
  "rsvp.message": "आर.एस.वी.पी. फॉर्म जल्द आ रहा है! कृपया बाद में देखें।",
  "footer.message": "हम आपके साथ जश्न मनाने के लिए बेसब्र हैं!"
}
```

**Step 5: Create i18n utility**

`src/i18n/utils.ts`:
```typescript
import en from './en.json';
import sv from './sv.json';
import hi from './hi.json';

const translations: Record<string, Record<string, string>> = { en, sv, hi };

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in translations) return lang;
  return 'en';
}

export function t(lang: string, key: string): string {
  return translations[lang]?.[key] ?? translations['en'][key] ?? key;
}

export function getLocalePath(lang: string, hash?: string): string {
  const base = lang === 'en' ? '/' : `/${lang}/`;
  return hash ? `${base}#${hash}` : base;
}
```

**Step 6: Verify build succeeds**

Run:
```bash
npm run build
```
Expected: Build succeeds without errors.

**Step 7: Commit**

```bash
git add astro.config.mjs src/i18n/
git commit -m "feat: add i18n config and translation files for EN/SV/HI"
```

---

### Task 3: Create global styles

**Files:**
- Create: `src/styles/global.css`

**Step 1: Write global CSS with custom properties**

`src/styles/global.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600&family=Noto+Serif:wght@400;700&display=swap');

:root {
  --color-gold: #D4A843;
  --color-gold-light: #E8C96A;
  --color-teal: #1B4D5C;
  --color-teal-dark: #0F2F3A;
  --color-cream: #FDF6EC;
  --color-blush: #D4917A;
  --color-white: #FFFFFF;
  --color-text: #2C2C2C;
  --color-text-light: #5A5A5A;

  --font-heading: 'Noto Serif', Georgia, serif;
  --font-body: 'Noto Sans', system-ui, sans-serif;

  --max-width: 900px;
  --section-padding: 5rem 1.5rem;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 4rem;
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-cream);
  line-height: 1.7;
  font-size: 1.05rem;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  color: var(--color-teal-dark);
  line-height: 1.3;
}

a {
  color: var(--color-teal);
  text-decoration: none;
}

a:hover {
  color: var(--color-gold);
}

.section {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--section-padding);
}

.section-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-teal-dark);
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: var(--color-gold);
  margin: 0.75rem auto 0;
  border-radius: 2px;
}

@media (max-width: 600px) {
  :root {
    --section-padding: 3rem 1rem;
  }

  .section-title {
    font-size: 1.6rem;
  }
}
```

**Step 2: Verify build succeeds**

Run:
```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat: add global styles with fusion color palette and typography"
```

---

### Task 4: Create BaseLayout and LanguageSwitcher

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/LanguageSwitcher.astro`

**Step 1: Create LanguageSwitcher component**

`src/components/LanguageSwitcher.astro`:
```astro
---
import { getLocalePath } from '../i18n/utils';

interface Props {
  currentLang: string;
}

const { currentLang } = Astro.props;

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'sv', label: 'SV' },
  { code: 'hi', label: 'HI' },
];
---

<nav class="lang-switcher" aria-label="Language">
  {languages.map((lang) => (
    <a
      href={getLocalePath(lang.code)}
      class:list={['lang-link', { active: currentLang === lang.code }]}
      aria-current={currentLang === lang.code ? 'page' : undefined}
    >
      {lang.label}
    </a>
  ))}
</nav>

<style>
  .lang-switcher {
    display: flex;
    gap: 0.25rem;
  }

  .lang-link {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-cream);
    transition: background-color 0.2s;
  }

  .lang-link:hover {
    background-color: rgba(255, 255, 255, 0.15);
    color: var(--color-cream);
  }

  .lang-link.active {
    background-color: var(--color-gold);
    color: var(--color-teal-dark);
  }
</style>
```

**Step 2: Create BaseLayout component**

`src/layouts/BaseLayout.astro`:
```astro
---
import '../styles/global.css';
import LanguageSwitcher from '../components/LanguageSwitcher.astro';
import { t } from '../i18n/utils';

interface Props {
  lang: string;
}

const { lang } = Astro.props;
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{t(lang, 'hero.names')} — {t(lang, 'hero.welcome')}</title>
    <meta name="description" content={t(lang, 'hero.tagline')} />
  </head>
  <body>
    <header class="site-header">
      <nav class="site-nav">
        <div class="nav-links">
          <a href="#hero">{t(lang, 'nav.hero')}</a>
          <a href="#venue">{t(lang, 'nav.venue')}</a>
          <a href="#schedule">{t(lang, 'nav.schedule')}</a>
          <a href="#rsvp">{t(lang, 'nav.rsvp')}</a>
        </div>
        <LanguageSwitcher currentLang={lang} />
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer class="site-footer">
      <p>{t(lang, 'footer.message')}</p>
    </footer>
  </body>
</html>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--color-teal-dark);
  }

  .site-nav {
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.5rem;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
  }

  .nav-links a {
    color: var(--color-cream);
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s;
  }

  .nav-links a:hover {
    color: var(--color-gold);
  }

  .site-footer {
    text-align: center;
    padding: 2rem 1.5rem;
    background-color: var(--color-teal-dark);
    color: var(--color-cream);
    font-family: var(--font-heading);
    font-size: 1.1rem;
  }

  @media (max-width: 600px) {
    .nav-links {
      gap: 0.75rem;
    }

    .nav-links a {
      font-size: 0.8rem;
    }
  }
</style>
```

**Step 3: Verify build succeeds**

Run:
```bash
npm run build
```

**Step 4: Commit**

```bash
git add src/layouts/ src/components/
git commit -m "feat: add BaseLayout with sticky nav and LanguageSwitcher"
```

---

### Task 5: Create Hero section

**Files:**
- Create: `src/components/Hero.astro`

**Step 1: Write Hero component**

`src/components/Hero.astro`:
```astro
---
import { t } from '../i18n/utils';

interface Props {
  lang: string;
}

const { lang } = Astro.props;
---

<section id="hero" class="hero">
  <div class="hero-content">
    <p class="hero-welcome">{t(lang, 'hero.welcome')}</p>
    <h1 class="hero-names">{t(lang, 'hero.names')}</h1>
    <p class="hero-date">{t(lang, 'hero.date')}</p>
    <p class="hero-tagline">{t(lang, 'hero.tagline')}</p>
  </div>
</section>

<style>
  .hero {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(
      135deg,
      var(--color-teal-dark) 0%,
      var(--color-teal) 50%,
      var(--color-gold) 100%
    );
    color: var(--color-cream);
    padding: 4rem 1.5rem;
  }

  .hero-content {
    max-width: 600px;
  }

  .hero-welcome {
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 1rem;
    opacity: 0.9;
  }

  .hero-names {
    font-size: 3.5rem;
    font-family: var(--font-heading);
    color: var(--color-cream);
    margin-bottom: 0.75rem;
  }

  .hero-date {
    font-size: 1.4rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    color: var(--color-gold-light);
  }

  .hero-tagline {
    font-size: 1.1rem;
    font-style: italic;
    opacity: 0.85;
  }

  @media (max-width: 600px) {
    .hero {
      min-height: 70vh;
      padding: 3rem 1rem;
    }

    .hero-names {
      font-size: 2.2rem;
    }

    .hero-date {
      font-size: 1.1rem;
    }
  }
</style>
```

**Step 2: Verify build succeeds**

Run:
```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: add Hero section component"
```

---

### Task 6: Create Venue section

**Files:**
- Create: `src/components/Venue.astro`

**Step 1: Write Venue component**

`src/components/Venue.astro`:
```astro
---
import { t } from '../i18n/utils';

interface Props {
  lang: string;
}

const { lang } = Astro.props;
---

<section id="venue" class="section venue">
  <h2 class="section-title">{t(lang, 'venue.title')}</h2>
  <div class="venue-card">
    <h3 class="venue-name">{t(lang, 'venue.name')}</h3>
    <p class="venue-address">{t(lang, 'venue.address')}</p>
    <p class="venue-description">{t(lang, 'venue.description')}</p>
    <a
      href="#"
      class="venue-directions"
      target="_blank"
      rel="noopener noreferrer"
    >
      {t(lang, 'venue.directions')} &rarr;
    </a>
  </div>
</section>

<style>
  .venue {
    background-color: var(--color-white);
    max-width: 100%;
    padding: var(--section-padding);
  }

  .venue .section-title {
    margin-bottom: 2rem;
  }

  .venue-card {
    max-width: var(--max-width);
    margin: 0 auto;
    text-align: center;
  }

  .venue-name {
    font-size: 1.5rem;
    color: var(--color-teal);
    margin-bottom: 0.5rem;
  }

  .venue-address {
    color: var(--color-text-light);
    margin-bottom: 1rem;
  }

  .venue-description {
    margin-bottom: 1.5rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .venue-directions {
    display: inline-block;
    padding: 0.6rem 1.5rem;
    background-color: var(--color-teal);
    color: var(--color-cream);
    border-radius: 6px;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .venue-directions:hover {
    background-color: var(--color-teal-dark);
    color: var(--color-cream);
  }
</style>
```

**Step 2: Verify build succeeds**

Run:
```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/components/Venue.astro
git commit -m "feat: add Venue section component"
```

---

### Task 7: Create Schedule section

**Files:**
- Create: `src/components/Schedule.astro`

**Step 1: Write Schedule component**

`src/components/Schedule.astro`:
```astro
---
import { t } from '../i18n/utils';

interface Props {
  lang: string;
}

const { lang } = Astro.props;

const events = ['ceremony', 'dinner', 'party'];
---

<section id="schedule" class="section schedule">
  <h2 class="section-title">{t(lang, 'schedule.title')}</h2>
  <div class="timeline">
    {events.map((event) => (
      <div class="timeline-item">
        <div class="timeline-time">{t(lang, `schedule.${event}.time`)}</div>
        <div class="timeline-dot" />
        <div class="timeline-content">
          <h3>{t(lang, `schedule.${event}.title`)}</h3>
          <p>{t(lang, `schedule.${event}.description`)}</p>
        </div>
      </div>
    ))}
  </div>
</section>

<style>
  .timeline {
    max-width: 500px;
    margin: 0 auto;
    position: relative;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 80px;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--color-gold);
  }

  .timeline-item {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: 2rem;
    position: relative;
  }

  .timeline-time {
    flex-shrink: 0;
    width: 65px;
    text-align: right;
    font-weight: 600;
    color: var(--color-teal);
    padding-top: 0.15rem;
  }

  .timeline-dot {
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--color-gold);
    border: 2px solid var(--color-cream);
    margin-top: 0.35rem;
    z-index: 1;
  }

  .timeline-content h3 {
    font-size: 1.15rem;
    margin-bottom: 0.25rem;
    color: var(--color-teal-dark);
  }

  .timeline-content p {
    color: var(--color-text-light);
    font-size: 0.95rem;
  }

  @media (max-width: 600px) {
    .timeline::before {
      left: 60px;
    }

    .timeline-time {
      width: 45px;
      font-size: 0.85rem;
    }
  }
</style>
```

**Step 2: Verify build succeeds**

Run:
```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/components/Schedule.astro
git commit -m "feat: add Schedule section with timeline layout"
```

---

### Task 8: Create RSVP placeholder section

**Files:**
- Create: `src/components/Rsvp.astro`

**Step 1: Write RSVP component**

`src/components/Rsvp.astro`:
```astro
---
import { t } from '../i18n/utils';

interface Props {
  lang: string;
}

const { lang } = Astro.props;
---

<section id="rsvp" class="section rsvp">
  <h2 class="section-title">{t(lang, 'rsvp.title')}</h2>
  <div class="rsvp-placeholder">
    <p>{t(lang, 'rsvp.message')}</p>
  </div>
</section>

<style>
  .rsvp {
    background-color: var(--color-white);
    max-width: 100%;
    padding: var(--section-padding);
  }

  .rsvp-placeholder {
    max-width: var(--max-width);
    margin: 0 auto;
    text-align: center;
    padding: 3rem 2rem;
    border: 2px dashed var(--color-gold);
    border-radius: 12px;
    color: var(--color-text-light);
    font-size: 1.1rem;
  }
</style>
```

**Step 2: Verify build succeeds**

Run:
```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/components/Rsvp.astro
git commit -m "feat: add RSVP placeholder section"
```

---

### Task 9: Create pages for all locales

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/pages/sv/index.astro`
- Create: `src/pages/hi/index.astro`

**Step 1: Write English page**

`src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import Venue from '../components/Venue.astro';
import Schedule from '../components/Schedule.astro';
import Rsvp from '../components/Rsvp.astro';

const lang = 'en';
---

<BaseLayout lang={lang}>
  <Hero lang={lang} />
  <Venue lang={lang} />
  <Schedule lang={lang} />
  <Rsvp lang={lang} />
</BaseLayout>
```

**Step 2: Write Swedish page**

`src/pages/sv/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/Hero.astro';
import Venue from '../../components/Venue.astro';
import Schedule from '../../components/Schedule.astro';
import Rsvp from '../../components/Rsvp.astro';

const lang = 'sv';
---

<BaseLayout lang={lang}>
  <Hero lang={lang} />
  <Venue lang={lang} />
  <Schedule lang={lang} />
  <Rsvp lang={lang} />
</BaseLayout>
```

**Step 3: Write Hindi page**

`src/pages/hi/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/Hero.astro';
import Venue from '../../components/Venue.astro';
import Schedule from '../../components/Schedule.astro';
import Rsvp from '../../components/Rsvp.astro';

const lang = 'hi';
---

<BaseLayout lang={lang}>
  <Hero lang={lang} />
  <Venue lang={lang} />
  <Schedule lang={lang} />
  <Rsvp lang={lang} />
</BaseLayout>
```

**Step 4: Verify full build succeeds**

Run:
```bash
npm run build
```
Expected: Build succeeds, generating pages for `/`, `/sv/`, and `/hi/`.

**Step 5: Verify all locale pages exist in output**

Run:
```bash
ls -la dist/index.html dist/sv/index.html dist/hi/index.html
```
Expected: All three files exist.

**Step 6: Commit**

```bash
git add src/pages/
git commit -m "feat: add pages for all three locales (EN/SV/HI)"
```

---

### Task 10: Final verification — dev server smoke test

**Step 1: Build and preview**

Run:
```bash
npm run build && npm run preview -- --host 0.0.0.0 &
sleep 3
```

**Step 2: Verify all three locale pages render**

Run:
```bash
curl -s http://localhost:4321/ | grep -o "We're getting married"
curl -s http://localhost:4321/sv/ | grep -o "Vi ska gifta oss"
curl -s http://localhost:4321/hi/ | grep -o "हमारी शादी हो रही है"
kill %1
```
Expected: Each curl returns the expected welcome text.

**Step 3: Commit (if any fixes were needed)**

Only if adjustments were made during verification.

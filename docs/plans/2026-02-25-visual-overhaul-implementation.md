# Visual Design Overhaul — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the wedding site from a clean/minimal template into a warm, handcrafted scrapbook aesthetic with scattered polaroids, cultural SVG motifs, richer typography, and paper textures.

**Architecture:** SVG + CSS hybrid approach. Cultural motifs (mehndi, Dala horse, mandala, vine dividers) are inline SVG Astro components with configurable props. Textures and layout effects use pure CSS. A small IntersectionObserver script handles scroll-triggered fade-ins. No JS frameworks.

**Tech Stack:** Astro 5, CSS custom properties, inline SVGs, Google Fonts (Great Vibes, Caveat), minimal vanilla JS for IntersectionObserver.

---

### Task 1: Update Global CSS — New Variables, Fonts & Paper Texture

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Add new Google Fonts to the import**

Update the `@import` line at the top of `src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Great+Vibes&family=Noto+Sans:wght@400;500;600&family=Noto+Serif:wght@400;700&family=Noto+Serif+Devanagari:wght@400;700&display=swap');
```

**Step 2: Add new CSS custom properties**

Add these new variables inside `:root`:

```css
  --color-ivory: #FAF3E0;
  --shadow-card: 0 4px 12px rgba(15, 47, 58, 0.12);
  --shadow-card-hover: 0 8px 20px rgba(15, 47, 58, 0.18);

  --font-script: 'Great Vibes', cursive;
  --font-handwritten: 'Caveat', cursive;
  --font-heading-hi: 'Noto Serif Devanagari', 'Noto Serif', Georgia, serif;
```

**Step 3: Add paper texture to body**

Replace the `body` background with a paper grain effect:

```css
body {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-cream);
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(180, 160, 130, 0.03) 2px,
      rgba(180, 160, 130, 0.03) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(180, 160, 130, 0.03) 2px,
      rgba(180, 160, 130, 0.03) 4px
    );
  line-height: 1.7;
  font-size: 1.05rem;
}
```

**Step 4: Update section-title to use script font**

```css
.section-title {
  font-family: var(--font-script);
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-teal-dark);
  font-weight: 400;
}
```

**Step 5: Add scroll-reveal utility class**

```css
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Step 6: Verify in browser**

Run: `npm run dev`

Open `http://localhost:4321` in browser. Check:
- Paper grain texture visible on cream background
- Section titles render in Great Vibes script font
- No layout shifts or broken styling
- All three locale pages load (`/`, `/sv/`, `/hi/`)

**Step 7: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: update global CSS with new fonts, paper texture, and reveal class"
```

---

### Task 2: Create SVG Motif Components

**Files:**
- Create: `src/components/motifs/MehndiCorner.astro`
- Create: `src/components/motifs/DalaHorse.astro`
- Create: `src/components/motifs/Mandala.astro`
- Create: `src/components/motifs/FloralDivider.astro`

**Step 1: Create the motifs directory**

```bash
mkdir -p src/components/motifs
```

**Step 2: Create MehndiCorner.astro**

Create `src/components/motifs/MehndiCorner.astro`:

```astro
---
interface Props {
  size?: string;
  color?: string;
  opacity?: number;
  flip?: boolean;
}

const { size = '120px', color = 'var(--color-gold)', opacity = 0.2, flip = false } = Astro.props;
const transform = flip ? 'scaleX(-1)' : '';
---

<svg
  width={size}
  height={size}
  viewBox="0 0 120 120"
  fill="none"
  style={`opacity: ${opacity}; transform: ${transform};`}
  aria-hidden="true"
>
  <!-- Paisley shape -->
  <path
    d="M10 110 Q10 60 40 35 Q55 22 70 30 Q85 38 80 55 Q75 72 55 75 Q35 78 30 60"
    stroke={color}
    stroke-width="1.5"
    fill="none"
  />
  <!-- Inner spiral -->
  <path
    d="M45 55 Q50 45 60 48 Q70 51 65 60 Q60 69 50 65"
    stroke={color}
    stroke-width="1"
    fill="none"
  />
  <!-- Dots -->
  <circle cx="38" cy="42" r="2" fill={color} />
  <circle cx="72" cy="42" r="2" fill={color} />
  <circle cx="55" cy="82" r="2" fill={color} />
  <!-- Leaf flourishes -->
  <path
    d="M25 90 Q15 80 25 70"
    stroke={color}
    stroke-width="1"
    fill="none"
  />
  <path
    d="M20 95 Q10 85 20 75"
    stroke={color}
    stroke-width="1"
    fill="none"
  />
</svg>
```

**Step 3: Create DalaHorse.astro**

Create `src/components/motifs/DalaHorse.astro`:

```astro
---
interface Props {
  size?: string;
  color?: string;
  opacity?: number;
}

const { size = '80px', color = 'var(--color-teal)', opacity = 0.2 } = Astro.props;
---

<svg
  width={size}
  height={size}
  viewBox="0 0 100 100"
  fill="none"
  style={`opacity: ${opacity};`}
  aria-hidden="true"
>
  <!-- Simplified Dala horse silhouette -->
  <path
    d="M30 85 L30 55 L25 40 L30 30 L40 20 L50 18 L55 22 L58 30
       L70 35 L75 45 L72 55 L72 85 Z"
    stroke={color}
    stroke-width="1.5"
    fill="none"
  />
  <!-- Saddle decoration -->
  <path
    d="M38 40 Q50 35 65 42"
    stroke={color}
    stroke-width="1"
    fill="none"
  />
  <path
    d="M40 48 Q50 44 62 50"
    stroke={color}
    stroke-width="1"
    fill="none"
  />
  <!-- Mane -->
  <path
    d="M40 22 Q35 15 42 12 Q48 15 45 20"
    stroke={color}
    stroke-width="1"
    fill="none"
  />
  <!-- Eye -->
  <circle cx="48" cy="26" r="2" fill={color} />
  <!-- Leg details -->
  <line x1="35" y1="70" x2="35" y2="85" stroke={color} stroke-width="1" />
  <line x1="67" y1="70" x2="67" y2="85" stroke={color} stroke-width="1" />
</svg>
```

**Step 4: Create Mandala.astro**

Create `src/components/motifs/Mandala.astro`:

```astro
---
interface Props {
  size?: string;
  color?: string;
  opacity?: number;
}

const { size = '300px', color = 'var(--color-gold)', opacity = 0.08 } = Astro.props;
---

<svg
  width={size}
  height={size}
  viewBox="0 0 200 200"
  fill="none"
  style={`opacity: ${opacity};`}
  aria-hidden="true"
>
  <!-- Outer ring -->
  <circle cx="100" cy="100" r="95" stroke={color} stroke-width="0.5" />
  <circle cx="100" cy="100" r="88" stroke={color} stroke-width="0.5" />

  <!-- Petal ring (8 petals) -->
  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
    <ellipse
      cx="100"
      cy="55"
      rx="12"
      ry="25"
      stroke={color}
      stroke-width="0.75"
      fill="none"
      transform={`rotate(${angle} 100 100)`}
    />
  ))}

  <!-- Inner petal ring (8 smaller petals, offset) -->
  {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
    <ellipse
      cx="100"
      cy="68"
      rx="8"
      ry="16"
      stroke={color}
      stroke-width="0.5"
      fill="none"
      transform={`rotate(${angle} 100 100)`}
    />
  ))}

  <!-- Center circles -->
  <circle cx="100" cy="100" r="20" stroke={color} stroke-width="0.75" />
  <circle cx="100" cy="100" r="10" stroke={color} stroke-width="0.5" />
  <circle cx="100" cy="100" r="4" fill={color} />

  <!-- Dots around outer ring -->
  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
    const rad = (angle * Math.PI) / 180;
    const cx = 100 + 82 * Math.cos(rad);
    const cy = 100 + 82 * Math.sin(rad);
    return <circle cx={cx} cy={cy} r="2" fill={color} />;
  })}
</svg>
```

**Step 5: Create FloralDivider.astro**

Create `src/components/motifs/FloralDivider.astro`:

```astro
---
interface Props {
  width?: string;
  color?: string;
  opacity?: number;
}

const { width = '200px', color = 'var(--color-gold)', opacity = 0.35 } = Astro.props;
---

<svg
  width={width}
  height="30"
  viewBox="0 0 200 30"
  fill="none"
  style={`opacity: ${opacity};`}
  aria-hidden="true"
>
  <!-- Center flower -->
  <circle cx="100" cy="15" r="4" fill={color} />
  <ellipse cx="100" cy="8" rx="3" ry="6" stroke={color} stroke-width="0.75" fill="none" />
  <ellipse cx="100" cy="22" rx="3" ry="6" stroke={color} stroke-width="0.75" fill="none" />
  <ellipse cx="93" cy="15" rx="6" ry="3" stroke={color} stroke-width="0.75" fill="none" />
  <ellipse cx="107" cy="15" rx="6" ry="3" stroke={color} stroke-width="0.75" fill="none" />

  <!-- Left vine -->
  <path d="M85 15 Q70 10 55 15 Q40 20 25 15 Q15 12 5 15" stroke={color} stroke-width="0.75" fill="none" />
  <!-- Left leaves -->
  <path d="M70 12 Q65 5 60 12" stroke={color} stroke-width="0.5" fill="none" />
  <path d="M45 18 Q40 25 35 18" stroke={color} stroke-width="0.5" fill="none" />

  <!-- Right vine -->
  <path d="M115 15 Q130 20 145 15 Q160 10 175 15 Q185 18 195 15" stroke={color} stroke-width="0.75" fill="none" />
  <!-- Right leaves -->
  <path d="M130 18 Q135 25 140 18" stroke={color} stroke-width="0.5" fill="none" />
  <path d="M155 12 Q160 5 165 12" stroke={color} stroke-width="0.5" fill="none" />
</svg>
```

**Step 6: Verify — import all four in a page temporarily**

Run `npm run dev` and confirm no build errors. Check the browser — motifs should render as light decorative line art.

**Step 7: Commit**

```bash
git add src/components/motifs/
git commit -m "feat: add SVG motif components (mehndi, dala horse, mandala, floral divider)"
```

---

### Task 3: Create Polaroid Component

**Files:**
- Create: `src/components/Polaroid.astro`

**Step 1: Create Polaroid.astro**

Create `src/components/Polaroid.astro`:

```astro
---
interface Props {
  caption?: string;
  rotation?: number;
  placeholderColor?: string;
  class?: string;
}

const {
  caption,
  rotation = 0,
  placeholderColor = 'var(--color-teal)',
  class: className = '',
} = Astro.props;
---

<div
  class={`polaroid ${className}`}
  style={`--rotation: ${rotation}deg;`}
>
  <div class="polaroid-image" style={`background: linear-gradient(135deg, ${placeholderColor}, var(--color-gold-light));`}>
    <slot />
  </div>
  {caption && <p class="polaroid-caption">{caption}</p>}
</div>

<style>
  .polaroid {
    background: var(--color-ivory);
    padding: 8px 8px 28px;
    box-shadow: var(--shadow-card);
    transform: rotate(var(--rotation));
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    width: fit-content;
    position: absolute;
    z-index: 2;
  }

  .polaroid:hover {
    transform: rotate(var(--rotation)) translateY(-4px);
    box-shadow: var(--shadow-card-hover);
  }

  .polaroid-image {
    width: 140px;
    height: 140px;
    overflow: hidden;
  }

  .polaroid-image :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .polaroid-caption {
    font-family: var(--font-handwritten);
    font-size: 0.95rem;
    color: var(--color-text-light);
    text-align: center;
    margin-top: 6px;
  }

  @media (max-width: 600px) {
    .polaroid {
      display: none;
    }
  }
</style>
```

**Step 2: Verify in browser**

Run `npm run dev`. Temporarily add a `<Polaroid>` to the English index page to verify it renders correctly — white bordered card with colored placeholder, rotated, with caption.

**Step 3: Commit**

```bash
git add src/components/Polaroid.astro
git commit -m "feat: add Polaroid component with placeholder support"
```

---

### Task 4: Add Watercolor Wash & Section Dividers to BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Add watercolor wash pseudo-elements to sections**

Add a `<style is:global>` block at the bottom of `BaseLayout.astro` (after the existing scoped `<style>`) for cross-section watercolor washes:

```astro
<style is:global>
  /* Watercolor wash between sections */
  #venue {
    position: relative;
  }

  #venue::before {
    content: '';
    position: absolute;
    top: -40px;
    left: 10%;
    width: 80%;
    height: 80px;
    background: radial-gradient(ellipse at center, rgba(212, 168, 67, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  #schedule {
    position: relative;
  }

  #schedule::before {
    content: '';
    position: absolute;
    top: -30px;
    right: 5%;
    width: 60%;
    height: 60px;
    background: radial-gradient(ellipse at center, rgba(212, 145, 122, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  #rsvp {
    position: relative;
  }

  #rsvp::before {
    content: '';
    position: absolute;
    top: -40px;
    left: 20%;
    width: 60%;
    height: 80px;
    background: radial-gradient(ellipse at center, rgba(232, 201, 106, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Scalloped section dividers */
  #venue,
  #rsvp {
    clip-path: polygon(
      0% 3%, 5% 0%, 10% 3%, 15% 0%, 20% 3%, 25% 0%, 30% 3%, 35% 0%,
      40% 3%, 45% 0%, 50% 3%, 55% 0%, 60% 3%, 65% 0%, 70% 3%, 75% 0%,
      80% 3%, 85% 0%, 90% 3%, 95% 0%, 100% 3%,
      100% 100%, 0% 100%
    );
    padding-top: calc(var(--section-padding) + 1rem);
  }
</style>
```

**Step 2: Verify in browser**

Run `npm run dev`. Check:
- Subtle golden/blush gradient washes visible between sections
- Venue and RSVP sections have scalloped top edges
- No content is clipped or hidden
- Looks good on mobile too

**Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add watercolor washes and scalloped section dividers"
```

---

### Task 5: Integrate Motifs into Hero Section

**Files:**
- Modify: `src/components/Hero.astro`

**Step 1: Add mandala background and mehndi corners to Hero**

Update `src/components/Hero.astro` — add imports and decorative elements:

```astro
---
import { t } from '../i18n/utils';
import Mandala from './motifs/Mandala.astro';
import MehndiCorner from './motifs/MehndiCorner.astro';

interface Props {
  lang: string;
}

const { lang } = Astro.props;
---

<section id="hero" class="hero">
  <div class="hero-mandala">
    <Mandala size="400px" color="var(--color-cream)" opacity={0.1} />
  </div>
  <div class="hero-motif-left">
    <MehndiCorner size="150px" color="var(--color-gold-light)" opacity={0.15} />
  </div>
  <div class="hero-motif-right">
    <MehndiCorner size="150px" color="var(--color-gold-light)" opacity={0.15} flip />
  </div>
  <div class="hero-content">
    <p class="hero-welcome">{t(lang, 'hero.welcome')}</p>
    <h1 class="hero-names">{t(lang, 'hero.names')}</h1>
    <p class="hero-date">{t(lang, 'hero.date')}</p>
    <p class="hero-tagline">{t(lang, 'hero.tagline')}</p>
  </div>
</section>
```

**Step 2: Add positioning styles for motifs**

Add to the existing `<style>` block in Hero.astro:

```css
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
    position: relative;
    overflow: hidden;
  }

  .hero-mandala {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .hero-motif-left {
    position: absolute;
    top: 2rem;
    left: 2rem;
    pointer-events: none;
  }

  .hero-motif-right {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    pointer-events: none;
  }

  .hero-content {
    max-width: 600px;
    position: relative;
    z-index: 1;
  }

  .hero-names {
    font-size: 3.5rem;
    font-family: var(--font-script);
    color: var(--color-cream);
    margin-bottom: 0.75rem;
  }
```

Update the mobile media query too:

```css
  @media (max-width: 600px) {
    .hero {
      min-height: 70vh;
      padding: 3rem 1rem;
    }

    .hero-names {
      font-size: 2.5rem;
    }

    .hero-date {
      font-size: 1.1rem;
    }

    .hero-motif-left,
    .hero-motif-right {
      display: none;
    }

    .hero-mandala :global(svg) {
      width: 250px;
      height: 250px;
    }
  }
```

**Step 3: Verify in browser**

Run `npm run dev`. Check:
- Mandala visible as faint circular pattern behind the names
- Mehndi corners visible in top-left and bottom-right
- Hero names render in script font
- Content is still clearly readable
- Mobile: corners hidden, mandala shrinks

**Step 4: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: add mandala and mehndi motifs to Hero section"
```

---

### Task 6: Integrate Motifs & Polaroids into Venue Section

**Files:**
- Modify: `src/components/Venue.astro`

**Step 1: Add Dala horse, floral divider, and polaroid to Venue**

Update `src/components/Venue.astro`:

```astro
---
import { t } from '../i18n/utils';
import DalaHorse from './motifs/DalaHorse.astro';
import FloralDivider from './motifs/FloralDivider.astro';
import Polaroid from './Polaroid.astro';

interface Props {
  lang: string;
}

const { lang } = Astro.props;
---

<section id="venue" class="section venue">
  <div class="venue-polaroid-1">
    <Polaroid rotation={-5} caption="Wiks Slott" placeholderColor="var(--color-teal)" />
  </div>
  <div class="venue-polaroid-2">
    <Polaroid rotation={4} placeholderColor="var(--color-blush)" />
  </div>
  <div class="venue-dala">
    <DalaHorse size="100px" color="var(--color-teal)" opacity={0.12} />
  </div>

  <h2 class="section-title">{t(lang, 'venue.title')}</h2>
  <div class="venue-divider">
    <FloralDivider width="180px" />
  </div>
  <div class="venue-card">
    <h3 class="venue-name">{t(lang, 'venue.name')}</h3>
    <p class="venue-address">{t(lang, 'venue.address')}</p>
    <p class="venue-description">{t(lang, 'venue.description')}</p>
    <a
      href="https://www.google.com/maps/place/Wiks+Slott,+Uppsala,+Sweden"
      class="venue-directions"
      target="_blank"
      rel="noopener noreferrer"
    >
      {t(lang, 'venue.directions')} &rarr;
    </a>
  </div>
</section>
```

**Step 2: Add styles for the new elements**

Add to the `<style>` block:

```css
  .venue {
    background-color: var(--color-white);
    max-width: 100%;
    padding: var(--section-padding);
    position: relative;
    overflow: hidden;
  }

  .venue-polaroid-1 {
    position: absolute;
    top: 4rem;
    left: 3%;
  }

  .venue-polaroid-2 {
    position: absolute;
    bottom: 3rem;
    right: 4%;
  }

  .venue-dala {
    position: absolute;
    bottom: 2rem;
    left: 5%;
    pointer-events: none;
  }

  .venue-divider {
    text-align: center;
    margin-bottom: 2rem;
  }

  .venue .section-title {
    margin-bottom: 0.75rem;
  }

  /* ...keep existing .venue-card, .venue-name, etc. styles... */

  @media (max-width: 600px) {
    .venue-dala {
      display: none;
    }
  }
```

Note: Keep all existing `.venue-card`, `.venue-name`, `.venue-address`, `.venue-description`, and `.venue-directions` styles unchanged.

**Step 3: Verify in browser**

Check: polaroids at left/right edges, Dala horse bottom-left, floral divider under title, all responsive.

**Step 4: Commit**

```bash
git add src/components/Venue.astro
git commit -m "feat: add polaroids, Dala horse, and floral divider to Venue section"
```

---

### Task 7: Integrate Motifs & Polaroids into Schedule Section

**Files:**
- Modify: `src/components/Schedule.astro`

**Step 1: Add mehndi corners, polaroids, and floral divider to Schedule**

Update imports and add decorative elements to `src/components/Schedule.astro`:

```astro
---
import { t } from '../i18n/utils';
import MehndiCorner from './motifs/MehndiCorner.astro';
import FloralDivider from './motifs/FloralDivider.astro';
import Polaroid from './Polaroid.astro';

interface Props {
  lang: string;
}

const { lang } = Astro.props;

const day1Events = ['mehendi'];
const day2Events = ['ceremony', 'dinner', 'party'];
---

<section id="schedule" class="section schedule">
  <div class="schedule-motif-left">
    <MehndiCorner size="100px" color="var(--color-gold)" opacity={0.15} />
  </div>
  <div class="schedule-motif-right">
    <MehndiCorner size="100px" color="var(--color-gold)" opacity={0.15} flip />
  </div>
  <div class="schedule-polaroid-1">
    <Polaroid rotation={6} placeholderColor="var(--color-gold)" />
  </div>
  <div class="schedule-polaroid-2">
    <Polaroid rotation={-4} placeholderColor="var(--color-teal)" />
  </div>

  <h2 class="section-title">{t(lang, 'schedule.title')}</h2>
  <div class="schedule-divider">
    <FloralDivider width="160px" />
  </div>

  <div class="timeline">
    <!-- ...existing timeline markup unchanged... -->
  </div>
</section>
```

Keep all existing timeline markup (`day-header`, `day1Events.map`, `day2Events.map`) exactly as-is inside the `.timeline` div.

**Step 2: Add positioning styles**

Add to the `<style>` block:

```css
  .schedule {
    position: relative;
    overflow: hidden;
  }

  .schedule-motif-left {
    position: absolute;
    top: 2rem;
    left: 2rem;
    pointer-events: none;
  }

  .schedule-motif-right {
    position: absolute;
    top: 2rem;
    right: 2rem;
    pointer-events: none;
  }

  .schedule-polaroid-1 {
    position: absolute;
    top: 6rem;
    right: 3%;
  }

  .schedule-polaroid-2 {
    position: absolute;
    bottom: 4rem;
    left: 3%;
  }

  .schedule-divider {
    text-align: center;
    margin-top: -1rem;
    margin-bottom: 2rem;
  }
```

Add to the mobile media query:

```css
  @media (max-width: 600px) {
    .schedule-motif-left,
    .schedule-motif-right {
      display: none;
    }

    /* ...keep existing mobile timeline styles... */
  }
```

**Step 3: Verify in browser**

Check: mehndi corners top-left and top-right, polaroids flanking timeline, floral divider under title, timeline still readable.

**Step 4: Commit**

```bash
git add src/components/Schedule.astro
git commit -m "feat: add mehndi corners, polaroids, and floral divider to Schedule section"
```

---

### Task 8: Integrate Motifs & Polaroids into RSVP Section

**Files:**
- Modify: `src/components/Rsvp.astro`

**Step 1: Add mehndi corners, polaroid, and floral divider to RSVP**

Update `src/components/Rsvp.astro`:

```astro
---
import { t } from '../i18n/utils';
import MehndiCorner from './motifs/MehndiCorner.astro';
import FloralDivider from './motifs/FloralDivider.astro';
import Polaroid from './Polaroid.astro';

interface Props {
  lang: string;
}

const { lang } = Astro.props;
---

<section id="rsvp" class="section rsvp">
  <div class="rsvp-motif-left">
    <MehndiCorner size="100px" color="var(--color-blush)" opacity={0.18} />
  </div>
  <div class="rsvp-motif-right">
    <MehndiCorner size="100px" color="var(--color-blush)" opacity={0.18} flip />
  </div>
  <div class="rsvp-polaroid">
    <Polaroid rotation={-3} caption="Save the date!" placeholderColor="var(--color-blush)" />
  </div>

  <h2 class="section-title">{t(lang, 'rsvp.title')}</h2>
  <div class="rsvp-divider">
    <FloralDivider width="160px" color="var(--color-blush)" />
  </div>
  <div class="rsvp-placeholder">
    <p>{t(lang, 'rsvp.message')}</p>
  </div>
</section>
```

**Step 2: Add positioning styles**

Replace the existing `<style>` block:

```css
  .rsvp {
    background-color: var(--color-white);
    max-width: 100%;
    padding: var(--section-padding);
    position: relative;
    overflow: hidden;
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

  .rsvp-polaroid {
    position: absolute;
    top: 4rem;
    right: 5%;
  }

  .rsvp-divider {
    text-align: center;
    margin-top: -1rem;
    margin-bottom: 2rem;
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

  @media (max-width: 600px) {
    .rsvp-motif-left,
    .rsvp-motif-right {
      display: none;
    }
  }
```

**Step 3: Verify in browser**

Check: mehndi corners bottom-left and bottom-right, polaroid top-right, floral divider in blush, placeholder box still looks good.

**Step 4: Commit**

```bash
git add src/components/Rsvp.astro
git commit -m "feat: add mehndi corners, polaroid, and floral divider to RSVP section"
```

---

### Task 9: Add Dala Horse to Footer

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Add Dala horse import and element to footer**

At the top of `BaseLayout.astro`, add the import:

```astro
import DalaHorse from '../components/motifs/DalaHorse.astro';
```

Update the footer markup:

```html
    <footer class="site-footer">
      <div class="footer-dala-left">
        <DalaHorse size="50px" color="var(--color-gold-light)" opacity={0.3} />
      </div>
      <p>{t(lang, 'footer.message')}</p>
      <div class="footer-dala-right">
        <DalaHorse size="50px" color="var(--color-gold-light)" opacity={0.3} />
      </div>
    </footer>
```

**Step 2: Add footer dala styles**

Add to the scoped `<style>` block:

```css
  .site-footer {
    text-align: center;
    padding: 2rem 1.5rem;
    background-color: var(--color-teal-dark);
    color: var(--color-cream);
    font-family: var(--font-heading);
    font-size: 1.1rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
  }

  .footer-dala-left,
  .footer-dala-right {
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    .footer-dala-left,
    .footer-dala-right {
      display: none;
    }
  }
```

**Step 3: Verify in browser**

Check: two small Dala horses flanking the footer message, hidden on mobile.

**Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add Dala horse motifs to footer"
```

---

### Task 10: Add Scroll-Reveal Animation Script

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/Venue.astro` (add `reveal` class)
- Modify: `src/components/Schedule.astro` (add `reveal` class)
- Modify: `src/components/Rsvp.astro` (add `reveal` class)

**Step 1: Add IntersectionObserver script to BaseLayout**

Add a `<script>` tag at the end of `BaseLayout.astro`, just before the closing `</style>` or after it:

```astro
<script>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
</script>
```

**Step 2: Add `reveal` class to section wrappers**

In `Venue.astro`, add class `reveal` to the outer section:
```html
<section id="venue" class="section venue reveal">
```

In `Schedule.astro`, add class `reveal` to the outer section:
```html
<section id="schedule" class="section schedule reveal">
```

In `Rsvp.astro`, add class `reveal` to the outer section:
```html
<section id="rsvp" class="section rsvp reveal">
```

**Step 3: Verify in browser**

Run `npm run dev`. Scroll down the page:
- Venue, Schedule, and RSVP sections should fade in and slide up as they enter the viewport
- Animation should only trigger once per section
- Hero should NOT animate (it's visible immediately)

**Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Venue.astro src/components/Schedule.astro src/components/Rsvp.astro
git commit -m "feat: add scroll-reveal fade-in animation to content sections"
```

---

### Task 11: Final Visual Polish & Build Verification

**Files:**
- Possibly minor tweaks to any file from above

**Step 1: Run production build**

```bash
npm run build
```

Expected: Clean build with no errors or warnings.

**Step 2: Preview production build**

```bash
npm run preview
```

Open `http://localhost:4321` and verify:
- All three locale pages (`/`, `/sv/`, `/hi/`) render correctly
- Paper texture visible on background
- Script font on section titles (Devanagari fallback on `/hi/`)
- Polaroids scattered at section edges, hidden on mobile
- SVG motifs visible but subtle (mandala in hero, mehndi corners, Dala horses, floral dividers)
- Scroll-reveal animations work
- Watercolor washes visible between sections
- Scalloped tops on venue and RSVP
- No horizontal scroll or layout overflow

**Step 3: Fix any issues found**

If anything is visually off, adjust CSS values (opacity, positioning, sizing) as needed. Keep changes minimal.

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: visual polish adjustments from review"
```

Only if there were actual fixes needed. Skip if everything looked correct.

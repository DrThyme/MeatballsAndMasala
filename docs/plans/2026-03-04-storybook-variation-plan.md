# Storybook Visual Variation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the wedding website from photo-driven elegance to a richly illustrated storybook aesthetic with dark ornate backgrounds, gold-framed sections, and AI-generated illustrations replacing all photography.

**Architecture:** Replace all photo-based components with illustration-based equivalents. Create new SVG motif components for the ornate gold borders and decorative elements. Restyle all existing components for dark backgrounds with cream/gold text. Add a new "Our Story" timeline section. Keep the same Astro framework, routing, and i18n system.

**Tech Stack:** Astro 5, CSS (scoped + global), SVG (inline), HTML, i18n JSON

---

## Task 1: Copy and Rename Illustration Assets

**Files:**
- Create: `public/illustrations/` directory with renamed files

**Step 1: Create the illustrations directory and copy files with readable names**

```bash
mkdir -p public/illustrations
cp new-style-pics/Gemini_Generated_Image_tqld1jtqld1jtqld.png public/illustrations/peacock-hero.png
cp new-style-pics/Gemini_Generated_Image_5knmaa5knmaa5knm.png public/illustrations/paisley-lotus-divider.png
cp new-style-pics/Gemini_Generated_Image_9c8rhd9c8rhd9c8r.png public/illustrations/lotus-medallion.png
cp new-style-pics/Gemini_Generated_Image_nk53rqnk53rqnk53.png public/illustrations/swedish-archipelago.png
cp new-style-pics/Gemini_Generated_Image_1azokh1azokh1azo.png public/illustrations/couple-eating.png
cp new-style-pics/Gemini_Generated_Image_jw2i3qjw2i3qjw2i.png public/illustrations/couple-traditional.png
cp new-style-pics/Gemini_Generated_Image_4yzb184yzb184yzb.png public/illustrations/himalayan-peaks.png
cp new-style-pics/Gemini_Generated_Image_y88auty88auty88a.png public/illustrations/mountain-meadow.png
cp new-style-pics/Gemini_Generated_Image_4xm45r4xm45r4xm4.png public/illustrations/swedish-meadow.png
cp new-style-pics/Gemini_Generated_Image_vxsy5evxsy5evxsy.png public/illustrations/love-story-timeline.png
cp new-style-pics/Gemini_Generated_Image_oaytg4oaytg4oayt.png public/illustrations/holding-hands.png
cp new-style-pics/Gemini_Generated_Image_9vbst19vbst19vbs.png public/illustrations/venue-map.png
```

**Step 2: Verify files are in place**

Run: `ls -la public/illustrations/`
Expected: 12 PNG files with readable names

**Step 3: Commit**

```bash
git add public/illustrations/
git commit -m "chore: copy and rename illustration assets to public/illustrations"
```

---

## Task 2: Update Global CSS Variables and Dark Theme Base

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Replace CSS custom properties (lines 3-25) with dark theme palette**

Replace the entire `:root` block with:

```css
:root {
  --color-base-dark: #1A3A3A;
  --color-deep-brown: #3D2B1F;
  --color-gold: #C8963E;
  --color-gold-light: #D4AA5A;
  --color-teal-accent: #2A7B7B;
  --color-deep-red: #8B2D2D;
  --color-cream: #F5E6C8;
  --color-warm-white: #FDF6EC;

  /* Legacy aliases for components that still reference old vars */
  --color-teal: #2A7B7B;
  --color-teal-dark: #1A3A3A;
  --color-blush: #8B2D2D;
  --color-white: #FDF6EC;
  --color-text: #F5E6C8;
  --color-text-light: #C8B89A;
  --color-ivory: #2A4A4A;
  --color-gold-light-legacy: #D4AA5A;

  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-card-hover: 0 8px 20px rgba(0, 0, 0, 0.4);

  --font-heading: 'Noto Serif', Georgia, serif;
  --font-body: 'Noto Sans', system-ui, sans-serif;
  --font-script: 'Great Vibes', cursive;
  --font-handwritten: 'Caveat', cursive;
  --font-heading-hi: 'Noto Serif Devanagari', 'Noto Serif', Georgia, serif;

  --max-width: 900px;
  --section-padding: 5rem 1.5rem;
}
```

**Step 2: Update body styles (lines 40-61) for dark background**

Replace body styles with:

```css
body {
  font-family: var(--font-body);
  color: var(--color-cream);
  background-color: var(--color-base-dark);
  line-height: 1.7;
  font-size: 1.05rem;
}
```

Remove the crosshatch background-image pattern (lines 44-58) — it won't be visible on dark.

**Step 3: Update heading and link colors (lines 63-76)**

```css
h1, h2, h3, h4 {
  font-family: var(--font-heading);
  color: var(--color-cream);
  line-height: 1.3;
}

a {
  color: var(--color-gold-light);
  text-decoration: none;
}

a:hover {
  color: var(--color-gold);
}
```

**Step 4: Update section-title styles (lines 84-101)**

```css
.section-title {
  font-family: var(--font-script);
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-cream);
  font-weight: 400;
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
```

**Step 5: Run dev server and verify**

Run: `npx astro dev`
Expected: Dark background across the entire site, cream-colored text, gold accents. Some components will look broken — that's expected at this stage.

**Step 6: Commit**

```bash
git add src/styles/global.css
git commit -m "style: switch to dark storybook theme palette and base styles"
```

---

## Task 3: Create SVG Motif — LotusCorner

**Files:**
- Create: `src/components/motifs/LotusCorner.astro`

**Step 1: Create the component**

This replaces `MehndiCorner.astro`. It's a corner ornament with a lotus flower and vine scrollwork, matching the gold border style from the illustrations.

```astro
---
interface Props {
  size?: string;
  color?: string;
  opacity?: number;
  flip?: boolean;
}

const { size = '120px', color = 'var(--color-gold)', opacity = 0.2, flip = false } = Astro.props;
---

<div
  class="lotus-corner"
  style={`width: ${size}; height: ${size}; opacity: ${opacity}; ${flip ? 'transform: scaleX(-1);' : ''}`}
>
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Main lotus flower -->
    <path d="M20 20 Q25 5 35 15 Q30 25 20 20Z" fill={color} opacity="0.9"/>
    <path d="M20 20 Q5 25 15 35 Q25 30 20 20Z" fill={color} opacity="0.9"/>
    <path d="M20 20 Q10 10 25 10 Q25 20 20 20Z" fill={color} opacity="0.7"/>
    <circle cx="20" cy="20" r="3" fill={color}/>

    <!-- Vine scrolling down -->
    <path d="M20 23 Q22 40 30 55 Q35 65 32 80 Q30 90 35 105" stroke={color} stroke-width="1.5" fill="none" stroke-linecap="round"/>

    <!-- Vine scrolling right -->
    <path d="M23 20 Q40 22 55 30 Q65 35 80 32 Q90 30 105 35" stroke={color} stroke-width="1.5" fill="none" stroke-linecap="round"/>

    <!-- Leaves along vertical vine -->
    <path d="M30 55 Q38 48 35 58 Q32 55 30 55Z" fill={color} opacity="0.7"/>
    <path d="M32 80 Q24 74 28 83 Q30 80 32 80Z" fill={color} opacity="0.6"/>

    <!-- Leaves along horizontal vine -->
    <path d="M55 30 Q48 38 58 35 Q55 32 55 30Z" fill={color} opacity="0.7"/>
    <path d="M80 32 Q74 24 83 28 Q80 30 80 32Z" fill={color} opacity="0.6"/>

    <!-- Small lotus buds -->
    <path d="M35 105 Q38 98 40 105 Q37 108 35 105Z" fill={color} opacity="0.6"/>
    <path d="M105 35 Q98 38 105 40 Q108 37 105 35Z" fill={color} opacity="0.6"/>

    <!-- Decorative dots -->
    <circle cx="42" cy="42" r="1.5" fill={color} opacity="0.5"/>
    <circle cx="60" cy="38" r="1" fill={color} opacity="0.4"/>
    <circle cx="38" cy="60" r="1" fill={color} opacity="0.4"/>
  </svg>
</div>

<style>
  .lotus-corner {
    pointer-events: none;
    line-height: 0;
  }

  .lotus-corner svg {
    width: 100%;
    height: 100%;
  }
</style>
```

**Step 2: Verify it renders**

Temporarily import and use in any section to check it looks correct:
Run: `npx astro dev` and visually check the corner ornament

**Step 3: Commit**

```bash
git add src/components/motifs/LotusCorner.astro
git commit -m "feat: add LotusCorner SVG motif component"
```

---

## Task 4: Create SVG Motif — LotusVineBorder

**Files:**
- Create: `src/components/motifs/LotusVineBorder.astro`

**Step 1: Create the component**

This replaces `FloralDivider.astro` — a horizontal divider with a central lotus and scrolling vines with small leaves.

```astro
---
interface Props {
  width?: string;
  color?: string;
  opacity?: number;
}

const { width = '200px', color = 'var(--color-gold)', opacity = 0.5 } = Astro.props;
---

<div class="lotus-vine-border" style={`width: ${width}; opacity: ${opacity};`}>
  <svg viewBox="0 0 300 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Left vine -->
    <path d="M10 20 Q30 15 50 18 Q70 20 90 16 Q110 12 130 18 Q140 20 148 20" stroke={color} stroke-width="1.2" fill="none" stroke-linecap="round"/>

    <!-- Right vine (mirrored) -->
    <path d="M290 20 Q270 15 250 18 Q230 20 210 16 Q190 12 170 18 Q160 20 152 20" stroke={color} stroke-width="1.2" fill="none" stroke-linecap="round"/>

    <!-- Center lotus -->
    <path d="M150 12 Q153 5 156 12 Q153 14 150 12Z" fill={color}/>
    <path d="M144 16 Q140 10 148 14 Q146 17 144 16Z" fill={color}/>
    <path d="M156 16 Q160 10 152 14 Q154 17 156 16Z" fill={color}/>
    <path d="M150 20 Q147 14 150 12 Q153 14 150 20Z" fill={color} opacity="0.8"/>
    <circle cx="150" cy="15" r="2" fill={color}/>

    <!-- Left leaves -->
    <path d="M50 18 Q55 10 58 17 Q55 19 50 18Z" fill={color} opacity="0.6"/>
    <path d="M90 16 Q85 22 88 16 Q90 14 90 16Z" fill={color} opacity="0.5"/>
    <path d="M120 16 Q125 10 124 17 Q122 18 120 16Z" fill={color} opacity="0.6"/>

    <!-- Right leaves (mirrored) -->
    <path d="M250 18 Q245 10 242 17 Q245 19 250 18Z" fill={color} opacity="0.6"/>
    <path d="M210 16 Q215 22 212 16 Q210 14 210 16Z" fill={color} opacity="0.5"/>
    <path d="M180 16 Q175 10 176 17 Q178 18 180 16Z" fill={color} opacity="0.6"/>

    <!-- Decorative dots -->
    <circle cx="30" cy="18" r="1.2" fill={color} opacity="0.4"/>
    <circle cx="70" cy="19" r="1" fill={color} opacity="0.3"/>
    <circle cx="230" cy="19" r="1" fill={color} opacity="0.3"/>
    <circle cx="270" cy="18" r="1.2" fill={color} opacity="0.4"/>

    <!-- End flourishes -->
    <path d="M10 20 Q5 16 8 14" stroke={color} stroke-width="1" fill="none" stroke-linecap="round"/>
    <path d="M290 20 Q295 16 292 14" stroke={color} stroke-width="1" fill="none" stroke-linecap="round"/>
  </svg>
</div>

<style>
  .lotus-vine-border {
    margin: 0 auto;
    text-align: center;
    line-height: 0;
  }

  .lotus-vine-border svg {
    width: 100%;
    height: auto;
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/motifs/LotusVineBorder.astro
git commit -m "feat: add LotusVineBorder SVG motif component"
```

---

## Task 5: Create GoldFrame Component

**Files:**
- Create: `src/components/GoldFrame.astro`

**Step 1: Create the component**

A reusable ornate border that wraps section content with gold lotus corners and vine edges. Uses CSS border-image with an SVG-based decorative border, plus absolutely positioned corner ornaments.

```astro
---
import LotusCorner from './motifs/LotusCorner.astro';

interface Props {
  class?: string;
  padding?: string;
}

const { class: className = '', padding = '3rem' } = Astro.props;
---

<div class={`gold-frame ${className}`} style={`--frame-padding: ${padding};`}>
  <div class="gold-frame-border">
    <div class="gold-frame-corner top-left">
      <LotusCorner size="80px" color="var(--color-gold)" opacity={0.6} />
    </div>
    <div class="gold-frame-corner top-right">
      <LotusCorner size="80px" color="var(--color-gold)" opacity={0.6} flip />
    </div>
    <div class="gold-frame-corner bottom-left">
      <LotusCorner size="80px" color="var(--color-gold)" opacity={0.6} />
    </div>
    <div class="gold-frame-corner bottom-right">
      <LotusCorner size="80px" color="var(--color-gold)" opacity={0.6} flip />
    </div>
  </div>
  <div class="gold-frame-content">
    <slot />
  </div>
</div>

<style>
  .gold-frame {
    position: relative;
    padding: var(--frame-padding);
  }

  .gold-frame-border {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(200, 150, 62, 0.3);
    border-radius: 4px;
    pointer-events: none;
  }

  .gold-frame-corner {
    position: absolute;
  }

  .gold-frame-corner.top-left {
    top: -8px;
    left: -8px;
  }

  .gold-frame-corner.top-right {
    top: -8px;
    right: -8px;
    transform: scaleX(-1);
  }

  .gold-frame-corner.bottom-left {
    bottom: -8px;
    left: -8px;
    transform: scaleY(-1);
  }

  .gold-frame-corner.bottom-right {
    bottom: -8px;
    right: -8px;
    transform: scale(-1);
  }

  .gold-frame-content {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 600px) {
    .gold-frame {
      --frame-padding: 1.5rem;
    }

    .gold-frame-corner :global(div) {
      width: 50px !important;
      height: 50px !important;
    }
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/GoldFrame.astro
git commit -m "feat: add GoldFrame wrapper component with lotus corner ornaments"
```

---

## Task 6: Create PaisleyBackground Component

**Files:**
- Create: `src/components/PaisleyBackground.astro`

**Step 1: Create the component**

A subtle repeating paisley pattern SVG used as section backgrounds. Renders as a low-opacity teal-on-dark-teal texture.

```astro
---
interface Props {
  opacity?: number;
  color?: string;
}

const { opacity = 0.05, color = 'var(--color-teal-accent)' } = Astro.props;
---

<div class="paisley-bg" style={`opacity: ${opacity};`}>
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <pattern id="paisley-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
        <!-- Paisley 1 -->
        <path d="M30 40 Q45 15 60 40 Q55 55 40 55 Q30 55 25 45Z" stroke={color} stroke-width="1" fill="none"/>
        <path d="M35 42 Q42 28 52 42" stroke={color} stroke-width="0.5" fill="none"/>
        <circle cx="42" cy="38" r="2" fill={color} opacity="0.5"/>

        <!-- Paisley 2 (rotated) -->
        <path d="M130 90 Q145 65 160 90 Q155 105 140 105 Q130 105 125 95Z" stroke={color} stroke-width="1" fill="none" transform="rotate(30, 145, 90)"/>
        <circle cx="142" cy="88" r="2" fill={color} opacity="0.5"/>

        <!-- Paisley 3 -->
        <path d="M70 140 Q85 115 100 140 Q95 155 80 155 Q70 155 65 145Z" stroke={color} stroke-width="1" fill="none" transform="rotate(-20, 85, 140)"/>
        <circle cx="82" cy="138" r="2" fill={color} opacity="0.5"/>

        <!-- Small decorative swirls -->
        <path d="M95 30 Q100 25 105 30 Q100 35 95 30" stroke={color} stroke-width="0.7" fill="none"/>
        <path d="M15 110 Q20 105 25 110 Q20 115 15 110" stroke={color} stroke-width="0.7" fill="none"/>
        <path d="M170 160 Q175 155 180 160 Q175 165 170 160" stroke={color} stroke-width="0.7" fill="none"/>

        <!-- Dots -->
        <circle cx="160" cy="30" r="1.5" fill={color} opacity="0.3"/>
        <circle cx="20" cy="170" r="1.5" fill={color} opacity="0.3"/>
        <circle cx="180" cy="140" r="1" fill={color} opacity="0.3"/>
        <circle cx="110" cy="170" r="1" fill={color} opacity="0.3"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#paisley-pattern)"/>
  </svg>
</div>

<style>
  .paisley-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  .paisley-bg svg {
    width: 100%;
    height: 100%;
  }

  .paisley-bg svg rect {
    width: 100%;
    height: 100%;
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/PaisleyBackground.astro
git commit -m "feat: add PaisleyBackground SVG repeating texture component"
```

---

## Task 7: Create PeacockHero Component

**Files:**
- Create: `src/components/PeacockHero.astro`

**Step 1: Create the component**

Replaces `Hero.astro`. Uses the peacock illustration as a full-viewport background with the couple's names overlaid in the storybook style.

```astro
---
import { t } from '../i18n/utils';
import GoldFrame from './GoldFrame.astro';
import LotusCorner from './motifs/LotusCorner.astro';

interface Props {
  lang: string;
}

const { lang } = Astro.props;
---

<section id="hero" class="hero">
  <img src="/illustrations/peacock-hero.png" alt="" class="hero-bg" aria-hidden="true" />
  <div class="hero-overlay" />
  <div class="hero-content">
    <p class="hero-welcome">{t(lang, 'hero.welcome')}</p>
    <h1 class="hero-names">{t(lang, 'hero.names')}</h1>
    <div class="hero-rule"></div>
    <p class="hero-date">{t(lang, 'hero.date')}</p>
    <p class="hero-tagline">{t(lang, 'hero.tagline')}</p>
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--color-cream);
    padding: 4rem 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(26, 58, 58, 0.4) 0%,
      rgba(26, 58, 58, 0.6) 50%,
      rgba(26, 58, 58, 0.7) 100%
    );
    z-index: 1;
  }

  .hero-content {
    max-width: 600px;
    position: relative;
    z-index: 3;
  }

  .hero-welcome {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    margin-bottom: 1rem;
    opacity: 0.9;
    color: var(--color-gold-light);
  }

  .hero-names {
    font-size: 4rem;
    font-family: var(--font-script);
    color: var(--color-warm-white);
    margin-bottom: 1rem;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  }

  .hero-rule {
    width: 80px;
    height: 2px;
    background: var(--color-gold);
    margin: 0 auto 1rem;
  }

  .hero-date {
    font-size: 1.4rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: var(--color-gold-light);
  }

  .hero-tagline {
    font-size: 1.1rem;
    font-style: italic;
    opacity: 0.85;
    color: var(--color-cream);
  }

  @media (max-width: 600px) {
    .hero {
      min-height: 80vh;
      padding: 3rem 1rem;
    }

    .hero-names {
      font-size: 2.8rem;
    }

    .hero-date {
      font-size: 1.1rem;
    }
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/PeacockHero.astro
git commit -m "feat: add PeacockHero component with illustration background"
```

---

## Task 8: Create IllustratedScene Component

**Files:**
- Create: `src/components/IllustratedScene.astro`

**Step 1: Create the component**

Replaces `PhotoBanner.astro`. Full-width illustrated scene break with gold frame border and caption.

```astro
---
interface Props {
  image: string;
  caption: string;
  alt: string;
}

const { image, caption, alt } = Astro.props;
---

<section class="illustrated-scene">
  <div class="scene-border">
    <img src={image} alt={alt} class="scene-img" loading="lazy" />
    <div class="scene-overlay">
      <p class="scene-caption">{caption}</p>
    </div>
  </div>
</section>

<style>
  .illustrated-scene {
    position: relative;
    width: 100%;
    padding: 0 1.5rem;
  }

  .scene-border {
    position: relative;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    height: 400px;
    overflow: hidden;
    border: 2px solid rgba(200, 150, 62, 0.4);
    border-radius: 4px;
  }

  .scene-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  .scene-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(26, 58, 58, 0.6) 100%
    );
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 2rem;
  }

  .scene-caption {
    font-family: var(--font-script);
    font-size: 2.5rem;
    color: var(--color-cream);
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
    text-align: center;
    padding: 0 1.5rem;
  }

  @media (max-width: 600px) {
    .illustrated-scene {
      padding: 0 0.5rem;
    }

    .scene-border {
      height: 250px;
    }

    .scene-caption {
      font-size: 1.6rem;
    }
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/IllustratedScene.astro
git commit -m "feat: add IllustratedScene component replacing PhotoBanner"
```

---

## Task 9: Create OurStory Component

**Files:**
- Create: `src/components/OurStory.astro`
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/sv.json`
- Modify: `src/i18n/hi.json`

**Step 1: Add i18n keys for Our Story section**

Add to `src/i18n/en.json` (before the closing `}`):

```json
"nav.ourstory": "Our Story",
"ourstory.title": "Our Story",
"ourstory.milestone1.title": "The First Meeting",
"ourstory.milestone1.description": "Two strangers, one shared moment",
"ourstory.milestone2.title": "Park Walk",
"ourstory.milestone2.description": "Where conversations never ended",
"ourstory.milestone3.title": "City Adventures",
"ourstory.milestone3.description": "Exploring the world together",
"ourstory.milestone4.title": "Together Since",
"ourstory.milestone4.date": "26.09.05"
```

Add equivalent keys to `sv.json` and `hi.json` with translated values.

**Step 2: Create the OurStory component**

```astro
---
import { t } from '../i18n/utils';
import GoldFrame from './GoldFrame.astro';
import LotusVineBorder from './motifs/LotusVineBorder.astro';

interface Props {
  lang: string;
}

const { lang } = Astro.props;

const milestones = ['milestone1', 'milestone2', 'milestone3', 'milestone4'];
---

<section id="ourstory" class="ourstory">
  <GoldFrame>
    <h2 class="section-title">{t(lang, 'ourstory.title')}</h2>
    <div class="ourstory-divider">
      <LotusVineBorder width="200px" />
    </div>

    <div class="ourstory-banner">
      <img src="/illustrations/love-story-timeline.png" alt="Our love story timeline" loading="lazy" />
    </div>

    <div class="ourstory-milestones">
      {milestones.map((ms) => (
        <div class="milestone reveal">
          <h3 class="milestone-title">{t(lang, `ourstory.${ms}.title`)}</h3>
          <p class="milestone-desc">
            {t(lang, `ourstory.${ms}.description`) || t(lang, `ourstory.${ms}.date`)}
          </p>
        </div>
      ))}
    </div>
  </GoldFrame>
</section>

<style>
  .ourstory {
    position: relative;
    padding: var(--section-padding);
  }

  .ourstory-divider {
    text-align: center;
    margin-bottom: 2rem;
  }

  .ourstory-banner {
    width: 100%;
    max-width: 800px;
    margin: 0 auto 2rem;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(200, 150, 62, 0.3);
  }

  .ourstory-banner img {
    width: 100%;
    height: auto;
    display: block;
  }

  .ourstory-milestones {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .milestone {
    text-align: center;
    flex: 1;
  }

  .milestone-title {
    font-family: var(--font-script);
    font-size: 1.3rem;
    color: var(--color-gold-light);
    margin-bottom: 0.25rem;
  }

  .milestone-desc {
    font-size: 0.9rem;
    color: var(--color-cream);
    opacity: 0.8;
  }

  @media (max-width: 600px) {
    .ourstory-milestones {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
```

**Step 3: Commit**

```bash
git add src/components/OurStory.astro src/i18n/en.json src/i18n/sv.json src/i18n/hi.json
git commit -m "feat: add OurStory section with illustrated timeline"
```

---

## Task 10: Restyle Welcome Component for Dark Theme

**Files:**
- Modify: `src/components/Welcome.astro`

**Step 1: Replace the entire Welcome component**

Update imports to use new motifs, add illustration, restyle for dark background:

```astro
---
import { t } from '../i18n/utils';
import GoldFrame from './GoldFrame.astro';
import LotusVineBorder from './motifs/LotusVineBorder.astro';

interface Props {
  lang: string;
}

const { lang } = Astro.props;
---

<section class="welcome reveal">
  <GoldFrame>
    <h2 class="section-title">{t(lang, 'welcome.title')}</h2>
    <div class="welcome-divider">
      <LotusVineBorder width="200px" />
    </div>
    <div class="welcome-illustration">
      <img src="/illustrations/couple-eating.png" alt="Priya and Tim sharing a meal" loading="lazy" />
    </div>
    <div class="welcome-letter">
      <p class="welcome-body">{t(lang, 'welcome.body')}</p>
      <p class="welcome-signature">{t(lang, 'welcome.signature')}</p>
    </div>
  </GoldFrame>
</section>

<style>
  .welcome {
    padding: var(--section-padding);
    position: relative;
  }

  .welcome .section-title {
    margin-bottom: 0.75rem;
  }

  .welcome-divider {
    text-align: center;
    margin-bottom: 2rem;
  }

  .welcome-illustration {
    max-width: 400px;
    margin: 0 auto 2rem;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(200, 150, 62, 0.3);
  }

  .welcome-illustration img {
    width: 100%;
    height: auto;
    display: block;
  }

  .welcome-letter {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }

  .welcome-body {
    font-size: 1.05rem;
    line-height: 1.8;
    color: var(--color-cream);
    margin-bottom: 1.5rem;
  }

  .welcome-signature {
    font-family: var(--font-script);
    font-size: 1.8rem;
    color: var(--color-gold-light);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/Welcome.astro
git commit -m "style: restyle Welcome section for dark storybook theme"
```

---

## Task 11: Create StoryVenue Component

**Files:**
- Create: `src/components/StoryVenue.astro`

**Step 1: Create the component**

Replaces `Venue.astro`. Centers on the treasure map illustration instead of polaroids and text.

```astro
---
import { t } from '../i18n/utils';
import GoldFrame from './GoldFrame.astro';
import LotusVineBorder from './motifs/LotusVineBorder.astro';

interface Props {
  lang: string;
}

const { lang } = Astro.props;
---

<section id="venue" class="venue reveal">
  <GoldFrame>
    <h2 class="section-title">{t(lang, 'venue.title')}</h2>
    <div class="venue-divider">
      <LotusVineBorder width="200px" />
    </div>

    <div class="venue-map">
      <img src="/illustrations/venue-map.png" alt="Illustrated map of Wiks Slott" loading="lazy" />
    </div>

    <div class="venue-details">
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
  </GoldFrame>
</section>

<style>
  .venue {
    padding: var(--section-padding);
    position: relative;
  }

  .venue .section-title {
    margin-bottom: 0.75rem;
  }

  .venue-divider {
    text-align: center;
    margin-bottom: 2rem;
  }

  .venue-map {
    max-width: 500px;
    margin: 0 auto 2rem;
    border-radius: 4px;
    overflow: hidden;
    border: 2px solid rgba(200, 150, 62, 0.4);
  }

  .venue-map img {
    width: 100%;
    height: auto;
    display: block;
  }

  .venue-details {
    max-width: var(--max-width);
    margin: 0 auto;
    text-align: center;
  }

  .venue-name {
    font-size: 1.5rem;
    color: var(--color-gold-light);
    margin-bottom: 0.5rem;
  }

  .venue-address {
    color: var(--color-cream);
    opacity: 0.8;
    margin-bottom: 1rem;
  }

  .venue-description {
    margin-bottom: 1.5rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    color: var(--color-cream);
  }

  .venue-directions {
    display: inline-block;
    padding: 0.6rem 1.5rem;
    background-color: var(--color-gold);
    color: var(--color-base-dark);
    border-radius: 6px;
    font-weight: 600;
    transition: background-color 0.2s;
  }

  .venue-directions:hover {
    background-color: var(--color-gold-light);
    color: var(--color-base-dark);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/StoryVenue.astro
git commit -m "feat: add StoryVenue component with illustrated treasure map"
```

---

## Task 12: Restyle Schedule Component for Dark Theme

**Files:**
- Modify: `src/components/Schedule.astro`

**Step 1: Update imports**

Replace the imports at the top of the file (lines 2-5):

```astro
import { t } from "../i18n/utils";
import LotusCorner from "./motifs/LotusCorner.astro";
import LotusVineBorder from "./motifs/LotusVineBorder.astro";
import GoldFrame from "./GoldFrame.astro";
```

**Step 2: Replace template section**

Remove the two Polaroid instances and replace the MehndiCorner with LotusCorner. Replace FloralDivider with LotusVineBorder. Wrap the content in GoldFrame. Add the couple illustration as a decorative element.

The section content (lines 18-108) should become:

```astro
<section id="schedule" class="section schedule reveal">
  <GoldFrame>
    <div class="schedule-motif-left">
      <LotusCorner size="100px" color="var(--color-gold)" opacity={0.15} />
    </div>
    <div class="schedule-motif-right">
      <LotusCorner size="100px" color="var(--color-gold)" opacity={0.15} flip />
    </div>

    <h2 class="section-title">{t(lang, "schedule.title")}</h2>
    <div class="schedule-divider">
      <LotusVineBorder width="200px" />
    </div>

    <div class="schedule-illustration">
      <img src="/illustrations/couple-traditional.png" alt="Priya and Tim in traditional dress" loading="lazy" />
    </div>

    <div class="timeline">
      <!-- Same timeline content as before (day headers + events) -->
    </div>
  </GoldFrame>
</section>
```

**Step 3: Update the CSS styles**

Key color changes:
- `.day-header` background: `rgba(42, 75, 75, 0.8)` instead of `var(--color-cream)`
- `.day-title` color: `var(--color-cream)` instead of `var(--color-teal-dark)`
- `.timeline-dot` border: `2px solid var(--color-base-dark)` instead of `var(--color-cream)`
- `.timeline-content h3` color: `var(--color-gold-light)`
- `.timeline-content p` color: `var(--color-cream)` with `opacity: 0.8`
- `.event-explanation` background: `rgba(42, 75, 75, 0.5)` border-left: `3px solid var(--color-gold)`
- Remove all Polaroid positioning styles
- Add `.schedule-illustration` with `max-width: 350px; margin: 0 auto 2rem; border-radius: 4px; overflow: hidden; border: 1px solid rgba(200, 150, 62, 0.3);`

**Step 4: Commit**

```bash
git add src/components/Schedule.astro
git commit -m "style: restyle Schedule section for dark storybook theme"
```

---

## Task 13: Restyle RSVP Component for Dark Theme

**Files:**
- Modify: `src/components/Rsvp.astro`

**Step 1: Replace the entire RSVP component**

Remove polaroid, replace MehndiCorner with LotusCorner, replace FloralDivider with LotusVineBorder, add lotus medallion illustration.

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

    <div class="rsvp-medallion">
      <img src="/illustrations/lotus-medallion.png" alt="Decorative lotus medallion" loading="lazy" />
    </div>

    <div class="rsvp-placeholder">
      <p>{t(lang, "rsvp.message")}</p>
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

  .rsvp-medallion {
    max-width: 200px;
    margin: 0 auto 2rem;
  }

  .rsvp-medallion img {
    width: 100%;
    height: auto;
    display: block;
  }

  .rsvp-placeholder {
    max-width: var(--max-width);
    margin: 0 auto;
    text-align: center;
    padding: 3rem 2rem;
    border: 2px dashed var(--color-gold);
    border-radius: 12px;
    color: var(--color-cream);
    font-size: 1.1rem;
  }

  @media (max-width: 600px) {
    .rsvp-motif-left,
    .rsvp-motif-right {
      display: none;
    }
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/Rsvp.astro
git commit -m "style: restyle RSVP section for dark storybook theme with lotus medallion"
```

---

## Task 14: Update BaseLayout for Dark Theme

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Update imports (lines 2-5)**

Replace DalaHorse with LotusVineBorder:

```astro
import '../styles/global.css';
import LanguageSwitcher from '../components/LanguageSwitcher.astro';
import LotusVineBorder from '../components/motifs/LotusVineBorder.astro';
import { t } from '../i18n/utils';
```

**Step 2: Update navigation links (line 26-29)**

Add a link to the new Our Story section:

```html
<a href="#hero">{t(lang, 'nav.hero')}</a>
<a href="#ourstory">{t(lang, 'nav.ourstory')}</a>
<a href="#venue">{t(lang, 'nav.venue')}</a>
<a href="#schedule">{t(lang, 'nav.schedule')}</a>
<a href="#rsvp">{t(lang, 'nav.rsvp')}</a>
```

**Step 3: Replace footer (lines 39-47)**

Replace DalaHorse motifs with LotusVineBorder:

```html
<footer class="site-footer">
  <div class="footer-border">
    <LotusVineBorder width="250px" color="var(--color-gold-light)" opacity={0.4} />
  </div>
  <p>{t(lang, 'footer.message')}</p>
</footer>
```

**Step 4: Remove watercolor wash styles (lines 119-165)**

Delete the entire `<style is:global>` block that creates the `::before` pseudo-elements on #venue, #schedule, and #rsvp. These watercolor washes were for the light theme.

**Step 5: Update header/footer CSS**

The header background stays dark (`var(--color-teal-dark)` which now maps to `#1A3A3A`). Update footer to be slightly different shade:

```css
.site-footer {
  text-align: center;
  padding: 2rem 1.5rem;
  background-color: rgba(15, 30, 30, 0.8);
  color: var(--color-cream);
  font-family: var(--font-heading);
  font-size: 1.1rem;
}

.footer-border {
  margin-bottom: 1rem;
}
```

Remove `.footer-dala-left`, `.footer-dala-right` styles and related mobile styles.

**Step 6: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "style: update BaseLayout for dark storybook theme, add Our Story nav"
```

---

## Task 15: Update Page Files to Use New Components

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/sv/index.astro`
- Modify: `src/pages/hi/index.astro`

**Step 1: Update English page (`src/pages/index.astro`)**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PeacockHero from '../components/PeacockHero.astro';
import OurStory from '../components/OurStory.astro';
import IllustratedScene from '../components/IllustratedScene.astro';
import Welcome from '../components/Welcome.astro';
import StoryVenue from '../components/StoryVenue.astro';
import Schedule from '../components/Schedule.astro';
import Rsvp from '../components/Rsvp.astro';

const lang = 'en';
---

<BaseLayout lang={lang}>
  <PeacockHero lang={lang} />
  <OurStory lang={lang} />
  <IllustratedScene image="/illustrations/swedish-archipelago.png" caption="From the land of midnight sun" alt="Swedish red cottages by the sea" />
  <Welcome lang={lang} />
  <IllustratedScene image="/illustrations/himalayan-peaks.png" caption="To the peaks of the Himalayas" alt="Snow-capped Himalayan mountains" />
  <StoryVenue lang={lang} />
  <IllustratedScene image="/illustrations/swedish-meadow.png" caption="Where wildflowers dance" alt="Swedish meadow with bluebells and strawberries" />
  <Schedule lang={lang} />
  <IllustratedScene image="/illustrations/holding-hands.png" caption="Two hands, one journey" alt="Couple holding hands with mehndi designs" />
  <Rsvp lang={lang} />
</BaseLayout>
```

**Step 2: Apply same changes to Swedish page (`src/pages/sv/index.astro`)**

Same structure, but with `const lang = 'sv';` and import path adjusted (`../../layouts/BaseLayout.astro`, etc.)

**Step 3: Apply same changes to Hindi page (`src/pages/hi/index.astro`)**

Same structure, but with `const lang = 'hi';`

**Step 4: Run dev server and verify**

Run: `npx astro dev`
Expected: Full storybook experience — dark background, illustrated hero, all sections with gold frames, illustrated scene breaks between sections, new Our Story section.

**Step 5: Commit**

```bash
git add src/pages/index.astro src/pages/sv/index.astro src/pages/hi/index.astro
git commit -m "feat: wire up all storybook components in page files"
```

---

## Task 16: Add i18n Keys for Swedish and Hindi

**Files:**
- Modify: `src/i18n/sv.json`
- Modify: `src/i18n/hi.json`

**Step 1: Add Our Story translations to Swedish**

```json
"nav.ourstory": "Vår historia",
"ourstory.title": "Vår historia",
"ourstory.milestone1.title": "Första mötet",
"ourstory.milestone1.description": "Två främlingar, ett delat ögonblick",
"ourstory.milestone2.title": "Promenaden i parken",
"ourstory.milestone2.description": "Där samtalen aldrig tog slut",
"ourstory.milestone3.title": "Stadsäventyr",
"ourstory.milestone3.description": "Att utforska världen tillsammans",
"ourstory.milestone4.title": "Tillsammans sedan",
"ourstory.milestone4.date": "26.09.05"
```

**Step 2: Add Our Story translations to Hindi**

```json
"nav.ourstory": "हमारी कहानी",
"ourstory.title": "हमारी कहानी",
"ourstory.milestone1.title": "पहली मुलाकात",
"ourstory.milestone1.description": "दो अजनबी, एक साझा पल",
"ourstory.milestone2.title": "पार्क में सैर",
"ourstory.milestone2.description": "जहाँ बातें कभी खत्म नहीं हुईं",
"ourstory.milestone3.title": "शहर के किस्से",
"ourstory.milestone3.description": "साथ मिलकर दुनिया देखना",
"ourstory.milestone4.title": "साथ तब से",
"ourstory.milestone4.date": "26.09.05"
```

**Step 3: Commit**

```bash
git add src/i18n/sv.json src/i18n/hi.json
git commit -m "feat: add Our Story i18n translations for Swedish and Hindi"
```

---

## Task 17: Add Falling Leaves CSS Animation

**Files:**
- Create: `src/components/FallingLeaves.astro`
- Modify: `src/layouts/BaseLayout.astro` (add the component)

**Step 1: Create the FallingLeaves component**

```astro
---
interface Props {
  count?: number;
}

const { count = 6 } = Astro.props;
const leaves = Array.from({ length: count }, (_, i) => i);
---

<div class="falling-leaves" aria-hidden="true">
  {leaves.map((i) => (
    <div
      class="leaf"
      style={`--delay: ${i * 2.5}s; --x-start: ${15 + i * 13}%; --duration: ${8 + (i % 3) * 3}s; --x-drift: ${(i % 2 === 0 ? 1 : -1) * (20 + i * 5)}px;`}
    />
  ))}
</div>

<style>
  .falling-leaves {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 50;
    overflow: hidden;
  }

  .leaf {
    position: absolute;
    top: -20px;
    left: var(--x-start);
    width: 8px;
    height: 6px;
    background: var(--color-gold);
    border-radius: 0 50% 50% 50%;
    opacity: 0.4;
    animation: fall var(--duration) var(--delay) infinite ease-in-out;
    transform: rotate(45deg);
  }

  @keyframes fall {
    0% {
      top: -20px;
      opacity: 0;
      transform: rotate(45deg) translateX(0);
    }
    10% {
      opacity: 0.4;
    }
    90% {
      opacity: 0.3;
    }
    100% {
      top: 100vh;
      opacity: 0;
      transform: rotate(180deg) translateX(var(--x-drift));
    }
  }

  @media (max-width: 600px) {
    .leaf:nth-child(n+4) {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .leaf {
      animation: none;
      display: none;
    }
  }
</style>
```

**Step 2: Add FallingLeaves to BaseLayout**

In `src/layouts/BaseLayout.astro`, import and add just after the opening `<body>` tag:

```astro
import FallingLeaves from '../components/FallingLeaves.astro';
```

```html
<body>
  <FallingLeaves count={6} />
  <header>...
```

**Step 3: Run dev server and verify**

Run: `npx astro dev`
Expected: Small gold leaf shapes slowly drifting down across the page. Should be subtle and not distracting. Reduced to 3 on mobile. Disabled for `prefers-reduced-motion`.

**Step 4: Commit**

```bash
git add src/components/FallingLeaves.astro src/layouts/BaseLayout.astro
git commit -m "feat: add falling leaves CSS animation"
```

---

## Task 18: Add Gold Frame Shimmer Animation

**Files:**
- Modify: `src/components/GoldFrame.astro`

**Step 1: Add a shimmer pseudo-element to the gold border**

Add this to the `.gold-frame-border` in the `<style>` block:

```css
.gold-frame-border::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(200, 150, 62, 0.08) 50%,
    transparent 100%
  );
  animation: shimmer 8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0%, 100% { left: -100%; }
  50% { left: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .gold-frame-border::after {
    animation: none;
    display: none;
  }
}
```

**Step 2: Commit**

```bash
git add src/components/GoldFrame.astro
git commit -m "feat: add subtle shimmer animation to gold frame borders"
```

---

## Task 19: Add Parallax to Illustrated Scenes

**Files:**
- Modify: `src/components/IllustratedScene.astro`

**Step 1: Add a simple CSS parallax effect**

Update the `.scene-img` style to add a subtle parallax scroll effect:

```css
.scene-border {
  /* existing styles... */
  overflow: hidden;
}

.scene-img {
  width: 100%;
  height: 120%;
  object-fit: cover;
  object-position: center;
  display: block;
  margin-top: -10%;
}
```

**Step 2: Add a script block for parallax**

```html
<script>
  const scenes = document.querySelectorAll('.scene-img');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const handleScroll = () => {
            const rect = entry.target.parentElement!.getBoundingClientRect();
            const progress = 1 - (rect.bottom / (window.innerHeight + rect.height));
            const offset = progress * 20 - 10;
            (entry.target as HTMLElement).style.transform = `translateY(${offset}%)`;
          };
          window.addEventListener('scroll', handleScroll, { passive: true });
          entry.target.setAttribute('data-parallax', 'true');
        }
      });
    },
    { threshold: 0 }
  );

  scenes.forEach((s) => observer.observe(s));
</script>
```

**Step 3: Commit**

```bash
git add src/components/IllustratedScene.astro
git commit -m "feat: add parallax scroll effect to illustrated scene breaks"
```

---

## Task 20: Visual Review and Polish

**Files:**
- Various minor adjustments

**Step 1: Run the dev server and do a full visual review**

Run: `npx astro dev`

Check each section top-to-bottom:
- Hero: Peacock illustration visible, text readable, gold accents
- Our Story: Timeline banner shows, milestones aligned
- Scene breaks: Illustrations load, captions visible, parallax smooth
- Welcome: Couple illustration, letter text readable on dark
- Venue: Map illustration, details readable, directions button works
- Schedule: Timeline gold line visible, day headers styled, expandable details work
- RSVP: Lotus medallion, dashed border visible
- Footer: Lotus vine border, text centered
- Navigation: All links work, language switcher functional
- Mobile (resize to <600px): Gold frames simplify, scenes shorter, milestones vertical, leaves reduced
- Falling leaves: Subtle, not distracting
- Scroll reveals: Sections fade in on scroll

**Step 2: Fix any issues found**

Address spacing, color contrast, alignment, or overflow issues discovered during review.

**Step 3: Final commit**

```bash
git add -u
git commit -m "fix: polish and visual adjustments after full review"
```

---

## Task Summary

| Task | Description | Dependencies |
|------|-------------|-------------|
| 1 | Copy illustration assets | None |
| 2 | Dark theme CSS variables | None |
| 3 | LotusCorner SVG motif | None |
| 4 | LotusVineBorder SVG motif | None |
| 5 | GoldFrame component | Task 3 |
| 6 | PaisleyBackground component | None |
| 7 | PeacockHero component | Task 5 |
| 8 | IllustratedScene component | None |
| 9 | OurStory component | Tasks 4, 5 |
| 10 | Restyle Welcome | Tasks 4, 5 |
| 11 | StoryVenue component | Tasks 4, 5 |
| 12 | Restyle Schedule | Tasks 3, 4, 5 |
| 13 | Restyle RSVP | Tasks 3, 4, 5 |
| 14 | Update BaseLayout | Tasks 4, 17 |
| 15 | Update page files | Tasks 7-13 |
| 16 | i18n translations | Task 9 |
| 17 | Falling leaves animation | None |
| 18 | Gold frame shimmer | Task 5 |
| 19 | Parallax for scenes | Task 8 |
| 20 | Visual review and polish | All above |

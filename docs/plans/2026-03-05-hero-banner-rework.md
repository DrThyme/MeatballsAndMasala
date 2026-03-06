# Hero Banner Rework Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current PeacockHero (background image + HTML text overlay) with a simple responsive `<img>` hero using a new illustration with baked-in text.

**Architecture:** Single component rewrite. The new hero is a full-width `<img>` that scales naturally with viewport width. A visually-hidden `<h1>` provides accessibility. No overlay, no HTML text rendering.

**Tech Stack:** Astro, CSS

---

### Task 1: Copy new image and remove old one

**Files:**
- Create: `public/illustrations/hero-banner.png` (copy from `new-style-pics/Gemini_Generated_Image_6lmumb6lmumb6lmu.png`)
- Delete: `public/illustrations/peacock-hero.png`

**Step 1: Copy the new image**

```bash
cp new-style-pics/Gemini_Generated_Image_6lmumb6lmumb6lmu.png public/illustrations/hero-banner.png
```

**Step 2: Remove the old image**

```bash
rm public/illustrations/peacock-hero.png
```

**Step 3: Commit**

```bash
git add public/illustrations/hero-banner.png
git rm public/illustrations/peacock-hero.png
git commit -m "feat: replace peacock hero image with new illustrated banner"
```

---

### Task 2: Rewrite PeacockHero component

**Files:**
- Modify: `src/components/PeacockHero.astro` (full rewrite)

**Step 1: Rewrite the component**

Replace the entire content of `src/components/PeacockHero.astro` with:

```astro
---
import { t } from '../i18n/utils';

interface Props {
  lang: string;
}

const { lang } = Astro.props;
---

<section id="hero" class="hero">
  <img
    src="/illustrations/hero-banner.png"
    alt={`${t(lang, 'hero.names')} — ${t(lang, 'hero.date')}. ${t(lang, 'hero.tagline')}`}
    class="hero-img"
  />
  <h1 class="sr-only">
    {t(lang, 'hero.welcome')} {t(lang, 'hero.names')} — {t(lang, 'hero.date')}. {t(lang, 'hero.tagline')}
  </h1>
</section>

<style>
  .hero {
    background-color: #1A3A3A;
    overflow: hidden;
  }

  .hero-img {
    width: 100%;
    height: auto;
    display: block;
    max-height: 90vh;
    object-fit: contain;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
```

**Step 2: Visual check**

Run the dev server and verify:
- Desktop: image fills width, text is readable, no cropping
- Mobile (375px): image scales down, fully visible, ~40-50vh height

```bash
npm run dev
```

**Step 3: Commit**

```bash
git add src/components/PeacockHero.astro
git commit -m "feat: rewrite PeacockHero as simple responsive image hero"
```

---

### Task 3: Verify build

**Step 1: Run the build**

```bash
npm run build
```

Expected: Clean build with no errors.

**Step 2: Commit (if any adjustments needed)**

Only if Task 3 Step 1 required fixes.

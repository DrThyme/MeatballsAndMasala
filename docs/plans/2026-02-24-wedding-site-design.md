# MeatballsAndMasala — Wedding Site Design

## Overview

A single-page, trilingual wedding website for a Swedish-Indian fusion wedding. Built with Astro, using warm and colorful aesthetics that blend both cultures.

## Site Structure & Routing

Single-page layout with these sections (top to bottom):

1. **Hero** — Names, wedding date, welcome message
2. **Venue** — Location details, link to directions
3. **Schedule/Activities** — Timeline of the day's events
4. **RSVP** — Styled placeholder (non-functional for now)
5. **Footer** — Contact info or closing message

URL structure:
- `/` — English (default)
- `/sv/` — Swedish
- `/hi/` — Hindi

Sticky top nav with anchor links to each section + a language switcher (EN / SV / HI).

## Visual Design

**Color palette:**
- Primary accent: saffron/marigold gold (Indian wedding tradition)
- Contrast: deep teal or navy
- Background: cream/warm white
- Secondary accent: soft blush or terracotta

**Typography:**
- Decorative/serif font for headings
- Clean sans-serif for body text
- Google Fonts with Devanagari subset support (Noto family covers all three languages)

**Decorative elements:**
- Subtle fusion patterns (Dala horse motifs meets rangoli/mandala) — kept light
- Image placeholders for user-supplied photography

**Responsive:** Mobile-first design.

## i18n Architecture

**Translation files** in `src/i18n/`:
- `en.json`, `sv.json`, `hi.json`
- Flat key-value structure organized by section (e.g., `hero.welcome`, `venue.title`)

**Helper function:** `t(key)` utility that takes the current locale and returns the translated string. No external i18n library.

**Astro i18n config** in `astro.config.mjs`:
- Default locale: `en`
- Locales: `en`, `sv`, `hi`
- Routing: `prefix-other-locales` (English at `/`, others prefixed)

All translatable text lives in JSON files, not hardcoded in components. Placeholder translations to start.

## Component Breakdown

**Layout:**
- `BaseLayout.astro` — HTML lang attribute per locale, sticky nav, language switcher, footer, slot for content

**Section components:**
- `Hero.astro` — Background image/color, names, date, welcome text
- `Venue.astro` — Location name, address, description, Google Maps link
- `Schedule.astro` — Timeline/list of events with times and descriptions
- `Rsvp.astro` — Styled placeholder with "Coming soon" message
- `LanguageSwitcher.astro` — EN / SV / HI links

**Pages:**
- `src/pages/index.astro` — English (composes all section components)
- `src/pages/sv/index.astro` — Swedish
- `src/pages/hi/index.astro` — Hindi

Each page passes locale to the layout, which feeds into `t()` for translations.

**Styling:** Astro scoped styles + global CSS for palette, typography, and shared variables.

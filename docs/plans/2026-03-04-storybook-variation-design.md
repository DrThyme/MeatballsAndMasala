# Storybook Variation Design

## Overview

A complete visual reskin of the MeatballsAndMasala wedding website, transforming it from an elegant photo-driven design into a richly illustrated storybook experience. The site keeps the same Astro framework and trilingual support but replaces all photography with AI-generated illustrations, uses dark ornate backgrounds, and reflows the narrative with a new "Our Story" section.

**Branch:** `feat/visual-overhaul-v2`
**Approach:** New SVG motif components + CSS reskin (Approach B)

---

## Visual Identity

### Color Palette

| Role           | Color     | Usage                                    |
|----------------|-----------|------------------------------------------|
| Base dark      | `#1A3A3A` | Primary background                       |
| Deep brown     | `#3D2B1F` | Secondary background, gradient blends    |
| Gold           | `#C8963E` | Borders, accents, divider lines          |
| Gold light     | `#D4AA5A` | Lotus motifs, highlights                 |
| Teal accent    | `#2A7B7B` | Peacock feathers, links, hover states    |
| Deep red       | `#8B2D2D` | Saree color, warm accent                 |
| Cream          | `#F5E6C8` | Body text, headings                      |
| Warm white     | `#FDF6EC` | Highlights, emphasized text              |

### Typography

- **Section titles:** Great Vibes (cursive, storybook feel)
- **Headings:** Noto Serif / Noto Serif Devanagari (Hindi)
- **Body:** Noto Sans
- **Captions/handwritten:** Caveat
- All text in cream/warm-white for contrast against dark backgrounds

### Signature Visual Elements

- **Ornate gold frame borders** (lotus corners + vine edges) around every section
- **Paisley background texture** — repeating SVG, subtle 5-10% opacity teal-on-dark-teal
- **Falling leaves** — small orange/gold CSS-animated leaves drifting down
- **Dark throughout** — no light sections, fully immersive dark mood

---

## Page Structure

### Section Flow (Narrative Chapter Progression)

1. **Hero / Title Page**
   - Peacock illustration (`tqld1j...`) as background
   - "Priya & Tim" in Great Vibes, date, gold frame
   - Full viewport height

2. **Our Story** (NEW)
   - Timeline banner illustration (`vxsy5e...`) as centerpiece
   - Horizontal milestones: The First Meeting → Park Walk → City Adventures → EST. 26.09.05
   - Each milestone fades/slides in on scroll
   - Vertical layout on mobile

3. **Illustrated Scene: Swedish Archipelago**
   - Red cottages illustration (`nk53rq...`)
   - Full-width, gold-framed scene break
   - Caption: "From the land of midnight sun"

4. **Welcome / Invitation**
   - Couple feeding each other illustration (`1azokh...`) as centerpiece
   - Invitation letter in cream text on dark background
   - Gold frame around entire section

5. **Illustrated Scene: Himalayas**
   - Mountain illustration (`y88aut...` or `4xm45r...`)
   - Caption: "To the peaks of the Himalayas"

6. **The Venue**
   - Treasure map illustration (`9vbst1...`) as centerpiece
   - Venue details below the map
   - Map already includes "The Venue - September 5, 2026"

7. **Illustrated Scene: Swedish Meadow**
   - Bluebells and strawberries illustration (`4yzb18...`)
   - Caption: "Where wildflowers dance"

8. **Schedule / Celebrations**
   - Couple in traditional dress illustration (`jw2i3q...`) as decorative element
   - Gold-accented timeline on dark background
   - Day 1: Haldi & Mehendi, Day 2: Wedding Day
   - Expandable "Learn More" sections preserved

9. **Illustrated Scene: Hands**
   - Mehndi hands illustration (`oaytg4...`)
   - Caption: "Two hands, one journey"

10. **RSVP**
    - Lotus medallion illustration (`9c8rhd...`) as central decoration
    - RSVP form on dark background with gold frame

11. **Footer**
    - Dark with gold lotus vine border
    - "We can't wait to celebrate with you!"

---

## Components

### New Components

| Component               | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| `GoldFrame.astro`      | Reusable ornate border with lotus corners and vine edges. CSS border-image or absolutely positioned SVG. Takes `size` prop. |
| `PaisleyBackground.astro` | Repeating SVG paisley pattern as section background. Subtle opacity, teal-on-dark-teal. |
| `LotusVineBorder.astro` | Horizontal divider with lotus center and scrolling vines. Replaces `FloralDivider.astro`. |
| `PeacockHero.astro`    | Hero section using peacock illustration. Full-viewport with text overlay.   |
| `OurStory.astro`       | New section: illustrated timeline of the couple's journey.                  |
| `IllustratedScene.astro` | Full-width illustrated scene break. Takes illustration image + caption. Replaces `PhotoBanner.astro`. |
| `StoryVenue.astro`     | Venue section centered around the treasure map illustration.                |
| `LotusCorner.astro`    | Corner decoration with lotus + vine. Replaces `MehndiCorner.astro`.        |

### Restyled Components (keep, modify CSS)

| Component               | Changes                                                                    |
|------------------------|-----------------------------------------------------------------------------|
| `Welcome.astro`        | Dark background, gold frame, couple illustration                           |
| `Schedule.astro`       | Gold-accented timeline on dark, couple illustration as decoration           |
| `Rsvp.astro`           | Lotus medallion centerpiece, dark background, gold frame                   |
| `LanguageSwitcher.astro` | Restyled for dark theme (cream text, gold accents)                        |
| `BaseLayout.astro`     | Updated global styles, dark body background, new CSS variables             |

### Removed Components

| Component               | Reason                                                                     |
|------------------------|-----------------------------------------------------------------------------|
| `Polaroid.astro`       | No polaroids in storybook version                                          |
| `Mandala.astro`        | Replaced by lotus/peacock motifs                                           |
| `MehndiCorner.astro`   | Replaced by `LotusCorner.astro`                                           |
| `DalaHorse.astro`      | Not needed — Swedish culture represented through illustrations              |
| `FloralDivider.astro`  | Replaced by `LotusVineBorder.astro`                                        |
| `PhotoBanner.astro`    | Replaced by `IllustratedScene.astro`                                       |

### SVG Motifs to Create

- Gold lotus vine border (for `GoldFrame`)
- Paisley repeating pattern tile
- Lotus + paisley horizontal divider
- Lotus corner ornament

---

## Interactions & Animations

### Kept from Original
- Scroll-reveal fade-in animations (0.6s ease, 20px translateY)
- Smooth scroll navigation with hash anchors

### New
- **Falling leaves** — CSS keyframe animation, 5-8 small orange/gold leaves drifting down slowly. Reduced to 2-3 on mobile.
- **Gold frame shimmer** — Subtle traveling highlight on gold borders.
- **Scene parallax** — Slight parallax on illustrated scene breaks during scroll.
- **Our Story step-through** — Each milestone fades/slides in on scroll. Horizontal on desktop, vertical on mobile.

### Removed
- Polaroid hover effects (no polaroids)

---

## Mobile Responsiveness

- Gold frames simplify (thinner borders, simpler corner ornaments)
- Falling leaves reduced to 2-3 for performance
- Scene breaks: 200px height (vs 400px desktop)
- Our Story timeline: vertical layout
- Navigation: smaller text, dark theme
- All sections: reduced padding (`3rem 1rem`)

---

## Assets

### Illustrations (from `/new-style-pics/`)

| File (prefix)   | Usage                         |
|-----------------|-------------------------------|
| `tqld1j...`    | Hero — peacocks               |
| `5knmaa...`    | Divider — paisley lotus       |
| `9c8rhd...`    | RSVP — lotus medallion        |
| `nk53rq...`    | Scene — Swedish archipelago   |
| `1azokh...`    | Welcome — couple eating       |
| `jw2i3q...`    | Schedule — couple dressed     |
| `y88aut...`    | Scene — Himalayan peaks       |
| `4xm45r...`    | Scene — mountain meadow       |
| `4yzb18...`    | Scene — Swedish meadow        |
| `vxsy5e...`    | Our Story — timeline banner   |
| `oaytg4...`    | Scene — holding hands         |
| `9vbst1...`    | Venue — treasure map          |

---

## What Stays the Same

- Astro 5 framework and project structure
- Trilingual support (EN/SV/HI) with i18n system
- Sticky navigation with hash anchors
- Same wedding content/copy (dates, venue, schedule, traditions)
- Responsive breakpoint at 600px
- Intersection Observer for scroll reveals

# Visual Design Overhaul — Scrapbook Aesthetic

**Date:** 2026-02-25
**Approach:** SVG + CSS Hybrid
**Goal:** Transform the site from a clean/minimal template into a warm, handcrafted wedding scrapbook with cultural character from both Swedish and Indian traditions.

## 1. Background & Texture Foundation

**Paper texture base:** Replace the flat `#FDF6EC` cream background with a subtle paper grain effect using CSS repeating patterns (tiny noise). Every section gets the scrapbook "page" feel.

**Watercolor wash accents:** Soft radial-gradient blobs in blush and gold tones at low opacity, placed at section boundaries to create a hand-painted atmosphere.

**Section dividers:** Replace hard edges between sections with organic shapes — torn-paper or scalloped borders using CSS `clip-path` or SVG waves. Sections feel like layered scrapbook pages rather than stacked boxes.

## 2. Scattered Polaroid Photos

**Component:** `Polaroid.astro` — reusable, accepts `src`, `caption`, `rotation` props.

**Styling:**
- Thick white border (classic Polaroid frame, thicker on bottom)
- Subtle drop shadow for depth
- Random rotation range: -8deg to +8deg
- Optional handwritten-style caption beneath the image

**Placement (absolute positioning within sections):**
- **Hero:** One polaroid peeking from left, one from right
- **Venue:** One tilted polaroid near the map link
- **Schedule:** Polaroids flanking the timeline
- **RSVP:** One or two framing the form area
- Roughly 2-3 per section, placed at edges/corners to avoid obscuring content

**Responsive:** On mobile (< 600px), polaroids hide or shrink significantly.

**Placeholders:** Solid colored rectangles with subtle gradients in the couple's palette — easy to swap for real photos later.

## 3. Cultural SVG Motifs

All SVGs colored with CSS custom properties for theme consistency.

**Motif types:**
- **Mehndi/henna patterns** — Paisley and floral line art as corner decorations and border accents. Used around section titles and the RSVP area.
- **Dala horse** — Simple outline of the Swedish Dala horse, used sparingly (1-2 instances) near venue section or footer.
- **Rangoli-inspired mandala** — Circular geometric pattern as a large, low-opacity background element behind the Hero title.
- **Floral vine dividers** — Vine/leaf SVG lines between content blocks, replacing plain `<hr>` elements.

**Placement philosophy:** Decorative, not dominant. Low opacity (15-30%) as background accents or small sizes as corner embellishments. Content always reads clearly above.

**Implementation:** Each motif is an Astro component (e.g., `MehndiCorner.astro`, `DalaHorse.astro`) accepting `color`, `size`, and `opacity` props.

## 4. Typography

**Headings:** Script/calligraphic font (`Great Vibes` or `Dancing Script` from Google Fonts) for couple's names and section headers — handwritten wedding invitation feel.

**Body:** Keep `Noto Sans` for readability.

**Captions/accents:** Handwritten font (`Caveat` or `Patrick Hand`) for polaroid captions and small decorative text.

**Decorative initials:** First letter of couple's names in Hero gets extra styling — larger size, gold, with mehndi-pattern SVG behind it as a drop cap.

**Hindi fallback:** Script fonts don't support Devanagari. Hindi pages fall back to `Noto Serif Devanagari` — elegant and culturally appropriate. Handwritten feel is English/Swedish only.

## 5. Color Palette

Existing palette retained with minor additions:

| Token | Value | Use |
|-------|-------|-----|
| Gold | `#D4A843` | Primary accent (unchanged) |
| Teal dark | `#0F2F3A` | Primary text (unchanged) |
| Teal medium | `#1B4D5C` | Secondary (unchanged) |
| Cream | `#FDF6EC` | Base background (unchanged) |
| Gold light | `#E8C96A` | Accents (unchanged) |
| Blush | `#D4917A` | Secondary accent (unchanged) |
| **Warm ivory** | `#FAF3E0` | **NEW** — Polaroid frame borders |
| **Shadow tone** | `rgba(15,47,58,0.12)` | **NEW** — Consistent card/polaroid shadows |

## 6. Animations (CSS only)

- **Polaroid settle:** On page load, polaroids rotate from a slightly exaggerated angle to their final rotation via CSS transition.
- **Scroll fade-in:** Section content fades in on scroll using `@keyframes` + `IntersectionObserver` (minimal JS — just toggles a CSS class).
- **Polaroid hover:** Slight lift on hover (`translateY` + shadow increase).

No heavy JS frameworks. Only JS is a small IntersectionObserver script for scroll-triggered animations.

## Technical Notes

- All decorative SVGs are Astro components for reuse and prop-based customization
- CSS custom properties control all colors — theme changes propagate automatically
- Paper texture and watercolor washes are CSS-only (gradients, patterns)
- Placeholder images are styled divs, not actual image files
- Mobile-first: decorative elements gracefully degrade on small screens

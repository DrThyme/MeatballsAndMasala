# Hero Banner Rework Design

## Summary

Replace the current PeacockHero (background image + HTML text overlay) with a simple responsive `<img>` hero using a new Gemini-generated illustration that has all wedding text baked into the artwork.

## Approach

**Simple `<img>` tag** — the image scales to full viewport width with natural aspect ratio. No cropping, no overlay, no HTML text. A visually-hidden `<h1>` provides accessibility and SEO.

## HTML Structure

```html
<section id="hero" class="hero">
  <img src="/illustrations/hero-banner.png" alt="..." class="hero-img" />
  <h1 class="sr-only">{translated names, date, tagline}</h1>
</section>
```

## Styling

- `.hero` — no min-height, background color `#1A3A3A` (matches image edges), `overflow: hidden`, optional `max-height: 90vh` for very large screens
- `.hero-img` — `width: 100%; height: auto; display: block`
- `.sr-only` — visually hidden text for screen readers

## Responsive Behavior

- Image always fills width, height follows natural aspect ratio (~16:9)
- Mobile (~375px): roughly 40-50% viewport height, fully visible
- Desktop: taller, capped at 90vh if needed

## File Changes

1. Copy `new-style-pics/Gemini_Generated_Image_6lmumb6lmumb6lmu.png` to `public/illustrations/hero-banner.png`
2. Rewrite `src/components/PeacockHero.astro` — remove overlay, HTML text, text styling CSS
3. Remove `public/illustrations/peacock-hero.png`

## What Stays the Same

- Component file name and interface (`lang` prop)
- Section `id="hero"`
- i18n usage for sr-only text

# CLAUDE.md — Project Guide

Personal portfolio for **Anh Dang** (Data Analyst II at First Community Credit Union; Georgia Tech OMSCS, Machine Learning; U.S. Army Reserve Signal officer). Static site on GitHub Pages: `https://anhtdang92.github.io`.

## Stack and deploy

- Plain HTML/CSS/JS. No framework, no build step, no dependencies.
- GitHub Pages publishes `main` automatically. `_config.yml` excludes `CLAUDE.md`, `PROJECT_INDEX.md` and `README.md` from the public site.
- Run locally: `python3 -m http.server 8000`.

## Files

| File | Purpose |
|---|---|
| `index.html` | Home: hero, numbers row, About, Highlights, "How ATLAS works", Featured projects, Building toward, contact footer. Has a home-only `<style>` block. |
| `js/index.js` | Home only: dynamic years, number count-ups, trajectory tooltips, project-card behaviour, desktop-only hero particles / cursor glow (created on demand, paused off-screen). |
| `experience.html` | Civilian and Army timelines, Credentials (M.S. progress, B.S., Certifications & clearance), OMSCS courses, credits-by-semester plan, Building toward. |
| `skills.html` | Tech stack (plain grouped lists) and AI tools used day to day, RTX 4090 card. No page JS. |
| `projects.html` | Featured repos: ATLAS, ARGUS (in progress), Signal Network Mapper, CurStar, DeepSeek. |
| `projects/atlas-ml-trading.html` | ATLAS case study (metrics live here, with baselines and sources). |
| `projects/kraken-ml-trading-strategy.html`, `projects/ml-trading-algorithm.html` | Redirect stubs (noindex) for old URLs. |
| `404.html` | Standalone error page (own CSS, dark default). |
| `css/shared.css` | Design tokens, nav, footer, layout, reveal, print styles. Loaded on every page (home included). |
| `js/shared.js` | Theme, mobile menu, scroll progress, back-to-top, reveal observer, footer year. Loaded on every page. |
| `favicon-32.png`, `apple-touch-icon.png`, `logo-nav.png` | Icons; `logo.png` is the 500px source. |
| `og-image.svg` / `og-image.png` | Link-preview image (1200×630). Render the PNG from the SVG after edits. |
| `sitemap.xml`, `robots.txt` | Update `lastmod` when pages change. |

## Theme

- Dark is the default for everyone. Light only when the visitor picks it with the toggle (`localStorage.theme = 'light'`).
- Each page's `<head>` has a one-line inline script that applies a saved light choice before first paint. Don't add `prefers-color-scheme` switching.
- Light-theme accent tokens in `shared.css` are darkened for WCAG AA. Don't redefine tokens in page `<style>` blocks.
- Canvas code should read colours from CSS variables and register a redraw in `window._themeRedrawFns` (or listen for the `themechange` event).

## Mobile and accessibility rules

- Test at 360 and 390px wide: no horizontal overflow, text ≥ 12px, tap targets ≥ 24px (44px for primary buttons).
- `js/shared.js` is the only owner of the mobile menu. Don't add other `.nav-toggle` handlers.
- Same top nav on every subpage: Home, Projects, Skills & AI, Experience (with `aria-current="page"`).
- No inline `onclick`. No JS view-transition click hijacking (`@view-transition{navigation:auto}` is in shared.css).
- Content must not depend on hover; anything hover-revealed needs a focus/touch equivalent.
- Respect `prefers-reduced-motion`. Decorative loops pause off-screen.
- New pages: `<meta name="robots">`, canonical, og/twitter tags, the inline theme script, non-blocking fonts, `css/shared.css`, `js/shared.js`.

## Content rules

- Every claim must match the owner's resume and the linked repos. Don't invent metrics, code, or results; show model metrics only with context (period, baseline, source).
- Employer: First Community Credit Union. Public facts only ($2.9B in assets, 176K members, 41 Texas counties, 19 branches). Don't name internal systems, vendors, partners, or volumes.
- Army: "S6 OIC, Signal Officer (1LT), U.S. Army Reserve". No unit designation, no security-program specifics. Clearance wording: "Secret clearance (DoD)".
- OMSCS: no GPA. Progress and course list live on `experience.html` and the home "Building toward" card; keep them in sync.
- Years of experience are computed in `js/index.js` from start dates; keep the static fallback text in sync.
- Certification: CompTIA Security+ (Sep 2026), linked to its Credly badge.
- Title: list only the current position (Data Analyst II). Don't present the owner as an ML Engineer or "building toward" one in titles, headlines, meta tags or the OG image.

## Verify before pushing

- 0 console errors on every page at 390 and 1280.
- axe-core: 0 violations in dark and light.
- Mobile menu opens/closes on every page; dark is the default with OS light mode.
- Lighthouse mobile on `/` (last run: 100 across the board).

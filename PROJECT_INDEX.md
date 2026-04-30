# Project Index

Generated on **April 30, 2026 (UTC)**.

## What this project is
- Personal portfolio site for Anh Dang.
- Multi-page static website deployed via GitHub Pages.
- Stack: plain HTML, CSS, and JavaScript (no framework/build step).

## File inventory
- `404.html`
- `CLAUDE.md`
- `README.md`
- `css/shared.css`
- `experience.html`
- `index.html`
- `js/index.js`
- `js/shared.js`
- `logo.png`
- `og-image.png`
- `og-image.svg`
- `projects.html`
- `projects/kraken-ml-trading-strategy.html`
- `projects/ml-trading-algorithm.html`
- `resume_portfolio_final.pdf`
- `robots.txt`
- `sitemap.xml`
- `skills.html`

## High-level structure
- **Core pages**: home (`index.html`), experience, skills, projects listing, 2 project detail pages, 404.
- **Styling**: shared site-wide stylesheet in `css/shared.css`, with substantial page-specific inline CSS in `index.html`.
- **Behavior**:
  - Shared interactions (theme toggle, reveal effects, mobile nav, scroll progress) in `js/shared.js`.
  - Home-page-specific visualizations/animations in `js/index.js`.
- **SEO/ops**: `sitemap.xml`, `robots.txt`, Open Graph image assets.
- **Content assets**: logo, OG images, downloadable resume PDF.

## Size snapshot (line counts)
- `index.html`: 1451
- `skills.html`: 897
- `experience.html`: 667
- `projects.html`: 404
- `projects/kraken-ml-trading-strategy.html`: 209
- `projects/ml-trading-algorithm.html`: 201
- `js/index.js`: 1539
- `js/shared.js`: 103
- `css/shared.css`: 251
- `404.html`: 53
- `sitemap.xml`: 39
- `robots.txt`: 4
- `CLAUDE.md`: 325
- `README.md`: 0

## Quick observations
- Project is documentation-rich (`CLAUDE.md`) but `README.md` is currently empty.
- The home page and home JS file are the largest/most complex parts.
- Codebase is straightforward to host and maintain due to no dependency/toolchain overhead.

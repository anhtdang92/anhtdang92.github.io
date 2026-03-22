# CLAUDE.md — Comprehensive Project Documentation

## Overview

Personal portfolio website for **Anh Dang** — Data Analyst II building toward ML Engineering. Multi-page static site deployed via GitHub Pages at `https://anhtdang92.github.io`.

**Owner:** Anh Dang — Data Analyst II, Georgia Tech MSCS Candidate (Machine Learning), U.S. Army Signal Officer, Houston TX.

## Architecture

- **Stack:** Pure HTML/CSS/JS — zero frameworks, zero build process, zero dependencies
- **Type:** Multi-page static site (7 HTML files + 2 JS + 1 CSS + assets)
- **Deployment:** GitHub Pages, automatic on push to `main`
- **Design system:** `css/shared.css` shared across all pages; `index.html` has its own embedded `<style>` block (~580 lines)
- **Fonts:** Outfit (UI) + JetBrains Mono (code) via Google Fonts, deferred loading with preload
- **Theme:** Dark/light mode with CSS custom properties and `data-theme` attribute
- **SEO:** Structured data (JSON-LD), Open Graph, Twitter Cards, canonical URLs, robots meta, sitemap.xml, robots.txt
- **JS architecture:** `js/shared.js` loaded on ALL pages (reveal, scroll, theme, nav); `js/index.js` loaded additionally on home page (canvas, animations, enhancements)

## Complete File Map

| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | 1451 | Home page — HTML structure + embedded CSS (~580 lines of `<style>`) |
| `js/index.js` | 1539 | Home page JavaScript (deferred) — canvas, animations, enhancements |
| `js/shared.js` | 96 | Shared JS for ALL pages — reveal, scroll, theme toggle, nav, event wiring |
| `css/shared.css` | 249 | Shared design system — CSS vars, nav, footer, badges, .sr-only, responsive, print |
| `experience.html` | 663 | Experience & Education page — timeline, OMSCS progress |
| `skills.html` | 880 | Skills & AI page — radar chart, treemap, skill bars, AI tools, GPU card |
| `projects.html` | 404 | Projects listing page — 2 project cards with expand panels, comparison matrix |
| `projects/kraken-ml-trading-strategy.html` | 206 | Project detail: ML crypto trading (scikit-learn, GCP, Kraken API) |
| `projects/ml-trading-algorithm.html` | 198 | Project detail: ML equity trading (walk-forward backtesting) |
| `404.html` | 43 | Custom 404 page — standalone CSS, full OG/Twitter meta, robots noindex |
| `sitemap.xml` | 39 | XML sitemap (6 URLs) |
| `robots.txt` | 4 | Crawl rules — allow all, references sitemap |
| `logo.png` | — | Brand logo (used in nav, favicons) — rendered at 24×24 with explicit dimensions |
| `og-image.png` | — | Open Graph social preview image |
| `og-image.svg` | — | SVG source for OG image |
| `resume_portfolio_final.pdf` | — | Downloadable resume PDF |
| `README.md` | 1 | Minimal project readme |
| `CLAUDE.md` | — | This file (project documentation for AI-assisted development) |

## Page Architecture

### Navigation Structure
All pages share a consistent nav bar with NO inline `onclick` handlers (all wired via `js/shared.js`):
- **Brand logo** with `width="24" height="24"` (links to `index.html`)
- **Home** → `index.html`
- **Projects** → `index.html#explore` (or `projects.html`)
- **About** → `index.html#about`
- **Highlights** → `index.html#highlights`
- **Theme toggle** (moon/sun icon)
- **Mobile hamburger** (appears at 768px breakpoint, `aria-expanded` managed by JS)

### index.html — Home Page (1451 lines)

The largest and most complex page. Loads `js/shared.js` + `js/index.js` (both deferred). Contains embedded CSS (~580 lines in `<style>`) that extends shared.css (no duplication — reveal, scroll-progress, back-to-top, section dividers are in shared.css only).

**Sections (by `id`):**
1. **Hero** (no id) — Avatar with animated border, name with gradient text, subtitle, tech tags (Python, SQL, ML, etc.), CTA links (Resume, GitHub, LinkedIn), scroll indicator
2. **`#about`** — 4 info cards (Role, Education, Military, Focus), about text, stat rings with animated SVG
3. **`#highlights`** — Work highlight cards with PSR format (Problem/Solution/Result), impact numbers, testimonials
4. **`#ml-metrics`** — ML Metrics Carousel with tabbed panels (Neural Network canvas, Confusion Matrix canvas, Feature Importance bars, ROC Curve canvas, Learning Curves canvas). Buttons have `aria-selected` toggled by JS.
5. **`#pipeline`** — Interactive SVG pipeline diagram with tooltips
6. **`#explore`** — 2 project cards (Kraken ML Trading, ML Trading Algorithm) with expand panels and sparklines
7. **`#next`** — Career goals card with gradient border, target items (ML Engineer, OMSCS graduation, etc.)

**Embedded CSS features:**
- KPI strip with sparkline SVGs (5 metrics)
- Trajectory chart (career timeline SVG)
- GitHub contribution heatmap
- Radar chart for skills
- OMSCS progress donut
- ML carousel panels
- Pipeline diagram
- Testimonial grid
- 15+ custom keyframe animations

### experience.html — Experience & Education (663 lines)

- Hidden `<h1>` for SEO (`.sr-only`)
- Vertical timeline with glowing dots (`.tl` entries, `.tl.now` for current role)
- Timeline scroll glow effect (`.tl-glow`)
- Education cards (Georgia Tech OMSCS, UHD)
- OMSCS progress donut chart (canvas with `role="img"` + `aria-label`)
- OMSCS semester timeline visualization (canvas)
- Page-specific styles for timeline, education, and OMSCS components
- Loads `js/shared.js` + inline page-specific JS

### skills.html — Skills & AI (880 lines)

- Hidden `<h1>` for SEO (`.sr-only`)
- Radar chart (canvas with `role="img"` + `aria-label`) with labeled axes
- Tech treemap (canvas with `role="img"` + `aria-label`)
- Skill bars organized by category (Languages, ML/Data, Databases, Cloud, etc.)
- Proficiency levels: Strong (green), Growing (cyan), Learning (orange)
- AI & Automation section — AI cards (Production LLMs, Local Inference, Coding Agents, Automation)
- AI workflow diagram (pipeline visualization)
- GPU card (RTX 4090 specs)
- Page-specific styles for radar, skill bars, AI grid, GPU card
- Loads `js/shared.js` + inline page-specific JS

### projects.html — Projects Listing (404 lines)

- Hidden `<h1>` for SEO (`.sr-only`)
- 2-column project grid with sort select (labeled with `.sr-only`)
- Project cards with badges (ML, AI, Web), tech tags, expand panels (`aria-expanded`)
- Project sparkline SVGs
- Comparison matrix with sortable columns
- Staggered waterfall entrance animation
- 3D tilt and hover glow on cards
- Loads `js/shared.js` + inline page-specific JS

### projects/kraken-ml-trading-strategy.html — Project Detail (206 lines)

- Breadcrumb navigation
- Project hero with badge, tech tags, description
- Writeup sections with code blocks (syntax-highlighted Python)
- Tech grid, result cards, metrics row
- CTA section
- Uses `../css/shared.css` + `../js/shared.js` + page-specific code block styles

### projects/ml-trading-algorithm.html — Project Detail (198 lines)

- Same structure as Kraken page
- Writeup about walk-forward backtesting, feature engineering
- Tech grid, result cards
- Uses `../css/shared.css` + `../js/shared.js` + page-specific code block styles

### 404.html — Error Page (43 lines)

- Standalone (own CSS, no shared CSS/JS)
- Full SEO meta: description, OG, Twitter Cards
- `<meta name="robots" content="noindex, follow">`
- Centered gradient "404" text
- "Back to Portfolio" link

## CSS Architecture

### Design Tokens (CSS Custom Properties)

```
Dark theme (default):
--bg: #04070d          --card: #0b1120        --inner: #070c17
--border: rgba(255,255,255,0.08)
--text: #eef3f9        --muted: #b0c8dc       --dim: #8fa8be
--green: #00ff87       --cyan: #00d4ff        --purple: #e040fb
--gold: #ffd000        --orange: #ff9500      --red: #ff3860
--violet: #bf5fff      --card-glass: rgba(11,17,32,0.9)

Light theme ([data-theme="light"]):
--bg: #f4f6f9          --card: #ffffff         --inner: #eef1f5
--border: rgba(0,0,0,0.09)
--text: #151e2b        --muted: #2a4a62        --dim: #3d6078
--green: #00bb66       --cyan: #0099cc         --purple: #a944ff
--gold: #cc8800        --orange: #cc6600       --red: #cc2244
--violet: #8833cc      --card-glass: rgba(255,255,255,0.9)
```

### Typography
- `--ff: 'Outfit', sans-serif` — Body text, headings
- `--mono: 'JetBrains Mono', monospace` — Labels, code, technical text

### Responsive Breakpoints
- `768px` — Mobile nav hamburger appears
- `600px` — Primary responsive breakpoint (compact layouts, smaller fonts)
- `900px` — KPI strip reflow
- `prefers-reduced-motion: reduce` — Disables all animations, ambient effects
- `hover: none` — Mobile tap feedback styles
- `print` — Print stylesheet (hides nav, ambient, resets colors)

### Animation System
- **Reveal:** `.reveal` + `.reveal-d1` through `.reveal-d6` — IntersectionObserver-triggered fade-up
- **Hero choreography:** Staggered entrance (avatar → label → name → subtitle → tags → links → scroll)
- **Keyframes:** `fadeIn`, `fadeUp`, `spin`, `float`, `drift`, `blink`, `popIn`, `gradientShift`, `shimmer`, `bounce`, `tagPop`, `heroAvatarIn`, `heroNameIn`, `btnShine`, `navGlowIn`, `statusPulse`, `nextBorderFlow`, `borderSlide`, `barGrow`, `dotPop`, `meshA/B/C`, `vtFadeIn/Out`, `dividerShift`, `arrowPulse`, `gpuBorder`, `holoShimmer`, `tlPulse`

### Badge System
Color-coded project/skill badges:
- `.badge-ml` — Purple (Machine Learning)
- `.badge-ai` — Green (AI)
- `.badge-web` — Cyan (Web)
- `.badge-ios` — Gold (iOS)
- `.badge-work` — Orange (Work)

### Visual Effects
- **Mesh gradient:** 3 animated radial gradient blobs (fixed position background)
- **Noise overlay:** SVG `feTurbulence` filter for texture
- **Ambient particles:** CSS-animated floating dots (4 per page)
- **Scroll progress:** Fixed top gradient bar (purple → cyan → green)
- **Card glow:** Radial gradient on hover
- **Section dividers:** Animated gradient lines between sections
- **Glass morphism:** `backdrop-filter: blur(16px)` on 15+ card types
- **Canvas visualizations:** 9 total (hero particles, cursor glow, neural net, confusion matrix, model comparison, ROC curve, radar chart, treemap, OMSCS chart)

## JavaScript Architecture

### js/shared.js (96 lines) — Loaded on ALL pages

Single source of truth for common UI behavior:
1. **Reveal observer** — `IntersectionObserver` triggers `.visible` on `.reveal` elements
2. **Scroll handler** (RAF-throttled) — Updates scroll progress bar, back-to-top visibility, nav scroll state
3. **Theme management** — `toggleTheme()`, localStorage persistence, `prefers-color-scheme` detection, canvas redraw on theme change via `_themeRedrawFns` array
4. **Nav toggle** — Mobile hamburger open/close with `aria-expanded`, ESC key to close
5. **Event wiring** — Theme toggle, back-to-top, nav toggle all use `addEventListener` (no inline `onclick`)
6. **Mobile nav close** — Links close mobile nav on click

### js/index.js (1539 lines) — Home page (deferred, loaded after shared.js)

Extends shared.js with home-page-specific features. Does NOT duplicate shared.js functionality (theme, scroll, reveal, nav all handled by shared.js).

1. **Dynamic date calculations** (lines 1–30) — Computes years of experience, military service from start dates. Updates DOM elements by ID. Never hardcodes ages/years.

2. **Active nav highlighting** (lines 32–47) — IntersectionObserver highlights current section's nav link

3. **Hero parallax** (lines 49–54) — Parallax transform + opacity fade on hero section during scroll

4. **Theme-aware canvas helpers** (lines 56–75) — `isLightTheme()`, `themeColors()` returns full color palette for canvas drawing. `_themeRedrawFns` array for theme-switch canvas redraws.

5. **KPI count-up animation** — Animates `.kpi-num` elements on scroll into view. Handles millions (M+) and suffix preservation. Cubic ease-out curve.

6. **Trajectory chart** — Scroll-triggered SVG line draw-in animation

7. **Futuristic enhancements** (deferred via `requestIdleCallback`):
   - Blinking cursor on hero subtitle
   - Magnetic hover on CTA buttons
   - SVG progress ring animation
   - GitHub contribution heatmap (live data fetch with 3-tier fallback: direct → CORS proxies → GitHub Events API → static fallback, 24h localStorage cache)
   - KPI sparkline animation
   - Hero particle constellation (canvas, 40 particles with connections, mouse repulsion)
   - Cursor glow trail (full-page canvas)
   - Universal number counter (animates all `.impact-num` elements)
   - ML carousel tabs (toggles `aria-selected` on buttons)
   - Value banner scroll observer
   - Parallax depth on mesh gradient blobs
   - Trajectory chart tooltips

8. **Canvas visualizations** (drawn in `js/index.js`):
   - Hero particle constellation with mouse interaction
   - Cursor glow trail
   - Neural network architecture
   - Confusion matrix heatmap
   - Model comparison bar chart
   - ROC curve

### Performance Optimizations
- `requestAnimationFrame` throttling on all scroll handlers
- `requestIdleCallback` for non-critical enhancements
- `IntersectionObserver` for lazy animations (only animate when visible)
- Hero canvas pauses when off-screen or tab hidden (`visibilitychange`)
- `passive: true` on scroll listeners
- Font preloading with `<link rel="preload">` + deferred loading (`media="print" onload="this.media='all'"`) on all subpages
- GitHub contribution data cached 24h in localStorage
- Canvas DPR-aware sizing
- Logo `<img>` tags include `width`/`height` to prevent CLS

## SEO & Metadata

### Structured Data (JSON-LD)
- **index.html:** `Person` schema (name, jobTitle, url, sameAs, alumniOf, knowsAbout, address)
- **Project pages:** `BreadcrumbList` schema (Home → Projects → Project Name)

### Open Graph / Twitter Cards
All pages include (including 404.html):
- `og:title`, `og:description`, `og:type`, `og:url`, `og:image`
- `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`
- Canonical URLs
- Theme color: `#04070d`
- `<meta name="robots">` — `index, follow` on content pages; `noindex, follow` on 404

### Heading Hierarchy
- **index.html:** `<h1>` in hero section, `<h2>` per section
- **Subpages:** Hidden `<h1 class="sr-only">` for SEO + visible `<h2>` section titles

### Sitemap
6 URLs indexed in `sitemap.xml`:
1. `/` (priority 1.0)
2. `/experience.html` (0.9)
3. `/projects.html` (0.9)
4. `/skills.html` (0.9)
5. `/projects/kraken-ml-trading-strategy.html` (0.8)
6. `/projects/ml-trading-algorithm.html` (0.8)

## Accessibility

- Skip-to-content link (`.skip-link`)
- `aria-label` on nav, sections, buttons, canvas elements
- `aria-hidden="true"` on decorative elements (ambient particles, mesh gradient, noise overlay, scroll progress)
- `aria-expanded` on mobile nav toggle and project detail toggles
- `aria-selected` on ML carousel tab buttons
- `role="img"` + `aria-label` on all canvas elements (radar, treemap, OMSCS chart)
- `role="navigation"`, `role="main"` landmarks
- Focus-visible outlines with contrast-aware styling
- `prefers-reduced-motion` media query disables all animations
- Screen reader-only class (`.sr-only`) in shared.css
- Hidden `<h1>` on subpages for document outline
- `<label class="sr-only">` on form controls (sort select)
- Light theme `--dim` (#3d6078) meets WCAG AA contrast on light backgrounds

## External Links & Resources

- **GitHub:** `https://github.com/anhtdang92`
- **LinkedIn:** `https://linkedin.com/in/anh-dang92`
- **Kraken ML repo:** `https://github.com/anhtdang92/Kraken_ML_Trading_Strategy`
- **ML Trading repo:** `https://github.com/anhtdang92/ML-Trading-Algorithm`
- **Google Fonts:** Outfit + JetBrains Mono
- **GitHub Contributions API:** `https://github.com/users/anhtdang92/contributions` (with CORS proxy fallbacks)

## Development Notes

- Edit `index.html` for home page changes (both HTML and embedded CSS)
- Edit `css/shared.css` for design system changes (affects ALL pages including home)
- Edit `js/index.js` for home page interactivity (do NOT duplicate shared.js functionality)
- Edit `js/shared.js` for behavior shared across ALL pages
- Edit `experience.html`, `skills.html`, `projects.html` for those standalone pages
- Edit `projects/*.html` for individual project detail pages
- No build step — push to `main` to deploy
- All content is hardcoded (no CMS or data files)
- Project detail pages use `../css/shared.css` and `../js/shared.js` relative paths
- Root-level pages use `css/shared.css` and `js/shared.js` relative paths
- `index.html` loads BOTH `js/shared.js` AND `js/index.js` (shared.js first, both deferred)
- Subpages load `js/shared.js` before inline `<script>` blocks for page-specific code
- Date calculations in `js/index.js` are dynamic — never hardcode years or ages
- No inline `onclick` handlers — all event binding in JS via `addEventListener`
- Canvas elements must have `role="img"` and `aria-label` for accessibility
- New pages should include: `<meta name="robots">`, font preload, `<h1 class="sr-only">`, and load `js/shared.js`

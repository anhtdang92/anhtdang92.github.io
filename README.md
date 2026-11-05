# anhtdang92.github.io

Personal portfolio of **Anh Dang**: Data Analyst II at First Community Credit Union, Georgia Tech OMSCS (Machine Learning) student, and U.S. Army Reserve Signal officer.

**Live site:** https://anhtdang92.github.io

## Pages

| Page | What's on it |
|---|---|
| `index.html` | Home: intro, key numbers, work highlights, "How ATLAS works", featured projects, contact |
| `experience.html` | Work and Army timeline, education, OMSCS progress |
| `skills.html` | Skills, AI tools, local GPU setup |
| `projects.html` | Featured repos: ATLAS, ARGUS, Signal Network Mapper, CurStar, DeepSeek |
| `projects/atlas-ml-trading.html` | ATLAS case study |

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

- `css/shared.css`: design tokens, nav, footer, layout, print styles (every page)
- `js/shared.js`: theme (dark by default), mobile menu, scroll UI, reveal animations (every page)
- `js/index.js`: home page charts and interactions

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

GitHub Pages publishes `main` automatically. `_config.yml` keeps internal notes (`CLAUDE.md`, `PROJECT_INDEX.md`, `README.md`) off the public site.

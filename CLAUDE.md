# CLAUDE.md — Project Index

## Overview
Personal portfolio website for Anh Dang (Data Analyst II). Single-page static site deployed via GitHub Pages.

## Architecture
- Pure HTML/CSS/JS — no frameworks, no build process, no dependencies
- Single file: `index.html` (~31KB) contains all markup, styles, and scripts
- Deployed automatically via GitHub Pages at `https://anhtdang92.github.io`

## File Map
- `index.html` — Entire site (HTML structure, embedded CSS, vanilla JS)
- `README.md` — Project readme
- `CLAUDE.md` — This file (project index for AI-assisted development)

## CSS Architecture (embedded in index.html)
- 12 CSS custom properties for theming (--bg, --card, --green, --cyan, etc.)
- Dark theme with navy background (#04070d)
- Fonts: Outfit (UI) + JetBrains Mono (code) from Google Fonts
- Single responsive breakpoint at 600px
- Animation classes: `.reveal`, `.reveal-d1` through `.reveal-d6`

## JavaScript (embedded in index.html)
- Intersection Observer for scroll-triggered reveal animations
- Smooth scrolling navigation
- No external JS libraries

## Sections
1. Hero — intro with CTA buttons
2. About — role, education, military, focus + stats row
3. Skills — 4 category rows, color-coded by proficiency (green=strong, cyan=growing, orange=learning)
4. Projects — 6 GitHub-linked project cards
5. Experience — vertical timeline (7 entries)
6. Education — 2 cards (Georgia Tech OMSCS, UHD)
7. What's Next — career goals

## Development Notes
- Edit `index.html` directly for any changes
- No build step required — push to `main` to deploy
- All content is hardcoded (no CMS or data files)
- External links: GitHub profile, LinkedIn, email, 6 project repos

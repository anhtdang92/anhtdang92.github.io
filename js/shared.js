/* Shared JS — loaded on every page (theme, nav, reveal, scroll UI) */

// Storage can throw when site data is blocked, so never let it stop the rest of this file.
function safeGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function safeSet(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Jump to the top only on a plain reload. Back/forward keeps the browser's scroll restore.
(function () {
  try {
    var navEntry = performance.getEntriesByType('navigation')[0];
    if (navEntry && navEntry.type === 'reload' && !location.hash) {
      history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  } catch (e) {}
})();

// Scroll-triggered reveal animations
(function () {
  var items = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { observer.observe(el); });
})();

// Scroll progress bar, back-to-top, nav scroll state — RAF-throttled
(function () {
  var progressBar = document.querySelector('.scroll-progress');
  var backToTop = document.querySelector('.back-to-top');
  var navEl = document.querySelector('nav');
  var ticking = false;
  function update() {
    var s = window.scrollY;
    var d = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (d > 0 ? Math.min(100, s / d * 100) : 0) + '%';
    if (backToTop) backToTop.classList.toggle('visible', s > window.innerHeight);
    if (navEl) navEl.classList.toggle('scrolled', s > 60);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
})();

// THEME — dark is the default. Light only when the visitor picked it with the toggle.
// (A tiny inline script in each page's <head> applies a saved light choice before first paint.)
function isLightTheme() { return document.documentElement.getAttribute('data-theme') === 'light'; }

// Pages push canvas redraw functions here so charts repaint with the new palette.
var _themeRedrawFns = window._themeRedrawFns || [];
window._themeRedrawFns = _themeRedrawFns;

var _moonSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>';
var _sunSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/></svg>';

function applyTheme(theme) {
  var light = theme === 'light';
  document.documentElement.setAttribute('data-theme', light ? 'light' : 'dark');
  var btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.innerHTML = light ? _sunSVG : _moonSVG;
    btn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    btn.setAttribute('title', light ? 'Switch to dark mode' : 'Switch to light mode');
  }
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', light ? '#f4f6f9' : '#04070d');
}

function toggleTheme() {
  var next = isLightTheme() ? 'dark' : 'light';
  applyTheme(next);
  safeSet('theme', next);
  window._themeRedrawFns.forEach(function (fn) { try { fn(); } catch (e) {} });
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
}

applyTheme(safeGet('theme') === 'light' ? 'light' : 'dark');

// Footer year (any element with data-current-year)
document.querySelectorAll('[data-current-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

// NAV + BUTTON WIRING — this file is the only owner of the mobile menu (no inline onclick)
(function () {
  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.setAttribute('type', 'button');
    themeBtn.addEventListener('click', toggleTheme);
  }

  var btt = document.querySelector('.back-to-top');
  if (btt) {
    btt.setAttribute('type', 'button');
    btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  var nav = document.querySelector('nav:not(.footer-nav)');
  var navToggle = document.querySelector('.nav-toggle');
  if (!nav || !navToggle) return;
  if (!nav.id) nav.id = 'site-nav';
  navToggle.setAttribute('type', 'button');
  navToggle.setAttribute('aria-controls', nav.id);
  navToggle.setAttribute('aria-expanded', 'false');

  // While the full-screen menu is open, the page underneath should not take focus.
  function setPageInert(on) {
    document.querySelectorAll('main, footer, .footer').forEach(function (el) {
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }
  function openNav() {
    nav.classList.add('open');
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    setPageInert(true);
  }
  function closeNav(returnFocus) {
    if (!nav.classList.contains('open')) return;
    nav.classList.remove('open');
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    setPageInert(false);
    if (returnFocus) navToggle.focus();
  }
  window.closeNav = closeNav;

  navToggle.addEventListener('click', function () {
    if (nav.classList.contains('open')) closeNav(false); else openNav();
  });
  nav.querySelectorAll('a:not(.brand)').forEach(function (link) {
    link.addEventListener('click', function () { closeNav(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav(true);
  });
  // Close the overlay if the screen grows past the mobile breakpoint
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeNav(false);
  }, { passive: true });
})();

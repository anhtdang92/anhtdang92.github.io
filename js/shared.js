/* Shared JS — used by project detail pages and index.html */

// Scroll-triggered reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Scroll progress bar, back-to-top, nav scroll state
const progressBar = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const d = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (s / d * 100) + '%';
  if (backToTop) backToTop.classList.toggle('visible', s > window.innerHeight);
  const nav = document.querySelector('nav');
  if (nav) nav.classList.toggle('scrolled', s > 60);
}, { passive: true });

// Theme toggle with prefers-color-scheme auto-detection
function isLightTheme() { return document.documentElement.getAttribute('data-theme') === 'light'; }

function toggleTheme() {
  const html = document.documentElement;
  const btn = document.querySelector('.theme-toggle');
  const wasLight = html.getAttribute('data-theme') === 'light';
  html.setAttribute('data-theme', wasLight ? 'dark' : 'light');
  btn.textContent = wasLight ? '\u{1F319}' : '\u{2600}\u{FE0F}';
  localStorage.setItem('theme', wasLight ? 'dark' : 'light');
  if (typeof _themeRedrawFns !== 'undefined') {
    // Fade canvas elements during redraw
    document.querySelectorAll('.ml-panel canvas').forEach(c => { c.style.opacity = '0'; });
    _themeRedrawFns.forEach(function(fn) { fn(); });
    setTimeout(() => {
      document.querySelectorAll('.ml-panel canvas').forEach(c => { c.style.opacity = ''; });
    }, 50);
  }
}

(function() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.querySelector('.theme-toggle').textContent = '\u{2600}\u{FE0F}';
  } else if (!saved && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme', 'light');
    document.querySelector('.theme-toggle').textContent = '\u{2600}\u{FE0F}';
  }
})();

// Mobile nav close on link click
document.querySelectorAll('nav a:not(.brand)').forEach(link => {
  link.addEventListener('click', () => {
    const n = document.querySelector('nav');
    if (n) n.classList.remove('open');
    document.body.classList.remove('nav-open');
  });
});

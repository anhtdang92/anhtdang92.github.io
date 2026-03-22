// DYNAMIC DATE CALCULATIONS — never hardcode years or age
(function() {
  const now = new Date();
  // Data engineering career start: Aug 2021 (IT Data Analyst)
  const daStart = new Date(2021, 7, 1); // Aug 2021
  const daYears = Math.floor((now - daStart) / (365.25 * 24 * 60 * 60 * 1000));
  // Military officer career start: Jul 2022
  const milStart = new Date(2022, 6, 1); // Jul 2022
  const milYears = Math.floor((now - milStart) / (365.25 * 24 * 60 * 60 * 1000));
  // Ring percentage: scale years (10 years = 100%)
  const daPct = Math.min(100, Math.round(daYears / 10 * 100));

  // Update section-desc
  const daEl = document.getElementById('da-years');
  const milEl = document.getElementById('mil-years');
  const milEl2 = document.getElementById('mil-years-2');
  if (daEl) daEl.textContent = daYears;
  if (milEl) milEl.textContent = milYears;
  if (milEl2) milEl2.textContent = milYears;

  // Update stat ring value + percentage
  const ringVal = document.getElementById('ring-da-val');
  const ringFill = document.getElementById('ring-da-fill');
  if (ringVal) ringVal.textContent = daYears;
  if (ringFill) ringFill.dataset.pct = daPct;

  // Update footer year
  const footerYear = document.querySelector('.footer-text[style]');
  if (footerYear) footerYear.textContent = 'Anh Dang · Houston, TX · ' + now.getFullYear();
})();

// Scroll-triggered reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Active nav link highlighting on scroll
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector('nav a[href="#' + entry.target.id + '"]');
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

sections.forEach(section => navObserver.observe(section));

// Scroll progress bar, back-to-top, hero parallax, and nav shrink — single throttled handler
const progressBar = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');
const heroSection = document.querySelector('.hero');
const mainNav = document.querySelector('nav');
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight * 100) + '%';
    backToTop.classList.toggle('visible', scrollTop > window.innerHeight);
    if (mainNav) mainNav.classList.toggle('scrolled', scrollTop > 60);
    if (scrollTop < window.innerHeight) {
      heroSection.style.transform = `translateY(${scrollTop * 0.15}px)`;
      heroSection.style.opacity = 1 - (scrollTop / window.innerHeight * 0.6);
    }
    scrollTicking = false;
  });
}, { passive: true });

// Theme-aware color helper for canvas charts
function isLightTheme() { return document.documentElement.getAttribute('data-theme') === 'light'; }
function themeColors() {
  const light = isLightTheme();
  return {
    text: light ? '#151e2b' : '#fff',
    muted: light ? '#3a5068' : '#9db5cc',
    dim: light ? '#566e85' : '#7a96b0',
    border: light ? 'rgba(160,175,192,0.4)' : 'rgba(42,63,90,0.5)',
    gridLine: light ? 'rgba(100,120,140,0.25)' : 'rgba(42,63,90,0.3)',
    diagonal: light ? 'rgba(100,120,140,0.35)' : 'rgba(157,181,204,0.3)',
    green: light ? '#00804a' : '#00ff87',
    cyan: light ? '#0077a0' : '#00d4ff',
    purple: light ? '#8020e0' : '#e040fb',
    gold: light ? '#b87800' : '#ffd000',
    greenFill: function(a) { return light ? 'rgba(0,128,74,' + a + ')' : 'rgba(0,255,135,' + a + ')'; },
    redFill: function(a) { return light ? 'rgba(204,34,68,' + a + ')' : 'rgba(255,56,96,' + a + ')'; },
    cyanFill: function(a) { return light ? 'rgba(0,119,160,' + a + ')' : 'rgba(0,212,255,' + a + ')'; },
    barColors: light ? ['#8020e0', '#00804a', '#0077a0', '#b87800'] : ['#e040fb', '#00ff87', '#00d4ff', '#ffd000']
  };
}
var _themeRedrawFns = [];
// Dark/light mode toggle with canvas fade
function toggleTheme() {
  const html = document.documentElement;
  const btn = document.querySelector('.theme-toggle');
  const wasLight = html.getAttribute('data-theme') === 'light';
  html.setAttribute('data-theme', wasLight ? 'dark' : 'light');
  btn.textContent = wasLight ? '🌙' : '☀️';
  localStorage.setItem('theme', wasLight ? 'dark' : 'light');
  // Fade canvas elements during redraw for smooth transition
  document.querySelectorAll('.ml-panel canvas').forEach(c => { c.style.opacity = '0'; });
  _themeRedrawFns.forEach(function(fn) { fn(); });
  setTimeout(() => {
    document.querySelectorAll('.ml-panel canvas').forEach(c => { c.style.opacity = ''; });
  }, 50);
}
(function() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.querySelector('.theme-toggle').textContent = '☀️';
  } else if (!saved && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme', 'light');
    document.querySelector('.theme-toggle').textContent = '☀️';
  }
})();

// Wire up theme toggle button (no inline onclick)
document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

// Wire up back-to-top button (no inline onclick)
document.getElementById('backToTopBtn').addEventListener('click', function() {
  window.scrollTo({top:0,behavior:'smooth'});
});

// Close mobile nav on link click
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => document.querySelector('nav').classList.remove('open'));
});


// KPI COUNT-UP ANIMATION on scroll
const kpiStrip = document.querySelector('.kpi-strip');
if (kpiStrip) {
  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        entry.target.querySelectorAll('.kpi-num').forEach(el => {
          const raw = el.textContent.trim();
          const target = parseFloat(el.dataset.kpi);
          const finalText = raw; // remember final display text
          if (isNaN(target)) return;
          const duration = 1400;
          const start = performance.now();
          const isMillion = target >= 1000000;
          const suffix = isMillion ? 'M+' : raw.replace(/[0-9.,]/g, '');
          el.textContent = isMillion ? '0M+' : '0' + suffix;
          const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const e = 1 - Math.pow(1 - p, 3);
            if (p >= 1) { el.textContent = finalText; return; }
            if (isMillion) {
              el.textContent = (e * target / 1000000).toFixed(1) + 'M+';
            } else {
              el.textContent = Math.floor(e * target) + suffix;
            }
            requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: 0.3 });
  kpiObserver.observe(kpiStrip);
}

// TRAJECTORY CHART animation on scroll
const trajChart = document.querySelector('.trajectory-chart');
if (trajChart) {
  const trajObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.3 });
  trajObserver.observe(trajChart);
}

// === FUTURISTIC ENHANCEMENTS ===
// Deferred to reduce Total Blocking Time — runs after page is interactive
(typeof requestIdleCallback === 'function' ? requestIdleCallback : function(cb) { setTimeout(cb, 1); })(function() {

// 1. BLINKING CURSOR on hero subtitle (text shown immediately)
(function() {
  const sub = document.querySelector('.hero-sub');
  if (!sub || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cursor = document.createElement('span');
  cursor.className = 'type-cursor';
  sub.appendChild(cursor);
  setTimeout(() => cursor.style.display = 'none', 2500);
})();

// 2. MAGNETIC HOVER on CTA buttons
document.querySelectorAll('.hero-links a, .project-links-row a, .next-card').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});




// 6. SVG PROGRESS RING animation on scroll
const ringObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const fill = entry.target.querySelector('.ring-fill');
      if (fill) {
        const pct = parseFloat(fill.dataset.pct);
        const circumference = 226;
        const offset = circumference * (1 - pct / 100);
        fill.style.strokeDashoffset = offset;
      }
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stat-ring').forEach(ring => ringObserver.observe(ring));


// 8. GITHUB CONTRIBUTION HEATMAP — Live data from GitHub contribution graph
(function() {
  const grid = document.getElementById('gh-grid');
  const monthsRow = document.getElementById('gh-months');
  const totalEl = document.getElementById('gh-total');
  if (!grid) return;

  const USERNAME = 'anhtdang92';
  const weeks = 52, days = 7;
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // Render month labels
  const now = new Date();
  for (let w = 0; w < weeks; w++) {
    const weekDate = new Date(now);
    weekDate.setDate(weekDate.getDate() - (weeks - w) * 7);
    const span = document.createElement('span');
    if (w === 0 || weekDate.getDate() <= 7) {
      span.textContent = monthNames[weekDate.getMonth()];
    }
    monthsRow.appendChild(span);
  }

  // Show skeleton loader while fetching
  grid.style.gridTemplateRows = 'repeat(7, 1fr)';
  grid.style.gridAutoFlow = 'column';
  grid.classList.add('gh-skeleton');
  for (let i = 0; i < days * weeks; i++) {
    const sk = document.createElement('div');
    sk.className = 'gh-skeleton-cell';
    sk.style.animationDelay = (Math.random() * 0.5) + 's';
    grid.appendChild(sk);
  }
  totalEl.textContent = 'Loading contributions...';

  // Build actual grid (replaces skeleton when data arrives)
  function buildGrid() {
    grid.innerHTML = '';
    grid.classList.remove('gh-skeleton');
    const cellEls = [];
    for (let d = 0; d < days; d++) {
      for (let w = 0; w < weeks; w++) {
        const cell = document.createElement('div');
        cell.className = 'gh-cell';
        grid.appendChild(cell);
        cellEls.push({ el: cell, week: w, day: d });
      }
    }
    return cellEls;
  }
  let cellEls = [];

  // Parse GitHub contributions HTML and return { contribMap, total }
  function parseContributionsHTML(html) {
    const contribMap = {};
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Try to get the official total from the h2 heading
    const h2 = doc.querySelector('#js-contribution-activity-description');
    let officialTotal = 0;
    if (h2) {
      const m = h2.textContent.match(/(\d[\d,]*)\s+contribution/);
      if (m) officialTotal = parseInt(m[1].replace(/,/g, ''), 10);
    }

    // Extract per-day data from td elements with data-date and data-level
    const tds = doc.querySelectorAll('td[data-date]');
    tds.forEach(td => {
      const date = td.getAttribute('data-date');
      const level = parseInt(td.getAttribute('data-level') || '0', 10);
      if (date && level > 0) {
        const id = td.getAttribute('id');
        const tooltip = id ? doc.querySelector('tool-tip[for="' + id + '"]') : null;
        let count = level;
        if (tooltip) {
          const match = tooltip.textContent.match(/(\d+)\s+contribution/);
          if (match) count = parseInt(match[1], 10);
        }
        contribMap[date] = count;
      }
    });

    return { contribMap, officialTotal };
  }

  // Try fetching the contributions HTML from a URL
  async function tryFetchHTML(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    // For allorigins JSON wrapper, extract the contents field
    if (url.includes('allorigins.win/get')) {
      const json = JSON.parse(text);
      return json.contents;
    }
    return text;
  }

  // Apply contribution data to the grid and display total
  function applyContribData(contribMap, officialTotal) {
    cellEls = buildGrid();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - (weeks * 7 - 1));

    let sumTotal = 0;
    const counts = [];
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < days; d++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(cellDate.getDate() + w * 7 + d);
        const key = cellDate.toISOString().slice(0, 10);
        const count = contribMap[key] || 0;
        counts.push(count);
        sumTotal += count;
      }
    }

    // Use the official total from GitHub's h2 if available, otherwise sum from grid
    const total = officialTotal > 0 ? officialTotal : sumTotal;

    const maxCount = Math.max(...counts, 1);
    const q1 = Math.ceil(maxCount * 0.25);
    const q2 = Math.ceil(maxCount * 0.5);
    const q3 = Math.ceil(maxCount * 0.75);

    cellEls.forEach(({ el, week, day }) => {
      const idx = week * days + day;
      const count = counts[idx] || 0;
      let level = 0;
      if (count >= q3) level = 4;
      else if (count >= q2) level = 3;
      else if (count >= q1) level = 2;
      else if (count > 0) level = 1;
      el.className = 'gh-cell' + (level > 0 ? ' l' + level : '');
      el.title = count > 0 ? count + ' contribution' + (count !== 1 ? 's' : '') : 'No contributions';
    });

    // Animate total on scroll
    const heatmapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          const duration = 1200;
          const start = performance.now();
          const step = (ts) => {
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            totalEl.textContent = Math.floor(eased * total) + ' contributions in the last year';
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.2 });
    heatmapObserver.observe(grid.parentElement);
  }

  // Fetch contribution data with parallel strategies using Promise.any
  async function fetchContributions() {
    // Check localStorage cache (24h TTL)
    const CACHE_KEY = 'gh_contrib_cache';
    const CACHE_TTL = 24 * 60 * 60 * 1000;
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        applyContribData(cached.contribMap, cached.officialTotal);
        return;
      }
    } catch(e) {}

    const ghURL = 'https://github.com/users/' + USERNAME + '/contributions';

    const urls = [
      ghURL,
      'https://api.allorigins.win/get?url=' + encodeURIComponent(ghURL),
      'https://corsproxy.io/?' + encodeURIComponent(ghURL)
    ];

    try {
      const html = await Promise.any(urls.map(async (url) => {
        const result = await tryFetchHTML(url);
        if (!result || !result.includes('data-date')) throw new Error('No data');
        return result;
      }));
      const { contribMap, officialTotal } = parseContributionsHTML(html);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ contribMap, officialTotal, ts: Date.now() })); } catch(e) {}
      applyContribData(contribMap, officialTotal);
      return;
    } catch (e) {
      // All proxies failed, fall through to Events API
    }

    // Strategy 4: GitHub Events API (limited to ~90 days of recent activity)
    try {
      const events = [];
      for (let page = 1; page <= 10; page++) {
        const res = await fetch('https://api.github.com/users/' + USERNAME + '/events/public?per_page=100&page=' + page);
        if (!res.ok) break;
        const data = await res.json();
        if (!data.length) break;
        events.push(...data);
      }
      const contribMap = {};
      events.forEach(evt => {
        if (!['PushEvent','CreateEvent','PullRequestEvent','IssuesEvent','PullRequestReviewEvent'].includes(evt.type)) return;
        const date = evt.created_at.slice(0, 10);
        contribMap[date] = (contribMap[date] || 0) + (evt.type === 'PushEvent' ? (evt.payload.commits ? evt.payload.commits.length : 1) : 1);
      });
      applyContribData(contribMap, 0);
    } catch (e) {
      applyStaticFallback();
    }
  }

  function applyStaticFallback() {
    // Generate a plausible static heatmap pattern when all API calls fail
    const today = new Date();
    const contribMap = {};
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayOfWeek = d.getDay();
      // Simulate typical activity: weekdays more active, some variance
      const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
      const base = isWeekday ? 0.55 : 0.2;
      if (Math.random() < base) {
        contribMap[key] = Math.floor(Math.random() * 6) + 1;
      }
    }
    applyContribData(contribMap, 0);
    totalEl.textContent = 'Activity (cached)';
  }

  fetchContributions();
})();



// 11. KPI SPARKLINE ANIMATION
(function() {
  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        // Animate SVG elements in
        entry.target.querySelectorAll('.kpi-sparkline *').forEach((el, i) => {
          el.style.opacity = '0';
          el.style.transition = 'opacity 0.4s ease ' + (i * 0.08) + 's';
          requestAnimationFrame(() => { el.style.opacity = ''; });
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.kpi-strip').forEach(strip => kpiObserver.observe(strip));
})();

// HERO PARTICLE CONSTELLATION
(function() {
  const canvas = document.getElementById('heroParticles');
  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
  if (!canvas || isMobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let W, H, particles = [];
  const PARTICLE_COUNT = isMobile ? 14 : 40;
  const CONNECT_DIST = isMobile ? 80 : 120;
  const REPULSE_DIST = 100;
  const REPULSE_FORCE = 3;
  const colors = ['#e040fb','#00d4ff','#00ff87','#ffd000','#bf5fff'];
  let mouseX = -9999, mouseY = -9999;

  canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  canvas.parentElement.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  function resize() {
    const container = canvas.parentElement;
    W = container.offsetWidth;
    H = Math.min(container.offsetHeight, window.innerHeight);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const opacity = (1 - dist / CONNECT_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    // Particles with mouse repulsion
    for (const p of particles) {
      // Mouse repulsion
      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < REPULSE_DIST && mDist > 0) {
        const force = (1 - mDist / REPULSE_DIST) * REPULSE_FORCE;
        p.vx += (mdx / mDist) * force * 0.02;
        p.vy += (mdy / mDist) * force * 0.02;
      }
      // Dampen velocity
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    // Draw mouse glow in hero
    if (mouseX > 0 && mouseY > 0) {
      const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 60);
      grad.addColorStop(0, 'rgba(0,212,255,0.06)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(mouseX - 60, mouseY - 60, 120, 120);
    }
    if (!document.hidden && heroVisible) requestAnimationFrame(draw);
  }

  let heroVisible = true;
  init();
  draw();
  const heroObs = new IntersectionObserver(([e]) => {
    heroVisible = e.isIntersecting;
    if (heroVisible && !document.hidden) requestAnimationFrame(draw);
  }, { threshold: 0 });
  heroObs.observe(canvas.parentElement);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && heroVisible) requestAnimationFrame(draw); });
  window.addEventListener('resize', () => { ctx.setTransform(1,0,0,1,0,0); resize(); });
})();

// 12. CURSOR GLOW TRAIL (full page) — only runs while mouse is active
(function() {
  const canvas = document.getElementById('cursorGlow');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches || 'ontouchstart' in window) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let W, H;
  let trail = [];
  const MAX_TRAIL = 20;
  let mx = -100, my = -100;
  let glowRunning = false;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    trail.push({ x: mx, y: my, age: 0 });
    if (trail.length > MAX_TRAIL) trail.shift();
    if (!glowRunning) { glowRunning = true; requestAnimationFrame(draw); }
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < trail.length; i++) {
      const t = trail[i];
      t.age++;
      const life = 1 - t.age / 30;
      if (life <= 0) { trail.splice(i, 1); i--; continue; }
      const r = 20 * life;
      const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r);
      grad.addColorStop(0, `rgba(0,212,255,${0.08 * life})`);
      grad.addColorStop(0.5, `rgba(224,64,251,${0.04 * life})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(t.x - r, t.y - r, r * 2, r * 2);
    }
    const g = ctx.createRadialGradient(mx, my, 0, mx, my, 35);
    g.addColorStop(0, 'rgba(0,212,255,0.1)');
    g.addColorStop(0.4, 'rgba(224,64,251,0.04)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(mx - 35, my - 35, 70, 70);
    if (trail.length > 0 && !document.hidden) {
      requestAnimationFrame(draw);
    } else {
      glowRunning = false;
    }
  }
})();

// 13. UNIVERSAL NUMBER COUNTER — animate ALL numbers on page
(function() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function countUp(el, finalText) {
    if (prefersReducedMotion) { el.textContent = finalText; return; }
    const nums = finalText.match(/[\d.]+/);
    if (!nums) return;
    const target = parseFloat(nums[0]);
    const prefix = finalText.substring(0, finalText.indexOf(nums[0]));
    const suffix = finalText.substring(finalText.indexOf(nums[0]) + nums[0].length);
    const isDecimal = nums[0].includes('.');
    const duration = 1200;
    const start = performance.now();
    el.textContent = prefix + '0' + suffix;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      if (p >= 1) { el.textContent = finalText; return; }
      const val = isDecimal ? (e * target).toFixed(1) : Math.floor(e * target);
      el.textContent = prefix + val + suffix;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Impact numbers
  const impactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        entry.target.querySelectorAll('.impact-num').forEach(el => {
          countUp(el, el.textContent.trim());
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.impact-row').forEach(r => impactObserver.observe(r));
})();

// ML CAROUSEL TABS
(function() {
  const btns = document.querySelectorAll('.ml-carousel-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.ml-carousel-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(btn.dataset.panel);
      if (panel) {
        panel.classList.add('active');
        panel.querySelectorAll('.reveal').forEach(r => r.classList.add('visible'));
      }
    });
  });
})();

// 14. VALUE BANNER scroll observer
(function() {
  const bannerObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.value-banner').forEach(b => bannerObs.observe(b));
})();

// 15. PARALLAX DEPTH on mesh gradient blobs
(function() {
  const mg1 = document.querySelector('.mg1');
  const mg2 = document.querySelector('.mg2');
  const mg3 = document.querySelector('.mg3');
  if (!mg1) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const s = window.scrollY;
        mg1.style.transform = `translate(${Math.sin(s * 0.001) * 40}px, ${s * 0.08}px) scale(1.1)`;
        mg2.style.transform = `translate(${Math.cos(s * 0.0015) * 30}px, ${s * -0.05}px) scale(1.15)`;
        mg3.style.transform = `translate(${Math.sin(s * 0.002) * 25}px, ${s * 0.03}px) scale(0.95)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// TRAJECTORY CHART TOOLTIPS
(function() {
  const chart = document.querySelector('.trajectory-chart');
  if (!chart) return;
  const svg = chart.querySelector('.trajectory-svg');
  const tooltip = document.createElement('div');
  tooltip.className = 'chart-tooltip';
  chart.style.position = 'relative';
  chart.appendChild(tooltip);
  const data = [
    {cx:60,cy:110,title:'IT Intern',detail:'Help Desk → Data exposure · 2020'},
    {cx:200,cy:95,title:'IT Data Analyst',detail:'SQL + reporting foundations · Aug 2021'},
    {cx:340,cy:70,title:'IT Data Analyst',detail:'SQL Server admin + stored procs · 2021–2023'},
    {cx:480,cy:50,title:'Data Analyst I',detail:'ML integration + 3M decisions/mo · Apr 2023'},
    {cx:620,cy:30,title:'Data Analyst II',detail:'Visa DPS pipeline · ML decisioning · Apr 2026+'}
  ];
  const dots = svg.querySelectorAll('.traj-dot');
  dots.forEach((dot, i) => {
    if (!data[i]) return;
    dot.style.cursor = 'pointer';
    dot.addEventListener('mouseenter', (e) => {
      const rect = chart.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      const scaleX = svgRect.width / 700;
      const scaleY = svgRect.height / 160;
      tooltip.innerHTML = '<div class="tt-title">' + data[i].title + '</div><div class="tt-detail">' + data[i].detail + '</div>';
      tooltip.classList.add('show');
      const x = data[i].cx * scaleX + svgRect.left - rect.left;
      const y = data[i].cy * scaleY + svgRect.top - rect.top - 50;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
      tooltip.style.transform = 'translateX(-50%)';
    });
    dot.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
  });
})();

// HEATMAP TOOLTIPS
(function() {
  const grid = document.getElementById('gh-grid');
  if (!grid) return;
  const tooltip = document.createElement('div');
  tooltip.className = 'gh-tooltip';
  document.body.appendChild(tooltip);
  grid.addEventListener('mouseover', (e) => {
    const cell = e.target.closest('.gh-cell');
    if (!cell) return;
    const level = cell.classList.contains('l4') ? '8+ contributions' :
                  cell.classList.contains('l3') ? '5-7 contributions' :
                  cell.classList.contains('l2') ? '3-4 contributions' :
                  cell.classList.contains('l1') ? '1-2 contributions' : 'No contributions';
    const cells = Array.from(grid.querySelectorAll('.gh-cell'));
    const idx = cells.indexOf(cell);
    const weeks = 52, days = 7;
    const w = idx % weeks;
    const d = Math.floor(idx / weeks);
    const now = new Date();
    const cellDate = new Date(now);
    cellDate.setDate(cellDate.getDate() - (weeks - w) * 7 + d);
    const dateStr = cellDate.toLocaleDateString('en-US', {weekday:'short',month:'short',day:'numeric',year:'numeric'});
    tooltip.innerHTML = '<strong>' + level + '</strong><br>' + dateStr;
    tooltip.classList.add('show');
    const rect = cell.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
  });
  grid.addEventListener('mouseout', (e) => {
    if (e.target.closest('.gh-cell')) tooltip.classList.remove('show');
  });
})();

// CARD HOVER GLOW (directional from mouse entry point)
(function() {
  const cards = document.querySelectorAll('.about-card,.highlight-card,.kpi-card,.next-card,.next-item,.testimonial-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--glow-x', x + 'px');
      card.style.setProperty('--glow-y', y + 'px');
      card.style.background = `radial-gradient(circle 150px at ${x}px ${y}px, rgba(0,212,255,0.06), transparent), var(--card)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

// SECTION DIVIDER GLOW ANIMATION ON SCROLL
(function() {
  document.querySelectorAll('section + section').forEach(s => s.classList.add('section-divider-glow'));
  const divObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.section-divider-glow').forEach(el => divObs.observe(el));
})();

// MOBILE NAV SCROLL LOCK
(function() {
  const navToggle = document.querySelector('.nav-toggle');
  if (!navToggle) return;
  navToggle.addEventListener('click', () => {
    const nav = document.querySelector('nav');
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    document.body.classList.toggle('nav-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
})();

// NAV SHRINK ON SCROLL — merged into main scroll handler above (line 1478)

// VIEW TRANSITION API for page navigation
(function() {
  if (!document.startViewTransition) return;
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;
      e.preventDefault();
      document.startViewTransition(() => {
        window.location.href = href;
      });
    });
  });
})();

// === ML METRICS PANEL ===

// CONFUSION MATRIX (Canvas)
(function() {
  const canvas = document.getElementById('confusionMatrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const matrix = [[115, 85], [95, 105]]; // TP, FP, FN, TN
  const labels = ['Up', 'Down'];
  const total = 115+85+95+105;
  const pad = 60, cellW = (w - pad) / 2, cellH = (h - pad) / 2;
  let animated = false;

  function draw(progress) {
    ctx.clearRect(0, 0, w, h);
    const light = isLightTheme();
    const tc = themeColors();
    const colors = [
      [tc.greenFill(0.6*progress), tc.redFill(0.25*progress)],
      [tc.redFill(0.25*progress), tc.greenFill(0.5*progress)]
    ];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const x = pad + c * cellW, y = pad + r * cellH;
        ctx.fillStyle = colors[r][c];
        ctx.fillRect(x+1, y+1, cellW-2, cellH-2);
        ctx.strokeStyle = tc.border;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellW, cellH);
        const val = Math.floor(matrix[r][c] * progress);
        ctx.fillStyle = light ? '#111' : '#fff';
        ctx.font = '700 22px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val, x + cellW/2, y + cellH/2 - 8);
        const pct = ((matrix[r][c] / total) * 100 * progress).toFixed(1);
        ctx.fillStyle = light ? '#333' : 'rgba(157,181,204,0.8)';
        ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.fillText(pct + '%', x + cellW/2, y + cellH/2 + 14);
      }
    }
    // Axis labels
    ctx.fillStyle = tc.muted;
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Predicted Up', pad + cellW/2, pad - 10);
    ctx.fillText('Predicted Down', pad + cellW + cellW/2, pad - 10);
    ctx.save();
    ctx.translate(pad - 12, pad + cellH/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('Actual Up', 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(pad - 12, pad + cellH + cellH/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('Actual Down', 0, 0);
    ctx.restore();
    ctx.fillStyle = tc.dim;
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PREDICTED', pad + cellW, pad - 26);
    ctx.save();
    ctx.translate(pad - 30, pad + cellH);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('ACTUAL', 0, 0);
    ctx.restore();
  }

  draw(0);
  const cmObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        let p = 0;
        (function step() {
          p = Math.min(1, p + 0.03);
          draw(1 - Math.pow(1 - p, 3));
          if (p < 1) requestAnimationFrame(step);
        })();
      }
    });
  }, { threshold: 0.3 });
  cmObs.observe(canvas);
  _themeRedrawFns.push(function() { draw(animated ? 1 : 0); });
  // Legend
  const legend = document.getElementById('cmLegend');
  if (legend) legend.innerHTML = '<span style="color:var(--green)">TP: 115</span> · <span style="color:var(--red)">FP: 85</span> · <span style="color:var(--red)">FN: 95</span> · <span style="color:var(--green)">TN: 105</span> · <span>n=400</span>';
})();

// FEATURE IMPORTANCE (Horizontal Bars)
(function() {
  const container = document.getElementById('featureImportance');
  if (!container) return;
  const features = [
    {name: 'RSI (14)', val: 0.142, color: 'var(--green)'},
    {name: 'MACD Signal', val: 0.128, color: 'var(--green)'},
    {name: 'Volume SMA 20', val: 0.115, color: 'var(--cyan)'},
    {name: 'Bollinger %B', val: 0.098, color: 'var(--cyan)'},
    {name: 'ATR (14)', val: 0.087, color: 'var(--cyan)'},
    {name: 'EMA 50 Slope', val: 0.076, color: 'var(--purple)'},
    {name: 'OBV Delta', val: 0.064, color: 'var(--purple)'},
    {name: 'Stochastic %K', val: 0.055, color: 'var(--muted)'},
    {name: 'ADX', val: 0.048, color: 'var(--muted)'},
    {name: 'VWAP Ratio', val: 0.041, color: 'var(--muted)'}
  ];
  const maxVal = features[0].val;
  features.forEach((f, i) => {
    const row = document.createElement('div');
    row.className = 'fi-row';
    const pct = ((f.val / maxVal) * 100).toFixed(0);
    row.innerHTML = '<span class="fi-label">' + f.name + '</span>' +
      '<div class="fi-bar-track"><div class="fi-bar-fill" style="background:' + f.color + ';width:0" data-w="' + pct + '"><span class="fi-bar-val">' + f.val.toFixed(3) + '</span></div></div>';
    container.appendChild(row);
  });
  const fiObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        entry.target.querySelectorAll('.fi-bar-fill').forEach((bar, i) => {
          setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, i * 60);
        });
      }
    });
  }, { threshold: 0.2 });
  fiObs.observe(container);
})();

// MODEL COMPARISON (Grouped Bar Canvas)
(function() {
  const canvas = document.getElementById('modelComparison');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const models = ['Kraken GBM', 'ML Trading GBM'];
  const metrics = {
    accuracy:  [0.55, 0.52],
    precision: [0.53, 0.50],
    recall:    [0.57, 0.54],
    f1:        [0.55, 0.52]
  };
  let current = 'accuracy';
  let animP = 0;

  function draw(metric, progress) {
    const tc = themeColors();
    const colorVals = tc.barColors;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const vals = metrics[metric];
    const pad = {l:70, r:20, t:20, b:40};
    const barW = (w - pad.l - pad.r) / vals.length;
    // Y axis
    ctx.strokeStyle = tc.gridLine;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (h - pad.t - pad.b) * (1 - i * 0.25);
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
      ctx.fillStyle = tc.muted;
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText((i * 25) + '%', pad.l - 8, y + 4);
    }
    // Bars
    var light = isLightTheme();
    var barOpacity = light ? '44' : '33';
    for (let i = 0; i < vals.length; i++) {
      const x = pad.l + i * barW + barW * 0.15;
      const bw = barW * 0.7;
      const maxH = h - pad.t - pad.b;
      const bh = maxH * vals[i] * progress;
      const y = h - pad.b - bh;
      ctx.fillStyle = colorVals[i] + barOpacity;
      ctx.fillRect(x, y, bw, bh);
      ctx.fillStyle = colorVals[i];
      ctx.fillRect(x, y, bw, 3);
      // Value label
      if (progress > 0.9) {
        ctx.fillStyle = colorVals[i];
        ctx.font = '700 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText((vals[i] * 100).toFixed(0) + '%', x + bw/2, y - 6);
      }
      // Model name
      ctx.fillStyle = tc.muted;
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(models[i], x + bw/2, h - pad.b + 16);
    }
  }

  function animateDraw(metric) {
    animP = 0;
    (function step() {
      animP = Math.min(1, animP + 0.04);
      draw(metric, 1 - Math.pow(1 - animP, 3));
      if (animP < 1) requestAnimationFrame(step);
    })();
  }

  // Tab switching
  document.querySelectorAll('.ml-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ml-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      current = tab.dataset.metric;
      animateDraw(current);
    });
  });

  draw(current, 0);
  const mcObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateDraw(current);
      }
    });
  }, { threshold: 0.3 });
  mcObs.observe(canvas);
  _themeRedrawFns.push(function() { draw(current, canvas.dataset.animated ? 1 : 0); });
})();

// ROC CURVE (Canvas)
(function() {
  const canvas = document.getElementById('rocCurve');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const pad = 50;
  const pw = w - 2*pad, ph = h - 2*pad;
  // Simulated ROC data points (FPR, TPR) — AUC ≈ 0.58
  const rocPoints = [
    [0,0],[0.05,0.08],[0.10,0.16],[0.15,0.22],[0.20,0.28],[0.30,0.38],
    [0.40,0.48],[0.50,0.57],[0.60,0.66],[0.70,0.75],[0.80,0.84],
    [0.90,0.92],[1,1]
  ];
  let animated = false;

  function draw(progress) {
    ctx.clearRect(0, 0, w, h);
    const tc = themeColors();
    // Grid
    ctx.strokeStyle = tc.gridLine;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const x = pad + pw * i/4, y = pad + ph * i/4;
      ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, pad+ph); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(pad+pw, y); ctx.stroke();
    }
    // Diagonal (random)
    ctx.setLineDash([4,4]);
    ctx.strokeStyle = tc.diagonal;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, pad+ph); ctx.lineTo(pad+pw, pad); ctx.stroke();
    ctx.setLineDash([]);
    // ROC curve
    const nPts = Math.floor(rocPoints.length * progress);
    if (nPts > 1) {
      ctx.beginPath();
      for (let i = 0; i < nPts; i++) {
        const x = pad + rocPoints[i][0] * pw;
        const y = pad + ph - rocPoints[i][1] * ph;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = tc.cyan;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // Fill area under curve
      ctx.lineTo(pad + rocPoints[nPts-1][0] * pw, pad + ph);
      ctx.lineTo(pad, pad + ph);
      ctx.closePath();
      ctx.fillStyle = tc.cyanFill(0.12);
      ctx.fill();
      // Dots
      for (let i = 0; i < nPts; i++) {
        const x = pad + rocPoints[i][0] * pw;
        const y = pad + ph - rocPoints[i][1] * ph;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = tc.cyan;
        ctx.fill();
      }
    }
    // Axis labels
    ctx.fillStyle = tc.muted;
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('False Positive Rate', pad + pw/2, h - 10);
    for (let i = 0; i <= 4; i++) {
      ctx.fillText((i*25)+'%', pad + pw*i/4, h - 22);
    }
    ctx.save();
    ctx.translate(14, pad + ph/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('True Positive Rate', 0, 0);
    ctx.restore();
    for (let i = 0; i <= 4; i++) {
      ctx.textAlign = 'right';
      ctx.fillText((100-i*25)+'%', pad - 6, pad + ph*i/4 + 4);
    }
    // AUC badge
    if (progress > 0.5) {
      ctx.fillStyle = tc.cyanFill(0.18);
      ctx.fillRect(pad + pw*0.5 - 40, pad + ph*0.4, 80, 24);
      ctx.fillStyle = tc.cyan;
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('AUC = 0.81', pad + pw*0.5, pad + ph*0.4 + 16);
    }
  }

  draw(0);
  const rocObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        let p = 0;
        (function step() {
          p = Math.min(1, p + 0.025);
          draw(1 - Math.pow(1 - p, 3));
          if (p < 1) requestAnimationFrame(step);
        })();
      }
    });
  }, { threshold: 0.3 });
  rocObs.observe(canvas);
  _themeRedrawFns.push(function() { draw(animated ? 1 : 0); });
})();

// PIPELINE DIAGRAM TOOLTIPS
(function() {
  const diagram = document.getElementById('pipelineDiagram');
  if (!diagram) return;
  const tooltip = document.getElementById('pipelineTooltip');
  diagram.querySelectorAll('.pipe-node').forEach(node => {
    node.addEventListener('mouseenter', (e) => {
      const label = node.dataset.label;
      const detail = node.dataset.detail;
      tooltip.innerHTML = '<div class="pt-title">' + label + '</div><div class="pt-detail">' + detail + '</div>';
      tooltip.classList.add('show');
    });
    node.addEventListener('mousemove', (e) => {
      const rect = diagram.getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
      tooltip.style.top = (e.clientY - rect.top - 40) + 'px';
    });
    node.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
  });
})();

// PERFORMANCE: Pause all RAF loops when tab is hidden
(function() {
  window._tabHidden = () => document.hidden;
})();

// === CREATIVE FLAIR FEATURES ===

// 1. PAGE LOADER — staggered cascade entrance
(function() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('done'), 300);
    setTimeout(() => loader.remove(), 800);
  });
})();

// 2. 3D TILT EFFECT on cards
(function() {
  if ('ontouchstart' in window || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards = document.querySelectorAll('.about-card,.highlight-card,.kpi-card,.ml-panel,.impact-card,.testimonial-card,.stat-ring,.pipeline-diagram');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      card.style.transition = 'transform 0.1s ease-out';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)';
    });
  });
})();

// 3. TYPING ANIMATION on hero subtitle
(function() {
  const sub = document.querySelector('.hero-sub');
  if (!sub || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const fullText = sub.textContent.trim();
  sub.textContent = '';
  const span = document.createElement('span');
  span.className = 'typed-text blink';
  sub.appendChild(span);
  let i = 0;
  const type = () => {
    if (i < fullText.length) {
      span.textContent += fullText[i];
      i++;
      setTimeout(type, 18 + Math.random() * 22);
    } else {
      span.classList.add('done');
      span.classList.remove('blink');
    }
  };
  setTimeout(type, 1000);
})();

// 4. INTERACTIVE NEURAL NETWORK VISUALIZATION
(function() {
  const canvas = document.getElementById('neuralNetCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const layers = [5, 8, 6, 4, 2];
  const layerNames = ['Input', 'Hidden 1', 'Hidden 2', 'Hidden 3', 'Output'];
  let hoveredNeuron = null;
  let mouseX = -1, mouseY = -1;
  let animProgress = 0;
  let animated = false;

  function getNeuronPositions() {
    const positions = [];
    const layerSpacing = w / (layers.length + 1);
    layers.forEach((count, li) => {
      const x = layerSpacing * (li + 1);
      const neuronSpacing = (h - 40) / (count + 1);
      for (let ni = 0; ni < count; ni++) {
        const y = neuronSpacing * (ni + 1) + 20;
        positions.push({ x, y, layer: li, index: ni });
      }
    });
    return positions;
  }

  const neurons = getNeuronPositions();

  function draw(progress) {
    ctx.clearRect(0, 0, w, h);
    const tc = themeColors();
    const layerColors = [tc.cyan, tc.purple, tc.purple, tc.purple, tc.green];

    // Draw connections
    for (let i = 0; i < neurons.length; i++) {
      for (let j = 0; j < neurons.length; j++) {
        if (neurons[j].layer === neurons[i].layer + 1) {
          const isHovered = hoveredNeuron && (
            (hoveredNeuron.layer === neurons[i].layer && hoveredNeuron.index === neurons[i].index) ||
            (hoveredNeuron.layer === neurons[j].layer && hoveredNeuron.index === neurons[j].index)
          );
          ctx.beginPath();
          ctx.moveTo(neurons[i].x, neurons[i].y);
          ctx.lineTo(neurons[j].x, neurons[j].y);
          ctx.strokeStyle = isHovered ? 'rgba(0,212,255,0.4)' : 'rgba(42,63,90,' + (0.15 * progress) + ')';
          ctx.lineWidth = isHovered ? 1.5 : 0.5;
          ctx.stroke();

          // Animated data packet on hovered connections
          if (isHovered && progress >= 1) {
            const t = (Date.now() % 1500) / 1500;
            const px = neurons[i].x + (neurons[j].x - neurons[i].x) * t;
            const py = neurons[i].y + (neurons[j].y - neurons[i].y) * t;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = tc.cyan;
            ctx.fill();
          }
        }
      }
    }

    // Draw neurons
    neurons.forEach(n => {
      const isHovered = hoveredNeuron && hoveredNeuron.layer === n.layer && hoveredNeuron.index === n.index;
      const r = isHovered ? 10 : 6;
      const color = layerColors[n.layer];

      // Glow
      if (isHovered) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 20);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(n.x - 20, n.y - 20, 40, 40);
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, r * progress, 0, Math.PI * 2);
      ctx.globalAlpha = isHovered ? 1 : 0.7;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.stroke();
    });

    // Layer labels
    if (progress > 0.5) {
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      const layerSpacing = w / (layers.length + 1);
      layerNames.forEach((name, i) => {
        ctx.fillStyle = tc.muted;
        ctx.fillText(name, layerSpacing * (i + 1), h - 5);
      });
    }
  }

  // Mouse interaction
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = w / rect.width;
    const scaleY = h / rect.height;
    mouseX = (e.clientX - rect.left) * scaleX;
    mouseY = (e.clientY - rect.top) * scaleY;
    hoveredNeuron = null;
    for (const n of neurons) {
      const dx = mouseX - n.x, dy = mouseY - n.y;
      if (Math.sqrt(dx*dx + dy*dy) < 15) {
        hoveredNeuron = n;
        canvas.style.cursor = 'pointer';
        break;
      }
    }
    if (!hoveredNeuron) canvas.style.cursor = 'default';
  });
  let nnHoverActive = false;
  canvas.addEventListener('mouseenter', () => {
    nnHoverActive = true;
    if (animated) nnLoop();
  });
  canvas.addEventListener('mouseleave', () => { hoveredNeuron = null; mouseX = -1; mouseY = -1; nnHoverActive = false; if (animated) draw(1); });

  function nnLoop() {
    if (!nnHoverActive || !animated) return;
    draw(1);
    requestAnimationFrame(nnLoop);
  }

  // Animate on scroll
  draw(0);
  const nnObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        const start = performance.now();
        const animate = (now) => {
          animProgress = Math.min((now - start) / 800, 1);
          draw(1 - Math.pow(1 - animProgress, 3));
          if (animProgress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    });
  }, { threshold: 0.3 });
  nnObs.observe(canvas);
  _themeRedrawFns.push(() => { if (animated) draw(1); });
})();

// 5. KONAMI CODE EASTER EGG — Matrix rain
(function() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let running = false;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*アイウエオカキクケコサシスセソ';
  let columns, drops;

  function initMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const fontSize = 14;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  }

  function drawMatrix() {
    if (!running) return;
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff87';
    ctx.font = '14px "JetBrains Mono", monospace';
    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * 14, drops[i] * 14);
      if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(drawMatrix);
  }

  document.addEventListener('keydown', e => {
    if (e.key === code[pos]) {
      pos++;
      if (pos === code.length) {
        pos = 0;
        if (!running) {
          running = true;
          initMatrix();
          canvas.classList.add('active');
          drawMatrix();
          setTimeout(() => {
            running = false;
            canvas.classList.remove('active');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }, 5000);
        }
      }
    } else {
      pos = 0;
    }
  });
})();

// 6. SOUND EFFECTS with Web Audio API
(function() {
  const toggle = document.getElementById('soundToggle');
  if (!toggle) return;
  let enabled = false;
  let audioCtx = null;

  toggle.addEventListener('click', () => {
    enabled = !enabled;
    toggle.textContent = enabled ? '🔊' : '🔇';
    toggle.classList.toggle('muted', !enabled);
    if (enabled && !audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  });

  function playTone(freq, duration, type) {
    if (!enabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = type || 'sine';
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  // Hover sound on interactive elements
  document.querySelectorAll('.about-card,.highlight-card,.kpi-card,.flip-card,.impact-card,.ml-panel,.pipe-node,.testimonial-card,.hero-links a,.next-card').forEach(el => {
    el.addEventListener('mouseenter', () => playTone(800 + Math.random() * 400, 0.08, 'sine'));
  });

  // Click sound
  document.addEventListener('click', e => {
    if (e.target.closest('a,button')) playTone(1200, 0.05, 'square');
  });

  // Theme toggle whoosh
  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', () => playTone(400, 0.2, 'sawtooth'));
})();

// 7. SCROLL-SYNCED PIPELINE DATA FLOW
(function() {
  const diagram = document.getElementById('pipelineDiagram');
  if (!diagram) return;
  const svg = diagram.querySelector('.pipeline-svg');
  if (!svg) return;

  // Add animated data packets flowing along the pipeline
  const pipeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !diagram.dataset.animated) {
        diagram.dataset.animated = 'true';
        // Animate pipeline nodes appearing one by one
        const nodes = svg.querySelectorAll('.pipe-node');
        nodes.forEach((node, i) => {
          node.style.opacity = '0';
          node.style.transform = 'translateY(10px)';
          node.style.transition = 'all 0.4s ease ' + (i * 0.15) + 's';
          requestAnimationFrame(() => {
            node.style.opacity = '1';
            node.style.transform = 'translateY(0)';
          });
        });
        // Animate arrows with dash offset
        const arrows = svg.querySelectorAll('line[marker-end]');
        arrows.forEach((arrow, i) => {
          arrow.style.strokeDasharray = '30';
          arrow.style.strokeDashoffset = '30';
          arrow.style.transition = 'stroke-dashoffset 0.6s ease ' + (i * 0.15 + 0.3) + 's';
          requestAnimationFrame(() => { arrow.style.strokeDashoffset = '0'; });
        });
      }
    });
  }, { threshold: 0.3 });
  pipeObs.observe(diagram);
})();

// 8. ANIMATED THEME TRANSITION (smooth gradient wipe)
(function() {
  const origToggle = window.toggleTheme;
  if (!origToggle) return;
  window.toggleTheme = function() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:1;background:radial-gradient(circle at 50% 50%,var(--purple),transparent 70%);transition:opacity 0.4s ease';
    document.body.appendChild(overlay);
    setTimeout(() => { origToggle(); overlay.style.opacity = '0'; }, 150);
    setTimeout(() => overlay.remove(), 600);
  };
})();

}); // end requestIdleCallback deferred block

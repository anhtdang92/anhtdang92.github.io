/* Home page JS — loaded after js/shared.js (both deferred).
   shared.js owns the theme (isLightTheme, toggleTheme, window._themeRedrawFns, 'themechange'),
   the mobile menu, the reveal observer, scroll progress, back-to-top and the footer year.
   Everything here is home-specific. Heavy features start only when their section nears the viewport,
   and decorative motion is skipped on touch screens and under prefers-reduced-motion. */
(function () {
  'use strict';

  // ---------- helpers ----------
  function mq(q) { return !!(window.matchMedia && window.matchMedia(q).matches); }
  var reduceMotion = mq('(prefers-reduced-motion: reduce)');
  var finePointer = mq('(hover: hover) and (pointer: fine)');
  var hasIO = 'IntersectionObserver' in window;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clamp01(x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }
  function easeOutCubic(p) { return 1 - Math.pow(1 - p, 3); }
  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }
  function idle(fn) { (window.requestIdleCallback || function (cb) { return setTimeout(cb, 200); })(fn); }

  // Run fn once, when el comes within `margin` of the viewport.
  function whenNear(el, fn, margin) {
    if (!el) return;
    if (!hasIO) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { io.disconnect(); fn(); return; }
      }
    }, { rootMargin: (margin || '300px') + ' 0px' });
    io.observe(el);
  }

  // Run fn once, when at least `threshold` of el is on screen.
  function whenSeen(el, fn, threshold) {
    if (!el) return;
    if (!hasIO) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { io.disconnect(); fn(); return; }
      }
    }, { threshold: threshold || 0.3 });
    io.observe(el);
  }

  // Tween 0..1 over `duration` ms. Timing starts at the first frame's own timestamp,
  // so progress can never be negative (the old performance.now() start could be later than the rAF time).
  function tween(duration, frame, done) {
    if (reduceMotion) { frame(1, 1); if (done) done(); return; }
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var raw = clamp01((ts - start) / duration);
      frame(easeOutCubic(raw), raw);
      if (raw < 1) requestAnimationFrame(step); else if (done) done();
    }
    requestAnimationFrame(step);
  }

  // Count a number up to its final text ("5+", "$2.9B", "90%+", "176K"...)
  function countUp(el, finalText, duration) {
    if (reduceMotion) return;
    var m = finalText.match(/\d+(?:\.\d+)?/);
    if (!m) return;
    var target = parseFloat(m[0]);
    var prefix = finalText.slice(0, m.index);
    var suffix = finalText.slice(m.index + m[0].length);
    var decimals = m[0].indexOf('.') >= 0 ? m[0].split('.')[1].length : 0;
    if (!decimals && target < 10 && /^[KMB]/.test(suffix)) decimals = 1; // e.g. $0.0B … $2.9B
    tween(duration || 1200, function (e, raw) {
      if (raw >= 1) { el.textContent = finalText; return; }
      var val = e * target;
      el.textContent = prefix + (decimals ? val.toFixed(decimals) : Math.floor(val)) + suffix;
    });
  }

  var MONO = '"JetBrains Mono", monospace';

  // ---------- 1. Dynamic dates (never hardcode years) ----------
  (function () {
    var now = new Date();
    var YEAR = 365.25 * 24 * 60 * 60 * 1000;
    var daYears = Math.floor((now - new Date(2021, 7, 1)) / YEAR);  // IT Data Analyst, Aug 2021
    var milYears = Math.floor((now - new Date(2022, 6, 1)) / YEAR); // commissioned, Jul 2022
    function set(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
    set('da-years', daYears);
    set('kpi-years', daYears + '+');
    set('mil-years', milYears);
    set('mil-years-2', milYears);
    set('ring-da-val', daYears);
    set('ring-mil-val', milYears);
    function ring(id, years) {
      var fill = document.getElementById(id);
      if (fill) fill.setAttribute('data-pct', Math.min(100, Math.round(years / 10 * 100)));
    }
    ring('ring-da-fill', daYears);
    ring('ring-mil-fill', milYears);
  })();

  // ---------- 2. Active nav link for the in-page sections ----------
  (function () {
    var links = $$('nav:not(.footer-nav) a[href^="#"]');
    if (!links.length || !hasIO) return;
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        var link = byId[entry.target.id];
        if (link) { link.classList.add('active'); link.setAttribute('aria-current', 'location'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' }); // a thin band across the middle of the screen
    $$('main > section').forEach(function (s) { io.observe(s); });
  })();

  // ---------- 3. Pause decorative CSS animations in off-screen sections ----------
  (function () {
    if (!hasIO || reduceMotion) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('offscreen', !e.isIntersecting); });
    }, { rootMargin: '100px 0px' });
    $$('main > section, main > .kpi-strip').forEach(function (el) { io.observe(el); });
  })();

  // ---------- 4. Number count-ups, progress rings, section divider glow ----------
  (function () {
    var strip = $('.kpi-strip');
    whenSeen(strip, function () {
      $$('.kpi-num', strip).forEach(function (el) { countUp(el, el.textContent.trim(), 1400); });
    }, 0.3);

    $$('.impact-row').forEach(function (row) {
      whenSeen(row, function () {
        $$('.impact-num', row).forEach(function (el) { countUp(el, el.textContent.trim(), 1200); });
      }, 0.3);
    });

    $$('.stat-ring').forEach(function (ring) {
      whenSeen(ring, function () {
        var fill = $('.ring-fill', ring);
        if (!fill) return;
        var pct = parseFloat(fill.getAttribute('data-pct')) || 0;
        fill.style.strokeDashoffset = 226 * (1 - pct / 100);
      }, 0.3);
    });

    $$('main > section + section').forEach(function (s) {
      s.classList.add('section-divider-glow');
      whenSeen(s, function () { s.classList.add('visible'); }, 0.05);
    });
  })();

  // ---------- 5. Tooltips for SVG charts: hover, focus, click/tap (with pinning) ----------
  function attachTips(container, tip, items, content) {
    if (!container || !tip || !items.length) return;
    var pinned = null;
    function show(item) {
      tip.innerHTML = content(item);
      tip.classList.add('show');
      var cr = container.getBoundingClientRect();
      var r = item.getBoundingClientRect();
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var x = Math.max(8, Math.min(r.left + r.width / 2 - cr.left - tw / 2, cr.width - tw - 8));
      var y = r.top - cr.top - th - 10;
      if (y < 4) y = r.bottom - cr.top + 10;
      tip.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
      items.forEach(function (i) { i.classList.toggle('is-active', i === item); });
    }
    function hide() {
      pinned = null;
      tip.classList.remove('show');
      items.forEach(function (i) { i.classList.remove('is-active'); });
    }
    function toggle(item) {
      if (pinned === item) { hide(); } else { pinned = item; show(item); }
    }
    items.forEach(function (item) {
      item.addEventListener('mouseenter', function () { if (!pinned) show(item); });
      item.addEventListener('mouseleave', function () { if (!pinned && document.activeElement !== item) hide(); });
      item.addEventListener('focus', function () { show(item); });
      item.addEventListener('blur', function () { hide(); });
      item.addEventListener('click', function () { toggle(item); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(item); }
        else if (e.key === 'Escape') { hide(); }
      });
    });
    document.addEventListener('click', function (e) { if (pinned && !container.contains(e.target)) hide(); });
  }

  // ---------- 6. Career trajectory (desktop SVG; phones get the HTML timeline) ----------
  (function () {
    var chart = $('.trajectory-chart');
    if (!chart) return;
    whenNear(chart, function () {
      var tip = document.createElement('div');
      tip.className = 'chart-tooltip';
      tip.setAttribute('aria-hidden', 'true');
      chart.appendChild(tip);
      attachTips(chart, tip, $$('.traj-dot', chart), function (dot) {
        return '<div class="tt-title">' + dot.getAttribute('data-title') + '</div><div class="tt-detail">' + dot.getAttribute('data-detail') + '</div>';
      });
    });
  })();

  // ---------- 7. Coding activity: same-origin data/contributions.json, else a link card ----------
  (function () {
    var card = document.getElementById('ghHeatmap');
    if (!card || !window.fetch) return;
    var src = card.getAttribute('data-src');
    if (!src) return;
    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

    function parseDay(s) { var p = s.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
    function fmtDate(s, withWeekday) {
      var opts = { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
      if (withWeekday) opts.weekday = 'short';
      return parseDay(s).toLocaleDateString('en-US', opts);
    }
    function plural(n) { return n.toLocaleString('en-US') + ' contribution' + (n === 1 ? '' : 's'); }

    function render(data) {
      var counts = {};
      (data && Array.isArray(data.days) ? data.days : []).forEach(function (d) {
        if (d && DAY_RE.test(d.date)) counts[d.date] = Math.max(0, Math.round(+d.count) || 0);
      });
      var keys = Object.keys(counts).sort();
      if (!keys.length) throw new Error('no contribution data');
      var endKey = DAY_RE.test(data.generated) ? data.generated : keys[keys.length - 1];
      var end = parseDay(endKey);
      // One year back, then back again to a Sunday so every column is a Sun–Sat week (like GitHub)
      var start = new Date(end.getTime());
      start.setUTCDate(start.getUTCDate() - 364);
      start.setUTCDate(start.getUTCDate() - start.getUTCDay());

      var cells = [], sum = 0, max = 0;
      for (var d = new Date(start.getTime()); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
        var key = d.toISOString().slice(0, 10);
        var c = counts[key] || 0;
        cells.push({ key: key, count: c, month: d.getUTCMonth(), dom: d.getUTCDate() });
        sum += c;
        if (c > max) max = c;
      }
      var total = (typeof data.total === 'number' && isFinite(data.total)) ? Math.round(data.total) : sum;
      var weeks = Math.ceil(cells.length / 7);
      function level(n) {
        if (!n) return 0;
        var r = n / max;
        return r > 0.75 ? 4 : r > 0.5 ? 3 : r > 0.25 ? 2 : 1;
      }
      var label = plural(total) + ' in the year to ' + fmtDate(endKey);

      var scroll = document.createElement('div');
      scroll.className = 'gh-scroll';
      var inner = document.createElement('div');
      inner.className = 'gh-inner';

      var months = document.createElement('div');
      months.className = 'gh-months';
      months.setAttribute('aria-hidden', 'true');
      months.style.gridTemplateColumns = 'repeat(' + weeks + ',1fr)';
      for (var w = 0; w < weeks; w++) {
        var first = cells[w * 7];
        var span = document.createElement('span');
        if (first && first.dom <= 7) span.textContent = MONTHS[first.month];
        months.appendChild(span);
      }

      var grid = document.createElement('div');
      grid.className = 'gh-grid';
      grid.setAttribute('role', 'img');
      grid.setAttribute('aria-label', 'GitHub contribution graph: ' + label);
      grid.style.gridTemplateColumns = 'repeat(' + weeks + ',1fr)';
      var frag = document.createDocumentFragment();
      cells.forEach(function (c) {
        var el = document.createElement('div');
        var lv = level(c.count);
        el.className = 'gh-cell' + (lv ? ' l' + lv : '');
        el.setAttribute('data-date', c.key);
        el.setAttribute('data-count', c.count);
        frag.appendChild(el);
      });
      grid.appendChild(frag);

      var legend = document.createElement('div');
      legend.className = 'gh-legend';
      legend.innerHTML = '<a href="https://github.com/anhtdang92" target="_blank" rel="noopener" style="margin-right:auto;font-family:var(--mono);font-size:12px">View on GitHub →</a>' +
        '<span aria-hidden="true">Less</span>' +
        [0, 1, 2, 3, 4].map(function (l) { return '<i class="gh-cell gh-legend-cell' + (l ? ' l' + l : '') + '" aria-hidden="true"></i>'; }).join('') +
        '<span aria-hidden="true">More</span>';

      inner.appendChild(months);
      inner.appendChild(grid);
      scroll.appendChild(inner);

      var graph = document.getElementById('gh-graph');
      graph.innerHTML = '';
      graph.appendChild(scroll);
      graph.appendChild(legend);
      graph.hidden = false;
      var fallback = document.getElementById('gh-fallback');
      if (fallback) fallback.hidden = true;
      var totalEl = document.getElementById('gh-total');
      if (totalEl) totalEl.textContent = label;

      // Phones: the graph scrolls sideways — start at the most recent weeks, keep it keyboard-scrollable
      if (scroll.scrollWidth > scroll.clientWidth + 1) {
        scroll.scrollLeft = scroll.scrollWidth;
        scroll.tabIndex = 0;
        scroll.setAttribute('role', 'region');
        scroll.setAttribute('aria-label', 'Contribution graph, scrolls sideways');
      }

      // Hover tooltip, from each cell's data-* attributes
      var tip = document.createElement('div');
      tip.className = 'gh-tooltip';
      tip.setAttribute('aria-hidden', 'true');
      document.body.appendChild(tip);
      function hideTip() { tip.classList.remove('show'); }
      grid.addEventListener('mouseover', function (e) {
        var cell = e.target.closest ? e.target.closest('.gh-cell') : null;
        if (!cell) return;
        var n = +cell.getAttribute('data-count');
        tip.textContent = (n ? plural(n) : 'No contributions') + ' on ' + fmtDate(cell.getAttribute('data-date'), true);
        tip.classList.add('show');
        var r = cell.getBoundingClientRect();
        var left = Math.max(8, Math.min(r.left + r.width / 2 - tip.offsetWidth / 2, window.innerWidth - tip.offsetWidth - 8));
        tip.style.left = left + 'px';
        tip.style.top = (r.top - tip.offsetHeight - 8) + 'px';
      });
      grid.addEventListener('mouseleave', hideTip);
      window.addEventListener('scroll', hideTip, { passive: true });
    }

    whenNear(card, function () {
      var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 4000);
      fetch(src, { signal: ctrl ? ctrl.signal : undefined, headers: { Accept: 'application/json' } })
        .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
        .then(function (data) { clearTimeout(timer); render(data); })
        .catch(function () { clearTimeout(timer); /* the "View my contributions on GitHub" card stays */ });
    }, '400px');
  })();

  // ---------- 8. Desktop-only flourishes (mouse + motion allowed) ----------

  // Hero particle constellation: one loop, ~30fps, paused off-screen / in background tabs
  idle(function () {
    var hero = $('.hero');
    if (!hero || reduceMotion || !mq('(hover: hover)') || window.innerWidth < 600) return;
    var canvas = document.createElement('canvas');
    canvas.id = 'heroParticles';
    canvas.setAttribute('aria-hidden', 'true');
    hero.parentNode.insertBefore(canvas, hero);
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, particles = [];
    var COUNT = 40, LINK = 120, REPEL = 100;
    var colors = ['#e040fb', '#00d4ff', '#00ff87', '#ffd000', '#bf5fff'];
    var mouseX = -9999, mouseY = -9999;
    var raf = 0, last = 0, onScreen = true;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.parentNode.clientWidth;
      H = hero.offsetTop + hero.offsetHeight;
      canvas.style.height = H + 'px';
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.1
      });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x, dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = 'rgba(0,212,255,' + ((1 - dist / LINK) * 0.12) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      particles.forEach(function (pt) {
        var mdx = pt.x - mouseX, mdy = pt.y - mouseY;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < REPEL && md > 0) {
          var force = (1 - md / REPEL) * 3;
          pt.vx += (mdx / md) * force * 0.04;
          pt.vy += (mdy / md) * force * 0.04;
        }
        pt.vx *= 0.98; pt.vy *= 0.98;
        pt.x += pt.vx; pt.y += pt.vy;
        if (pt.x < 0 || pt.x > W) pt.vx *= -1;
        if (pt.y < 0 || pt.y > H) pt.vy *= -1;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }
    function frame(ts) {
      raf = 0;
      if (!onScreen || document.hidden) return;
      if (ts - last >= 33) { last = ts; draw(); }
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(frame); }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

    hero.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', function () { mouseX = mouseY = -9999; });
    if (hasIO) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (onScreen) start(); else stop();
      }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    window.addEventListener('resize', debounce(resize, 150), { passive: true });
    start();
  });

  // Cursor glow trail (only while the mouse moves)
  (function () {
    if (!finePointer || reduceMotion) return;
    var canvas = null, ctx = null, W = 0, H = 0, trail = [], mx = -100, my = -100, running = false;
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < trail.length; i++) {
        var t = trail[i];
        t.age++;
        var life = 1 - t.age / 30;
        if (life <= 0) { trail.splice(i, 1); i--; continue; }
        var r = 20 * life;
        var g = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r);
        g.addColorStop(0, 'rgba(0,212,255,' + (0.08 * life) + ')');
        g.addColorStop(0.5, 'rgba(224,64,251,' + (0.04 * life) + ')');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(t.x - r, t.y - r, r * 2, r * 2);
      }
      if (trail.length && !document.hidden) requestAnimationFrame(draw);
      else { running = false; ctx.clearRect(0, 0, W, H); }
    }
    document.addEventListener('mousemove', function (e) {
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'cursorGlow';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', debounce(resize, 150), { passive: true });
        canvas.style.opacity = '0.7';
      }
      mx = e.clientX; my = e.clientY;
      trail.push({ x: mx, y: my, age: 0 });
      if (trail.length > 20) trail.shift();
      if (!running) { running = true; requestAnimationFrame(draw); }
    }, { passive: true });
  })();

  // Card hover glow, magnetic CTA buttons, 3D tilt
  (function () {
    if (!finePointer) return;
    $$('.about-card,.highlight-card,.kpi-card,.next-card,.next-item').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left, y = e.clientY - rect.top;
        card.style.background = 'radial-gradient(circle 150px at ' + x + 'px ' + y + 'px, rgba(0,212,255,0.06), transparent), var(--card-glass)';
      });
      card.addEventListener('mouseleave', function () { card.style.background = ''; });
    });
    if (reduceMotion) return;
    $$('.hero-links a').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        btn.style.transform = 'translate(' + ((e.clientX - rect.left - rect.width / 2) * 0.15) + 'px,' + ((e.clientY - rect.top - rect.height / 2) * 0.15) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
    $$('.about-card,.highlight-card,.kpi-card,.impact-card,.stat-ring').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transition = 'transform 0.1s ease-out';
        card.style.transform = 'perspective(800px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)';
        card.style.transform = '';
      });
    });
  })();

  // Konami code easter egg — matrix rain (canvas is created only when triggered)
  (function () {
    if (reduceMotion) return;
    var code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var pos = 0, running = false;
    function run() {
      running = true;
      var canvas = document.createElement('canvas');
      canvas.id = 'matrixCanvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*アイウエオカキクケコサシスセソ';
      var drops = new Array(Math.floor(canvas.width / 14)).fill(1);
      function frame() {
        if (!running) return;
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff87';
        ctx.font = '14px ' + MONO;
        for (var i = 0; i < drops.length; i++) {
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, drops[i] * 14);
          if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(function () { canvas.classList.add('active'); frame(); });
      setTimeout(function () {
        running = false;
        canvas.classList.remove('active');
        setTimeout(function () { canvas.remove(); }, 600);
      }, 5000);
    }
    document.addEventListener('keydown', function (e) {
      var key = e.key && e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === code[pos]) {
        pos++;
        if (pos === code.length) { pos = 0; if (!running) run(); }
      } else {
        pos = key === code[0] ? 1 : 0;
      }
    });
  })();
})();

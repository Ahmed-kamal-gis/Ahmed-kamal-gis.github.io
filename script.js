/* ============================================================
   AHMED KAMAL — GIS Portfolio Script
   ============================================================ */

// ── CANVAS BACKGROUND (GIS-inspired grid + dots) ──
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, dots = [], animFrame;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function initDots() {
  dots = [];
  const count = Math.floor((W * H) / 18000);
  for (let i = 0; i < count; i++) {
    dots.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.5 + 0.1
    });
  }
}

function drawGrid() {
  const spacing = 80;
  ctx.strokeStyle = 'rgba(56,189,248,0.04)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += spacing) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += spacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

function drawConnections() {
  const maxDist = 140;
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.12;
        ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  drawGrid();
  dots.forEach(d => {
    d.x += d.vx; d.y += d.vy;
    if (d.x < 0 || d.x > W) d.vx *= -1;
    if (d.y < 0 || d.y > H) d.vy *= -1;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56,189,248,${d.opacity})`;
    ctx.fill();
  });
  drawConnections();
  animFrame = requestAnimationFrame(animateCanvas);
}

resizeCanvas(); initDots(); animateCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initDots(); });

// ── THEME TOGGLE ──
const themeBtn = document.getElementById('theme-toggle');
const iconMoon = themeBtn.querySelector('.icon-moon');
const iconSun  = themeBtn.querySelector('.icon-sun');

function setTheme(light) {
  document.body.classList.toggle('light-mode', light);
  iconMoon.style.display = light ? 'none'  : 'block';
  iconSun.style.display  = light ? 'block' : 'none';
  themeBtn.title = light ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  localStorage.setItem('theme', light ? 'light' : 'dark');
}

// Load saved preference
const saved = localStorage.getItem('theme');
if (saved === 'light') setTheme(true);

themeBtn.addEventListener('click', () => {
  setTheme(!document.body.classList.contains('light-mode'));
});

// ── NAV SCROLL ──
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── MOBILE NAV ──
const mobileBtn = document.getElementById('mobile-nav-btn');
const navLinksEl = document.getElementById('nav-links');
if (mobileBtn && navLinksEl) {
  mobileBtn.addEventListener('click', () => {
    const open = navLinksEl.style.display === 'flex';
    navLinksEl.style.display = open ? 'none' : 'flex';
    navLinksEl.style.flexDirection = 'column';
    navLinksEl.style.position = 'absolute';
    navLinksEl.style.top = '100%';
    navLinksEl.style.left = '0'; navLinksEl.style.right = '0';
    navLinksEl.style.background = 'rgba(6,9,18,0.97)';
    navLinksEl.style.padding = '1rem 1.5rem 1.5rem';
    navLinksEl.style.borderBottom = '1px solid rgba(255,255,255,0.07)';
  });
}

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// ── COUNTER ANIMATION ──
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = el.dataset.target.includes('.');
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = eased * target;
    el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = 'true';
      animateCounter(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

// ── SMOOTH ACTIVE NAV ──
const sections = document.querySelectorAll('section[id], div[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navAs.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// Página CHISPA — interacciones
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import './style.css';
import { gotoView } from './viewer.js';
import { ZONES } from './data.js';

// ---------- Plano: selector de zonas ----------
const panel = {
  badge: document.getElementById('zoneBadge'),
  title: document.getElementById('zoneTitle'),
  desc: document.getElementById('zoneDesc'),
  equip: document.getElementById('zoneEquip'),
  viewBtn: document.getElementById('zoneViewBtn')
};

let currentZone = null;

function selectZone(key, goTo3D = false) {
  const z = ZONES[key];
  if (!z) return;
  currentZone = key;
  document.querySelectorAll('.zone').forEach((el) => el.classList.toggle('selected', el.dataset.zone === key));
  panel.badge.textContent = 'Zona ' + z.letter;
  panel.badge.style.background = z.color;
  panel.badge.style.color = '#0b0e14';
  panel.title.textContent = z.title;
  panel.desc.textContent = z.desc;
  panel.equip.innerHTML = z.equip.map((e) => `<li>${e}</li>`).join('');
  if (goTo3D) {
    document.getElementById('visor').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => gotoView(z.view), 700);
  }
}

document.querySelectorAll('.zone').forEach((el) => {
  el.addEventListener('click', () => selectZone(el.dataset.zone));
  el.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); selectZone(el.dataset.zone); } });
});
panel.viewBtn?.addEventListener('click', () => document.getElementById('visor').scrollIntoView({ behavior: 'smooth' }));

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ---------- Contadores animados ----------
const counters = document.querySelectorAll('.stat-num[data-count]');
const cio = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    cio.unobserve(el);
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const t0 = performance.now(); const dur = 1400;
    (function tick() {
      const k = Math.min(1, (performance.now() - t0) / dur);
      const v = target * (1 - Math.pow(1 - k, 3));
      el.textContent = v.toFixed(dec);
      if (k < 1) requestAnimationFrame(tick);
    })();
  });
}, { threshold: 0.6 });
counters.forEach((el) => cio.observe(el));

// ---------- Partículas del hero (chispas) ----------
const canvas = document.getElementById('sparks');
const ctx = canvas.getContext('2d');
let W, H, parts = [];
function sizeCanvas() {
  W = canvas.width = canvas.offsetWidth * devicePixelRatio;
  H = canvas.height = canvas.offsetHeight * devicePixelRatio;
}
function makeParts() {
  const n = Math.min(90, Math.floor(W / 16));
  parts = Array.from({ length: n }, () => ({
    x: Math.random() * W,
    y: H + Math.random() * H * 0.4,
    r: (Math.random() * 1.8 + 0.6) * devicePixelRatio,
    s: (Math.random() * 0.5 + 0.25) * devicePixelRatio,
    tw: Math.random() * Math.PI * 2,
    ts: Math.random() * 0.06 + 0.02
  }));
}
function loop() {
  ctx.clearRect(0, 0, W, H);
  for (const p of parts) {
    p.y -= p.s; p.tw += p.ts;
    if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
    const a = 0.25 + 0.55 * Math.abs(Math.sin(p.tw));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 179, 0, ${a})`;
    ctx.fill();
  }
  requestAnimationFrame(loop);
}
sizeCanvas(); makeParts(); loop();
window.addEventListener('resize', () => { sizeCanvas(); makeParts(); });

// ---------- Nav con sombra al scrollear ----------
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 24), { passive: true });

// ---------- Año dinámico en footer ----------
const year = document.querySelector('.footer-note');
if (year) year.textContent = year.textContent.replace('2026', new Date().getFullYear());

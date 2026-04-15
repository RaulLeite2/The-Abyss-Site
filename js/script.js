/* ====================================================
   THE ABYSS — script.js
   ==================================================== */

// ---- Custom cursor ----
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animateFollower() {
    fx += (mx - fx) * 0.16;
    fy += (my - fy) * 0.16;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  })();

  document.querySelectorAll('a, button, input, textarea').forEach((el) => {
    el.addEventListener('mouseenter', () => follower.classList.add('hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
  });
})();

// ---- Navbar scroll + active link ----
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  let current = '';
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ---- Mobile nav toggle ----
const navToggle  = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

navToggle.addEventListener('click', () => navLinksEl.classList.toggle('open'));
navLinksEl.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') navLinksEl.classList.remove('open');
});

// ---- Scroll reveal ----
const revealEls = document.querySelectorAll(
  '.service-card, .project-card, .founder-card, .about-text, .contact-form, .contact-info, .contact-link, .about-stats'
);
revealEls.forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  }),
  { threshold: 0.1 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// ---- Particle canvas (white particles) ----
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let pts = [], raf;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function spawn() {
    pts = [];
    const n = Math.floor((canvas.width * canvas.height) / 16000);
    for (let i = 0; i < n; i++) {
      pts.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        r:  Math.random() * 1.1 + 0.3,
        dx: (Math.random() - 0.5) * 0.28,
        dy: (Math.random() - 0.5) * 0.28,
        a:  Math.random() * 0.45 + 0.12,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${0.1 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    raf = requestAnimationFrame(draw);
  }

  function init() {
    cancelAnimationFrame(raf);
    resize();
    spawn();
    draw();
  }

  init();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });
})();

// ---- Contact form ----
const contactForm = document.getElementById('contactForm');
const formNotice  = document.getElementById('formNotice');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name  = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const msg   = contactForm.message.value.trim();

    if (!name || !email || !msg) {
      formNotice.textContent = 'Please fill in all fields.';
      formNotice.className   = 'form-notice error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formNotice.textContent = 'Please enter a valid email address.';
      formNotice.className   = 'form-notice error';
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled     = true;
    btn.textContent  = 'Sending…';

    setTimeout(() => {
      formNotice.textContent = "✓ Message sent! We'll reach back soon.";
      formNotice.className   = 'form-notice success';
      contactForm.reset();
      btn.disabled    = false;
      btn.textContent = 'Enter the Abyss';
    }, 1200);
  });
}

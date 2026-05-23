/* =====================================================================
   script.js – Portfolio Interactive Logic
   ===================================================================== */

'use strict';

// -----------------------------------------------------------------------
// 1. LOADER
// -----------------------------------------------------------------------
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Wait for the bar animation (2.2s) then hide
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger initial reveal check
    handleReveal();
    animateCounters();
  }, 2400);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';

// -----------------------------------------------------------------------
// 2. CUSTOM CURSOR
// -----------------------------------------------------------------------
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (dot) {
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  }
});

// Ring follows with smooth lerp
function lerpCursor() {
  if (!ring) return;
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(lerpCursor);
}
lerpCursor();

// Expand ring on hoverable elements
const hoverables = document.querySelectorAll('a, button, .btn, .skill-card, .project-card, .csocial, .contact-item, .back-top');
hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => ring && ring.classList.add('expand'));
  el.addEventListener('mouseleave', () => ring && ring.classList.remove('expand'));
});

// Click shrink
document.addEventListener('mousedown', () => ring && ring.classList.add('click'));
document.addEventListener('mouseup',   () => ring && ring.classList.remove('click'));

// -----------------------------------------------------------------------
// 3. NAVBAR – scroll glass + active link
// -----------------------------------------------------------------------
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // Glass effect
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  // Active link
  let currentSection = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) {
      currentSection = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-section') === currentSection);
  });

  // Reveal
  handleReveal();

  // Skill bars
  triggerBars();
});

// -----------------------------------------------------------------------
// 4. MOBILE MENU
// -----------------------------------------------------------------------
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');

hamburger && hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close on link click
navMenu && navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// -----------------------------------------------------------------------
// 5. TYPED.JS
// -----------------------------------------------------------------------
if (document.getElementById('typed')) {
  new Typed('#typed', {
    strings: [
      'Web Developer',
      'B.Tech CSE Student',
      'AI Enthusiast',
      'Aspiring Software Engineer',
      'Problem Solver'
    ],
    typeSpeed:  55,
    backSpeed:  35,
    backDelay:  2200,
    startDelay: 600,
    loop:       true,
    cursorChar: '|'
  });
}

// -----------------------------------------------------------------------
// 6. PARTICLES.JS
// -----------------------------------------------------------------------
if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
  particlesJS('particles-js', {
    particles: {
      number: { value: 70, density: { enable: true, value_area: 900 } },
      color: { value: ['#00f3ff', '#7000ff', '#ff00c8'] },
      shape: { type: 'circle' },
      opacity: {
        value: 0.45, random: true,
        anim: { enable: true, speed: 0.8, opacity_min: 0.05, sync: false }
      },
      size: {
        value: 2.5, random: true,
        anim: { enable: true, speed: 1.5, size_min: 0.1, sync: false }
      },
      line_linked: {
        enable: true, distance: 160,
        color: '#7000ff', opacity: 0.18, width: 1
      },
      move: {
        enable: true, speed: 1.2,
        direction: 'none', random: true,
        straight: false, out_mode: 'out', bounce: false
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        grab: { distance: 180, line_linked: { opacity: 0.6 } },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}

// -----------------------------------------------------------------------
// 7. VANILLA TILT (3D tilt on skill cards)
// -----------------------------------------------------------------------
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
    max:        12,
    speed:      400,
    glare:      true,
    'max-glare': 0.15,
    scale:      1.04
  });
}

// -----------------------------------------------------------------------
// 8. SCROLL REVEAL
// -----------------------------------------------------------------------
function handleReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('active');
    }
  });
}
handleReveal(); // run once on load

// -----------------------------------------------------------------------
// 9. SKILL PROGRESS BARS – animate on scroll into view
// -----------------------------------------------------------------------
let barsAnimated = false;

function triggerBars() {
  if (barsAnimated) return;
  const barsSection = document.querySelector('.skills-bars');
  if (!barsSection) return;
  const rect = barsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 50) {
    barsAnimated = true;
    document.querySelectorAll('.bar-fill').forEach(bar => {
      const target = bar.getAttribute('data-width');
      bar.style.width = target + '%';
    });
  }
}

// -----------------------------------------------------------------------
// 10. HERO STAT COUNTERS
// -----------------------------------------------------------------------
function animateCounters() {
  document.querySelectorAll('.hstat-num').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'), 10);
    let current  = 0;
    const step   = Math.ceil(target / 30);
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      counter.textContent = current;
    }, 40);
  });
}

// -----------------------------------------------------------------------
// 11. CONTACT FORM
// -----------------------------------------------------------------------
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

contactForm && contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Basic validation
  const name    = document.getElementById('formName').value.trim();
  const email   = document.getElementById('formEmail').value.trim();
  const message = document.getElementById('formMessage').value.trim();

  if (!name || !email || !message) return;

  // Simulate send
  submitBtn.innerHTML = '<span>Sending…</span> <i class="fas fa-spinner fa-spin"></i>';
  submitBtn.disabled  = true;

  setTimeout(() => {
    submitBtn.innerHTML = '<span>Sent!</span> <i class="fas fa-check"></i>';
    submitBtn.style.background = 'linear-gradient(135deg,#00ff88,#00c8ff)';

    formSuccess && formSuccess.classList.add('show');
    contactForm.reset();

    setTimeout(() => {
      submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      submitBtn.style.background = '';
      submitBtn.disabled = false;
      formSuccess && formSuccess.classList.remove('show');
    }, 4000);
  }, 1800);
});

// -----------------------------------------------------------------------
// 12. FOOTER YEAR
// -----------------------------------------------------------------------
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// -----------------------------------------------------------------------
// 13. RESUME BUTTON (placeholder download)
// -----------------------------------------------------------------------
const resumeBtn = document.getElementById('downloadResumeBtn');
resumeBtn && resumeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // Replace '#' with your actual resume PDF path when ready
  alert('📄 Resume download will be available soon!');
});

// -----------------------------------------------------------------------
// 14. SMOOTH BACK-TO-TOP
// -----------------------------------------------------------------------
document.querySelectorAll('.back-top').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// -----------------------------------------------------------------------
// 15. PARALLAX ORBS on mouse move
// -----------------------------------------------------------------------
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');
const orb3 = document.querySelector('.orb-3');

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 40;
  const y = (e.clientY / window.innerHeight - 0.5) * 40;
  if (orb1) orb1.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
  if (orb3) orb3.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
});

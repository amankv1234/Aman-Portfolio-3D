/* =====================================================================
   script.js – Portfolio Interactive Logic (Enhanced)
   ===================================================================== */

'use strict';

// -----------------------------------------------------------------------
// 0. UTILITY HELPERS
// -----------------------------------------------------------------------

/** Linear interpolation */
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/** Debounce helper for resize events */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/** Clamp a value between min and max */
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// -----------------------------------------------------------------------
// 1. LOADER
// -----------------------------------------------------------------------
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Wait for the bar animation (2.2s) then hide
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger initial reveal check (fallback for elements already in view)
    handleReveal();
  }, 2400);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';

// -----------------------------------------------------------------------
// 2. CUSTOM CURSOR
// -----------------------------------------------------------------------
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
const cursorGlow = document.getElementById('cursorGlow');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;
let glowX  = 0, glowY  = 0;

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
  if (ring) {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
  }

  // Cursor glow – large soft glow (200-300px), slightly behind cursor ring
  if (cursorGlow) {
    glowX = lerp(glowX, mouseX, 0.08);
    glowY = lerp(glowY, mouseY, 0.08);
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top  = glowY + 'px';
  }

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
// 3. MOUSE-REACTIVE GRADIENT
// -----------------------------------------------------------------------
const mouseGradient = document.getElementById('mouseGradient');
let gradX = 0, gradY = 0;
let targetGradX = 0, targetGradY = 0;

document.addEventListener('mousemove', (e) => {
  targetGradX = e.clientX;
  targetGradY = e.clientY;
});

function animateGradient() {
  if (mouseGradient) {
    gradX = lerp(gradX, targetGradX, 0.06);
    gradY = lerp(gradY, targetGradY, 0.06);
    mouseGradient.style.left = gradX + 'px';
    mouseGradient.style.top  = gradY + 'px';
    mouseGradient.style.background = `radial-gradient(600px circle at center, rgba(112, 0, 255, 0.12), rgba(0, 243, 255, 0.06), transparent 70%)`;
    mouseGradient.style.transform  = 'translate(-50%, -50%)';
    mouseGradient.style.width  = '1200px';
    mouseGradient.style.height = '1200px';
    mouseGradient.style.pointerEvents = 'none';
    mouseGradient.style.position = 'fixed';
    mouseGradient.style.zIndex = '0';
    mouseGradient.style.borderRadius = '50%';
  }
  requestAnimationFrame(animateGradient);
}
animateGradient();

// -----------------------------------------------------------------------
// 4. NAVBAR – scroll glass + active link (IntersectionObserver enhanced)
// -----------------------------------------------------------------------
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

// Scroll-driven glass effect via rAF-throttled scroll handler
let ticking = false;

function onScrollActions() {
  // Glass effect
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(onScrollActions);
    ticking = true;
  }
});

// IntersectionObserver for precise active nav link tracking
const navObserverOptions = {
  root: null,
  rootMargin: '-20% 0px -75% 0px',
  threshold: 0
};

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-section') === id);
      });
    }
  });
}, navObserverOptions);

sections.forEach(section => navObserver.observe(section));

// -----------------------------------------------------------------------
// 5. MOBILE MENU
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
// 6. TYPED.JS (Updated strings)
// -----------------------------------------------------------------------
if (document.getElementById('typed')) {
  new Typed('#typed', {
    strings: [
      'Full Stack Developer',
      'MERN Developer',
      'Open Source Contributor',
      'GSSoC 2026 Ambassador',
      'Web Developer Intern'
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
// 7. PARTICLES.JS (Enhanced)
// -----------------------------------------------------------------------
if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
  particlesJS('particles-js', {
    particles: {
      number: { value: 90, density: { enable: true, value_area: 850 } },
      color: { value: ['#00f3ff', '#7000ff', '#ff00c8', '#00ff88', '#a855f7'] },
      shape: { type: 'circle' },
      opacity: {
        value: 0.5, random: true,
        anim: { enable: true, speed: 1.0, opacity_min: 0.05, sync: false }
      },
      size: {
        value: 3, random: true,
        anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
      },
      line_linked: {
        enable: true, distance: 150,
        color: '#7000ff', opacity: 0.2, width: 1
      },
      move: {
        enable: true, speed: 1.3,
        direction: 'none', random: true,
        straight: false, out_mode: 'out', bounce: false
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: ['grab', 'repulse'] },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        grab: { distance: 200, line_linked: { opacity: 0.7 } },
        repulse: { distance: 120, duration: 0.4 },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}

// -----------------------------------------------------------------------
// 8. VANILLA TILT (3D tilt on skill cards)
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
// 9. SCROLL REVEAL (IntersectionObserver-based)
// -----------------------------------------------------------------------
function handleReveal() {
  // Fallback: mark elements already in viewport as active
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('active');
    }
  });
}
handleReveal(); // run once on load

// IntersectionObserver for reveal animations (performance optimized)
const revealObserverOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target); // stop observing once revealed
    }
  });
}, revealObserverOptions);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Staggered reveal delays: .reveal-delay-1, .reveal-delay-2, etc.
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Extract delay index from class name
      const classList = entry.target.classList;
      let delayMs = 0;
      classList.forEach(cls => {
        const match = cls.match(/^reveal-delay-(\d+)$/);
        if (match) {
          delayMs = parseInt(match[1], 10) * 150; // 150ms per step
        }
      });
      setTimeout(() => {
        entry.target.classList.add('active');
      }, delayMs);
      staggerObserver.unobserve(entry.target);
    }
  });
}, { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

document.querySelectorAll('[class*="reveal-delay-"]').forEach(el => {
  staggerObserver.observe(el);
});

// Stagger skill category cards on entry
const skillCategoryObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.skill-category');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 200);
      });
      skillCategoryObserver.unobserve(entry.target);
    }
  });
}, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.05 });

const skillsCategories = document.querySelector('.skills-categories');
if (skillsCategories) {
  // Set initial hidden state for animation
  document.querySelectorAll('.skill-category').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  skillCategoryObserver.observe(skillsCategories);
}

// Stagger achievement cards on entry
const achObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.ach-card');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 150);
      });
      achObserver.unobserve(entry.target);
    }
  });
}, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.05 });

const achGrid = document.querySelector('.achievements-grid');
if (achGrid) {
  document.querySelectorAll('.ach-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  achObserver.observe(achGrid);
}

// -----------------------------------------------------------------------
// 10. SKILL PROGRESS BARS – animate on scroll into view
// -----------------------------------------------------------------------
let barsAnimated = false;

function triggerBars() {
  if (barsAnimated) return;
  const barsSection = document.querySelector('.skills-bars');
  if (!barsSection) return;
  barsAnimated = true;
  document.querySelectorAll('.bar-fill').forEach(bar => {
    const target = bar.getAttribute('data-width');
    bar.style.width = target + '%';
  });
}

// IntersectionObserver for skill bars
const barsSection = document.querySelector('.skills-bars');
if (barsSection) {
  const barsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerBars();
        barsObserver.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.1 });
  barsObserver.observe(barsSection);
}

// -----------------------------------------------------------------------
// 11. HERO STAT COUNTERS (IntersectionObserver + Smooth Easing)
// -----------------------------------------------------------------------
function animateCounters() {
  document.querySelectorAll('.hstat-num').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'), 10);
    const duration = 1500; // ms
    let startTime = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.round(target * easedProgress);
      counter.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  });
}

// Trigger counters when hero stats become visible
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.3 });
  counterObserver.observe(heroStats);
}

// -----------------------------------------------------------------------
// 12. CONTACT FORM (Enhanced with floating labels & validation)
// -----------------------------------------------------------------------
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const contactToast = document.getElementById('contactToast');
const toastTitle = document.getElementById('toastTitle');
const toastMessage = document.getElementById('toastMessage');

function showContactToast(type, title, message) {
  if (!contactToast) return;
  contactToast.classList.remove('success', 'error', 'show');
  contactToast.classList.add(type);
  if (toastTitle) toastTitle.textContent = title;
  if (toastMessage) toastMessage.textContent = message;
  window.setTimeout(() => contactToast.classList.add('show'), 20);
  window.setTimeout(() => contactToast.classList.remove('show'), 5200);
}

// Floating label effect – add 'has-value' class when input has content
document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(input => {
  // Check initial value (e.g. autofill)
  if (input.value.trim()) {
    input.closest('.form-group')?.classList.add('has-value');
  }

  input.addEventListener('input', () => {
    const group = input.closest('.form-group');
    if (!group) return;
    if (input.value.trim()) {
      group.classList.add('has-value');
    } else {
      group.classList.remove('has-value');
    }
  });

  input.addEventListener('focus', () => {
    input.closest('.form-group')?.classList.add('focused');
  });

  input.addEventListener('blur', () => {
    input.closest('.form-group')?.classList.remove('focused');
    // Validation visual feedback on blur
    if (input.hasAttribute('required') && !input.value.trim()) {
      input.closest('.form-group')?.classList.add('error');
    } else if (input.type === 'email' && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        input.closest('.form-group')?.classList.add('error');
      } else {
        input.closest('.form-group')?.classList.remove('error');
      }
    } else {
      input.closest('.form-group')?.classList.remove('error');
    }
  });
});

contactForm && contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Enhanced validation with visual feedback
  const name    = document.getElementById('formName');
  const email   = document.getElementById('formEmail');
  const message = document.getElementById('formMessage');
  let isValid = true;

  [name, email, message].forEach(field => {
    if (!field) return;
    const group = field.closest('.form-group');
    if (field.hasAttribute('required') && !field.value.trim()) {
      group?.classList.add('error');
      isValid = false;
    } else {
      group?.classList.remove('error');
    }
  });

  // Email format check
  if (email && email.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      email.closest('.form-group')?.classList.add('error');
      isValid = false;
    }
  }

  if (!isValid) return;

  submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
  submitBtn.disabled  = true;
  formSuccess && formSuccess.classList.remove('show');

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Message delivery failed');
    }

    submitBtn.innerHTML = '<span>Sent!</span> <i class="fas fa-check"></i>';
    submitBtn.style.background = 'linear-gradient(135deg,#00ff88,#00c8ff)';

    formSuccess && formSuccess.classList.add('show');
    showContactToast('success', 'Message sent to Aman', "Thank you. Your message has been delivered to Aman's email.");
    contactForm.reset();

    document.querySelectorAll('#contactForm .form-group').forEach(g => {
      g.classList.remove('has-value', 'error', 'focused');
    });
  } catch (error) {
    submitBtn.innerHTML = '<span>Try Again</span> <i class="fas fa-rotate-right"></i>';
    showContactToast('error', 'Message not sent', 'Please try again, or email Aman directly at amankumarvishwakarma767@gmail.com.');
  } finally {
    setTimeout(() => {
      submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      submitBtn.style.background = '';
      submitBtn.disabled = false;
      formSuccess && formSuccess.classList.remove('show');
    }, 4200);
  }

  return;

  // Simulate send
  submitBtn.innerHTML = '<span>Sending…</span> <i class="fas fa-spinner fa-spin"></i>';
  submitBtn.disabled  = true;

  setTimeout(() => {
    submitBtn.innerHTML = '<span>Sent!</span> <i class="fas fa-check"></i>';
    submitBtn.style.background = 'linear-gradient(135deg,#00ff88,#00c8ff)';

    formSuccess && formSuccess.classList.add('show');
    contactForm.reset();

    // Remove all has-value classes after reset
    document.querySelectorAll('#contactForm .form-group').forEach(g => {
      g.classList.remove('has-value', 'error', 'focused');
    });

    setTimeout(() => {
      submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      submitBtn.style.background = '';
      submitBtn.disabled = false;
      formSuccess && formSuccess.classList.remove('show');
    }, 4000);
  }, 1800);
});

// -----------------------------------------------------------------------
// 13. FOOTER YEAR
// -----------------------------------------------------------------------
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// -----------------------------------------------------------------------
// 14. RESUME BUTTON (Fixed – let links work naturally)
// -----------------------------------------------------------------------
// The resume buttons already have proper Google Drive links in the HTML.
// No click handler needed – they work as natural anchor links.

// -----------------------------------------------------------------------
// 15. SMOOTH BACK-TO-TOP
// -----------------------------------------------------------------------
document.querySelectorAll('.back-top').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// -----------------------------------------------------------------------
// 16. SMOOTH SCROLL for nav links and all internal anchors
// -----------------------------------------------------------------------
function smoothScrollTo(targetEl) {
  if (!targetEl) return;
  const navbarHeight = navbar ? navbar.offsetHeight : 0;
  const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 10;
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

// Nav links smooth scroll
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      smoothScrollTo(target);
    }
  });
});

// All internal anchor links (footer links, scroll-cue, etc.)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  // Skip if it's a nav-link (already handled) or back-top (already handled)
  if (anchor.classList.contains('nav-link') || anchor.classList.contains('back-top')) return;

  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      smoothScrollTo(target);
    }
  });
});

// -----------------------------------------------------------------------
// 17. PARALLAX ORBS on mouse move (Enhanced with orb-4 + tech badges)
// -----------------------------------------------------------------------
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');
const orb3 = document.querySelector('.orb-3');
const orb4 = document.querySelector('.orb-4');
const techBadges = document.querySelectorAll('.tech-badge[data-speed]');

// Smooth parallax state
let parallaxTargetX = 0, parallaxTargetY = 0;
let parallaxCurrentX = 0, parallaxCurrentY = 0;

document.addEventListener('mousemove', (e) => {
  parallaxTargetX = (e.clientX / window.innerWidth  - 0.5) * 40;
  parallaxTargetY = (e.clientY / window.innerHeight - 0.5) * 40;
});

function animateParallax() {
  // Smooth lerp for parallax
  parallaxCurrentX = lerp(parallaxCurrentX, parallaxTargetX, 0.06);
  parallaxCurrentY = lerp(parallaxCurrentY, parallaxTargetY, 0.06);

  const x = parallaxCurrentX;
  const y = parallaxCurrentY;

  if (orb1) orb1.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
  if (orb3) orb3.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  if (orb4) orb4.style.transform = `translate(${-x * 0.6}px, ${y * 0.35}px)`;

  // Tech badges parallax based on data-speed
  techBadges.forEach(badge => {
    const speed = parseFloat(badge.getAttribute('data-speed')) || 1;
    const bx = x * speed * 0.3;
    const by = y * speed * 0.3;
    badge.style.transform = `translate(${bx}px, ${by}px)`;
  });

  requestAnimationFrame(animateParallax);
}
animateParallax();

// -----------------------------------------------------------------------
// 18. MAGNETIC BUTTONS
// -----------------------------------------------------------------------
const magneticButtons = document.querySelectorAll('.magnetic-btn');

magneticButtons.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const deltaX = e.clientX - btnCenterX;
    const deltaY = e.clientY - btnCenterY;

    // Magnetic pull strength – button content shifts toward cursor
    const pullStrength = 0.3;
    const moveX = deltaX * pullStrength;
    const moveY = deltaY * pullStrength;

    btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    btn.style.transition = 'transform 0.15s ease';
  });

  btn.addEventListener('mouseleave', () => {
    // Spring back to center
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
});

// -----------------------------------------------------------------------
// 19. PERFORMANCE – Debounced resize handler
// -----------------------------------------------------------------------
const handleResize = debounce(() => {
  // Recalculate any layout-dependent values on resize
  handleReveal();
}, 200);

window.addEventListener('resize', handleResize);

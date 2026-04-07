/* =========================================================
   GCH Bâtiment — main.js
   Animations : scroll reveal, nav, burger menu
   ========================================================= */

/* ── NAV : scroll state ── */
(function () {
  const nav  = document.getElementById('nav');
  const hero = document.getElementById('hero');

  function updateNav() {
    const threshold = hero ? hero.offsetHeight * 0.15 : 80;
    nav.classList.toggle('scrolled', window.scrollY > threshold);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // init
})();


/* ── BURGER MENU ── */
(function () {
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const links      = document.querySelectorAll('.mobile-link');

  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', open);
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', false);
    });
  });
})();


/* ── SCROLL REVEAL ── */
(function () {
  const reveals = document.querySelectorAll('.reveal');

  // Hero elements are animated via CSS keyframes — skip them
  const nonHeroReveals = Array.from(reveals).filter(
    el => !el.closest('.hero')
  );

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything
    nonHeroReveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  nonHeroReveals.forEach(el => observer.observe(el));
})();


/* ── SMOOTH ACTIVE NAV LINK ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  function onScroll() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const top    = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav__links a[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── COUNTER ANIMATION (stats) ── */
(function () {
  const stats = document.querySelectorAll('.about__stat-num');

  function animateCount(el) {
    const raw    = el.textContent.trim();
    const num    = parseInt(raw.replace(/\D/g, ''), 10);
    const suffix = raw.replace(/[\d]/g, '');
    const duration = 1400;
    const startTime = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
      el.textContent = Math.floor(eased * num) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(el => observer.observe(el));
})();

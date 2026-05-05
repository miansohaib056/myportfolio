/* =========================================================
   Sohaib · Portfolio · script.js
   Vanilla JS — no dependencies
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Loader ---------- */
  const hideLoader = () => document.getElementById('loader').classList.add('done');
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader, { once: true });

  /* ---------- Year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Custom Cursor ---------- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (dot && ring && window.matchMedia('(min-width: 901px)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    }, { passive: true });
    const animate = () => {
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    animate();

    document.querySelectorAll('a, button, [data-cursor="link"], input, textarea, .skill-card, .project-card, .timeline-card, .contact-info-item')
      .forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
      });
  }

  /* ---------- Navbar + scroll progress + scroll spy (rAF-throttled) ---------- */
  const navbar = document.getElementById('navbar');
  const sp = document.getElementById('scrollProgress');
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  let scrollTicking = false;

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 30);

    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    sp.style.width = pct + '%';

    // Scroll spy
    const cy = y + 120;
    let current = '';
    sections.forEach(s => {
      if (cy >= s.offsetTop && cy < s.offsetTop + s.offsetHeight) current = s.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
    scrollTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(onScroll);
      scrollTicking = true;
    }
  }, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- Typing effect ---------- */
  const typingEl = document.getElementById('typing');
  if (typingEl) {
    const words = ['load fast.', 'rank well.', 'convert.', 'just work.'];
    let wi = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = words[wi];
      typingEl.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) {
        ci++;
        setTimeout(tick, 80 + Math.random() * 60);
      } else if (deleting && ci > 0) {
        ci--;
        setTimeout(tick, 40);
      } else {
        if (!deleting) {
          deleting = true;
          setTimeout(tick, 1600);
        } else {
          deleting = false;
          wi = (wi + 1) % words.length;
          setTimeout(tick, 220);
        }
      }
    };
    tick();
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  const reveals = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => io.observe(el));

  /* ---------- Stat counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 2000;
        const startTime = performance.now();
        const easeOutExpo = (t) => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
        el.textContent = '0';
        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          el.textContent = Math.round(easeOutExpo(progress) * target);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterIO.observe(c));

  /* ---------- Magnetic buttons ---------- */
  if (window.matchMedia('(min-width: 901px)').matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
      const strength = 18;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x / r.width * strength}px, ${y / r.height * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- Testimonial slider ---------- */
  const track = document.getElementById('testimonialTrack');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('sliderDots');
  if (track) {
    const cards = track.children;
    const total = cards.length;
    let index = 0;

    // Build dots
    for (let i = 0; i < total; i++) {
      const b = document.createElement('button');
      b.className = 'dot' + (i === 0 ? ' active' : '');
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    }
    const dots = dotsWrap.querySelectorAll('.dot');

    const goTo = (i) => {
      index = (i + total) % total;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, n) => d.classList.toggle('active', n === index));
    };
    prev.addEventListener('click', () => goTo(index - 1));
    next.addEventListener('click', () => goTo(index + 1));

    // Auto-rotate (pauses on hover)
    let auto = setInterval(() => goTo(index + 1), 6000);
    track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
    track.parentElement.addEventListener('mouseleave', () => {
      auto = setInterval(() => goTo(index + 1), 6000);
    });

    // Touch swipe
    let startX = 0, dx = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchmove', (e) => { dx = e.touches[0].clientX - startX; }, { passive: true });
    track.addEventListener('touchend', () => {
      if (Math.abs(dx) > 50) goTo(dx > 0 ? index - 1 : index + 1);
      dx = 0;
    });
  }

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;

      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');

      [name, email, message].forEach(field => {
        field.parentElement.classList.remove('error');
        const errEl = form.querySelector(`[data-error-for="${field.id}"]`);
        if (errEl) errEl.textContent = '';
      });

      if (!name.value.trim() || name.value.trim().length < 2) {
        markError(name, 'Please enter your name.');
        ok = false;
      }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email.value.trim())) {
        markError(email, 'Please enter a valid email.');
        ok = false;
      }
      if (!message.value.trim() || message.value.trim().length < 10) {
        markError(message, 'Message should be at least 10 characters.');
        ok = false;
      }

      if (ok) {
        // Frontend-only — replace with real backend later
        success.classList.add('show');
        form.reset();
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    });

    form.querySelectorAll('input, textarea').forEach(f => {
      f.addEventListener('input', () => {
        f.parentElement.classList.remove('error');
        const errEl = form.querySelector(`[data-error-for="${f.id}"]`);
        if (errEl) errEl.textContent = '';
      });
    });
  }

  function markError(field, msg) {
    field.parentElement.classList.add('error');
    const errEl = document.querySelector(`[data-error-for="${field.id}"]`);
    if (errEl) errEl.textContent = msg;
  }

  /* ---------- Back to top ---------- */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Hero 3D mouse parallax ---------- */
  const reducedMotion3D = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hero = document.getElementById('home');
  const heroInner = hero?.querySelector('.hero-inner');
  const shapes = hero?.querySelectorAll('.cube, .orb, .ring');
  if (hero && shapes && heroInner && !reducedMotion3D && isFinePointer) {
    let raf3d = null;
    hero.addEventListener('mousemove', (e) => {
      if (raf3d) return;
      raf3d = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2;  // -1..1
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2;

        // Subtle 3D tilt on the hero text block
        heroInner.style.setProperty('--hero-ry', (x * 4) + 'deg');
        heroInner.style.setProperty('--hero-rx', (-y * 3) + 'deg');

        // Layered parallax — each shape moves a different distance
        shapes.forEach((s, i) => {
          const depth = (i + 1) * 6;
          s.style.setProperty('--mx', (x * depth) + 'px');
          s.style.setProperty('--my', (y * depth) + 'px');
        });
        raf3d = null;
      });
    }, { passive: true });
    hero.addEventListener('mouseleave', () => {
      heroInner.style.setProperty('--hero-ry', '0deg');
      heroInner.style.setProperty('--hero-rx', '0deg');
      shapes.forEach(s => {
        s.style.setProperty('--mx', '0px');
        s.style.setProperty('--my', '0px');
      });
    });
  }

})();

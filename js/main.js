/* ============================================================
   Felix Portfolio – main.js
   Features:
     1. Navbar scroll shadow + active section highlight
     2. Mobile menu toggle
     3. Typing effect (Hero subtitle)
     4. Smooth scroll for nav links
     5. Contact form validation + submit feedback
     6. Intersection Observer – fade-in on scroll
   ============================================================ */

'use strict';

/* ── 1. Navbar: scroll class + active nav link ──────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  /* Add shadow when page is scrolled */
  function onScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveLink();
  }

  /* Mark the nav link whose section is currently in view */
  function highlightActiveLink() {
    let current = '';

    sections.forEach(section => {
      const top = section.offsetTop - 80; // offset for fixed navbar
      if (window.scrollY >= top) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ── 2. Mobile menu toggle ──────────────────────────────────── */
(function initMobileMenu() {
  const toggle   = document.getElementById('navToggle');
  const mobileNav = document.getElementById('navMobile');

  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close menu when a link is clicked */
  mobileNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Close menu when clicking outside */
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ── 3. Typing effect ───────────────────────────────────────── */
(function initTyping() {
  const target = document.getElementById('typingTarget');
  if (!target) return;

  const phrases = [
    'Fullstack Developer Intern',
    'React & Next.js Enthusiast',
    'Node.js Backend Builder',
    'Always Learning 🚀',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  const typeSpeed  = 80;   // ms per character when typing
  const deleteSpeed = 45;  // ms per character when deleting
  const pauseAfter = 1800; // ms to pause at full phrase

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      target.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, deleteSpeed);

    } else {
      charIndex++;
      target.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(tick, pauseAfter);
        return;
      }
      setTimeout(tick, typeSpeed);
    }
  }

  tick();
})();


/* ── 4. Smooth scroll (fallback for older browsers) ─────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight ?? 60;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 5. Contact form: validation + submit ───────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const statusEl   = document.getElementById('formStatus');

  if (!form) return;

  /* Simple field validator */
  function validateField(input) {
    const value = input.value.trim();

    if (!value) {
      input.classList.add('error');
      return false;
    }

    /* Basic email format check */
    if (input.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        input.classList.add('error');
        return false;
      }
    }

    input.classList.remove('error');
    return true;
  }

  /* Remove error state on input */
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const nameInput    = form.querySelector('#name');
    const emailInput   = form.querySelector('#email');
    const messageInput = form.querySelector('#message');

    const isValid =
      validateField(nameInput) &
      validateField(emailInput) &
      validateField(messageInput);

    if (!isValid) {
      setStatus('Please fill in all fields correctly.', 'error');
      return;
    }

    /* Disable button while "sending" */
    submitBtn.disabled = true;
    submitText.textContent = 'Sending…';
    setStatus('', '');

    try {
      /*
       * No real backend – simulate a 1.5 s network delay.
       * To wire up a real service (Formspree, EmailJS, etc.),
       * replace the setTimeout block with your fetch() call.
       */
      await fakeSubmit({
        name:    nameInput.value.trim(),
        email:   emailInput.value.trim(),
        message: messageInput.value.trim(),
      });

      setStatus('✅ Message sent! I\'ll get back to you soon.', 'success');
      form.reset();

    } catch {
      setStatus('❌ Something went wrong. Please try again.', 'error');

    } finally {
      submitBtn.disabled = false;
      submitText.textContent = 'Send Message';
    }
  });

  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className   = 'form-status ' + type;
  }

  /* Simulated async submit – replace with real integration */
  function fakeSubmit(data) {
    console.log('[Contact Form] Submitted:', data);
    return new Promise(resolve => setTimeout(resolve, 1500));
  }
})();


/* ── 6. Scroll-reveal animation ─────────────────────────────── */
(function initScrollReveal() {
  /* Add the base hidden style via JS so it degrades gracefully
     when JS is disabled */
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.55s ease, transform 0.55s ease;
    }
    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  /* Elements to animate */
  const targets = [
    ...document.querySelectorAll('.repo-card'),
    ...document.querySelectorAll('.code-block'),
    ...document.querySelectorAll('.skills-badges'),
    ...document.querySelectorAll('.file-tree'),
    ...document.querySelectorAll('.contact-form'),
    ...document.querySelectorAll('.contact-info'),
  ];

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`; // staggered delay
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once only
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(el => observer.observe(el));
})();


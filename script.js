// ====================================================================
// AI EXPLORER PROGRAM — Aruna's Academy
// Interaction script
// ====================================================================

(function () {
  const body = document.body;

  // ----------------------------------------------------------------
  // THEME TOGGLE
  // ----------------------------------------------------------------
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('aea-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    body.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('aea-theme', next);
  });

  // ----------------------------------------------------------------
  // LANGUAGE SWITCH
  // ----------------------------------------------------------------
  const langBtns = document.querySelectorAll('.lang-btn');
  const i18nEls = document.querySelectorAll('[data-i18n]');

  function applyLanguage(lang) {
    const dict = translations[lang] || translations.en;

    i18nEls.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    body.setAttribute('data-lang', lang);
    localStorage.setItem('aea-lang', lang);
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')));
  });

  const savedLang = localStorage.getItem('aea-lang');
  if (savedLang && translations[savedLang]) {
    applyLanguage(savedLang);
  }

  // ----------------------------------------------------------------
  // REVEAL ON SCROLL (program cards, projects, section heads)
  // ----------------------------------------------------------------
  const revealTargets = document.querySelectorAll(
    '.section-head, .program-card, .project-tile, .enroll-card'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  // stagger program cards
  document.querySelectorAll('.program-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });
  document.querySelectorAll('.project-tile').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });

  // ----------------------------------------------------------------
  // BUILD PATH — active step + progress line
  // ----------------------------------------------------------------
  const pathSteps = document.querySelectorAll('.path-step');
  const pathNodes = document.querySelectorAll('.path-node');
  const pathLineFg = document.querySelector('.path-line-fg');
  const pathWrap = document.querySelector('.path-wrap');

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const step = entry.target;
      const node = step.querySelector('.path-node');
      if (entry.isIntersecting) {
        step.classList.add('is-active');
        node.classList.add('is-active');
      } else {
        // keep node highlighted slightly less eagerly to avoid flicker
        if (entry.boundingClientRect.top > window.innerHeight * 0.6) {
          step.classList.remove('is-active');
          node.classList.remove('is-active');
        }
      }
    });
  }, { threshold: 0.35, rootMargin: '-15% 0px -15% 0px' });

  pathSteps.forEach(step => stepObserver.observe(step));

  // progress line fill based on scroll through path-wrap
  function updatePathLine() {
    if (!pathWrap || !pathLineFg) return;
    const rect = pathWrap.getBoundingClientRect();
    const total = rect.height;
    const viewportCenter = window.innerHeight * 0.5;

    let progress = (viewportCenter - rect.top) / total;
    progress = Math.max(0, Math.min(1, progress));

    const dashLength = 1200;
    const offset = dashLength - (dashLength * progress);
    pathLineFg.style.strokeDashoffset = offset;
  }

  // set the SVG path length dynamically to match actual rendered height
  function setPathGeometry() {
    if (!pathWrap) return;
    const height = pathWrap.offsetHeight;
    const svg = document.querySelector('.path-line');
    if (!svg) return;
    svg.setAttribute('viewBox', `0 0 100 ${height}`);
    const d = `M50,0 L50,${height}`;
    document.querySelector('.path-line-bg').setAttribute('d', d);
    pathLineFg.setAttribute('d', d);

    const dashLength = height;
    pathLineFg.style.strokeDasharray = dashLength;
    pathLineFg.style.strokeDashoffset = dashLength;
  }

  function updatePathLineDynamic() {
    if (!pathWrap || !pathLineFg) return;
    const rect = pathWrap.getBoundingClientRect();
    const total = rect.height;
    const viewportCenter = window.innerHeight * 0.5;

    let progress = (viewportCenter - rect.top) / total;
    progress = Math.max(0, Math.min(1, progress));

    const dashLength = total;
    const offset = dashLength - (dashLength * progress);
    pathLineFg.style.strokeDashoffset = offset;
  }

  window.addEventListener('resize', setPathGeometry);
  setPathGeometry();

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updatePathLineDynamic);
  });
  updatePathLineDynamic();

  // ----------------------------------------------------------------
  // SMOOTH NAV HIGHLIGHT (optional subtle UX touch)
  // ----------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();

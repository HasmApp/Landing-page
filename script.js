(function () {
  'use strict';

  var htmlRoot = document.getElementById('html-root');
  var langButtons = document.querySelectorAll('.lang-btn');
  var langContents = document.querySelectorAll('.lang-content');

  // Theme: init from localStorage, default light
  var themeToggle = document.getElementById('theme-toggle');
  var THEME_KEY = 'hasm-theme';
  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }
  function setTheme(theme) {
    if (theme === 'dark') {
      htmlRoot.setAttribute('data-theme', 'dark');
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
      }
    } else {
      htmlRoot.setAttribute('data-theme', 'light');
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
    try {
      localStorage.setItem(THEME_KEY, theme || 'light');
    } catch (e) {}
  }
  function initTheme() {
    var stored = getStoredTheme();
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored);
      return;
    }
    setTheme('light');
  }
  initTheme();
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isDark = htmlRoot.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  // Mobile nav
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  var navBackdrop = document.getElementById('nav-backdrop');
  function openNav() {
    document.body.classList.add('nav-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    if (navBackdrop) navBackdrop.removeAttribute('hidden');
  }
  function closeNav() {
    document.body.classList.remove('nav-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    if (navBackdrop) navBackdrop.setAttribute('hidden', '');
  }
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      if (document.body.classList.contains('nav-open')) {
        closeNav();
      } else {
        openNav();
      }
    });
    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeNav);
    }
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  function setLanguage(lang) {
    htmlRoot.setAttribute('lang', lang === 'ar' ? 'ar' : 'en');
    htmlRoot.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    langButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    langContents.forEach(function (el) {
      el.classList.toggle('visible', el.getAttribute('data-lang') === lang);
    });
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLanguage(btn.getAttribute('data-lang'));
    });
  });

  setLanguage('ar');

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scrollAnimate = document.querySelectorAll('.scroll-animate');
  if (scrollAnimate.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    );
    scrollAnimate.forEach(function (el) { observer.observe(el); });
  }

  var priceEl = document.getElementById('live-price');
  var nextDropEl = document.getElementById('next-drop-timer');
  var progressEl = document.getElementById('next-drop-progress');
  if (priceEl) {
    var value = 239;
    var max = 239;
    var min = 149;
    var step = 10;
    var nextDropSeconds = 3;

    function updatePrice() {
      value = value <= min ? max : value - step;
      priceEl.textContent = value;
      nextDropSeconds = 3;
      if (progressEl) progressEl.style.width = '100%';
    }

    function secSuffix() {
      return (htmlRoot.getAttribute('lang') === 'ar' ? 'ث' : 's');
    }
    function tick() {
      if (nextDropEl) nextDropEl.textContent = Math.max(0, nextDropSeconds) + secSuffix();
      if (progressEl) progressEl.style.width = (nextDropSeconds / 3 * 100) + '%';
      nextDropSeconds--;
      if (nextDropSeconds < 0) updatePrice();
    }

    if (nextDropEl) nextDropEl.textContent = '3' + secSuffix();
    if (progressEl) progressEl.style.width = '100%';
    setInterval(tick, 1000);
  }

  var timerEl = document.getElementById('auction-timer');
  var auctionProgressEl = document.getElementById('auction-progress');
  if (timerEl) {
    var seconds = 180;
    var cycleSeconds = 180;
    function fmt(t) {
      var m = Math.floor(t / 60);
      var s = t % 60;
      return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
    timerEl.textContent = fmt(seconds);
    if (auctionProgressEl) auctionProgressEl.style.width = '100%';
    setInterval(function () {
      seconds = seconds <= 0 ? cycleSeconds : seconds - 1;
      timerEl.textContent = fmt(seconds);
      if (auctionProgressEl) {
        auctionProgressEl.style.width = (seconds / cycleSeconds * 100) + '%';
      }
    }, 1000);
  }

  var slider = document.querySelector('.mockup-screen-slider');
  if (slider && !prefersReducedMotion) {
    function onScroll() {
      var y = window.scrollY;
      var viewportHalf = window.innerHeight * 0.4;
      if (y > viewportHalf) {
        slider.classList.add('show-second');
      } else {
        slider.classList.remove('show-second');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var heroInner = document.querySelector('.hero-inner');
  if (heroInner && !prefersReducedMotion) {
    var heroKids = heroInner.querySelectorAll('.hero-title, .hero-sub, .hero-cta, .hero-mockup, .hero-stores');
    heroKids.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      el.style.transitionDelay = (i * 0.06) + 's';
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        heroKids.forEach(function (el) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });
  }

  var ctaForm = document.getElementById('cta-phone-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      var input = ctaForm.querySelector('input[name="phone"]');
      var phone = input && input.value ? input.value.trim() : '';
      if (!phone) {
        e.preventDefault();
        input.focus();
        return;
      }
      // Form submits to FormSubmit.co (action="https://formsubmit.co/info@hasm.io")
    });
  }
})();

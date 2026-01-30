/**
 * Animation logic: scroll-based entrance, parallax.
 * Isolated and reusable; no UI framework dependency.
 */

const DEFAULT_OPTIONS = {
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.1,
};

/**
 * Observe elements with [data-animate] and add .is-visible when in view.
 * @param {Object} options - IntersectionObserver options
 */
export function initScrollAnimations(options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const els = document.querySelectorAll('[data-animate]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, opts);

  els.forEach((el) => observer.observe(el));
}

/**
 * Parallax: move elements based on scroll (subtle).
 * @param {string} selector - Selector for [data-parallax] elements
 * @param {number} factor - Movement factor (e.g. 0.05 = slow)
 */
export function initParallax(selector = '[data-parallax]', factor = 0.05) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  let ticking = false;
  let lastScrollY = window.scrollY;

  function update() {
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const offset = (centerY - viewportCenter) * factor;
      el.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  }

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

/**
 * Run after DOM ready.
 */
export function runAnimations() {
  initScrollAnimations();
  initParallax('[data-parallax]', 0.04);
}

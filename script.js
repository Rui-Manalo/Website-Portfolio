// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav__links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('is-open'));
});

// ===== Animated hero stat counters =====
const statNums = document.querySelectorAll('.stat__num');

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimal || '0', 10);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = decimals ? value.toFixed(decimals) : Math.round(value);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ===== Reveal on scroll (stat counters + skill meters) =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // stat counters: start numeric animation and add visible state
    if (entry.target.classList.contains('stat__num')) {
      animateCount(entry.target);
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
      return;
    }

    // meter fills: animate width
    if (entry.target.classList.contains('meter__fill')) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
      return;
    }

    // generic revealable elements: add class to trigger CSS animation
    if (entry.target.classList.contains('reveal')) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
      return;
    }
  });
}, { threshold: 0.4 });

statNums.forEach(el => observer.observe(el));
document.querySelectorAll('.meter__fill').forEach(el => observer.observe(el));

// Programmatically mark a set of common content blocks as revealable
const revealSelectors = [
  '.hero__copy', '.hero__panel', '.about__inner', '.projects > article', '.work__inner', '.skills__inner', '.experience__inner', '.contact__inner'
];
revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    observer.observe(el);
  });
});

// Also ensure stat numbers and panel children get a visible class when observed
// (observer callback will add `.is-visible` when intersecting). When a stat
// becomes visible, add a small class to animate the number popping.


// ===== Sticky nav background intensifies on scroll =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
});

// Animasi scroll, Intersection Observer, dan Progress Bar
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js');

  // Elemen yang muncul saat di-scroll; jeda berurutan antar saudara
  var sel = 'section h2, .prose, .lead, .rows li, .steps li, .vals div, .team div, blockquote, details, .proj tbody tr, .contact .mail, .contact p';
  var els = document.querySelectorAll(sel);
  els.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.matches(sel); });
    var i = sibs.indexOf(el);
    el.style.setProperty('--d', Math.min(i * 0.09, 0.45) + 's');
    el.setAttribute('data-r', '');
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  els.forEach(function (el) { io.observe(el); });

  // Garis progres, geser ringan pada sketsa, dan tautan menu aktif
  var bar = document.querySelector('.progress');
  var svg = document.querySelector('.elev');
  var ticking = false;

  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    if (svg && y < window.innerHeight) svg.style.transform = 'translateY(' + (y * 0.1) + 'px)';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  var links = {};
  document.querySelectorAll('nav a').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });

  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
        if (links[e.target.id]) links[e.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  document.querySelectorAll('section[id]').forEach(function (s) { spy.observe(s); });
})();

// Navigasi responsif (Mobile Menu)
(function () {
  var root = document.documentElement;
  var header = document.querySelector('header');
  var btn = document.querySelector('.menu');
  if (!header || !btn) return;

  root.classList.add('nav-js');

  function set(open) {
    header.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? 'Tutup' : 'Menu';
  }

  btn.addEventListener('click', function () {
    set(!header.classList.contains('open'));
  });

  header.querySelectorAll('nav a').forEach(function (a) {
    a.addEventListener('click', function () { set(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') set(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 720) set(false);
  });
})();

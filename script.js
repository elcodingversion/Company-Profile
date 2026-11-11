/**
 * Studio Teduh – Arsitektur & Interior
 * Global Interactivity, Animations, Theme Switcher & Form Handling
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Theme Management (Light / Dark Mode with LocalStorage)
  // ==========================================================================
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');

  // Load saved theme or system preference
  var savedTheme = localStorage.getItem('studio_theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else {
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.setAttribute('data-theme', 'dark');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var currentTheme = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('studio_theme', newTheme);

      if (window.showToast) {
        window.showToast('Mode ' + (newTheme === 'dark' ? 'Gelap' : 'Terang') + ' aktif');
      }
    });
  }

  // ==========================================================================
  // 2. Mobile Navigation Toggle
  // ==========================================================================
  var header = document.querySelector('header');
  var menuBtn = document.querySelector('.menu');

  if (header && menuBtn) {
    var setMenu = function (open) {
      header.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.textContent = open ? 'Tutup' : 'Menu';
    };

    menuBtn.addEventListener('click', function () {
      setMenu(!header.classList.contains('open'));
    });

    header.querySelectorAll('nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenu(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('open')) {
        setMenu(false);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && header.classList.contains('open')) {
        setMenu(false);
      }
    });
  }

  // ==========================================================================
  // 3. Active Navigation Link Highlighting
  // ==========================================================================
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('nav a.nav-link');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ==========================================================================
  // 4. Scroll Progress Bar & Parallax Sketch
  // ==========================================================================
  var progressBar = document.querySelector('.progress');
  var svgElev = document.querySelector('.elev');
  var ticking = false;

  function handleScroll() {
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var scrollY = window.scrollY;

    if (progressBar) {
      var progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
      progressBar.style.transform = 'scaleX(' + progress + ')';
    }

    if (svgElev && scrollY < window.innerHeight) {
      svgElev.style.transform = 'translateY(' + (scrollY * 0.08) + 'px)';
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(handleScroll);
    }
  }, { passive: true });

  handleScroll();

  // ==========================================================================
  // 5. Scroll Reveal Animations (Intersection Observer)
  // ==========================================================================
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('js');

    var animSelector = 'section h2, .page-header h1, .page-header p, .lead, .hero-visual-card, .card, .service-card, .project-card, .team-card, .val-card, .steps li, .stat-item, blockquote, details, .contact-info-card, .contact-form-card, .cta-banner';
    var animatedElements = document.querySelectorAll(animSelector);

    animatedElements.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentNode.children, function (child) {
        return child.matches(animSelector);
      });
      var index = siblings.indexOf(el);
      el.style.setProperty('--d', Math.min(index * 0.08, 0.45) + 's');
      el.setAttribute('data-r', '');
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    animatedElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ==========================================================================
  // 6. Global Toast Notification Helper
  // ==========================================================================
  window.showToast = function (message, type) {
    var container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'toast';
    var icon = type === 'error' ? '⚠️' : '✓';
    toast.innerHTML = '<span class="toast-icon">' + icon + '</span><span>' + message + '</span>';

    container.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('show');
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }, 3800);
  };

  // ==========================================================================
  // 7. Project Portfolio Filter (projek.html)
  // ==========================================================================
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            requestAnimationFrame(function () {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(function () {
              if (card.style.opacity === '0') {
                card.style.display = 'none';
              }
            }, 250);
          }
        });
      });
    });
  }

  // ==========================================================================
  // 8. Password Visibility Toggle
  // ==========================================================================
  var pwdToggleBtns = document.querySelectorAll('.btn-toggle-pwd');
  pwdToggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.previousElementSibling;
      if (input && (input.type === 'password' || input.type === 'text')) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.textContent = '🔒';
          btn.setAttribute('aria-label', 'Sembunyikan password');
        } else {
          input.type = 'password';
          btn.textContent = '👁️';
          btn.setAttribute('aria-label', 'Tampilkan password');
        }
      }
    });
  });

  // Password strength meter in registration
  var pwdInput = document.getElementById('regPassword');
  var pwdBar = document.getElementById('pwdStrengthBar');
  if (pwdInput && pwdBar) {
    pwdInput.addEventListener('input', function () {
      var val = pwdInput.value;
      var score = 0;
      if (val.length >= 6) score += 25;
      if (val.length >= 10) score += 25;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 25;
      if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score += 25;

      pwdBar.style.width = score + '%';
      if (score < 50) {
        pwdBar.style.backgroundColor = '#E57373';
      } else if (score < 75) {
        pwdBar.style.backgroundColor = 'var(--accent)';
      } else {
        pwdBar.style.backgroundColor = '#4CAF50';
      }
    });
  }

  // ==========================================================================
  // 9. Contact Form Submission (kontak.html)
  // ==========================================================================
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput = contactForm.querySelector('[name="nama"]');
      var emailInput = contactForm.querySelector('[name="email"]');
      var name = nameInput ? nameInput.value.trim() : '';

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Kirim Permohonan Konsultasi →';
        }
        contactForm.reset();
        window.showToast('Terima kasih, ' + (name || 'Bapak/Ibu') + '! Permohonan Anda telah terkirim. Tim kami akan menghubungi Anda.');
      }, 750);
    });
  }

  // ==========================================================================
  // 10. Login & Register Form Submissions
  // ==========================================================================
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('loginEmail').value;
      var submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Memeriksa...';
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Masuk ke Akun';
        }
        window.showToast('Berhasil masuk sebagai ' + email + '! Mengalihkan ke Beranda...');
        setTimeout(function () {
          window.location.href = 'index.html';
        }, 1200);
      }, 650);
    });
  }

  var registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('regName').value;
      var pwd = document.getElementById('regPassword').value;
      var confirmPwd = document.getElementById('regConfirmPassword').value;

      if (pwd !== confirmPwd) {
        window.showToast('Password dan konfirmasi password tidak cocok!', 'error');
        return;
      }

      var submitBtn = registerForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mendaftarkan...';
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Daftar Akun Sekarang';
        }
        window.showToast('Pendaftaran berhasil, selamat datang ' + name + '! Mengalihkan ke Login...');
        setTimeout(function () {
          window.location.href = 'login.html';
        }, 1200);
      }, 650);
    });
  }

})();

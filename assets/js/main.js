/**
 * VULCAN & CO. — BLACKSMITH & BLADESMITH ATELIER
 * Core Shared JavaScript
 */

(function () {
  'use strict';

  // --- 1. Theme Management (Dark / Light) ---
  const THEME_KEY = 'vulcan_theme';
  const html = document.documentElement;

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      html.classList.add('dark');
    } else {
      html.setAttribute('data-theme', 'light');
      html.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
    updateThemeToggleButtons(theme);
  }

  function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  function updateThemeToggleButtons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      
      const sunIcon = btn.querySelector('.sun-icon');
      const moonIcon = btn.querySelector('.moon-icon');
      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.classList.remove('hidden');
          moonIcon.classList.add('hidden');
        } else {
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
        }
      }
    });
  }

  // --- 2. Direction Management (LTR / RTL) ---
  const DIR_KEY = 'vulcan_dir';

  function initDir() {
    const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
    applyDir(savedDir);
  }

  function applyDir(dir) {
    html.setAttribute('dir', dir);
    document.body.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);
    updateDirToggleButtons(dir);
  }

  function toggleDir() {
    const currentDir = html.getAttribute('dir') || 'ltr';
    const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    applyDir(nextDir);
  }

  function updateDirToggleButtons(dir) {
    const dirBtns = document.querySelectorAll('.dir-toggle-btn');
    dirBtns.forEach(btn => {
      const isRtl = dir === 'rtl';
      btn.setAttribute('aria-label', isRtl ? 'Switch to LTR' : 'Switch to RTL');
      const dirText = btn.querySelector('.dir-text');
      if (dirText) {
        dirText.textContent = isRtl ? 'LTR' : 'RTL';
      }
    });
  }

  // --- 3. Preloader ---
  function initLoader() {
    const loader = document.getElementById('forge-loader');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('loader-hidden');
      }, 300);
    });

    // Fallback if load already fired or takes too long
    setTimeout(() => {
      if (loader && !loader.classList.contains('loader-hidden')) {
        loader.classList.add('loader-hidden');
      }
    }, 1200);
  }

  // --- 4. Navigation & Dropdowns (Click-Only) ---
  function initNavigation() {
    // Header scroll background effect with smooth passive listener
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 15) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // Desktop Click-Only Dropdowns
    const dropdownWrappers = document.querySelectorAll('.dropdown-wrapper');
    dropdownWrappers.forEach(wrapper => {
      const trigger = wrapper.querySelector('.dropdown-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = wrapper.classList.contains('open');
        
        // Close all other dropdowns
        dropdownWrappers.forEach(other => {
          if (other !== wrapper) {
            other.classList.remove('open');
            const otherTrigger = other.querySelector('.dropdown-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          wrapper.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      // Close dropdown when any item inside is clicked
      const items = wrapper.querySelectorAll('.dropdown-item');
      items.forEach(item => {
        item.addEventListener('click', () => {
          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        });
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      dropdownWrappers.forEach(wrapper => {
        if (!wrapper.contains(e.target)) {
          wrapper.classList.remove('open');
          const trigger = wrapper.querySelector('.dropdown-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownWrappers.forEach(wrapper => {
          wrapper.classList.remove('open');
          const trigger = wrapper.querySelector('.dropdown-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
        closeMobileMenu();
      }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileMenu.classList.contains('menu-open');
        if (isOpen) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    }

    // Mobile Accordion (Click-Only)
    const mobileAccordions = document.querySelectorAll('.mobile-accordion-wrapper');
    mobileAccordions.forEach(acc => {
      const trigger = acc.querySelector('.mobile-accordion-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = acc.classList.contains('open');
        acc.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      });
    });

    // Auto-close mobile menu on any link navigation click
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Active Link Detection
    highlightActiveLink();
  }

  function openMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (!mobileMenu || !mobileMenuBtn) return;

    // Ensure accordions are initially closed
    const mobileAccordions = document.querySelectorAll('.mobile-accordion-wrapper');
    mobileAccordions.forEach(acc => {
      acc.classList.remove('open');
      const trigger = acc.querySelector('.mobile-accordion-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });

    mobileMenu.classList.add('menu-open');
    document.body.classList.add('mobile-menu-active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');
    if (menuIcon && closeIcon) {
      menuIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
    }
  }

  function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (!mobileMenu || !mobileMenuBtn) return;

    mobileMenu.classList.remove('menu-open');
    document.body.classList.remove('mobile-menu-active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');
    if (menuIcon && closeIcon) {
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    }

    // Reset mobile accordions to closed state
    const mobileAccordions = document.querySelectorAll('.mobile-accordion-wrapper');
    mobileAccordions.forEach(acc => {
      acc.classList.remove('open');
      const trigger = acc.querySelector('.mobile-accordion-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function highlightActiveLink() {
    const path = window.location.pathname;
    let page = path.split('/').pop();
    if (!page || page === '') page = 'index.html';

    const isHome = page === 'index.html' || page === 'home-2.html' || page === './';

    // 1. Desktop Nav Links
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        if (href === page || (page === 'index.html' && (href === './' || href === 'index.html'))) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      }
    });

    // 2. Desktop Home Dropdown Trigger
    const homeDropdownBtns = document.querySelectorAll('.dropdown-trigger');
    homeDropdownBtns.forEach(btn => {
      if (isHome) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 3. Mobile Nav Links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      if (link.classList.contains('mobile-accordion-trigger')) {
        if (isHome) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
        return;
      }

      const href = link.getAttribute('href');
      if (href) {
        if (href === page || (page === 'index.html' && (href === './' || href === 'index.html'))) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      }
    });

    // 4. Mobile Accordion Wrapper Open State
    const mobileAccordionWrappers = document.querySelectorAll('.mobile-accordion-wrapper');
    mobileAccordionWrappers.forEach(wrapper => {
      if (isHome) {
        wrapper.classList.add('open');
        const trigger = wrapper.querySelector('.mobile-accordion-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      } else {
        wrapper.classList.remove('open');
        const trigger = wrapper.querySelector('.mobile-accordion-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 5. Scroll to Top ---
  function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
          } else {
            scrollBtn.classList.remove('show');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Global Initialization ---
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDir();
    initLoader();
    initNavigation();
    highlightActiveLink();
    initScrollToTop();

    // Bind theme toggles
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    // Bind dir toggles
    document.querySelectorAll('.dir-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleDir);
    });
  });

  // Export to window
  window.VulcanForge = {
    toggleTheme,
    toggleDir,
    closeMobileMenu
  };
})();

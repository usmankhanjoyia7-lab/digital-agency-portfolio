/* ============================================
   DIGITAL AGENCY WEBSITE - MAIN JAVASCRIPT
   ============================================ */

// ============================================
// 1. STICKY NAVBAR & HAMBURGER MENU
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navbarMenu = document.querySelector('.navbar-menu');
  const navLinks = document.querySelectorAll('.navbar-menu a');

  // Sticky navbar on scroll
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger menu toggle
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navbarMenu.classList.toggle('active');
    });
  }

  // Close menu when link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navbarMenu.classList.remove('active');
    });
  });

  // Active link highlighting
  function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setActiveLink();
});

// ============================================
// 2. PORTFOLIO FILTERING
// ============================================

function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');

      // Get filter value
      const filterValue = this.getAttribute('data-filter');

      // Filter portfolio items
      portfolioItems.forEach(item => {
        if (filterValue === 'all') {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.animation = 'fadeIn 0.5s ease-in-out';
          }, 10);
        } else {
          const itemCategory = item.getAttribute('data-category');
          if (itemCategory === filterValue) {
            item.classList.remove('hidden');
            setTimeout(() => {
              item.style.animation = 'fadeIn 0.5s ease-in-out';
            }, 10);
          } else {
            item.classList.add('hidden');
          }
        }
      });
    });
  });

  // Set first button as active by default
  if (filterBtns.length > 0) {
    filterBtns[0].classList.add('active');
  }
}

// ============================================
// 3. TESTIMONIAL SLIDER
// ============================================

function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-btn:first-child');
  const nextBtn = document.querySelector('.slider-btn:last-child');
  const dots = document.querySelectorAll('.dot');

  if (slides.length === 0) return;

  let currentSlide = 0;

  function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[n].classList.add('active');
    if (dots[n]) dots[n].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });

  // Show first slide
  showSlide(0);

  // Auto-advance slides every 5 seconds
  setInterval(nextSlide, 5000);
}

// ============================================
// 4. SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.scroll-animate');
  animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// 5. COUNTERS
// ============================================

function initCounters() {
  const counters = document.querySelectorAll('.counter-number');

  if (counters.length === 0) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        const target = parseInt(entry.target.textContent);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps

        let current = 0;
        const counter = entry.target;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + '+';
            counter.dataset.counted = 'true';
          }
        };

        updateCounter();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

// ============================================
// 6. FORM VALIDATION
// ============================================

function initFormValidation() {
  const forms = document.querySelectorAll('form');

  if (forms.length === 0) return;

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      let isValid = true;
      const formGroups = this.querySelectorAll('.form-group');

      formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        if (input) {
          if (!validateField(input)) {
            isValid = false;
            group.classList.add('error');
          } else {
            group.classList.remove('error');
          }
        }
      });

      if (isValid) {
        // Show success message
        showSuccessMessage(this);
        // Reset form
        this.reset();
      }
    });

    // Real-time validation
    const inputs = this.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        const group = this.closest('.form-group');
        if (validateField(this)) {
          group.classList.remove('error');
        } else {
          group.classList.add('error');
        }
      });

      input.addEventListener('input', function() {
        const group = this.closest('.form-group');
        if (validateField(this)) {
          group.classList.remove('error');
        }
      });
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  const type = field.type;
  const name = field.name;

  // Required field
  if (!value) {
    updateErrorMessage(field, 'This field is required');
    return false;
  }

  // Email validation
  if (type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      updateErrorMessage(field, 'Please enter a valid email address');
      return false;
    }
  }

  // Phone validation
  if (name === 'phone') {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
      updateErrorMessage(field, 'Please enter a valid phone number');
      return false;
    }
  }

  // Message length
  if (name === 'message' && value.length < 10) {
    updateErrorMessage(field, 'Message must be at least 10 characters');
    return false;
  }

  return true;
}

function updateErrorMessage(field, message) {
  const group = field.closest('.form-group');
  const errorElement = group.querySelector('.form-error');
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function showSuccessMessage(form) {
  const successMsg = document.createElement('div');
  successMsg.className = 'success-message';
  successMsg.textContent = 'Thank you! Your message has been sent successfully.';
  successMsg.style.cssText = `
    background-color: #10b981;
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    animation: slideInDown 0.3s ease-out;
  `;

  form.insertBefore(successMsg, form.firstChild);

  setTimeout(() => {
    successMsg.style.animation = 'slideInUp 0.3s ease-out';
    setTimeout(() => successMsg.remove(), 300);
  }, 3000);
}

// ============================================
// 7. BACK TO TOP BUTTON
// ============================================

function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');

  if (!backToTopBtn) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================
// 8. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// 9. LAZY LOADING IMAGES
// ============================================

function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ============================================
// 10. MODAL/POPUP FUNCTIONALITY
// ============================================

function initModals() {
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.modal-close');
  const openButtons = document.querySelectorAll('[data-modal]');

  openButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });
}

// ============================================
// 11. DROPDOWN MENUS
// ============================================

function initDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const menu = dropdown.querySelector('.dropdown-menu');

    if (trigger && menu) {
      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('active');
      });

      document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
          menu.classList.remove('active');
        }
      });
    }
  });
}

// ============================================
// 12. TABS FUNCTIONALITY
// ============================================

function initTabs() {
  const tabGroups = document.querySelectorAll('.tab-group');

  tabGroups.forEach(group => {
    const tabs = group.querySelectorAll('.tab-trigger');
    const contents = group.querySelectorAll('.tab-content');

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        this.classList.add('active');
        if (contents[index]) {
          contents[index].classList.add('active');
        }
      });
    });

    // Activate first tab by default
    if (tabs.length > 0) {
      tabs[0].classList.add('active');
      if (contents.length > 0) {
        contents[0].classList.add('active');
      }
    }
  });
}

// ============================================
// 13. ACCORDION FUNCTIONALITY
// ============================================

function initAccordions() {
  const accordions = document.querySelectorAll('.accordion-item');

  accordions.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    if (trigger && content) {
      trigger.addEventListener('click', function() {
        const isActive = item.classList.contains('active');

        // Close all other accordion items
        document.querySelectorAll('.accordion-item').forEach(i => {
          i.classList.remove('active');
          const c = i.querySelector('.accordion-content');
          if (c) c.style.maxHeight = null;
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });
}

// ============================================
// 14. SEARCH FUNCTIONALITY
// ============================================

function initSearch() {
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');

  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();

    if (query.length < 2) {
      if (searchResults) searchResults.innerHTML = '';
      return;
    }

    // Search through blog posts, services, etc.
    const items = document.querySelectorAll('[data-searchable]');
    const results = [];

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        results.push(item);
      }
    });

    if (searchResults) {
      if (results.length === 0) {
        searchResults.innerHTML = '<p>No results found</p>';
      } else {
        searchResults.innerHTML = results.map(r => `<div>${r.textContent}</div>`).join('');
      }
    }
  });
}

// ============================================
// 15. PARALLAX EFFECT
// ============================================

function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (parallaxElements.length === 0) return;

  window.addEventListener('scroll', function() {
    parallaxElements.forEach(element => {
      const scrollPosition = window.scrollY;
      const elementOffset = element.offsetTop;
      const distance = scrollPosition - elementOffset;
      const parallaxValue = distance * 0.5;

      element.style.transform = `translateY(${parallaxValue}px)`;
    });
  });
}

// ============================================
// 16. TOOLTIP FUNCTIONALITY
// ============================================

function initTooltips() {
  const tooltips = document.querySelectorAll('[data-tooltip]');

  tooltips.forEach(element => {
    element.addEventListener('mouseenter', function() {
      const text = this.getAttribute('data-tooltip');
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = text;
      tooltip.style.cssText = `
        position: absolute;
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
      `;

      document.body.appendChild(tooltip);

      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    });

    element.addEventListener('mouseleave', function() {
      const tooltip = document.querySelector('.tooltip');
      if (tooltip) tooltip.remove();
    });
  });
}

// ============================================
// 17. NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 2000;
    animation: slideInRight 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideInLeft 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

// ============================================
// 18. UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Get element by ID
function getElement(id) {
  return document.getElementById(id);
}

// Get elements by class
function getElements(className) {
  return document.querySelectorAll(`.${className}`);
}

// Add class to element
function addClass(element, className) {
  if (element) element.classList.add(className);
}

// Remove class from element
function removeClass(element, className) {
  if (element) element.classList.remove(className);
}

// Toggle class on element
function toggleClass(element, className) {
  if (element) element.classList.toggle(className);
}

// ============================================
// 19. INITIALIZATION
// ============================================

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initPortfolioFilters();
  initTestimonialSlider();
  initScrollAnimations();
  initCounters();
  initFormValidation();
  initBackToTop();
  initSmoothScroll();
  initLazyLoading();
  initModals();
  initDropdowns();
  initTabs();
  initAccordions();
  initSearch();
  initParallax();
  initTooltips();
});

// ============================================
// 20. EXPORT FUNCTIONS FOR EXTERNAL USE
// ============================================

// Make functions available globally if needed
window.showNotification = showNotification;
window.debounce = debounce;
window.throttle = throttle;
window.getElement = getElement;
window.getElements = getElements;
window.addClass = addClass;
window.removeClass = removeClass;
window.toggleClass = toggleClass;

/* WhatsApp Floating Button */

window.addEventListener('scroll', function() {
  const btn = document.querySelector('.whatsapp-btn');
  if (window.scrollY > 200) {  
    btn.classList.add('show');
  } else {
    btn.classList.remove('show');
  }
});


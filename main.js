// ============================================
// Theme Toggle
// ============================================

const themeToggle = document.querySelector('.theme-toggle');

// Check for saved theme preference or default to dark theme
const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme || 'dark';

if (initialTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Add rotation animation
  themeToggle.style.animation = 'none';
  setTimeout(() => {
    themeToggle.style.animation = '';
  }, 10);
});

// ============================================
// Smooth Scroll for Navigation Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ============================================
// Contact Form Handling
// ============================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    console.log('Form submitted:', data);
    
    // Show success message
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Message Sent! ✓';
    submitButton.disabled = true;
    submitButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    // Reset form
    contactForm.reset();
    
    // Restore button after 3 seconds
    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      submitButton.style.background = '';
    }, 3000);
  });
}

// ============================================
// Intersection Observer for Animations
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger animation for multiple elements
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 100);
    }
  });
}, observerOptions);

// Observe project cards, skill categories, and stats
document.querySelectorAll('.project-card, .skill-category, .stat').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ============================================
// Active Navigation Link Highlighting
// ============================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// ============================================
// Parallax Effect on Hero Section
// ============================================

const heroSection = document.querySelector('.hero');
if (heroSection) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroShapes = heroSection.querySelectorAll('svg');
    heroShapes.forEach(shape => {
      shape.style.transform = `translateY(${scrolled * 0.3}px)`;
    });
  });
}

// ============================================
// Mouse Tracking for Interactive Elements
// ============================================

document.addEventListener('mousemove', (e) => {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    // Only apply on hover
    if (e.clientX > rect.left && e.clientX < rect.right &&
        e.clientY > rect.top && e.clientY < rect.bottom) {
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    }
  });
});

// Reset card transforms on mouse leave
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============================================
// Scroll Progress Indicator
// ============================================

const createScrollProgress = () => {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #0ea5e9, #ec4899, #8b5cf6);
    z-index: 1000;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
};

createScrollProgress();

// ============================================
// Cursor Glow Effect
// ============================================

const createCursorGlow = () => {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(14, 165, 233, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 999;
    display: none;
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
  `;
  document.body.appendChild(glow);
  
  document.addEventListener('mousemove', (e) => {
    glow.style.display = 'block';
    glow.style.left = (e.clientX - 20) + 'px';
    glow.style.top = (e.clientY - 20) + 'px';
  });
  
  document.addEventListener('mouseleave', () => {
    glow.style.display = 'none';
  });
};

// Only add cursor glow on non-touch devices
if (!window.matchMedia('(hover: none)').matches) {
  createCursorGlow();
}

// ============================================
// Animate Numbers on Scroll
// ============================================

const animateNumbers = () => {
  const stats = document.querySelectorAll('.stat-number');
  
  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const target = entry.target;
        const finalValue = parseInt(target.textContent);
        const duration = 2000;
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const currentValue = Math.floor(finalValue * progress);
          target.textContent = currentValue + '+';
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            target.textContent = finalValue + '+';
            target.dataset.animated = 'true';
          }
        };
        
        animate();
      }
    });
  }, { threshold: 0.5 });
  
  stats.forEach(stat => numberObserver.observe(stat));
};

animateNumbers();

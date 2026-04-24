import './style.css'

// Intersection Observer for Reveal Animations
const revealElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after animation if desired, or keep for repeat
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
};

// Navbar Scroll Effect
const handleNavbarScroll = () => {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('bg-brand-deep/80', 'backdrop-blur-xl', 'shadow-2xl', 'py-4', 'border-b', 'border-white/5');
      nav.classList.remove('py-6');
    } else {
      nav.classList.remove('bg-brand-deep/80', 'backdrop-blur-xl', 'shadow-2xl', 'py-4', 'border-b', 'border-white/5');
      nav.classList.add('py-6');
    }
  });
};

// Smooth Scroll for Navigation Links
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offset = 80; // Navbar height
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
};

// Form Interaction (Simple placeholder logic)
const initForm = () => {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const originalText = btn.textContent;
      
      btn.disabled = true;
      btn.textContent = 'Transmitting...';
      
      setTimeout(() => {
        btn.textContent = 'Transmission Received';
        btn.classList.replace('bg-blue-600', 'bg-green-600');
        form.reset();
        
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = originalText;
          btn.classList.replace('bg-green-600', 'bg-blue-600');
        }, 3000);
      }, 1500);
    });
  }
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  revealElements();
  handleNavbarScroll();
  initSmoothScroll();
  initForm();
});

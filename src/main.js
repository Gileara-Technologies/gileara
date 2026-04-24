import './style.css'

// Dark Mode Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or OS default
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  htmlElement.classList.add('dark');
} else {
  htmlElement.classList.remove('dark');
}

themeToggleBtn.addEventListener('click', () => {
  htmlElement.classList.toggle('dark');
  
  if (htmlElement.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Scroll animations via Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
  });

  // Dynamic Navbar Styling
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('bg-brand-surface/80', 'backdrop-blur-xl', 'shadow-lg', 'py-4', 'border-b', 'border-brand-secondary');
      nav.classList.remove('py-6');
    } else {
      nav.classList.remove('bg-brand-surface/80', 'backdrop-blur-xl', 'shadow-lg', 'py-4', 'border-b', 'border-brand-secondary');
      nav.classList.add('py-6');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Form Submission Logic
  const contactForm = document.querySelector('form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      
      btn.innerHTML = 'Sending... <span class="material-symbols-outlined animate-spin">refresh</span>';
      btn.classList.add('opacity-80', 'cursor-not-allowed');
      
      setTimeout(() => {
        btn.innerHTML = 'Message Received <span class="material-symbols-outlined">check_circle</span>';
        btn.classList.remove('opacity-80', 'cursor-not-allowed', 'bg-gradient-to-r', 'from-teal-500', 'to-sky-500');
        btn.classList.add('bg-green-500');
        contactForm.reset();
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.add('bg-gradient-to-r', 'from-teal-500', 'to-sky-500');
          btn.classList.remove('bg-green-500');
        }, 3000);
      }, 1500);
    });
  }
});

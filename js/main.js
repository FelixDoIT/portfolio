// ========================================
// Utility: throttle — limits execution rate for scroll events (perf)
// ========================================
function throttle(fn, wait = 80) {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}

// ========================================
// Mobile Menu Toggle
// ========================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// ========================================
// Smooth scroll for navigation links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// Navbar — shrink + shadow on scroll (throttled)
// ========================================
const navbar = document.querySelector('.navbar');

const handleNavbarScroll = throttle(() => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 60);

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// ========================================
// Active nav link highlighting (throttled)
// ========================================
const sections = document.querySelectorAll('section[id]');

const handleActiveLink = throttle(() => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}, 100);

window.addEventListener('scroll', handleActiveLink, { passive: true });

// ========================================
// Scroll-Reveal with IntersectionObserver (GPU-friendly)
// ========================================
function initScrollReveal() {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const revealElements = document.querySelectorAll(
        '.hero-text, .hero-image, .hero-content, ' +
        '.why-card, .project-card, .testimonial-card, ' +
        '.service-category, .timeline-item, .feature-item, ' +
        '.section-title, .section-subtitle, .cta-content, ' +
        '.about-image, .about-text, .about-image-placeholder, ' +
        '.contact-form, .contact-info'
    );

    // Add .reveal class to all target elements (if not already set in HTML)
    revealElements.forEach(el => {
        if (!el.classList.contains('reveal') &&
            !el.classList.contains('reveal-left') &&
            !el.classList.contains('reveal-right') &&
            !el.classList.contains('reveal-scale')) {
            el.classList.add('reveal');
        }
    });

    // Add stagger delays to grid children
    document.querySelectorAll('.why-grid, .projects-grid, .services-grid, .testimonials-grid, .hero-features').forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
            child.classList.add(`stagger-delay-${Math.min(i + 1, 6)}`);
        });
    });

    // Directional reveals for about section
    const aboutImg = document.querySelector('.about-image, .about-image-placeholder');
    const aboutTxt = document.querySelector('.about-text');
    if (aboutImg) { aboutImg.classList.remove('reveal'); aboutImg.classList.add('reveal-left'); }
    if (aboutTxt) { aboutTxt.classList.remove('reveal'); aboutTxt.classList.add('reveal-right'); }

    // Observe all reveal elements
    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        observer.observe(el);
    });
}

// Run after DOM is ready
initScrollReveal();

// ========================================
// Form submission handling
// ========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm(contactForm)) return;

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };

        alert('Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.');
        contactForm.reset();
        console.log('Form data:', formData);
    });

    // Real-time validation on blur
    contactForm.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', () => validateForm(contactForm));
    });
}

// ========================================
// Form validation
// ========================================
function validateForm(form) {
    const name = form.querySelector('#name');
    const phone = form.querySelector('#phone');
    const service = form.querySelector('#service');
    let isValid = true;

    if (name && name.value.trim() === '') {
        showError(name, 'Vui lòng nhập họ tên');
        isValid = false;
    } else if (name) {
        removeError(name);
    }

    if (phone && phone.value.trim() === '') {
        showError(phone, 'Vui lòng nhập số điện thoại');
        isValid = false;
    } else if (phone && !/^[0-9]{10,11}$/.test(phone.value.replace(/\s/g, ''))) {
        showError(phone, 'Số điện thoại không hợp lệ');
        isValid = false;
    } else if (phone) {
        removeError(phone);
    }

    if (service && service.value === '') {
        showError(service, 'Vui lòng chọn nhu cầu');
        isValid = false;
    } else if (service) {
        removeError(service);
    }

    return isValid;
}

function showError(element, message) {
    const formGroup = element.parentElement;
    let errorElement = formGroup.querySelector('.error-message');

    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.style.cssText = 'color:#EF4444;font-size:0.875rem;margin-top:0.25rem;display:block;';
        formGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
    element.style.borderColor = '#EF4444';
}

function removeError(element) {
    const formGroup = element.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) errorElement.remove();
    element.style.borderColor = '';
}

// ========================================
// Dynamic year in footer
// ========================================
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-brand p');
if (footerText) {
    footerText.textContent = `© ${currentYear} MyPortfolio, All Rights Reserved.`;
}

console.log('Portfolio website loaded successfully! 🚀');

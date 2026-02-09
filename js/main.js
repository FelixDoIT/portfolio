// Mobile Menu Toggle
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

// Smooth scroll for navigation links
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

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Form submission handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };
        
        // Display success message
        alert('Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.');
        
        // Reset form
        contactForm.reset();
        
        // In a real application, you would send this data to a server
        console.log('Form data:', formData);
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.why-card, .project-card, .testimonial-card, .service-category, .timeline-item').forEach(el => {
    observer.observe(el);
});

// Dynamic year in footer
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-brand p');
if (footerText) {
    footerText.textContent = `© ${currentYear} MyPortfolio, All Right Reserved.`;
}

// Add active class to current nav item
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', scrollActive);

// Parallax effect for hero section
const heroSection = document.querySelector('.hero');
if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = heroSection.querySelector('.hero-image');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Project cards hover effect enhancement
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Form validation
function validateForm(form) {
    const name = form.querySelector('#name');
    const phone = form.querySelector('#phone');
    const service = form.querySelector('#service');
    
    let isValid = true;
    
    if (name.value.trim() === '') {
        showError(name, 'Vui lòng nhập họ tên');
        isValid = false;
    } else {
        removeError(name);
    }
    
    if (phone.value.trim() === '') {
        showError(phone, 'Vui lòng nhập số điện thoại');
        isValid = false;
    } else if (!/^[0-9]{10,11}$/.test(phone.value.replace(/\s/g, ''))) {
        showError(phone, 'Số điện thoại không hợp lệ');
        isValid = false;
    } else {
        removeError(phone);
    }
    
    if (service.value === '') {
        showError(service, 'Vui lòng chọn nhu cầu');
        isValid = false;
    } else {
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
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    element.style.borderColor = 'red';
}

function removeError(element) {
    const formGroup = element.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    element.style.borderColor = '';
}

// Enhanced form submission with validation
if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateForm(contactForm);
        });
    });
}

console.log('Portfolio website loaded successfully! 🚀');

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');


if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };
}

let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');


        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                const activeLink = document.querySelector('header nav a[href*=' + id + ']');
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            });
        };
    });

    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    if (menuIcon && navbar) {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    }
};

// script.js

document.addEventListener("DOMContentLoaded", function() {
    const smokeContainer = document.getElementById('smoke-container');
    if (!smokeContainer) return;
    
    function createSmoke() {
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        
        // Randomize initial position
        smoke.style.left = Math.random() * window.innerWidth + 'px';
        
        // Append to container
        smokeContainer.appendChild(smoke);
        
        // Remove the smoke after animation ends
        setTimeout(() => {
            smokeContainer.removeChild(smoke);
        }, 5000); // Should match the animation duration
    }
    
    // Create smoke at intervals
    setInterval(createSmoke, 200); // Adjust the interval as needed
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const nextUrlInput = document.getElementById('next-url');

if (nextUrlInput) {
    const redirectBase = window.location.href.split('#')[0];
    nextUrlInput.value = `${redirectBase}#contact`;
}

if (contactForm) {
    contactForm.addEventListener('submit', () => {
    const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            // Prevent duplicate submits while the browser sends the POST request.
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }
    
        if (formStatus) {
            formStatus.textContent = 'Sending your message...';
            formStatus.className = 'form-status';
            formStatus.style.display = 'block';
        }

        // If submission stays on this page for any reason, restore button state.
        window.setTimeout(() => {
            if (!submitButton) return;
      submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }, 8000);
  });
}

// Initialize AOS
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
}

// Loading Animation
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.querySelector('.loader-wrapper');
        if (loader) {
            loader.classList.add('fade-out');
        }
    }, 1000); // Hide loader after 1 second
});

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Use saved theme first, then fall back to system preference.
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
body.setAttribute('data-theme', initialTheme);

function updateThemeToggleText(theme) {
    if (!themeToggle) return;
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
    themeToggle.setAttribute('title', `Switch to ${nextTheme} mode`);
}

updateThemeToggleText(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleText(newTheme);
    });
}

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scroll-top');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Skills Animation
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkills = () => {
    skillBars.forEach(skill => {
        const progress = skill.getAttribute('data-progress');
        skill.style.width = progress;
    });
};

// Intersection Observer for Skills
const skillsSection = document.querySelector('.skills');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 200);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 200);
            }
        });
    });
});

// Typing Animation for Contact Form
const typingText = document.querySelector('.typing-text');
const messages = [
    "Let's work together!",
    "Have a project in mind?",
    "Get in touch!",
    "Let's create something amazing!"
];

let messageIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeMessage() {
    if (!typingText) return;
    
    const currentMessage = messages[messageIndex];
    
    if (isDeleting) {
        typingText.textContent = currentMessage.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 50;
    } else {
        typingText.textContent = currentMessage.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentMessage.length) {
        isDeleting = true;
        typingDelay = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        messageIndex = (messageIndex + 1) % messages.length;
        typingDelay = 500; // Pause before typing next message
    }

    setTimeout(typeMessage, typingDelay);
}

if (typingText) {
    setTimeout(typeMessage, 1000);
}



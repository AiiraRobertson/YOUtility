// script.js - Main JavaScript file for YOUtility

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
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

// Enhanced scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in', 'visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .provider-card, .booking-card').forEach(card => {
    observer.observe(card);
});

// Add magnifier effect to images
document.querySelectorAll('.provider-image, .service-icon').forEach(img => {
    img.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.filter = 'brightness(1.1)';
    });

    img.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.filter = 'brightness(1)';
    });
});

// Enhanced CTA button click handler
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.add('loading');
        
        // Simulate loading
        setTimeout(() => {
            this.classList.remove('loading');
            window.location.href = this.getAttribute('href');
        }, 1000);
    });
}

// All buttons default click behavior
document.querySelectorAll('button[data-action], .service-card, button').forEach(element => {
    element.addEventListener('click', function(e) {
        // Primary button actions via data-action attribute
        const action = this.dataset.action;
        if (action) {
            e.preventDefault();
            switch (action) {
                case 'login':
                    window.location.href = 'login.html';
                    break;
                case 'signup':
                    window.location.href = 'signup.html';
                    break;
                case 'home':
                    window.location.href = 'index.html';
                    break;
                case 'services':
                    window.location.href = 'services.html';
                    break;
                case 'providers':
                    window.location.href = 'providers.html';
                    break;
                default:
                    console.info('Unhandled button action:', action);
            }
        }
    });
});

// Service card click actions
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        const serviceName = this.querySelector('h3')?.textContent?.trim() || 'services';
        const queryParam = encodeURIComponent(serviceName.replace('&', 'and'));
        window.location.href = `providers.html?service=${queryParam}`;
    });
});

// Add tooltips to service cards
document.querySelectorAll('.service-card').forEach(card => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltiptext';
    tooltip.textContent = 'Click to find providers for this service';
    
    const tooltipWrapper = document.createElement('div');
    tooltipWrapper.className = 'tooltip';
    tooltipWrapper.appendChild(tooltip);
    
    card.appendChild(tooltipWrapper);
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
    }
});

// Enhanced form focus effects
document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    element.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// Add ripple effect to buttons
document.querySelectorAll('button, .cta-button, .service-link').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Logo click effect
document.querySelector('.logo').addEventListener('click', function() {
    this.style.animation = 'bounce 0.6s ease';
    setTimeout(() => {
        this.style.animation = '';
        window.location.href = 'index.html';
    }, 600);
});

// Add bounce animation
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .form-group.focused label {
        color: #667eea;
        font-weight: 600;
    }
    
    .form-group.focused input, .form-group.focused select, .form-group.focused textarea {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('YOUtility app initialized');
    
    // Add loading class removal after page load
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});
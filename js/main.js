/**
 * Future Academy - Main JavaScript
 * Handles core functionality for the educational platform
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMobileNav();
    initTestimonialSlider();
    initScrollAnimations();
    initTypingEffect();
});

/**
 * Mobile Navigation
 * Handles the mobile menu toggle functionality
 */
function initMobileNav() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuBtn || !navLinks) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    // Ensure the menu button is visible
    mobileMenuBtn.style.display = window.innerWidth <= 768 ? 'block' : 'none';
    
    // Initialize menu state
    const updateMenuState = (isOpen) => {
        navLinks.classList.toggle('active', isOpen);
        const icon = mobileMenuBtn.querySelector('i');
        if (isOpen) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    };
    
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCurrentlyOpen = navLinks.classList.contains('active');
        updateMenuState(!isCurrentlyOpen);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            updateMenuState(false);
        }
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            updateMenuState(false);
        });
    });
    
    // Update menu visibility on resize
    window.addEventListener('resize', () => {
        mobileMenuBtn.style.display = window.innerWidth <= 768 ? 'block' : 'none';
        if (window.innerWidth > 768) {
            updateMenuState(false);
        }
    });
}

/**
 * Testimonial Slider
 * Manages the testimonial carousel functionality
 */
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slides.length || !dots.length) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    // Function to show a specific slide
    function showSlide(index) {
        // Wrap around if index is out of bounds
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Event listeners for prev and next buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            resetInterval();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            resetInterval();
        });
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetInterval();
        });
    });
    
    // Auto-advance slides
    function startInterval() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }
    
    // Reset interval when user interacts
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }
    
    // Start the auto-advance
    startInterval();
}

/**
 * Scroll Animations
 * Handles revealing elements as they enter the viewport
 */
function initScrollAnimations() {
    // Get all elements with the fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    // Get all elements with data-animation attribute
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll animations
    function handleScrollAnimations() {
        // Handle fade-in elements
        fadeElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('active');
            }
        });
        
        // Handle elements with data-animation attribute
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                const animation = element.getAttribute('data-animation');
                element.classList.add(animation);
                element.style.opacity = '1';
            }
        });
    }
    
    // Set initial styles for data-animation elements
    animatedElements.forEach(element => {
        const animation = element.getAttribute('data-animation');
        
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Set different initial styles based on animation type
        if (animation === 'slide-up') {
            element.style.transform = 'translateY(30px)';
        } else if (animation === 'slide-down') {
            element.style.transform = 'translateY(-30px)';
        } else if (animation === 'slide-left') {
            element.style.transform = 'translateX(30px)';
        } else if (animation === 'slide-right') {
            element.style.transform = 'translateX(-30px)';
        } else if (animation === 'zoom-in') {
            element.style.transform = 'scale(0.9)';
        }
    });
    
    // Add the active class to elements that are already in viewport on page load
    handleScrollAnimations();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimations);
}

/**
 * Typing Effect
 * Creates a typewriter effect for headings with the typing-effect class
 */
function initTypingEffect() {
    const elements = document.querySelectorAll('.typing-effect');
    
    elements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        // Store the original text and clear the element
        element.setAttribute('data-text', text);
        
        // Create and append cursor element
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.textContent = '|';
        cursor.style.marginLeft = '1px';
        cursor.style.animation = 'cursor-blink 1s infinite';
        element.appendChild(cursor);
        
        // Add CSS for cursor blink animation if not already added
        if (!document.querySelector('#cursor-style')) {
            const style = document.createElement('style');
            style.id = 'cursor-style';
            style.textContent = `
                @keyframes cursor-blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Start typing effect after a delay
        setTimeout(() => {
            typeText(element, text, 0);
        }, 500);
    });
    
    function typeText(element, text, index) {
        if (index < text.length) {
            // Insert the character before the cursor
            const cursor = element.querySelector('.cursor');
            const textNode = document.createTextNode(text.charAt(index));
            element.insertBefore(textNode, cursor);
            
            // Continue typing after delay
            setTimeout(() => {
                typeText(element, text, index + 1);
            }, 50 + Math.random() * 50);  // Random delay for natural effect
        }
    }
}

// Add shadow to navbar on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 0) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}); 
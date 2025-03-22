/**
 * Future Academy - Animation Functions
 * Handles custom animations and transitions for the educational platform
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initPageTransitions();
    initCounterAnimations();
    
    // Add CSS class for page loaded animation
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);
});

/**
 * Page Transitions
 * Smooth transitions between pages
 */
function initPageTransitions() {
    // Add event listeners to all internal links for page transitions
    document.querySelectorAll('a').forEach(link => {
        // Only add transition to internal links (not external or anchor links)
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) {
            return;
        }
        
        link.addEventListener('click', function(e) {
            // Don't transition if user is holding modifier keys
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                return;
            }
            
            const targetHref = this.getAttribute('href');
            
            // Don't transition to the current page
            if (targetHref === window.location.pathname || 
                (targetHref === 'index.html' && window.location.pathname === '/')) {
                return;
            }
            
            e.preventDefault();
            
            // Add exit animation class to body
            document.body.classList.add('page-transition-exit');
            
            // Navigate after animation completes
            setTimeout(() => {
                window.location.href = targetHref;
            }, 300);
        });
    });
    
    // Add entrance animation when page loads
    window.addEventListener('pageshow', () => {
        document.body.classList.add('page-transition-enter');
        
        setTimeout(() => {
            document.body.classList.remove('page-transition-enter');
        }, 500);
    });
}

/**
 * Counter Animations
 * Animated counting effect for numbers
 */
function initCounterAnimations() {
    const counterElements = document.querySelectorAll('.counter');
    
    counterElements.forEach(counter => {
        const targetValue = parseInt(counter.getAttribute('data-target'), 10);
        const duration = counter.getAttribute('data-duration') || 2000; // Duration in ms (default: 2s)
        
        // Function to animate counter
        function animateCounter() {
            if (!isElementInViewport(counter)) return;
            
            let startTime = null;
            
            // Remove scroll listener once animation starts
            window.removeEventListener('scroll', scrollHandler);
            
            function countStep(timestamp) {
                if (!startTime) startTime = timestamp;
                
                // Calculate progress
                const progress = Math.min((timestamp - startTime) / duration, 1);
                
                // Calculate current value based on easing function
                const currentValue = Math.floor(easeOutQuart(progress) * targetValue);
                
                // Update counter text
                counter.textContent = currentValue.toLocaleString();
                
                // Continue animation if not complete
                if (progress < 1) {
                    window.requestAnimationFrame(countStep);
                } else {
                    // Set final value precisely at the end
                    counter.textContent = targetValue.toLocaleString();
                }
            }
            
            // Start the animation
            window.requestAnimationFrame(countStep);
        }
        
        // Easing function for smoother animation
        function easeOutQuart(x) {
            return 1 - Math.pow(1 - x, 4);
        }
        
        // Check if element is in viewport and start animation
        const scrollHandler = () => {
            if (isElementInViewport(counter)) {
                animateCounter();
            }
        };
        
        // Start animation if already in viewport
        if (isElementInViewport(counter)) {
            animateCounter();
        } else {
            // Otherwise add scroll listener
            window.addEventListener('scroll', scrollHandler);
        }
    });
}

/**
 * Helper function to check if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

// Add CSS for page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Create style element if it doesn't exist
    if (!document.querySelector('#animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        
        // Add page transition styles
        style.textContent = `
            body {
                opacity: 1;
                transition: opacity 0.3s ease;
            }
            
            body.page-transition-exit {
                opacity: 0;
            }
            
            body.page-transition-enter {
                opacity: 0;
            }
            
            body.page-loaded {
                opacity: 1;
            }
            
            /* Add slide-up animation */
            .slide-up {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            /* Add slide-down animation */
            .slide-down {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            /* Add slide-left animation */
            .slide-left {
                opacity: 1 !important;
                transform: translateX(0) !important;
            }
            
            /* Add slide-right animation */
            .slide-right {
                opacity: 1 !important;
                transform: translateX(0) !important;
            }
            
            /* Add zoom-in animation */
            .zoom-in {
                opacity: 1 !important;
                transform: scale(1) !important;
            }
        `;
        
        document.head.appendChild(style);
    }
}); 
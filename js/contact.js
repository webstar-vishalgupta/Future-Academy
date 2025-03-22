// Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const WEB3FORMS_ACCESS_KEY = '43e77474-6913-4cbc-b159-7be8ba7fe63a';

    // Simple validation patterns
    const validation = {
        name: {
            pattern: /^[a-zA-Z\s]{2,50}$/,
            message: 'Please enter a valid name (2-50 characters)'
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        subject: {
            pattern: /^[a-zA-Z0-9\s\-_]{5,100}$/,
            message: 'Please enter a valid subject (5-100 characters)'
        },
        message: {
            pattern: /^[\s\S]{10,1000}$/,
            message: 'Please enter a message (10-1000 characters)'
        }
    };

    // Validate a single field
    function validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const errorElement = field.nextElementSibling;
        
        if (!validation[fieldName].pattern.test(value)) {
            field.classList.add('error');
            errorElement.textContent = validation[fieldName].message;
            return false;
        } else {
            field.classList.remove('error');
            errorElement.textContent = '';
            return true;
        }
    }

    // Validate all fields
    function validateForm() {
        let isValid = true;
        const fields = contactForm.querySelectorAll('input, textarea');
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Add validation on input
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => validateField(field));
        field.addEventListener('blur', () => validateField(field));
    });

    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
            // Prepare form data
            const formData = new FormData(contactForm);
            formData.append('access_key', WEB3FORMS_ACCESS_KEY);

            // Send the form data
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Reset form
                contactForm.reset();
                showNotification('Message sent successfully! We will get back to you soon.', 'success');
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Failed to send message. Please try again later.', 'error');
        } finally {
            // Reset submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });

    // Add keyframe animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .error {
            border-color: #EF4444 !important;
        }
    `;
    document.head.appendChild(style);
});

// Dark Mode Toggle
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    darkModeToggle.checked = savedTheme === 'dark';
} else {
    // Set initial theme based on system preference
    const initialTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', initialTheme);
    darkModeToggle.checked = initialTheme === 'dark';
}

// Toggle dark mode
darkModeToggle.addEventListener('change', () => {
    const theme = darkModeToggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const theme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        darkModeToggle.checked = e.matches;
    }
}); 
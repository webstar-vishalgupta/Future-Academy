/**
 * Future Academy - Progress Tracking JavaScript
 * Handles progress bars, badges, and streak functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    initProgressBars();
    simulateProgressData();
    initBadgeEffects();
    initStreakCounter();
});

/**
 * Progress Bars Animation
 * Animates the progress bars for each subject
 */
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    // Animate each progress bar
    progressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-progress') + '%';
        
        // Delay animation to allow page to load
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 300);
    });
}

/**
 * Progress Data Simulation
 * Simulates user progress data for demo purposes
 * In a real application, this would be loaded from server/API
 */
function simulateProgressData() {
    // This is placeholder functionality for the demo
    // In a real application, we would fetch actual user data
    
    // Progress tracking would be stored in localStorage or on a server
    // This function would typically make API calls or get data from localStorage
    
    // For this demo, we'll simulate this with a function that does nothing
    // except log to console - the HTML already has the simulated data
    console.log('Progress data would be loaded from server or localStorage in a real application');
    
    // For a real implementation, we would do something like:
    /*
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        lessonsCompleted: 0,
        quizzesCompleted: 0,
        studyHours: 0,
        subjects: {
            mathematics: { progress: 0, lessons: 0, quizzes: 0 },
            science: { progress: 0, lessons: 0, quizzes: 0 },
            programming: { progress: 0, lessons: 0, quizzes: 0 },
            languages: { progress: 0, lessons: 0, quizzes: 0 }
        },
        badges: [],
        streak: { current: 0, best: 0, activeDays: [] }
    };
    
    // Then update the UI with this data
    updateProgressUI(userData);
    */
}

/**
 * Badge Effects
 * Adds visual effects and animations to badge cards
 */
function initBadgeEffects() {
    const earnedBadges = document.querySelectorAll('.badge-card.earned');
    const lockedBadges = document.querySelectorAll('.badge-card.locked');
    
    // Add shine effect to earned badges
    earnedBadges.forEach(badge => {
        // Create shine overlay
        const shine = document.createElement('div');
        shine.className = 'badge-shine';
        badge.appendChild(shine);
        
        // Add hover effect
        badge.addEventListener('mouseenter', () => {
            shine.style.opacity = '1';
            shine.style.transform = 'translateX(100%)';
        });
        
        badge.addEventListener('mouseleave', () => {
            shine.style.opacity = '0';
            shine.style.transform = 'translateX(-100%)';
        });
    });
    
    // Add interactive effects to locked badges
    lockedBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            // Show tooltip with info on how to unlock
            const requirement = badge.querySelector('p').textContent;
            showTooltip(badge, `To unlock: ${requirement}`);
        });
    });
    
    // Helper function to show tooltips
    function showTooltip(element, message) {
        // Remove any existing tooltips
        const existingTooltip = document.querySelector('.badge-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Create and add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'badge-tooltip';
        tooltip.textContent = message;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip near the element
        const rect = element.getBoundingClientRect();
        tooltip.style.top = (rect.top + window.scrollY - tooltip.offsetHeight - 10) + 'px';
        tooltip.style.left = (rect.left + window.scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';
        
        // Add show class for animation
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);
        
        // Remove after a few seconds
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => {
                tooltip.remove();
            }, 300);
        }, 3000);
    }
    
    // Add tooltip styles if not already added
    if (!document.querySelector('#tooltip-style')) {
        const style = document.createElement('style');
        style.id = 'tooltip-style';
        style.textContent = `
            .badge-tooltip {
                position: absolute;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 1000;
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.3s, transform 0.3s;
                pointer-events: none;
                white-space: nowrap;
            }
            
            .badge-tooltip::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 5px solid rgba(0, 0, 0, 0.8);
            }
            
            .badge-tooltip.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .badge-shine {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    to right,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.3) 50%,
                    rgba(255, 255, 255, 0) 100%
                );
                z-index: 2;
                opacity: 0;
                transform: translateX(-100%);
                transition: transform 0.6s, opacity 0.6s;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Streak Counter Animation
 * Animates the streak counter and initializes streak functionality
 */
function initStreakCounter() {
    const streakCount = document.getElementById('streak-count');
    const currentValue = parseInt(streakCount.textContent);
    
    // Animate the streak counter
    animateNumber(streakCount, 0, currentValue, 1500);
    
    // Add hover information to calendar days
    const calendarDays = document.querySelectorAll('.calendar-days .day');
    
    calendarDays.forEach(day => {
        if (day.classList.contains('active') || day.classList.contains('today')) {
            day.setAttribute('title', 'You studied on this day');
        } else if (day.classList.contains('future')) {
            day.setAttribute('title', 'Future date');
        } else if (!day.classList.contains('prev-month') && !day.classList.contains('next-month')) {
            day.setAttribute('title', 'No activity on this day');
        }
    });
    
    // Helper function to animate number counting
    function animateNumber(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
}

/**
 * Progress Persistence
 * Would save user progress data to localStorage or server
 * Note: In this demo, we're not implementing actual persistence functionality
 */
function saveProgressData() {
    // This would be called when actual progress changes are made
    // For the demo, we're not implementing this functionality
    // Example of what this might do:
    
    /*
    const userData = {
        lessonsCompleted: 24,
        quizzesCompleted: 18,
        studyHours: 42,
        subjects: {
            mathematics: { progress: 65, lessons: 13, quizzes: 5 },
            science: { progress: 40, lessons: 8, quizzes: 3 },
            programming: { progress: 85, lessons: 17, quizzes: 7 },
            languages: { progress: 20, lessons: 4, quizzes: 2 }
        },
        badges: [
            { id: 'fast-learner', earned: '2023-04-01' },
            { id: 'quiz-master', earned: '2023-04-08' },
            // etc.
        ],
        streak: { 
            current: 7, 
            best: 12, 
            activeDays: ['2023-04-08', '2023-04-09', '2023-04-10', '2023-04-11', 
                        '2023-04-12', '2023-04-13', '2023-04-14', '2023-04-15'] 
        }
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Or send to server:
    // fetch('/api/save-progress', {
    //    method: 'POST',
    //    headers: { 'Content-Type': 'application/json' },
    //    body: JSON.stringify(userData)
    // });
    */
} 
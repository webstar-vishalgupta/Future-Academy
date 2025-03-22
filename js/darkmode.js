/**
 * Future Academy - Dark Mode Functionality
 * Handles dark mode toggle and persistence
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to toggle dark mode
    function toggleDarkMode(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        darkModeToggle.checked = isDark;
    }

    // Check for saved user preference, first in localStorage, then in system preferences
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        toggleDarkMode(savedTheme === 'dark');
    } else {
        toggleDarkMode(prefersDarkScheme.matches);
    }

    // Listen for toggle change
    darkModeToggle.addEventListener('change', (e) => {
        toggleDarkMode(e.target.checked);
    });

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            toggleDarkMode(e.matches);
        }
    });
}); 
/**
 * Forum JavaScript - Manages all forum-related functionality
 * 
 * This script handles:
 * - Category filtering
 * - Thread searching
 * - Sorting discussions
 * - New post modal
 * - Thread interaction
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all forum functionalities
    initCategoryFilters();
    initSearch();
    initSorting();
    initNewPostModal();
    initPagination();
    
    // Sample data for demonstration - in a real application, this would come from a backend
    const sampleThreads = getAllThreads();
    
    // For demo purposes - track which posts are "read"
    markRandomThreadsAsRead();
});

/**
 * Initialize category filtering functionality
 */
function initCategoryFilters() {
    const categoryLinks = document.querySelectorAll('.forum-categories a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all category links
            categoryLinks.forEach(cl => cl.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            const category = link.getAttribute('data-category');
            filterThreadsByCategory(category);
            
            // Update the results count in the UI
            updateResultsCount();
        });
    });
}

/**
 * Filter threads based on selected category
 */
function filterThreadsByCategory(category) {
    const threads = document.querySelectorAll('.thread-item');
    
    threads.forEach(thread => {
        if (category === 'all' || thread.getAttribute('data-category') === category) {
            thread.style.display = 'flex';
        } else {
            thread.style.display = 'none';
        }
    });
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('forum-search-input');
    const searchButton = searchInput.nextElementSibling;
    
    // Handle search when button is clicked
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value.trim().toLowerCase());
    });
    
    // Handle search when Enter key is pressed
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value.trim().toLowerCase());
        }
    });
}

/**
 * Perform search on threads
 */
function performSearch(query) {
    if (query === '') {
        resetSearch();
        return;
    }
    
    const threads = document.querySelectorAll('.thread-item');
    let hasResults = false;
    
    threads.forEach(thread => {
        const title = thread.querySelector('h3').textContent.toLowerCase();
        const excerpt = thread.querySelector('.thread-excerpt').textContent.toLowerCase();
        const author = thread.querySelector('.thread-author').textContent.toLowerCase();
        
        if (title.includes(query) || excerpt.includes(query) || author.includes(query)) {
            thread.style.display = 'flex';
            hasResults = true;
            
            // Highlight matching text (simplified version)
            highlightText(thread, query);
        } else {
            thread.style.display = 'none';
        }
    });
    
    // Show a message if no results were found
    const resultsContainer = document.querySelector('.discussion-threads');
    let noResultsMessage = document.querySelector('.no-results-message');
    
    if (!hasResults) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results-message';
            noResultsMessage.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>No results found</h3>
                <p>We couldn't find any threads matching "${query}"</p>
                <button class="secondary-button reset-search">Reset Search</button>
            `;
            resultsContainer.appendChild(noResultsMessage);
            
            // Add event listener to reset button
            noResultsMessage.querySelector('.reset-search').addEventListener('click', resetSearch);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
    
    // Update the results count
    updateResultsCount();
}

/**
 * Highlight matching text in search results
 */
function highlightText(thread, query) {
    // This is a simplified version - a production version would use safer text manipulation
    // Currently only highlights the first instance for demo purposes
    const titleElement = thread.querySelector('h3 a');
    const excerptElement = thread.querySelector('.thread-excerpt');
    
    // Only do the highlighting if not already highlighted
    if (!titleElement.innerHTML.includes('<mark>')) {
        titleElement.innerHTML = titleElement.innerHTML.replace(
            new RegExp(query, 'i'),
            match => `<mark>${match}</mark>`
        );
        
        excerptElement.innerHTML = excerptElement.innerHTML.replace(
            new RegExp(query, 'i'),
            match => `<mark>${match}</mark>`
        );
    }
}

/**
 * Reset search and show all threads
 */
function resetSearch() {
    // Clear the search input
    const searchInput = document.getElementById('forum-search-input');
    searchInput.value = '';
    
    // Show all threads
    const threads = document.querySelectorAll('.thread-item');
    threads.forEach(thread => {
        thread.style.display = 'flex';
        
        // Remove any highlighting
        const titleElement = thread.querySelector('h3 a');
        const excerptElement = thread.querySelector('.thread-excerpt');
        
        titleElement.innerHTML = titleElement.innerHTML.replace(/<mark>(.*?)<\/mark>/g, '$1');
        excerptElement.innerHTML = excerptElement.innerHTML.replace(/<mark>(.*?)<\/mark>/g, '$1');
    });
    
    // Remove no results message if it exists
    const noResultsMessage = document.querySelector('.no-results-message');
    if (noResultsMessage) {
        noResultsMessage.remove();
    }
    
    // Reset active category to "All Topics"
    const categoryLinks = document.querySelectorAll('.forum-categories a');
    categoryLinks.forEach(cl => cl.classList.remove('active'));
    document.querySelector('[data-category="all"]').classList.add('active');
    
    // Update the results count
    updateResultsCount();
}

/**
 * Initialize sorting functionality
 */
function initSorting() {
    const sortSelect = document.getElementById('forum-sort');
    
    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        sortThreads(sortValue);
    });
}

/**
 * Sort threads based on selected criteria
 */
function sortThreads(criteria) {
    const threadsContainer = document.querySelector('.discussion-threads');
    const threads = Array.from(document.querySelectorAll('.thread-item'));
    
    // Sort the threads based on the selected criteria
    threads.sort((a, b) => {
        switch (criteria) {
            case 'recent':
                // Sort by time (most recent first)
                const timeA = a.querySelector('.thread-time').textContent;
                const timeB = b.querySelector('.thread-time').textContent;
                // Simple comparison for demo - in real app would parse dates properly
                return timeA.includes('hours') ? -1 : (timeB.includes('hours') ? 1 : 0);
                
            case 'popular':
                // Sort by view count (highest first)
                const viewsA = parseInt(a.querySelector('.thread-views').textContent.match(/\d+/)[0]);
                const viewsB = parseInt(b.querySelector('.thread-views').textContent.match(/\d+/)[0]);
                return viewsB - viewsA;
                
            case 'active':
                // Sort by reply count (highest first)
                const repliesA = parseInt(a.querySelector('.thread-replies').textContent.match(/\d+/)[0]);
                const repliesB = parseInt(b.querySelector('.thread-replies').textContent.match(/\d+/)[0]);
                return repliesB - repliesA;
                
            case 'unanswered':
                // Sort by reply count (lowest first)
                const unansweredA = parseInt(a.querySelector('.thread-replies').textContent.match(/\d+/)[0]);
                const unansweredB = parseInt(b.querySelector('.thread-replies').textContent.match(/\d+/)[0]);
                return unansweredA - unansweredB;
                
            default:
                return 0;
        }
    });
    
    // Remove all threads from the container
    while (threadsContainer.firstChild) {
        threadsContainer.removeChild(threadsContainer.firstChild);
    }
    
    // Add sorted threads back to the container
    threads.forEach(thread => {
        threadsContainer.appendChild(thread);
    });
}

/**
 * Initialize new post modal functionality
 */
function initNewPostModal() {
    const newPostBtn = document.querySelector('.new-post-btn');
    const modal = document.getElementById('new-post-modal');
    const closeModalBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-post');
    const form = document.getElementById('new-post-form');
    
    // Show modal when new post button is clicked
    newPostBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
            document.body.classList.add('modal-open');
        }, 10);
    });
    
    // Hide modal when close button is clicked
    closeModalBtn.addEventListener('click', closeModal);
    
    // Hide modal when cancel button is clicked
    cancelBtn.addEventListener('click', closeModal);
    
    // Hide modal when clicking outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-category').value;
        const content = document.getElementById('post-content').value;
        const tags = document.getElementById('post-tags').value;
        
        // Validate form
        if (!title || !category || !content) {
            showFormError('Please fill in all required fields');
            return;
        }
        
        // In a real application, this would be sent to a server
        console.log('New post:', { title, category, content, tags });
        
        // Show success message and close modal
        showNotification('Your post has been created successfully!');
        closeModal();
        
        // Reset form
        form.reset();
    });
    
    // Initialize formatting tools
    initFormattingTools();
}

/**
 * Close the new post modal
 */
function closeModal() {
    const modal = document.getElementById('new-post-modal');
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

/**
 * Initialize text formatting tools for the post editor
 */
function initFormattingTools() {
    const formattingButtons = document.querySelectorAll('.formatting-tools button');
    const textarea = document.getElementById('post-content');
    
    formattingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const formatType = button.title.toLowerCase();
            applyFormatting(formatType, textarea);
        });
    });
}

/**
 * Apply formatting to selected text in textarea
 */
function applyFormatting(type, textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = '';
    
    switch (type) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'link':
            const url = prompt('Enter the URL:', 'https://');
            if (url) {
                formattedText = `[${selectedText || 'Link text'}](${url})`;
            } else {
                return; // User canceled
            }
            break;
        case 'image':
            const imageUrl = prompt('Enter the image URL:', 'https://');
            if (imageUrl) {
                formattedText = `![${selectedText || 'Image description'}](${imageUrl})`;
            } else {
                return; // User canceled
            }
            break;
        case 'code':
            formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
            break;
    }
    
    // Replace the selected text with the formatted text
    textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    
    // Update cursor position
    textarea.focus();
    const newCursorPos = start + formattedText.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
}

/**
 * Initialize pagination functionality
 */
function initPagination() {
    const prevButton = document.querySelector('.pagination-prev');
    const nextButton = document.querySelector('.pagination-next');
    const numberButtons = document.querySelectorAll('.pagination-numbers button');
    
    // Handle previous button click
    prevButton.addEventListener('click', () => {
        const activeButton = document.querySelector('.pagination-numbers button.active');
        const prevButton = activeButton.previousElementSibling;
        
        if (prevButton && prevButton.tagName === 'BUTTON') {
            changePage(prevButton);
        }
    });
    
    // Handle next button click
    nextButton.addEventListener('click', () => {
        const activeButton = document.querySelector('.pagination-numbers button.active');
        const nextButton = activeButton.nextElementSibling;
        
        if (nextButton && nextButton.tagName === 'BUTTON') {
            changePage(nextButton);
        }
    });
    
    // Handle number button click
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            changePage(button);
        });
    });
}

/**
 * Change active page
 */
function changePage(pageButton) {
    // Remove active class from current page
    const currentActive = document.querySelector('.pagination-numbers button.active');
    currentActive.classList.remove('active');
    
    // Add active class to new page
    pageButton.classList.add('active');
    
    // Enable/disable prev/next buttons as needed
    const prevButton = document.querySelector('.pagination-prev');
    const nextButton = document.querySelector('.pagination-next');
    const firstPage = document.querySelector('.pagination-numbers button:first-child');
    const lastPage = document.querySelector('.pagination-numbers button:last-of-type');
    
    prevButton.disabled = pageButton === firstPage;
    nextButton.disabled = pageButton === lastPage;
    
    // In a real application, this would fetch the threads for the selected page
    // For this demo, we'll just simulate a page change by scrolling to the top of the threads
    document.querySelector('.discussion-threads').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Show notification message
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    // Add notification to the DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add event listener to close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Automatically remove notification after 5 seconds
    setTimeout(() => {
        if (notification.parentNode === document.body) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

/**
 * Show form error message
 */
function showFormError(message) {
    const form = document.getElementById('new-post-form');
    let errorElement = form.querySelector('.form-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        form.prepend(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Hide error after 3 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000);
}

/**
 * Update the count of visible results/threads
 */
function updateResultsCount() {
    const visibleThreads = Array.from(document.querySelectorAll('.thread-item'))
        .filter(thread => thread.style.display !== 'none');
        
    const activeCategory = document.querySelector('.forum-categories a.active').textContent.split(' ')[0];
    const countDisplay = `Showing ${visibleThreads.length} discussions ${activeCategory !== 'All' ? `in ${activeCategory}` : ''}`;
    
    // If results count element doesn't exist, create it
    let resultsCount = document.querySelector('.results-count');
    if (!resultsCount) {
        resultsCount = document.createElement('div');
        resultsCount.className = 'results-count';
        const forumActions = document.querySelector('.forum-actions');
        forumActions.after(resultsCount);
    }
    
    resultsCount.textContent = countDisplay;
}

/**
 * Get all thread elements
 */
function getAllThreads() {
    return Array.from(document.querySelectorAll('.thread-item'));
}

/**
 * Mark random threads as read for demo purposes
 */
function markRandomThreadsAsRead() {
    const threads = getAllThreads();
    
    // Mark about half the threads as read
    threads.forEach((thread, index) => {
        if (index % 2 === 0) {
            thread.classList.add('thread-read');
        }
    });
}

/**
 * Add CSS styles for forum functionality
 */
(function addForumStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Forum-specific styles */
        .thread-read h3 a {
            color: var(--text-muted);
        }
        
        .no-results-message {
            text-align: center;
            padding: 40px 0;
            color: var(--text-muted);
        }
        
        .no-results-message i {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.6;
        }
        
        .results-count {
            margin: 10px 0;
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        
        mark {
            background-color: rgba(var(--primary-rgb), 0.2);
            padding: 0 3px;
            border-radius: 3px;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--bg-secondary);
            border-left: 4px solid var(--primary);
            border-radius: 4px;
            padding: 16px 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
        }
        
        .notification-content i {
            color: var(--primary);
            margin-right: 12px;
            font-size: 1.2rem;
        }
        
        .close-notification {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            margin-left: 16px;
            padding: 0;
        }
        
        .form-error {
            background-color: rgba(255, 87, 87, 0.1);
            border-left: 3px solid #ff5757;
            padding: 12px 16px;
            margin-bottom: 16px;
            border-radius: 4px;
            color: #ff5757;
        }
        
        /* Modal appearing animation */
        .forum-modal {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .forum-modal.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
})(); 
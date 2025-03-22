/**
 * Future Academy - Study Materials Page JavaScript
 * Handles filtering, sorting, and search functionality for study materials
 */

document.addEventListener('DOMContentLoaded', () => {
    initMaterialsFilter();
    initPagination();
    initSaveButtons();
    manageMaterialStorage();
});

/**
 * Materials Filter Functionality
 * Handles search, filtering, and sorting of materials
 */
function initMaterialsFilter() {
    // Get DOM elements
    const materialsContainer = document.getElementById('materials-container');
    const searchInput = document.getElementById('materials-search');
    const searchBtn = document.getElementById('search-btn');
    const subjectFilter = document.getElementById('subject-filter');
    const typeFilter = document.getElementById('type-filter');
    const levelFilter = document.getElementById('level-filter');
    const sortBy = document.getElementById('sort-by');
    const resetBtn = document.getElementById('reset-filters');
    const resultsCount = document.getElementById('results-count');
    
    // Get all material cards
    const allMaterials = Array.from(document.querySelectorAll('.material-card'));
    
    // Event listeners
    searchBtn.addEventListener('click', filterMaterials);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            filterMaterials();
        }
    });
    
    subjectFilter.addEventListener('change', filterMaterials);
    typeFilter.addEventListener('change', filterMaterials);
    levelFilter.addEventListener('change', filterMaterials);
    sortBy.addEventListener('change', filterMaterials);
    
    resetBtn.addEventListener('click', resetFilters);
    
    // Main filter function
    function filterMaterials() {
        const searchValue = searchInput.value.toLowerCase().trim();
        const subjectValue = subjectFilter.value;
        const typeValue = typeFilter.value;
        const levelValue = levelFilter.value;
        
        // Filter materials
        let filteredMaterials = allMaterials.filter(card => {
            // Get card data
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const subject = card.getAttribute('data-subject');
            const type = card.getAttribute('data-type');
            const level = card.getAttribute('data-level');
            
            // Check if card matches all filter criteria
            const matchesSearch = !searchValue || 
                title.includes(searchValue) || 
                description.includes(searchValue);
                
            const matchesSubject = subjectValue === 'all' || subject === subjectValue;
            const matchesType = typeValue === 'all' || type === typeValue;
            const matchesLevel = levelValue === 'all' || level === levelValue;
            
            return matchesSearch && matchesSubject && matchesType && matchesLevel;
        });
        
        // Sort materials
        sortMaterials(filteredMaterials);
        
        // Update results count
        resultsCount.textContent = filteredMaterials.length;
        
        // Show or hide cards based on filter results
        allMaterials.forEach(card => {
            card.style.display = 'none';
        });
        
        filteredMaterials.forEach(card => {
            card.style.display = 'flex';
        });
        
        // Reset pagination to page 1
        updatePagination(1);
    }
    
    // Sort materials based on selected option
    function sortMaterials(materials) {
        const sortValue = sortBy.value;
        
        materials.sort((a, b) => {
            const titleA = a.querySelector('h3').textContent;
            const titleB = b.querySelector('h3').textContent;
            
            switch (sortValue) {
                case 'a-z':
                    return titleA.localeCompare(titleB);
                case 'z-a':
                    return titleB.localeCompare(titleA);
                case 'newest':
                    // This is just a simulation - would use real date data in production
                    return -1; // Default to newest first
                case 'oldest':
                    // This is just a simulation - would use real date data in production
                    return 1; // Default to oldest first
                default:
                    return 0;
            }
        });
        
        // Reappend cards in sorted order
        materials.forEach(card => {
            materialsContainer.appendChild(card);
        });
    }
    
    // Reset all filters to default
    function resetFilters() {
        searchInput.value = '';
        subjectFilter.value = 'all';
        typeFilter.value = 'all';
        levelFilter.value = 'all';
        sortBy.value = 'newest';
        
        filterMaterials();
    }
}

/**
 * Pagination Functionality
 * Handles the pagination for study materials
 */
function initPagination() {
    const materialsPerPage = 9; // Number of materials to show per page
    const prevPageBtn = document.querySelector('.prev-page');
    const nextPageBtn = document.querySelector('.next-page');
    const pageNumbers = document.querySelectorAll('.page-number');
    
    let currentPage = 1;
    
    // Event listeners
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            updatePagination(currentPage - 1);
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        const totalPages = pageNumbers.length;
        if (currentPage < totalPages) {
            updatePagination(currentPage + 1);
        }
    });
    
    pageNumbers.forEach(btn => {
        btn.addEventListener('click', () => {
            updatePagination(parseInt(btn.textContent));
        });
    });
    
    // Update pagination and visible materials
    function updatePagination(pageNum) {
        currentPage = pageNum;
        
        // Update active page button
        pageNumbers.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === currentPage) {
                btn.classList.add('active');
            }
        });
        
        // Enable/disable prev and next buttons
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === pageNumbers.length;
        
        // Show materials for current page
        showMaterialsForPage(currentPage);
    }
    
    // Show materials for the selected page
    function showMaterialsForPage(pageNum) {
        const visibleMaterials = Array.from(document.querySelectorAll('.material-card[style*="display: flex"]'));
        
        const startIndex = (pageNum - 1) * materialsPerPage;
        const endIndex = startIndex + materialsPerPage;
        
        visibleMaterials.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Scroll to top of materials section
        document.querySelector('.materials-content').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Expose the updatePagination function to be used by the filter
    window.updatePagination = updatePagination;
    
    // Initialize with page 1
    updatePagination(1);
}

/**
 * Save Buttons Functionality
 * Allows users to save materials for later viewing
 */
function initSaveButtons() {
    const saveButtons = document.querySelectorAll('.save-btn');
    
    saveButtons.forEach(btn => {
        const materialId = btn.getAttribute('data-id');
        
        // Check if already saved
        if (isItemSaved(materialId)) {
            markAsSaved(btn);
        }
        
        btn.addEventListener('click', () => {
            toggleSavedStatus(btn, materialId);
        });
    });
    
    function toggleSavedStatus(btn, id) {
        const savedMaterials = getSavedMaterials();
        
        if (savedMaterials.includes(id)) {
            // Remove from saved
            const index = savedMaterials.indexOf(id);
            savedMaterials.splice(index, 1);
            btn.classList.remove('saved');
            btn.setAttribute('title', 'Save for later');
            btn.querySelector('.save-icon').textContent = '🔖';
            
            // Show removed notification
            showNotification('Material removed from saved items.');
        } else {
            // Add to saved
            savedMaterials.push(id);
            markAsSaved(btn);
            
            // Show saved notification
            showNotification('Material saved for later viewing!');
        }
        
        // Save to localStorage
        localStorage.setItem('savedMaterials', JSON.stringify(savedMaterials));
    }
    
    function markAsSaved(btn) {
        btn.classList.add('saved');
        btn.setAttribute('title', 'Remove from saved');
        btn.querySelector('.save-icon').textContent = '✓';
    }
    
    function isItemSaved(id) {
        const savedMaterials = getSavedMaterials();
        return savedMaterials.includes(id);
    }
    
    function getSavedMaterials() {
        return JSON.parse(localStorage.getItem('savedMaterials') || '[]');
    }
    
    function showNotification(message) {
        // Create notification element if it doesn't exist
        if (!document.querySelector('.notification')) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        const notification = document.querySelector('.notification');
        notification.textContent = message;
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--primary-color);
                color: white;
                padding: 12px 20px;
                border-radius: var(--radius-md);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s, transform 0.3s;
                z-index: 1000;
            }
            
            .notification.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .dark-mode .notification {
                background-color: #5271f2;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 15px rgba(108, 142, 255, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Recent Materials Management
 * Tracks recently viewed materials using localStorage
 */
function manageMaterialStorage() {
    // Track material views (would be implemented for real links)
    const materialLinks = document.querySelectorAll('.download-btn, .watch-btn, .view-btn, .practice-btn');
    
    materialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // In a real app, we would not prevent default but update in background
            // e.preventDefault();
            
            // Get the material card and its data
            const card = link.closest('.material-card');
            const materialId = card.querySelector('.save-btn').getAttribute('data-id');
            const materialTitle = card.querySelector('h3').textContent;
            const materialType = card.getAttribute('data-type');
            
            // Save as recently viewed
            addToRecentlyViewed(materialId, materialTitle, materialType);
        });
    });
    
    function addToRecentlyViewed(id, title, type) {
        // Get existing recently viewed items
        const recentItems = JSON.parse(localStorage.getItem('recentMaterials') || '[]');
        
        // Create new item with timestamp
        const newItem = {
            id,
            title,
            type,
            timestamp: Date.now()
        };
        
        // Remove if already in list
        const existingIndex = recentItems.findIndex(item => item.id === id);
        if (existingIndex !== -1) {
            recentItems.splice(existingIndex, 1);
        }
        
        // Add to beginning of array
        recentItems.unshift(newItem);
        
        // Keep only the most recent 10 items
        const limitedItems = recentItems.slice(0, 10);
        
        // Save back to localStorage
        localStorage.setItem('recentMaterials', JSON.stringify(limitedItems));
    }
} 
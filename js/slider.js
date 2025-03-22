document.addEventListener('DOMContentLoaded', () => {
    const slider = {
        container: document.querySelector('.slider'),
        slides: document.querySelectorAll('.slide'),
        bullets: document.querySelectorAll('.bullet'),
        prevBtn: document.querySelector('.slider-nav.prev'),
        nextBtn: document.querySelector('.slider-nav.next'),
        
        currentIndex: 0,
        slideInterval: null,
        intervalDuration: 3000,
        isAnimating: false,

        init() {
            // Set initial state
            this.slides.forEach((slide, index) => {
                if (index === this.currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Set up event listeners
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Add click events to bullets
            this.bullets.forEach((bullet, index) => {
                bullet.addEventListener('click', () => this.goToSlide(index));
            });

            // Start auto-sliding
            this.startAutoSlide();

            // Pause auto-slide on hover
            this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.container.addEventListener('mouseleave', () => this.startAutoSlide());

            // Handle touch events for mobile
            let touchStartX = 0;
            let touchEndX = 0;

            this.container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, false);

            this.container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            }, false);
        },

        handleSwipe(startX, endX) {
            const swipeThreshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextSlide(); // Swipe left
                } else {
                    this.prevSlide(); // Swipe right
                }
            }
        },

        startAutoSlide() {
            if (this.slideInterval) return;
            this.slideInterval = setInterval(() => this.nextSlide(), this.intervalDuration);
        },

        stopAutoSlide() {
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
                this.slideInterval = null;
            }
        },

        updateSlides() {
            if (this.isAnimating) return;
            this.isAnimating = true;

            // Update slides
            this.slides.forEach((slide, index) => {
                if (index === this.currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Update bullets
            this.bullets.forEach((bullet, index) => {
                if (index === this.currentIndex) {
                    bullet.classList.add('active');
                    // Reset and restart progress animation
                    const progress = bullet.querySelector('.progress');
                    progress.style.animation = 'none';
                    progress.offsetHeight; // Trigger reflow
                    progress.style.animation = 'bulletProgress 3s linear forwards';
                } else {
                    bullet.classList.remove('active');
                }
            });

            // Reset animation flag after transition
            setTimeout(() => {
                this.isAnimating = false;
            }, 500);
        },

        nextSlide() {
            if (this.isAnimating) return;
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
            this.updateSlides();
        },

        prevSlide() {
            if (this.isAnimating) return;
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            this.updateSlides();
        },

        goToSlide(index) {
            if (this.isAnimating || index === this.currentIndex) return;
            this.currentIndex = index;
            this.updateSlides();
            // Reset timer when manually changing slides
            this.stopAutoSlide();
            this.startAutoSlide();
        }
    };

    // Initialize the slider
    slider.init();
}); 
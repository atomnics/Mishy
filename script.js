/**
 * Tanzania Prime Origins
 * Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initForm();
    initScrollAnimations();
});

/**
 * Carousel Functionality
 */
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.product-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.carousel-dot');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    let isAnimating = false;

    // Calculate how many cards are visible
    const getVisibleCards = () => {
        const containerWidth = track.parentElement.offsetWidth;
        const cardWidth = cards[0].offsetWidth + 32; // card width + gap
        return Math.max(1, Math.floor(containerWidth / cardWidth));
    };

    // Calculate max index based on visible cards
    const getMaxIndex = () => {
        const visibleCards = getVisibleCards();
        return Math.max(0, cards.length - visibleCards);
    };

    // Update carousel position
    const updateCarousel = (smooth = true) => {
        if (isAnimating && smooth) return;

        const cardWidth = cards[0].offsetWidth + 32;
        const translateX = -currentIndex * cardWidth;

        isAnimating = smooth;
        track.style.transition = smooth ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        track.style.transform = `translateX(${translateX}px)`;

        if (smooth) {
            setTimeout(() => {
                isAnimating = false;
            }, 600);
        }

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Update arrow states
        if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        if (nextBtn) nextBtn.style.opacity = currentIndex >= getMaxIndex() ? '0.3' : '1';
    };

    // Navigation handlers
    const goToNext = () => {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    };

    const goToPrev = () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    };

    const goToIndex = (index) => {
        const maxIndex = getMaxIndex();
        currentIndex = Math.min(Math.max(0, index), maxIndex);
        updateCarousel();
    };

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', goToNext);
    if (prevBtn) prevBtn.addEventListener('click', goToPrev);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToIndex(index));
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isDragging = true;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        touchEndX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;

        const difference = touchStartX - touchEndX;
        const threshold = 50;

        if (Math.abs(difference) > threshold) {
            if (difference > 0) {
                goToNext();
            } else {
                goToPrev();
            }
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToPrev();
        if (e.key === 'ArrowRight') goToNext();
    });

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const maxIndex = getMaxIndex();
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            updateCarousel(false);
        }, 100);
    });

    // Initial update
    updateCarousel(false);
}

/**
 * Form Handling
 */
function initForm() {
    const form = document.getElementById('inquiryForm');
    const successMessage = document.getElementById('formSuccess');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate
        const fullName = form.querySelector('#fullName').value.trim();
        const company = form.querySelector('#company').value.trim();

        if (!fullName || !company) return;

        // Simulate form submission
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing...</span>';

        setTimeout(() => {
            form.style.display = 'none';
            successMessage.classList.add('show');
        }, 1200);
    });

    // Input focus effects
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes
    const animateElements = document.querySelectorAll(
        '.vetting-item, .product-card, .portal-form'
    );

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // CSS for animated state
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

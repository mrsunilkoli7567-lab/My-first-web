// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initHeroAnimations();
    initMenuTabs();
    initReviewsSlider();
    initModal();
    initForms();
    initScrollEffects();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');

    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                let targetElement = document.getElementById(targetId);
                
                // Handle special case for "Book a Table" button that should go to booking section
                if (link.classList.contains('nav__cta') || targetId === 'booking') {
                    targetElement = document.getElementById('contact');
                }
                
                if (targetElement) {
                    const headerHeight = header ? header.offsetHeight : 70;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Sticky header effect
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        });
    }
}

// Hero animations
function initHeroAnimations() {
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        // Add entrance animation
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // Hero CTA button smooth scroll
    const heroCta = document.querySelector('.hero__cta');
    if (heroCta) {
        heroCta.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.getElementById('contact');
            if (targetElement) {
                const headerHeight = document.getElementById('header')?.offsetHeight || 70;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Menu tabs functionality
function initMenuTabs() {
    const menuTabs = document.querySelectorAll('.menu__tab');
    const menuCategories = document.querySelectorAll('.menu__category');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');

            // Remove active class from all tabs and categories
            menuTabs.forEach(t => t.classList.remove('active'));
            menuCategories.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding category
            this.classList.add('active');
            const targetElement = document.getElementById(targetCategory);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });
}

// Reviews slider functionality
function initReviewsSlider() {
    const reviewCards = document.querySelectorAll('.review-card');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    const dotsContainer = document.getElementById('review-dots');
    
    let currentReview = 0;
    let autoSlideInterval;

    // Create dots
    if (dotsContainer && reviewCards.length > 0) {
        reviewCards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('reviews__dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToReview(index));
            dotsContainer.appendChild(dot);
        });
    }

    const dots = document.querySelectorAll('.reviews__dot');

    function showReview(index) {
        reviewCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (reviewCards[index]) {
            reviewCards[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentReview = index;
    }

    function nextReview() {
        const next = (currentReview + 1) % reviewCards.length;
        showReview(next);
    }

    function prevReview() {
        const prev = (currentReview - 1 + reviewCards.length) % reviewCards.length;
        showReview(prev);
    }

    function goToReview(index) {
        showReview(index);
        resetAutoSlide();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextReview, 4000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextReview();
            resetAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevReview();
            resetAutoSlide();
        });
    }

    // Start auto-slide
    if (reviewCards.length > 1) {
        startAutoSlide();
    }

    // Pause auto-slide on hover
    const reviewsSlider = document.querySelector('.reviews__slider');
    if (reviewsSlider) {
        reviewsSlider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        reviewsSlider.addEventListener('mouseleave', startAutoSlide);
    }
}

// Modal functionality
function initModal() {
    const modal = document.getElementById('review-modal');
    const openModalBtn = document.getElementById('write-review-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const reviewForm = document.getElementById('review-form');
    const ratingStars = document.querySelectorAll('.rating-input i');

    let selectedRating = 0;

    // Open modal
    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (reviewForm) {
                reviewForm.reset();
            }
            selectedRating = 0;
            ratingStars.forEach(star => star.classList.remove('active'));
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Rating stars functionality
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', function() {
            selectedRating = index + 1;
            ratingStars.forEach((s, i) => {
                if (i < selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });

        star.addEventListener('mouseenter', function() {
            ratingStars.forEach((s, i) => {
                if (i <= index) {
                    s.style.color = '#FFD700';
                } else {
                    s.style.color = '#E0E0E0';
                }
            });
        });
    });

    // Reset star colors on mouse leave
    const ratingContainer = document.querySelector('.rating-input');
    if (ratingContainer) {
        ratingContainer.addEventListener('mouseleave', function() {
            ratingStars.forEach((s, i) => {
                if (i < selectedRating) {
                    s.style.color = '#FFD700';
                } else {
                    s.style.color = '#E0E0E0';
                }
            });
        });
    }

    // Handle review form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const reviewData = {
                name: formData.get('reviewName'),
                rating: selectedRating,
                text: formData.get('reviewText')
            };

            console.log('Review submitted:', reviewData);
            
            // Show success message (you can replace this with actual API call)
            alert('Thank you for your review! It will be published after approval.');
            closeModal();
        });
    }
}

// Forms functionality
function initForms() {
    const bookingForm = document.getElementById('booking-form');

    if (bookingForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }

        // Form validation and submission
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const bookingData = {
                fullName: formData.get('fullName'),
                phoneNumber: formData.get('phoneNumber'),
                date: formData.get('date'),
                time: formData.get('time'),
                bookingFor: formData.get('bookingFor')
            };

            // Validate required fields
            const requiredFields = ['fullName', 'phoneNumber', 'date', 'time', 'bookingFor'];
            const missingFields = requiredFields.filter(field => !bookingData[field]);

            if (missingFields.length > 0) {
                alert('Please fill in all required fields: ' + missingFields.join(', '));
                return;
            }

            // Validate phone number (basic validation)
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(bookingData.phoneNumber.replace(/\D/g, '').slice(-10))) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }

            // Validate date (not in the past)
            const selectedDate = new Date(bookingData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                alert('Please select a future date for your booking.');
                return;
            }

            console.log('Booking submitted:', bookingData);
            
            // Show success message (you can replace this with actual API call)
            alert('Your booking request has been submitted! We will contact you shortly to confirm your reservation.');
            
            // Reset form
            this.reset();
        });

        // Phone number formatting
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                // Remove all non-digits
                let value = e.target.value.replace(/\D/g, '');
                
                // Limit to 10 digits
                if (value.length > 10) {
                    value = value.slice(0, 10);
                }
                
                // Format as phone number
                if (value.length >= 6) {
                    value = value.slice(0, 5) + '-' + value.slice(5);
                }
                
                e.target.value = value;
            });
        }
    }
}

// Scroll effects
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.feature-card, .menu-item, .contact-item, .section-header'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        const headerHeight = document.getElementById('header')?.offsetHeight || 70;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Throttled scroll event
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                highlightNavigation();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Performance optimization
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

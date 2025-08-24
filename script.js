// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

// Initialize all app functionality
function initializeApp() {
    try {
        initNavigation();
        initScrollEffects();
        initMenuFunctionality();
        initBookingForm();
        initContactForm();
        initWhatsAppIntegration();
        initReviewsSlider();
        initGalleryFilter();
        initModal();
        initIntersectionObserver();
        console.log('All components initialized successfully');
    } catch (e) {
        console.error('Initialization error:', e);
    }
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Navigation link handling
    navLinks.forEach((link) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects
function initScrollEffects() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function() {
        // Navbar background on scroll
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active navigation link
        updateActiveNavLink();
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const navbarHeight = document.querySelector('.navbar').offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// Menu functionality
function initMenuFunctionality() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    const menuSearch = document.getElementById('menu-search');

    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide categories
            menuCategories.forEach(cat => {
                if (category === 'all') {
                    cat.style.display = 'block';
                } else {
                    const catCategory = cat.getAttribute('data-category');
                    cat.style.display = catCategory === category ? 'block' : 'none';
                }
            });
        });
    });

    // Menu search functionality
    if (menuSearch) {
        menuSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                const itemName = item.querySelector('h4').textContent.toLowerCase();
                const itemDetails = item.querySelector('.menu-details');
                const detailsText = itemDetails ? itemDetails.textContent.toLowerCase() : '';
                
                if (itemName.includes(searchTerm) || detailsText.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// Booking form functionality
function initBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    const dateInput = document.getElementById('date');
    
    // Set minimum date to today
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const bookingData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                date: formData.get('date'),
                time: formData.get('time'),
                bookingType: formData.get('booking-type'),
                guests: formData.get('guests'),
                message: formData.get('message')
            };
            
            // Validate form
            if (validateBookingForm(bookingData)) {
                // Show success modal
                showModal('booking-modal');
                
                // Reset form
                this.reset();
                
                // Send WhatsApp message (optional)
                sendWhatsAppBooking(bookingData);
            }
        });
    }
}

// Validate booking form
function validateBookingForm(data) {
    if (!data.name || data.name.trim().length < 2) {
        alert('Please enter a valid name');
        return false;
    }
    
    if (!data.phone || data.phone.length < 10) {
        alert('Please enter a valid phone number');
        return false;
    }
    
    if (!data.date) {
        alert('Please select a date');
        return false;
    }
    
    if (!data.time) {
        alert('Please select a time');
        return false;
    }
    
    if (!data.bookingType) {
        alert('Please select a booking type');
        return false;
    }
    
    if (!data.guests || data.guests < 1) {
        alert('Please enter number of guests');
        return false;
    }
    
    return true;
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const contactData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
            };
            
            // Validate form
            if (validateContactForm(contactData)) {
                // Show success modal
                showModal('contact-modal');
                
                // Reset form
                this.reset();
            }
        });
    }
}

// Validate contact form
function validateContactForm(data) {
    if (!data.name || data.name.trim().length < 2) {
        alert('Please enter a valid name');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    if (!data.message || data.message.trim().length < 10) {
        alert('Please enter a message (minimum 10 characters)');
        return false;
    }
    
    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// WhatsApp integration
function initWhatsAppIntegration() {
    const whatsappBtn = document.getElementById('whatsapp-btn');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            const message = "Hello! I'd like to make a reservation at Moments Cafe & Lounge Restaurant. Please help me with booking details.";
            const phoneNumber = "918112291143";
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
}

// Send WhatsApp booking message
function sendWhatsAppBooking(bookingData) {
    const message = `Booking Request:
Name: ${bookingData.name}
Phone: ${bookingData.phone}
Date: ${bookingData.date}
Time: ${bookingData.time}
Type: ${bookingData.bookingType}
Guests: ${bookingData.guests}
Special Requests: ${bookingData.message || 'None'}`;
    
    const phoneNumber = "918112291143";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Optional: Open WhatsApp automatically
    setTimeout(() => {
        if (confirm('Would you like to send this booking request via WhatsApp?')) {
            window.open(whatsappUrl, '_blank');
        }
    }, 2000);
}

// Reviews slider functionality
function initReviewsSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.review-slide');
    const totalSlides = slides.length;
    
    // Auto-play slider
    setInterval(() => {
        changeSlide(1);
    }, 5000);
    
    // Change slide function (global scope for button access)
    window.changeSlide = function(direction) {
        slides[currentSlide].classList.remove('active');
        
        currentSlide += direction;
        
        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        } else if (currentSlide < 0) {
            currentSlide = totalSlides - 1;
        }
        
        slides[currentSlide].classList.add('active');
    };
}

// Gallery filter functionality
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filter === 'all' || itemCategory === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Gallery item click functionality (lightbox effect)
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('.gallery-overlay h4').textContent;
            
            // Create lightbox modal
            createLightbox(img.src, title);
        });
    });
}

// Create lightbox modal
function createLightbox(imageSrc, title) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${imageSrc}" alt="${title}">
            <h4>${title}</h4>
        </div>
    `;
    
    // Add styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        backdrop-filter: blur(10px);
    `;
    
    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        text-align: center;
        position: relative;
    `;
    
    const img = lightbox.querySelector('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 10px;
    `;
    
    const close = lightbox.querySelector('.lightbox-close');
    close.style.cssText = `
        position: absolute;
        top: -40px;
        right: -40px;
        color: white;
        font-size: 30px;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const h4 = lightbox.querySelector('h4');
    h4.style.cssText = `
        color: white;
        margin-top: 20px;
        font-size: 1.5rem;
    `;
    
    document.body.appendChild(lightbox);
    
    // Close functionality
    close.addEventListener('click', () => {
        document.body.removeChild(lightbox);
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            document.body.removeChild(lightbox);
        }
    });
}

// Modal functionality
function initModal() {
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close');
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Show modal function
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Intersection Observer for animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animation
    const elementsToObserve = document.querySelectorAll('.menu-item, .feature-item, .gallery-item, .contact-item');
    elementsToObserve.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top';
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top
setTimeout(initScrollToTop, 1000);

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

// Performance optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
}

// Initialize optimizations after page load
window.addEventListener('load', () => {
    optimizeImages();
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Console welcome message
console.log(`
🍽️ Welcome to Moments Cafe & Lounge Restaurant Website
📧 Contact: 8112291143
🏢 Location: Near V Mart Dadabadi, Kota
⏰ Open from 8 AM daily

Website developed with modern web technologies.
`);

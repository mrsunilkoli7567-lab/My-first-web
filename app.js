// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const bookingForm = document.getElementById('bookingForm');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth Scrolling Function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Add click event listeners to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const sectionId = href.substring(1); // Remove the '#' from href
        scrollToSection(sectionId);
    });
});

// Header Background Change on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(18, 18, 18, 0.98)';
    } else {
        header.style.background = 'rgba(18, 18, 18, 0.95)';
    }
});

// Set minimum date for booking form (today)
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        dateInput.min = todayString;
    }
});

// WhatsApp Booking Form Handling
if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const date = document.getElementById('date').value;
        const guests = document.getElementById('guests').value;
        const bookingType = document.getElementById('bookingType').value;

        if (!fullName || !phoneNumber || !date || !guests || !bookingType) {
            alert('Please fill out all fields.');
            return;
        }

        // Format WhatsApp message
        const message = `Hello Moments Cafe! I would like to make a booking.%0A%0AName: ${encodeURIComponent(fullName)}%0APhone: ${encodeURIComponent(phoneNumber)}%0ADate: ${encodeURIComponent(date)}%0AGuests: ${encodeURIComponent(guests)}%0ABooking Type: ${encodeURIComponent(bookingType)}`;

        // WhatsApp URL
        const whatsappURL = `https://wa.me/918112291143?text=${message}`;

        // Redirect to WhatsApp
        window.open(whatsappURL, '_blank');
    });
}

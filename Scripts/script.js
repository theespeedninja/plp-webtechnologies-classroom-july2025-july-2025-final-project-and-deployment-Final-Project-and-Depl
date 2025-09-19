// ===== CAR SHOP KENYA - MAIN JAVASCRIPT ===== //

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize only used functionality
    initNavigation();
    initSmoothScrolling();
    setActiveNavLink();
    console.log('Car Shop Kenya website initialized successfully! 🚗');
});

// ===== NAVIGATION FUNCTIONALITY ===== //
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    if (hamburger && navLinks) {
        // Toggle mobile menu
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close menu when clicking nav items
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// ===== SMOOTH SCROLLING ===== //
function initSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !document.querySelector(href)) return;
            e.preventDefault();
            const headerOffset = 80; // Account for fixed header
            const target = document.querySelector(href);
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ===== CAR FILTERING FUNCTIONALITY ===== //
function initCarFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cars = document.querySelectorAll('.car-item');
    const searchInput = document.getElementById('carSearch');
    const priceRange = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('priceDisplay');
    
    // Filter by category
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide cars
            cars.forEach(car => {
                if (filter === 'all' || car.classList.contains(filter)) {
                    car.style.display = 'block';
                    car.classList.add('fade-in');
                } else {
                    car.style.display = 'none';
                }
            });
        });
    });
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            cars.forEach(car => {
                const carName = car.querySelector('h3').textContent.toLowerCase();
                const carDescription = car.querySelector('p').textContent.toLowerCase();
                
                if (carName.includes(searchTerm) || carDescription.includes(searchTerm)) {
                    car.style.display = 'block';
                } else {
                    car.style.display = 'none';
                }
            });
        });
    }
    
    // Price range filter
    if (priceRange && priceDisplay) {
        priceRange.addEventListener('input', function() {
            const maxPrice = parseInt(this.value);
            priceDisplay.textContent = `KSh ${maxPrice.toLocaleString()}`;
            
            cars.forEach(car => {
                const priceElement = car.querySelector('.price');
                if (priceElement) {
                    const carPrice = parseInt(priceElement.textContent.replace(/[^\d]/g, ''));
                    
                    if (carPrice <= maxPrice) {
                        car.style.display = 'block';
                    } else {
                        car.style.display = 'none';
                    }
                }
            });
        });
        
        // Initialize price display
        const initialPrice = parseInt(priceRange.value);
        priceDisplay.textContent = `KSh ${initialPrice.toLocaleString()}`;
    }
}

// ===== IMAGE GALLERY/LIGHTBOX ===== //
function initImageGallery() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
    });
}

function openLightbox(src, alt) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="${alt}" class="lightbox-image">
            <button class="lightbox-close">&times;</button>
        </div>
    `;
    
    // Add styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
    `;
    
    const img = lightbox.querySelector('.lightbox-image');
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 5px;
    `;
    
    // Add to DOM and show
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Fade in
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
    
    // Close functionality
    const closeLightbox = () => {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = 'auto';
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

// ===== SCROLL ANIMATIONS ===== //
function initAnimations() {
    // Intersection Observer for scroll animations
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
    document.querySelectorAll('.card, .car-item, .service-item').forEach(el => {
        el.classList.add('animate-me');
        observer.observe(el);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-me {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .lightbox-overlay {
            animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ===== SET ACTIVE NAVIGATION LINK ===== //
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===== BACK TO TOP BUTTON ===== //
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== TESTIMONIAL SLIDER ===== //
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentSlide = 0;
    
    if (slider && slides.length > 0) {
        // Show first slide
        showSlide(currentSlide);
        
        // Auto-slide every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
        
        // Manual navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
                showSlide(currentSlide);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            });
        }
    }
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
            slide.classList.toggle('active', i === index);
        });
    }
}

// ===== LOADING ANIMATION ===== //
function initLoadingAnimation() {
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
        
        // Trigger entrance animations
        document.body.classList.add('loaded');
    });
}

// ===== UTILITY FUNCTIONS ===== //

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0
    }).format(amount);
}

// Debounce function for search
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

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initBackToTop();
    initTestimonialSlider();
    initLoadingAnimation();
});

// Export functions for use in other files
window.CarShopKenya = {
    formatCurrency,
    showNotification,
    debounce
};
// ===== FORM VALIDATION & HANDLING ===== //

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initNewsletterForm();
    initLoanCalculator();
});

// ===== CONTACT FORM VALIDATION ===== //
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                submitContactForm();
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearErrors(input));
        });
    }
}

function validateContactForm() {
    const form = document.getElementById('contactForm');
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const interest = form.querySelector('#interest');
    const message = form.querySelector('#message');
    
    let isValid = true;
    
    // Name validation
    if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError(name, 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation (Kenya format)
    const phoneRegex = /^(\+254|0)[17]\d{8}$/;
    if (!phone.value.trim()) {
        showError(phone, 'Phone number is required');
        isValid = false;
    } else if (!phoneRegex.test(phone.value.replace(/\s/g, ''))) {
        showError(phone, 'Please enter a valid Kenyan phone number');
        isValid = false;
    }
    
    // Interest validation
    if (!interest.value) {
        showError(interest, 'Please select your interest');
        isValid = false;
    }
    
    // Message validation
    if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.id;
    
    clearErrors(field);
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                showError(field, 'Name is required');
                return false;
            } else if (value.length < 2) {
                showError(field, 'Name must be at least 2 characters');
                return false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                showError(field, 'Email is required');
                return false;
            } else if (!emailRegex.test(value)) {
                showError(field, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'phone':
            const phoneRegex = /^(\+254|0)[17]\d{8}$/;
            if (!value) {
                showError(field, 'Phone number is required');
                return false;
            } else if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                showError(field, 'Please enter a valid Kenyan phone number');
                return false;
            }
            break;
            
        case 'message':
            if (!value) {
                showError(field, 'Message is required');
                return false;
            } else if (value.length < 10) {
                showError(field, 'Message must be at least 10 characters');
                return false;
            }
            break;
    }
    
    showSuccess(field);
    return true;
}

function submitContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        window.CarShopKenya.showNotification('Thank you! Your message has been sent successfully.', 'success');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Clear all validation states
        form.querySelectorAll('.error, .success').forEach(el => {
            el.remove();
        });
        
    }, 2000);
}

// ===== NEWSLETTER FORM ===== //
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                return;
            }
            
            if (!emailRegex.test(email.value)) {
                showError(email, 'Please enter a valid email address');
                return;
            }
            
            // Submit newsletter signup
            submitNewsletterForm(email.value);
        });
    }
}

function submitNewsletterForm(email) {
    const form = document.getElementById('newsletterForm');
    const submitBtn = form.querySelector('button');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing...';
    
    // Simulate API call
    setTimeout(() => {
        form.reset();
        window.CarShopKenya.showNotification('Successfully subscribed to our newsletter!', 'success');
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Clear errors
        form.querySelectorAll('.error').forEach(el => el.remove());
    }, 1500);
}

// ===== LOAN CALCULATOR ===== //
function initLoanCalculator() {
    const calculator = document.getElementById('loanCalculator');
    
    if (calculator) {
        const carPrice = calculator.querySelector('#carPrice');
        const downPayment = calculator.querySelector('#downPayment');
        const loanTerm = calculator.querySelector('#loanTerm');
        const interestRate = calculator.querySelector('#interestRate');
        const calculateBtn = calculator.querySelector('#calculateLoan');
        const result = calculator.querySelector('#loanResult');
        
        calculateBtn.addEventListener('click', function() {
            calculateLoan(carPrice.value, downPayment.value, loanTerm.value, interestRate.value, result);
        });
        
        // Real-time calculation
        [carPrice, downPayment, loanTerm, interestRate].forEach(input => {
            input.addEventListener('input', () => {
                if (carPrice.value && downPayment.value && loanTerm.value && interestRate.value) {
                    calculateLoan(carPrice.value, downPayment.value, loanTerm.value, interestRate.value, result);
                }
            });
        });
    }
}

function calculateLoan(price, down, term, rate, resultElement) {
    const principal = parseFloat(price) - parseFloat(down);
    const monthlyRate = parseFloat(rate) / 100 / 12;
    const numPayments = parseFloat(term) * 12;
    
    if (principal <= 0) {
        resultElement.innerHTML = '<p class="error">Down payment cannot be greater than car price.</p>';
        return;
    }
    
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;
    
    resultElement.innerHTML = `
        <div class="loan-results">
            <h4>Loan Summary</h4>
            <div class="result-grid">
                <div class="result-item">
                    <span class="label">Monthly Payment:</span>
                    <span class="value">${window.CarShopKenya.formatCurrency(monthlyPayment)}</span>
                </div>
                <div class="result-item">
                    <span class="label">Total Payment:</span>
                    <span class="value">${window.CarShopKenya.formatCurrency(totalPayment)}</span>
                </div>
                <div class="result-item">
                    <span class="label">Total Interest:</span>
                    <span class="value">${window.CarShopKenya.formatCurrency(totalInterest)}</span>
                </div>
                <div class="result-item">
                    <span class="label">Loan Amount:</span>
                    <span class="value">${window.CarShopKenya.formatCurrency(principal)}</span>
                </div>
            </div>
        </div>
    `;
    
    // Add CSS for loan results
    if (!document.querySelector('#loanResultsCSS')) {
        const style = document.createElement('style');
        style.id = 'loanResultsCSS';
        style.textContent = `
            .loan-results {
                background: #f8f9fa;
                padding: 1.5rem;
                border-radius: 10px;
                border-left: 4px solid #667eea;
                margin-top: 1rem;
            }
            .result-grid {
                display: grid;
                gap: 0.5rem;
                margin-top: 1rem;
            }
            .result-item {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid #dee2e6;
            }
            .result-item:last-child {
                border-bottom: none;
                font-weight: bold;
                color: #667eea;
            }
            .result-item .label {
                color: #666;
            }
            .result-item .value {
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== UTILITY FUNCTIONS ===== //
function showError(field, message) {
    clearErrors(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    field.style.borderColor = '#e74c3c';
    field.parentNode.appendChild(errorDiv);
}

function showSuccess(field) {
    clearErrors(field);
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = '✓ Looks good!';
    
    field.style.borderColor = '#27ae60';
    field.parentNode.appendChild(successDiv);
}

function clearErrors(field) {
    const parent = field.parentNode;
    const existingError = parent.querySelector('.error');
    const existingSuccess = parent.querySelector('.success');
    
    if (existingError) {
        parent.removeChild(existingError);
    }
    if (existingSuccess) {
        parent.removeChild(existingSuccess);
    }
    
    field.style.borderColor = '#e1e5e9';
}

// Phone number formatting for Kenya
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('254')) {
        value = '+254 ' + value.substring(3, 6) + ' ' + value.substring(6, 9) + ' ' + value.substring(9, 12);
    } else if (value.startsWith('0')) {
        value = value.substring(0, 4) + ' ' + value.substring(4, 7) + ' ' + value.substring(7, 10);
    }
    
    input.value = value;
}

// Auto-format phone numbers
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="tel"], input[name="phone"]').forEach(input => {
        input.addEventListener('input', () => formatPhoneNumber(input));
    });
});
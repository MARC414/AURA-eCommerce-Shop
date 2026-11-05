// Product Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeImageGallery();
    initializeTabs();
    initializeQuantityControls();
    initializeRatingInput();
    initializeNewsletterPopup();
    initializeWishlist();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeFormValidation();
});

// Image Gallery Functionality
function initializeImageGallery() {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (!mainImage || thumbnails.length === 0) return;

    // Set first thumbnail as active
    thumbnails[0].classList.add('active');

    // Add click handlers to thumbnails
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));

            // Add active class to clicked thumbnail
            this.classList.add('active');

            // Update main image
            const newSrc = this.getAttribute('data-src');
            const newAlt = this.getAttribute('data-alt');

            mainImage.src = newSrc;
            mainImage.alt = newAlt;

            // Smooth transition effect
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 200);
        });
    });

    // Keyboard navigation for thumbnails
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (index + 1) % thumbnails.length;
                thumbnails[nextIndex].click();
                thumbnails[nextIndex].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = (index - 1 + thumbnails.length) % thumbnails.length;
                thumbnails[prevIndex].click();
                thumbnails[prevIndex].focus();
            }
        });
    });
}

// Tab Functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabButtons.length === 0) return;

    // Add click handlers to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Update button states
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            // Update tab panes
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === targetTab) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // Keyboard navigation
    tabButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            const currentIndex = Array.from(tabButtons).indexOf(this);

            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % tabButtons.length;
                tabButtons[nextIndex].click();
                tabButtons[nextIndex].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
                tabButtons[prevIndex].click();
                tabButtons[prevIndex].focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                tabButtons[0].click();
                tabButtons[0].focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                tabButtons[tabButtons.length - 1].click();
                tabButtons[tabButtons.length - 1].focus();
            }
        });
    });
}

// Quantity Controls
function initializeQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.querySelector('[data-action="decrease"]');
    const increaseBtn = document.querySelector('[data-action="increase"]');

    if (!quantityInput || !decreaseBtn || !increaseBtn) return;

    // Decrease quantity
    decreaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            updateQuantityDisplay();
        }
    });

    // Increase quantity
    increaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        let maxValue = parseInt(quantityInput.max) || 10;
        if (currentValue < maxValue) {
            quantityInput.value = currentValue + 1;
            updateQuantityDisplay();
        }
    });

    // Direct input change
    quantityInput.addEventListener('input', function() {
        let value = parseInt(this.value);
        let minValue = parseInt(this.min) || 1;
        let maxValue = parseInt(this.max) || 10;

        if (isNaN(value) || value < minValue) {
            this.value = minValue;
        } else if (value > maxValue) {
            this.value = maxValue;
        }
        updateQuantityDisplay();
    });

    // Keyboard controls
    quantityInput.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            decreaseBtn.click();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            increaseBtn.click();
        }
    });

    function updateQuantityDisplay() {
        // Update any quantity-related displays
        const selectionStatus = document.querySelector('.selection-status');
        if (selectionStatus) {
            selectionStatus.textContent = `Selected quantity: ${quantityInput.value}`;
        }
    }
}

// Rating Input for Review Form
function initializeRatingInput() {
    const starInputs = document.querySelectorAll('.star-input');
    const ratingValue = document.querySelector('.rating-value') || document.querySelector('.review-rating');

    if (starInputs.length === 0) return;

    starInputs.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            updateStarRating(rating);
            updateRatingValue(rating);
        });

        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            updateStarRating(rating);
        });
    });

    document.querySelector('.rating-input').addEventListener('mouseleave', function() {
        // Reset to current rating
        const currentRating = parseInt(this.dataset.currentRating) || 0;
        updateStarRating(currentRating);
    });

    function updateStarRating(rating) {
        starInputs.forEach((star, index) => {
            if (index < rating) {
                star.textContent = '★';
                star.classList.add('filled');
            } else {
                star.textContent = '☆';
                star.classList.remove('filled');
            }
        });
    }

    function updateRatingValue(rating) {
        if (ratingValue) {
            ratingValue.dataset.currentRating = rating;
        }
    }
}

// Newsletter Popup
function initializeNewsletterPopup() {
    const popup = document.getElementById('newsletter-popup');
    const closeBtn = document.querySelector('.popup-close');
    const form = document.querySelector('.newsletter-form');

    if (!popup) return;

    // Show popup after 30 seconds
    setTimeout(() => {
        showNewsletterPopup();
    }, 30000);

    // Show popup when user scrolls to bottom
    window.addEventListener('scroll', function() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
            showNewsletterPopup();
        }
    });

    // Close popup
    closeBtn.addEventListener('click', hideNewsletterPopup);
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            hideNewsletterPopup();
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;

        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = 'Subscribed!';
            setTimeout(() => {
                hideNewsletterPopup();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);
    });

    function showNewsletterPopup() {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideNewsletterPopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Wishlist Functionality
function initializeWishlist() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const icon = this.querySelector('.icon');
            const text = this.querySelector('.text');

            // Toggle wishlist state
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                icon.textContent = '❤️';
                text.textContent = 'Add to Wishlist';
                localStorage.removeItem(`wishlist_${productId}`);
            } else {
                this.classList.add('active');
                icon.textContent = '❤️';
                text.textContent = 'Remove from Wishlist';
                localStorage.setItem(`wishlist_${productId}`, 'true');
            }
        });
    });

    // Check wishlist on page load
    wishlistBtns.forEach(btn => {
        const productId = btn.getAttribute('data-product-id');
        if (localStorage.getItem(`wishlist_${productId}`)) {
            btn.classList.add('active');
        }
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        this.setAttribute('aria-expanded', !isExpanded);
        this.classList.toggle('active');
        mainNav.classList.toggle('active');

        // Add animation
        if (!isExpanded) {
            mainNav.style.maxHeight = '0';
            setTimeout(() => {
                mainNav.style.maxHeight = mainNav.scrollHeight + 'px';
            }, 10);
        } else {
            mainNav.style.maxHeight = mainNav.scrollHeight + 'px';
            setTimeout(() => {
                mainNav.style.maxHeight = '0';
            }, 10);
        }
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Form Validation
function initializeFormValidation() {
    // Review form validation
    const reviewForm = document.querySelector('.review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate all required fields
            const name = document.getElementById('review-name').value.trim();
            const email = document.getElementById('review-email').value.trim();
            const rating = document.querySelector('.rating-input').dataset.currentRating;
            const text = document.getElementById('review-text').value.trim();

            if (!name || !email || !rating || !text) {
                alert('Please fill in all fields and select a rating.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Submit review
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = 'Review Submitted!';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    this.reset();
                    document.querySelector('.rating-input').dataset.currentRating = '0';
                    updateStarRating(0);
                }, 2000);
            }, 1500);
        });
    }

    // Contact form validation (if present)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Add validation logic here
            // ...
        });
    }
}

// Add to Cart Functionality
function addToCart(productId, quantity = 1) {
    // Get cart from localStorage or create new cart
    let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }

    // Save cart to localStorage
    localStorage.setItem('aura_cart', JSON.stringify(cart));

    // Show success message
    showNotification('Product added to cart!');

    // Update cart icon (if present)
    updateCartIcon();
}

// Buy Now Functionality
function buyNow(productId) {
    // Add to cart with quantity 1
    addToCart(productId, 1);

    // Redirect to checkout
    window.location.href = '/checkout';
}

// Request Quote Functionality
function requestQuote(productId) {
    // Show quote form
    const quoteForm = document.createElement('div');
    quoteForm.className = 'quote-form';
    quoteForm.innerHTML = `
        <h3>Request a Quote</h3>
        <form id="quote-form-${productId}">
            <div class="form-group">
                <label for="quote-name">Name</label>
                <input type="text" id="quote-name" required>
            </div>
            <div class="form-group">
                <label for="quote-email">Email</label>
                <input type="email" id="quote-email" required>
            </div>
            <div class="form-group">
                <label for="quote-quantity">Quantity</label>
                <input type="number" id="quote-quantity" min="1" value="1" required>
            </div>
            <div class="form-group">
                <label for="quote-message">Additional Requirements</label>
                <textarea id="quote-message" rows="4"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Submit Quote Request</button>
        </form>
    `;

    // Add to DOM
    const productInfo = document.querySelector('.product-info');
    productInfo.appendChild(quoteForm);

    // Handle form submission
    document.getElementById(`quote-form-${productId}`).addEventListener('submit', function(e) {
        e.preventDefault();

        // Process quote request
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = 'Quote Sent!';
            setTimeout(() => {
                quoteForm.remove();
                showNotification('Quote request sent successfully!');
            }, 2000);
        }, 1500);
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Update Cart Icon
function updateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        const cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartIcon.textContent = totalItems;
    }
}

// Utility Functions
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

// Lazy Loading for Images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Analytics Tracking
function trackEvent(eventName, data = {}) {
    // Implement your analytics tracking here
    console.log('Event tracked:', eventName, data);

    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Track page view
    trackEvent('page_view', {
        page_title: document.title,
        page_path: window.location.pathname
    });
});

// Add event listeners for buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add to Cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            addToCart(productId, quantity);
        });
    });

    // Buy Now buttons
    const buyNowBtns = document.querySelectorAll('.buy-now');
    buyNowBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            buyNow(productId);
        });
    });

    // Request Quote buttons
    const requestQuoteBtns = document.querySelectorAll('.request-quote');
    requestQuoteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            requestQuote(productId);
        });
    });
});
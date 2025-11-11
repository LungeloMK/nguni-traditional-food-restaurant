// ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== HEART ICON TOGGLE FOR FAVORITES =====
document.querySelectorAll('.dish-heart').forEach(heart => {
    heart.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('liked');
        
        if (this.classList.contains('liked')) {
            this.innerHTML = '♥';
            showNotification('Added to favorites!');
        } else {
            this.innerHTML = '♡';
            showNotification('Removed from favorites!');
        }
    });
});

// ===== ADD TO CART BUTTON =====
document.querySelectorAll('.btn-primary, .btn-outline').forEach(button => {
    if (button.textContent.includes('Add to Cart')) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const dishCard = this.closest('.dish-card');
            const dishName = dishCard.querySelector('h3').textContent;
            const dishPrice = dishCard.querySelector('.price').textContent;
            
            addToCart(dishName, dishPrice);
            showNotification(`${dishName} added to cart!`);
            
            // Animate button
            this.textContent = 'Added ✓';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
            }, 2000);
        });
    }
});

// ===== BOOKING FORM SUBMISSION =====
const bookingForm = document.querySelector('.booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const date = this.querySelector('input[type="date"]').value;
        const time = this.querySelector('input[type="time"]').value;
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const persons = this.querySelector('input[type="number"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        
        // Validation
        if (!date || !time || !name || !email || !persons || !phone) {
            showNotification('Please fill in all required fields!', 'error');
            return;
        }
        
        // Store booking
        const booking = {
            date: date,
            time: time,
            name: name,
            email: email,
            persons: persons,
            phone: phone,
            bookingDate: new Date().toLocaleDateString()
        };
        
        // Save to localStorage (simulating backend)
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Show success message
        showNotification(`Booking confirmed for ${name}! We'll contact you soon.`, 'success');
        
        // Reset form
        this.reset();
        
        console.log('Booking details:', booking);
    });
}

// ===== CART MANAGEMENT =====
function addToCart(dishName, dishPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.name === dishName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: dishName,
            price: dishPrice,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartIcon.setAttribute('data-count', totalItems);
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'error' ? '#FF6B6B' : type === 'success' ? '#51CF66' : '#4ECDC4'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===== LAZY LOADING FOR IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== SEARCH FUNCTIONALITY =====
const searchIcon = document.querySelector('.search-icon');
if (searchIcon) {
    searchIcon.addEventListener('click', function(e) {
        e.preventDefault();
        const searchTerm = prompt('What would you like to search for?');
        if (searchTerm) {
            showNotification(`Searching for: "${searchTerm}"`);
            // Implement actual search functionality here
        }
    });
}

// ===== ACTIVE NAVIGATION LINK =====
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===== ADD ACTIVE LINK STYLING =====
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-link.active {
        color: #FF6B4A;
        border-bottom: 2px solid #FF6B4A;
        padding-bottom: 0.5rem;
    }
`;
document.head.appendChild(activeStyle);

// ===== CATEGORY CARD INTERACTION =====
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        const categoryName = this.querySelector('h3').textContent;
        showNotification(`Browsing ${categoryName}...`);
        // Implement category filtering here
    });
});

// ===== FEATURE BOX INTERACTION =====
document.querySelectorAll('.feature-box').forEach(box => {
    box.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#fff5f5';
    });
    
    box.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'white';
    });
});

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initializeAnimations();
    loadSavedBookings();
});

// ===== INITIALIZE SCROLL ANIMATIONS =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-in-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.dish-card, .category-card, .feature-box, .testimonial-card, .team-member').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ===== LOAD SAVED BOOKINGS =====
function loadSavedBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    if (bookings.length > 0) {
        console.log('Saved bookings:', bookings);
    }
}

// ===== CART FUNCTIONALITY WITH ICON =====
document.querySelector('.cart-icon').addEventListener('click', function(e) {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
    } else {
        let cartSummary = 'Cart Items:\n\n';
        let total = 0;
        
        cart.forEach(item => {
            // Remove any non-numeric characters (currency symbols, spaces) to calculate totals
            const numeric = parseFloat(item.price.replace(/[^0-9.-]+/g, '')) || 0;
            const itemTotal = numeric * item.quantity;
            total += itemTotal;
            cartSummary += `${item.name} x${item.quantity} - ${item.price}\n`;
        });

        // Display total in Rands (R)
        cartSummary += `\nTotal: R${total.toFixed(2)}`;
        alert(cartSummary);
    }
});

// ===== DISH CARD KEYBOARD NAVIGATION =====
document.querySelectorAll('.dish-card').forEach((card, index) => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const button = this.querySelector('button');
            if (button) {
                button.click();
            }
        }
    });
});

// ===== AUTO-HIDE NAVIGATION ON MOBILE =====
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            document.querySelector('.nav-menu').style.display = 'none';
        }
    });
});

console.log('Website loaded successfully! 🍲');

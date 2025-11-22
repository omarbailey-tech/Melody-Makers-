// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Manipulation Functions
function getElement(selector) {
    return document.querySelector(selector);
}

function getAllElements(selector) {
    return document.querySelectorAll(selector);
}

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update navigation
    const navItems = document.querySelectorAll('nav ul li');
    navItems.forEach(item => {
        item.classList.remove('current');
    });
    
    // Find and set current nav item
    const currentNavItem = Array.from(navItems).find(item => 
        item.querySelector('a').getAttribute('onclick') === `showPage('${pageId}')`
    );
    
    if (currentNavItem) {
        currentNavItem.classList.add('current');
    }
    
    // Update page-specific content
    if (pageId === 'cart' || pageId === 'checkout') {
        displayCartItems();
    }
    
    if (pageId === 'products') {
        displayProducts();
    }
}

// Cart Functions
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartStorage();
    updateCartCount();
    showCartNotification();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartStorage();
    displayCartItems();
    updateCartCount();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCartStorage();
        displayCartItems();
        updateCartCount();
    }
}

function clearCart() {
    cart = [];
    updateCartStorage();
    displayCartItems();
    updateCartCount();
}

function updateCartStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    getElement('#cart-count').textContent = count;
}

function showCartNotification() {
    const notification = getElement('#cart-notification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

function calculateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + tax;
    
    return {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    };
}

// Display Cart Items
function displayCartItems() {
    const cartItemsElement = getElement('#cartItems');
    const checkoutItemsElement = getElement('#checkoutItems');
    
    if (cartItemsElement) {
        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<div class="empty-state">Your cart is empty</div>';
        } else {
            cartItemsElement.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>Price: J$${item.price.toLocaleString()}</p>
                    </div>
                    <div class="item-controls">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>Qty: ${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                        <button onclick="removeFromCart(${index})" class="btn btn-secondary">Remove</button>
                    </div>
                    <div class="item-subtotal">
                        J$${(item.price * item.quantity).toLocaleString()}
                    </div>
                </div>
            `).join('');
        }
        
        const totals = calculateCartTotals();
        getElement('#subtotal').textContent = `J$${parseFloat(totals.subtotal).toLocaleString()}`;
        getElement('#tax').textContent = `J$${parseFloat(totals.tax).toLocaleString()}`;
        getElement('#total').textContent = `J$${parseFloat(totals.total).toLocaleString()}`;
    }
    
    if (checkoutItemsElement) {
        if (cart.length === 0) {
            checkoutItemsElement.innerHTML = '<div class="empty-state">No items in cart</div>';
        } else {
            checkoutItemsElement.innerHTML = cart.map(item => `
                <div class="checkout-item">
                    <span>${item.name} (${item.quantity})</span>
                    <span>J$${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            `).join('');
            
            const totals = calculateCartTotals();
            getElement('#checkoutSubtotal').textContent = `J$${parseFloat(totals.subtotal).toLocaleString()}`;
            getElement('#checkoutTax').textContent = `J$${parseFloat(totals.tax).toLocaleString()}`;
            getElement('#checkoutTotal').textContent = `J$${parseFloat(totals.total).toLocaleString()}`;
        }
    }
}

// Form Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateForm(formData) {
    const errors = {};
    
    if (formData.fullName && formData.fullName.trim().length < 2) {
        errors.fullName = 'Full name must be at least 2 characters long';
    }
    
    if (formData.email && !validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (formData.username && formData.username.trim().length < 3) {
        errors.username = 'Username must be at least 3 characters long';
    }
    
    if (formData.password && !validatePassword(formData.password)) {
        errors.password = 'Password must be at least 6 characters long';
    }
    
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
}

// Product Data with realistic Jamaican prices
const products = [
    {
        id: 1,
        name: "Acoustic Guitar",
        price: 85000,
        category: "guitars",
        image: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Professional acoustic guitar with rich sound"
    },
    {
        id: 2,
        name: "Electric Guitar",
        price: 125000,
        category: "guitars",
        image: "https://images.unsplash.com/photo-1550985616-10810253dc04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
        description: "Premium electric guitar with amplifier"
    },
    {
        id: 3,
        name: "Digital Piano",
        price: 185000,
        category: "pianos",
        image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "88-key digital piano with weighted keys"
    },
    {
        id: 4,
        name: "Drum Set",
        price: 245000,
        category: "drums",
        image: "https://images.unsplash.com/photo-1598488031591-0aa96c6516e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Complete 5-piece drum set with cymbals"
    },
    {
        id: 5,
        name: "Violin",
        price: 65000,
        category: "strings",
        image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Classical violin with bow and case"
    },
    {
        id: 6,
        name: "Instrument Repair Service",
        price: 15000,
        category: "repair",
        image: "https://images.unsplash.com/photo-1598488031591-0aa96c6516e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Professional repair and maintenance service"
    },
    {
        id: 7,
        name: "Bass Guitar",
        price: 95000,
        category: "guitars",
        image: "https://images.unsplash.com/photo-1598488031591-0aa96c6516e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "4-string bass guitar with powerful sound"
    },
    {
        id: 8,
        name: "Saxophone",
        price: 135000,
        category: "wind",
        image: "https://images.unsplash.com/photo-1567427018140-e0c36d0b8f66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        description: "Alto saxophone with case and cleaning kit"
    }
];

// Display Products
function displayProducts(filter = 'all') {
    const productsGrid = getElement('#productsGrid');
    if (!productsGrid) return;
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>J$${product.price.toLocaleString()}</p>
            <p class="product-description">${product.description}</p>
            <button class="btn" onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
        </div>
    `).join('');
}

// Filter Products
function filterProducts() {
    const filter = getElement('#categoryFilter').value;
    displayProducts(filter);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize products
    displayProducts();
    updateCartCount();
    
    // Login Form Handler
    const loginForm = getElement('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                username: getElement('#username').value,
                password: getElement('#password').value
            };
            
            const errors = validateForm(formData);
            
            // Clear previous errors
            getAllElements('.error-message').forEach(el => el.textContent = '');
            
            if (Object.keys(errors).length === 0) {
                alert('Login successful!');
                showPage('home');
            } else {
                Object.keys(errors).forEach(key => {
                    const errorElement = getElement(`#${key}Error`);
                    if (errorElement) {
                        errorElement.textContent = errors[key];
                    }
                });
            }
        });
    }
    
    // Registration Form Handler
    const registerForm = getElement('#registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                fullName: getElement('#fullName').value,
                email: getElement('#email').value,
                username: getElement('#regUsername').value,
                password: getElement('#regPassword').value,
                confirmPassword: getElement('#confirmPassword').value
            };
            
            const errors = validateForm(formData);
            
            // Clear previous errors
            getAllElements('.error-message').forEach(el => el.textContent = '');
            
            if (Object.keys(errors).length === 0) {
                alert('Registration successful!');
                showPage('login');
            } else {
                Object.keys(errors).forEach(key => {
                    const errorElement = getElement(`#${key}Error`);
                    if (errorElement) {
                        errorElement.textContent = errors[key];
                    }
                });
            }
        });
    }
    
    // Cart Event Listeners
    const clearCartBtn = getElement('#clearCart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    const checkoutBtn = getElement('#checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
            } else {
                showPage('checkout');
                displayCartItems();
                // Pre-fill email if user is logged in
                const email = getElement('#email') ? getElement('#email').value : '';
                if (email) {
                    getElement('#checkoutEmail').value = email;
                }
            }
        });
    }
    
    // Checkout Event Listeners
    const confirmOrderBtn = getElement('#confirmOrder');
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', function() {
            const paymentAmount = parseFloat(getElement('#paymentAmount').value);
            const totals = calculateCartTotals();
            const totalAmount = parseFloat(totals.total);
            
            if (paymentAmount >= totalAmount) {
                alert('Order confirmed! Thank you for your purchase.');
                clearCart();
                showPage('home');
            } else {
                alert(`Insufficient payment. Total amount is J$${totalAmount.toLocaleString()}`);
            }
        });
    }
    
    // Product Filter
    const categoryFilter = getElement('#categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
});
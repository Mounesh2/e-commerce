class ECommerceApp {
    constructor() {
        this.token = localStorage.getItem('token');
        this.currentPage = 'items';
        this.items = [];
        this.cart = [];
        this.isLogin = true;
        
        this.initEventListeners();
        this.checkAuth();
    }

    initEventListeners() {
        // Auth form
        document.getElementById('auth-form').addEventListener('submit', (e) => this.handleAuth(e));
        document.getElementById('toggle-link').addEventListener('click', () => this.toggleAuthMode());
        
        // Navigation
        document.getElementById('show-items').addEventListener('click', () => this.showPage('items'));
        document.getElementById('show-cart').addEventListener('click', () => this.showPage('cart'));
        document.getElementById('logout').addEventListener('click', () => this.logout());
        
        // Nav links
        document.getElementById('nav-home').addEventListener('click', (e) => { e.preventDefault(); this.showPage('items'); });
        document.getElementById('nav-products').addEventListener('click', (e) => { e.preventDefault(); this.showPage('products'); });
        document.getElementById('nav-about').addEventListener('click', (e) => { e.preventDefault(); this.showPage('about'); });
        document.getElementById('nav-contact').addEventListener('click', (e) => { e.preventDefault(); this.showPage('contact'); });
        document.getElementById('profile-icon').addEventListener('click', () => this.showPage('profile'));
        
        // Product detail navigation
        document.getElementById('back-to-items').addEventListener('click', () => this.showPage('items'));
        document.getElementById('back-from-profile').addEventListener('click', () => this.showPage('items'));
        
        // Mobile menu
        document.getElementById('mobile-menu-btn').addEventListener('click', () => this.toggleMobileMenu());
        
        // Mobile nav links
        document.getElementById('mobile-nav-home').addEventListener('click', (e) => { e.preventDefault(); this.showPage('items'); this.closeMobileMenu(); });
        document.getElementById('mobile-nav-products').addEventListener('click', (e) => { e.preventDefault(); this.showPage('products'); this.closeMobileMenu(); });
        document.getElementById('mobile-nav-about').addEventListener('click', (e) => { e.preventDefault(); this.showPage('about'); this.closeMobileMenu(); });
        document.getElementById('mobile-nav-contact').addEventListener('click', (e) => { e.preventDefault(); this.showPage('contact'); this.closeMobileMenu(); });
        
        // Mobile buttons
        document.getElementById('mobile-show-items').addEventListener('click', () => { this.showPage('items'); this.closeMobileMenu(); });
        document.getElementById('mobile-show-cart').addEventListener('click', () => { this.showPage('cart'); this.closeMobileMenu(); });
        document.getElementById('mobile-logout').addEventListener('click', () => { this.logout(); this.closeMobileMenu(); });
        document.getElementById('mobile-profile-icon').addEventListener('click', () => { this.showPage('profile'); this.closeMobileMenu(); });
        
        // Theme selector
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => this.changeTheme(option.dataset.theme));
        });
        

        
        // Products page filters
        document.getElementById('products-apply-filters').addEventListener('click', () => this.loadProductsPage());
        document.getElementById('products-clear-filters').addEventListener('click', () => this.clearProductsFilters());
    }

    async handleAuth(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validate Gmail format for signup
        if (!this.isLogin && !email.endsWith('@gmail.com')) {
            alert('Email must be a Gmail address (@gmail.com)');
            return;
        }
        
        const endpoint = this.isLogin ? '/api/login' : '/api/signup';
        let requestBody = { email, password };
        
        if (!this.isLogin) {
            const fullName = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            
            // Validate required fields
            if (!fullName || !phone || !address) {
                alert('All fields are required for signup');
                return;
            }
            
            requestBody.fullName = fullName;
            requestBody.phone = phone;
            requestBody.address = address;
        }
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                if (this.isLogin) {
                    // Login successful
                    this.token = data.token;
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('userEmail', email);
                    this.showMainApp();
                    this.showPage('items');
                    this.loadItems();
                    this.loadCart();
                } else {
                    // Signup successful - redirect to login
                    alert(data.message);
                    this.isLogin = true;
                    this.toggleAuthMode();
                    document.getElementById('auth-form').reset();
                }
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Network error');
        }
    }

    toggleAuthMode() {
        this.isLogin = !this.isLogin;
        document.getElementById('auth-title').textContent = this.isLogin ? 'Login' : 'Sign Up';
        document.getElementById('auth-submit').textContent = this.isLogin ? 'Login' : 'Sign Up';
        document.getElementById('auth-toggle').innerHTML = this.isLogin 
            ? 'Don\'t have an account? <span id="toggle-link">Sign up</span>'
            : 'Already have an account? <span id="toggle-link">Login</span>';
        
        // Show/hide signup fields
        document.getElementById('signup-fields').style.display = this.isLogin ? 'none' : 'block';
        
        // Update required attributes
        const signupFields = ['fullName', 'phone', 'address'];
        signupFields.forEach(field => {
            const element = document.getElementById(field);
            if (this.isLogin) {
                element.removeAttribute('required');
            } else {
                element.setAttribute('required', 'true');
            }
        });
        
        document.getElementById('toggle-link').addEventListener('click', () => this.toggleAuthMode());
    }

    checkAuth() {
        this.loadSavedTheme();
        if (this.token) {
            this.showMainApp();
            this.showPage('items'); // Navigate to home page on app load
            this.loadItems();
            this.loadCart();
        } else {
            this.showAuth();
        }
    }

    showAuth() {
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('main-section').style.display = 'none';
    }

    showMainApp() {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('main-section').style.display = 'block';
    }

    showPage(page) {
        this.currentPage = page;
        document.getElementById('items-page').style.display = page === 'items' ? 'block' : 'none';
        document.getElementById('cart-page').style.display = page === 'cart' ? 'block' : 'none';
        document.getElementById('product-page').style.display = page === 'product' ? 'block' : 'none';
        document.getElementById('products-page').style.display = page === 'products' ? 'block' : 'none';
        document.getElementById('about-page').style.display = page === 'about' ? 'block' : 'none';
        document.getElementById('contact-page').style.display = page === 'contact' ? 'block' : 'none';
        document.getElementById('profile-page').style.display = page === 'profile' ? 'block' : 'none';
        
        // Update active navigation
        document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => link.classList.remove('active'));
        if (page === 'items') {
            document.getElementById('nav-home').classList.add('active');
            document.getElementById('mobile-nav-home').classList.add('active');
        } else if (page === 'products') {
            document.getElementById('nav-products').classList.add('active');
            document.getElementById('mobile-nav-products').classList.add('active');
        } else if (page === 'about') {
            document.getElementById('nav-about').classList.add('active');
            document.getElementById('mobile-nav-about').classList.add('active');
        } else if (page === 'contact') {
            document.getElementById('nav-contact').classList.add('active');
            document.getElementById('mobile-nav-contact').classList.add('active');
        }
        
        if (page === 'cart') {
            this.renderCart();
        } else if (page === 'profile') {
            this.loadProfile();
        } else if (page === 'products') {
            this.loadProductsPage();
        } else if (page === 'contact') {
            this.initContactForm();
        }
    }

    async loadItems() {
        try {
            const response = await fetch('/api/items');
            this.items = await response.json();
            this.renderHomeSections();
        } catch (error) {
            console.error('Error loading items:', error);
        }
    }

    renderHomeSections() {
        this.renderBestSellers();
        this.renderTopDiscounts();
    }
    
    renderBestSellers() {
        const bestSellers = this.items.filter(item => item.bestseller).slice(0, 5);
        const container = document.getElementById('best-sellers-list');
        container.innerHTML = '';
        
        bestSellers.forEach(item => {
            const itemCard = this.createItemCard(item, true);
            container.appendChild(itemCard);
        });
    }
    
    renderTopDiscounts() {
        const discountedItems = this.items
            .filter(item => item.discount)
            .sort((a, b) => b.discount - a.discount)
            .slice(0, 5);
        const container = document.getElementById('top-discounts-list');
        container.innerHTML = '';
        
        discountedItems.forEach(item => {
            const itemCard = this.createItemCard(item, false, true);
            container.appendChild(itemCard);
        });
    }
    
    createItemCard(item, isBestseller = false, hasDiscount = false) {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        let badges = '';
        if (isBestseller) badges += '<div class="bestseller-badge">🏆 Best Seller</div>';
        if (hasDiscount) badges += `<div class="discount-badge">-${item.discount}%</div>`;
        
        let priceHTML = `<div class="item-price">$${item.price}</div>`;
        if (item.originalPrice) {
            priceHTML = `
                <div class="item-price">
                    <span class="original-price">$${item.originalPrice}</span>
                    <span class="discounted-price">$${item.price}</span>
                </div>
            `;
        }
        
        itemCard.innerHTML = `
            ${badges}
            <img src="${item.image}" alt="${item.name}" class="item-image" onclick="app.showProductDetail(${item.id})">
            <div class="item-content">
                <h3 onclick="app.showProductDetail(${item.id})">${item.name}</h3>
                <p>Category: ${item.category}</p>
                ${priceHTML}
                <button onclick="app.addToCart(${item.id})">Add to Cart</button>
            </div>
        `;
        
        return itemCard;
    }

    async addToCart(itemId) {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ itemId })
            });
            
            if (response.ok) {
                this.loadCart();
                alert('Item added to cart!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }

    async loadCart() {
        try {
            const response = await fetch('/api/cart', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            
            this.cart = await response.json();
            this.updateCartCount();
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = count;
        document.getElementById('mobile-cart-count').textContent = count;
    }
    
    toggleMobileMenu() {
        const mobileNav = document.getElementById('mobile-nav');
        const menuBtn = document.getElementById('mobile-menu-btn');
        
        mobileNav.classList.toggle('active');
        menuBtn.classList.toggle('active');
    }
    
    closeMobileMenu() {
        const mobileNav = document.getElementById('mobile-nav');
        const menuBtn = document.getElementById('mobile-menu-btn');
        
        mobileNav.classList.remove('active');
        menuBtn.classList.remove('active');
    }

    renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        cartItems.innerHTML = '';
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
            cartTotal.innerHTML = '';
            return;
        }
        
        let total = 0;
        
        this.cart.forEach(item => {
            total += item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price} x ${item.quantity} = $${item.price * item.quantity}</p>
                </div>
                <button onclick="app.removeFromCart(${item.id})">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.innerHTML = `Total: $${total.toFixed(2)}`;
    }

    async removeFromCart(itemId) {
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            
            if (response.ok) {
                this.loadCart();
                if (this.currentPage === 'cart') {
                    this.renderCart();
                }
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    }

    async showProductDetail(itemId) {
        try {
            const response = await fetch(`/api/items/${itemId}`);
            const item = await response.json();
            
            // Update product detail page
            document.getElementById('product-name').textContent = item.name;
            document.getElementById('product-category').textContent = item.category;
            document.getElementById('product-price').textContent = `$${item.price}`;
            document.getElementById('product-description').textContent = item.description;
            
            // Update main image
            document.getElementById('main-product-image').src = item.image;
            document.getElementById('main-product-image').alt = item.name;
            
            // Update gallery images
            const galleryImages = document.querySelectorAll('.gallery-image');
            item.images.forEach((img, index) => {
                if (galleryImages[index]) {
                    galleryImages[index].src = img;
                    galleryImages[index].onclick = () => {
                        document.getElementById('main-product-image').src = img;
                    };
                }
            });
            
            // Update add to cart button
            document.getElementById('add-to-cart-detail').onclick = () => this.addToCart(itemId);
            
            // Show related items
            this.showRelatedItems(item.category, itemId);
            
            this.showPage('product');
        } catch (error) {
            console.error('Error loading product:', error);
        }
    }
    
    showRelatedItems(category, currentItemId) {
        const relatedItems = this.items.filter(item => 
            item.category === category && item.id !== currentItemId
        ).slice(0, 3);
        
        const relatedContainer = document.getElementById('related-items');
        relatedContainer.innerHTML = '';
        
        relatedItems.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            itemCard.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="item-image" onclick="app.showProductDetail(${item.id})">
                <div class="item-content">
                    <h3 onclick="app.showProductDetail(${item.id})">${item.name}</h3>
                    <p>Category: ${item.category}</p>
                    <div class="item-price">$${item.price}</div>
                    <button onclick="app.addToCart(${item.id})">Add to Cart</button>
                </div>
            `;
            relatedContainer.appendChild(itemCard);
        });
    }

    async loadProductsPage() {
        const category = document.getElementById('products-category-filter').value;
        const minPrice = document.getElementById('products-min-price').value;
        const maxPrice = document.getElementById('products-max-price').value;
        const sortBy = document.getElementById('sort-filter').value;
        
        let url = '/api/items?';
        if (category) url += `category=${category}&`;
        if (minPrice) url += `minPrice=${minPrice}&`;
        if (maxPrice) url += `maxPrice=${maxPrice}&`;
        
        try {
            const response = await fetch(url);
            let items = await response.json();
            
            // Apply sorting
            if (sortBy === 'price-low') {
                items.sort((a, b) => a.price - b.price);
            } else if (sortBy === 'price-high') {
                items.sort((a, b) => b.price - a.price);
            } else if (sortBy === 'name') {
                items.sort((a, b) => a.name.localeCompare(b.name));
            }
            
            this.renderProductsPage(items);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }
    
    renderProductsPage(items) {
        const itemsList = document.getElementById('products-items-list');
        itemsList.innerHTML = '';
        
        items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            itemCard.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="item-image" onclick="app.showProductDetail(${item.id})">
                <div class="item-content">
                    <h3 onclick="app.showProductDetail(${item.id})">${item.name}</h3>
                    <p>Category: ${item.category}</p>
                    <div class="item-price">$${item.price}</div>
                    <button onclick="app.addToCart(${item.id})">Add to Cart</button>
                </div>
            `;
            itemsList.appendChild(itemCard);
        });
    }
    
    clearProductsFilters() {
        document.getElementById('products-category-filter').value = '';
        document.getElementById('products-min-price').value = '';
        document.getElementById('products-max-price').value = '';
        document.getElementById('sort-filter').value = '';
        this.loadProductsPage();
    }

    async loadProfile() {
        try {
            const response = await fetch('/api/profile', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            
            if (response.ok) {
                const profile = await response.json();
                document.getElementById('profile-user-name').textContent = profile.fullName;
                document.getElementById('profile-user-email').textContent = profile.email;
                
                // Update profile details
                const detailItems = document.querySelectorAll('.detail-item .detail-value');
                detailItems[0].textContent = profile.phone;
                detailItems[1].textContent = profile.address;
                detailItems[2].textContent = profile.memberSince;
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for your message! We\'ll get back to you soon.');
                contactForm.reset();
            });
        }
    }

    changeTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('selectedTheme', theme);
        
        // Update active theme option
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
    }
    
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('selectedTheme') || 'ocean';
        this.changeTheme(savedTheme);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        this.token = null;
        this.cart = [];
        this.showAuth();
    }
}

// Initialize app
const app = new ECommerceApp();
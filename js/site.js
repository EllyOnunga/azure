/* Azure Bay Mobile-First Interactivity */
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    
    // Navigation Drawer Logic
    const drawerTrigger = document.getElementById('hamburger-trigger');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');

    if (drawerTrigger && drawer && overlay) {
        drawerTrigger.addEventListener('click', () => {
            drawer.classList.add('active');
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        overlay.addEventListener('click', () => {
            drawer.classList.remove('active');
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Close drawer on link click
        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                drawer.classList.remove('active');
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Sticky Header Effect
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.style.background = 'rgba(4, 18, 35, 0.95)';
                header.style.borderBottom = '1px solid var(--glass-border)';
            } else {
                header.style.background = 'rgba(10, 38, 71, 0.8)';
                header.style.borderBottom = 'none';
            }
        });
    }

    // Active State for Bottom Nav
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Simple Tab Filtering for Menu
    const filterTabs = document.querySelectorAll('.filter-tab');
    const menuItems = document.querySelectorAll('.menu-item-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            const activeTab = document.querySelector('.filter-tab.active');
            if (activeTab) activeTab.classList.remove('active');
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');
            
            menuItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'flex';
                    item.style.opacity = '0';
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // --- Form Overhaul & Validation Logic ---
    
    // 1. Date Restriction (Disable past dates)
    const dateInput = document.getElementById('res_date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // 2. Generic Success Simulation
    const showSuccess = (formId, message) => {
        const form = document.getElementById(formId);
        const parent = form.parentElement;
        
        // Premium Success Template
        const successHTML = `
            <div class="form-success-message">
                <div class="success-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 style="color: var(--soft-white); font-family: var(--font-heading); margin-bottom: 10px;">Message Received</h3>
                <p style="color: var(--text-light); line-height: 1.6;">${message}</p>
                <button onclick="location.reload()" class="btn-premium btn-outline" style="margin-top: 25px; padding: 10px 20px; font-size: 0.8rem; border-color: var(--accent-gold); color: var(--accent-gold);">Send Another</button>
            </div>
        `;
        
        form.style.opacity = '0';
        setTimeout(() => {
            parent.innerHTML = successHTML;
        }, 300);
    };

    // 3. Reservation Form Handler
    const reserveForm = document.getElementById('reserveForm');
    if (reserveForm) {
        reserveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = reserveForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = 'Securing Table...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showSuccess('reserveForm', 'Your reservation request for Azure Bay has been sent! We will confirm your table via email shortly. Karibu Sana.');
            }, 1500);
        });
    }

    // 4. Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showSuccess('contactForm', 'Thank you for reaching out to Azure Bay. Our team has received your message and will get back to you within 24 hours.');
            }, 1200);
        });
    }

    // --- Functional Ordering Engine ---
    let cart = JSON.parse(localStorage.getItem('azure_cart')) || [];
    const cartPanel = document.getElementById('cart-panel');
    const cartFab = document.getElementById('cart-fab');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountBadge = document.getElementById('cart-count');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const handoffOverlay = document.getElementById('handoff-overlay');

    const updateCartUI = () => {
        if (!cartItemsContainer) return;

        // Save state
        localStorage.setItem('azure_cart', JSON.stringify(cart));

        // Update badge and visibility
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountBadge.textContent = totalItems;
        if (totalItems > 0) {
            cartFab.classList.add('visible');
        } else {
            cartFab.classList.remove('visible');
            cartPanel.classList.remove('active');
        }

        // Render items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your selection is empty.</p>';
            cartSubtotal.textContent = 'KSH 0';
        } else {
            let html = '';
            let total = 0;
            cart.forEach(item => {
                const sub = item.price * item.quantity;
                total += sub;
                html += `
                    <div class="cart-item">
                        <div class="item-info-row">
                            <h4>${item.name}</h4>
                            <span>KSH ${item.price.toLocaleString()} x ${item.quantity}</span>
                        </div>
                        <div class="item-controls">
                            <button class="control-btn minus" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="control-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                `;
            });
            cartItemsContainer.innerHTML = html;
            cartSubtotal.textContent = `KSH ${total.toLocaleString()}`;

            // Add listeners to new buttons
            cartItemsContainer.querySelectorAll('.control-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const change = btn.classList.contains('plus') ? 1 : -1;
                    updateQuantity(id, change);
                });
            });
        }
    };

    const updateQuantity = (id, change) => {
        const index = cart.findIndex(item => item.id === id);
        if (index !== -1) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            updateCartUI();
        }
    };

    // Add to Order Logic
    document.querySelectorAll('.add-to-order-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.menu-item-card');
            const item = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseInt(card.dataset.price),
                quantity: 1
            };

            const existing = cart.find(i => i.id === item.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push(item);
            }

            // Quick Animation on card
            card.style.transform = 'scale(1.02)';
            card.style.borderColor = 'var(--accent-gold)';
            setTimeout(() => { 
                card.style.transform = ''; 
                card.style.borderColor = ''; 
            }, 300);

            updateCartUI();
        });
    });

    // Toggle Cart
    if (cartFab) cartFab.addEventListener('click', () => cartPanel.classList.add('active'));
    if (document.getElementById('close-cart')) {
        document.getElementById('close-cart').addEventListener('click', () => cartPanel.classList.remove('active'));
    }

    // Checkout Handoff Logic
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            handoffOverlay.classList.add('active');
            
            // Premium simulation delay
            setTimeout(() => {
                window.location.href = 'https://order.toasttab.com/azurebay';
            }, 2500);
        });
    }

    // Initial load
    updateCartUI();
});

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

    // --- Integrated Transition Ordering Engine ---
    let cart = JSON.parse(localStorage.getItem('azure_cart')) || [];
    const cartPanel = document.getElementById('cart-panel');
    const cartFab = document.getElementById('cart-fab');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountBadge = document.getElementById('cart-count');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const handoffOverlay = document.getElementById('handoff-overlay');
    
    // Page Elements (Floating or Standalone Page)
    const viewItems = document.getElementById('cart-view-items');
    const viewInfo = document.getElementById('cart-view-info');
    const goToInfoBtn = document.getElementById('go-to-info');
    const backToItemsBtn = document.getElementById('back-to-items');
    const orderTypeSelect = document.getElementById('order-type');
    const addressGroup = document.getElementById('delivery-address-group');
    const tableGroup = document.getElementById('table-number-group');
    const orderMenuGrid = document.getElementById('order-menu-grid');
    const orderItemsSummary = document.getElementById('order-items-summary');

    // EmailJS Init - Replace with your key
    if (typeof emailjs !== 'undefined') {
        emailjs.init("user_placeholder_key"); 
    }

    const updateCartUI = () => {
        const isOrderPage = !!orderMenuGrid;
        localStorage.setItem('azure_cart', JSON.stringify(cart));

        // Update Badges
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountBadge) cartCountBadge.textContent = totalItems;
        
        if (totalItems > 0) {
            if (cartFab) cartFab.classList.add('visible');
        } else {
            if (cartFab) cartFab.classList.remove('visible');
            if (cartPanel) cartPanel.classList.remove('active');
            resetCartView();
        }

        // Calculate Pricing
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderType = orderTypeSelect ? orderTypeSelect.value : 'pickup';
        let deliveryFee = 0;
        
        if (orderType === 'delivery') {
            deliveryFee = subtotal >= 1500 ? 0 : 100;
        }

        const grandTotal = subtotal + deliveryFee;

        // Populate Floating Cart (menu.html)
        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your selection is empty.</p>';
            } else {
                cartItemsContainer.innerHTML = cart.map(item => `
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
                `).join('');
            }
        }

        // Populate Standalone Order Page Summary (order.html)
        if (orderItemsSummary) {
            if (cart.length === 0) {
                orderItemsSummary.innerHTML = '<p style="color: var(--text-light); text-align: center; margin-top: 20px;">Your cart is empty.</p>';
            } else {
                orderItemsSummary.innerHTML = cart.map(item => `
                    <div class="order-item-row">
                        <div style="flex-grow: 1;">
                            <h5>${item.name}</h5>
                            <span style="font-size: 0.8rem; color: var(--accent-gold);">KSH ${item.price.toLocaleString()} each</span>
                        </div>
                        <div class="item-controls" style="margin-left: 15px;">
                            <button class="control-btn minus" data-id="${item.id}">-</button>
                            <span style="color: var(--soft-white); min-width: 20px; text-align: center;">${item.quantity}</span>
                            <button class="control-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Refresh Totals Everywhere
        const formattedSubtotal = `KSH ${subtotal.toLocaleString()}`;
        const formattedGrandTotal = `KSH ${grandTotal.toLocaleString()}`;
        const formattedFee = `KSH ${deliveryFee.toLocaleString()}`;

        if (cartSubtotal) cartSubtotal.textContent = formattedSubtotal;
        if (document.getElementById('order-subtotal')) document.getElementById('order-subtotal').textContent = formattedSubtotal;
        if (document.getElementById('order-total-grand')) document.getElementById('order-total-grand').textContent = formattedGrandTotal;
        if (document.getElementById('mpesa-amount')) document.getElementById('mpesa-amount').textContent = formattedGrandTotal;
        
        // Fee Rows Logic
        const feeRow = document.getElementById('delivery-fee-row');
        const freeNote = document.getElementById('free-delivery-note');
        const feeSpan = document.getElementById('order-delivery-fee');
        
        if (feeRow) feeRow.style.display = (orderType === 'delivery' && deliveryFee > 0) ? 'flex' : 'none';
        if (feeSpan) feeSpan.textContent = formattedFee;
        if (freeNote) freeNote.style.display = (orderType === 'delivery' && deliveryFee === 0 && subtotal > 0) ? 'flex' : 'none';

        // Est Time Logic
        const estTime = document.getElementById('order-est-time');
        if (estTime) {
            if (orderType === 'delivery') estTime.textContent = '35-45 mins';
            else if (orderType === 'pickup') estTime.textContent = '20 mins';
            else estTime.textContent = '15 mins';
        }

        // Min Order Logic
        const minWarning = document.getElementById('min-order-warning');
        const checkoutBtn = document.getElementById('checkout-btn');
        const canCheckout = subtotal >= 500;

        if (minWarning) minWarning.style.display = (subtotal > 0 && !canCheckout) ? 'block' : 'none';
        if (checkoutBtn) checkoutBtn.disabled = !canCheckout;
        if (goToInfoBtn) goToInfoBtn.disabled = !canCheckout;

        // Re-bind controls
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                const change = btn.classList.contains('plus') ? 1 : -1;
                const index = cart.findIndex(i => i.id === id);
                if (index !== -1) {
                    cart[index].quantity += change;
                    if (cart[index].quantity <= 0) cart.splice(index, 1);
                    updateCartUI();
                }
            });
        });
    };

    const resetCartView = () => {
        if (viewItems && viewInfo) {
            viewItems.classList.add('active');
            viewInfo.classList.remove('active');
        }
    };

    // Populate order.html Menu Grid if present
    if (orderMenuGrid) {
        // We can either fetch menu.html or just hardcode the keys since it's a fixed menu
        const menuData = [
            { id: 'p1', name: 'Swahili Garlic Prawns', price: 1850, category: 'appetizers' },
            { id: 'p5', name: 'Lamu Crab Cakes', price: 2100, category: 'appetizers' },
            { id: 'p6', name: 'Beef Samosas (3)', price: 950, category: 'appetizers' },
            { id: 'p7', name: 'Malindi Calamari', price: 1600, category: 'appetizers' },
            { id: 'p2', name: 'Grilled Whole Tilapia', price: 2450, category: 'mains' },
            { id: 'p8', name: 'Red Snapper', price: 2800, category: 'mains' },
            { id: 'p9', name: 'Beef Biryani', price: 2100, category: 'mains' },
            { id: 'p10', name: 'Chicken Pilau', price: 1950, category: 'mains' },
            { id: 'p3', name: 'Diani Lobster tail', price: 4250, category: 'mains' },
            { id: 'p12', name: 'Samaki wa Kupaka', price: 2300, category: 'mains' },
            { id: 'p11', name: 'Zanzibar Platter (2)', price: 7500, category: 'mains' },
            { id: 'p13', name: 'Mango Mousse', price: 850, category: 'desserts' },
            { id: 'p4', name: 'Nairobi Spritz', price: 1100, category: 'cocktails' },
            { id: 'p14', name: 'Classic Dawa', price: 950, category: 'cocktails' }
        ];

        orderMenuGrid.innerHTML = menuData.map(item => `
            <div class="menu-item-card glass-panel" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" style="padding: 15px; display: flex; flex-direction: row; align-items: center; gap: 15px;">
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0; font-size: 0.9rem; color: var(--soft-white);">${item.name}</h4>
                    <span style="color: var(--accent-gold); font-weight: 700; font-size: 0.8rem;">KSH ${item.price.toLocaleString()}</span>
                </div>
                <button class="add-to-order-btn" style="position: static; width: 32px; height: 32px; font-size: 1rem;">+</button>
            </div>
        `).join('');
    }

    // Transition Logic
    if (goToInfoBtn) {
        goToInfoBtn.addEventListener('click', () => {
            // If we are on menu.html, we redirect to order.html instead of just switching views
            if (!window.location.pathname.includes('order.html')) {
                window.location.href = 'order.html';
            } else {
                viewItems.classList.remove('active');
                viewInfo.classList.add('active');
            }
        });
    }

    if (backToItemsBtn) {
        backToItemsBtn.addEventListener('click', () => {
            viewInfo.classList.remove('active');
            viewItems.classList.add('active');
        });
    }

    if (orderTypeSelect) {
        orderTypeSelect.addEventListener('change', () => {
            const val = orderTypeSelect.value;
            if (addressGroup) addressGroup.style.display = val === 'delivery' ? 'flex' : 'none';
            if (tableGroup) tableGroup.style.display = val === 'eatin' ? 'flex' : 'none';
            updateCartUI();
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-order-btn')) {
            const btn = e.target.closest('.add-to-order-btn');
            const card = btn.closest('.menu-item-card');
            const item = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseInt(card.dataset.price),
                quantity: 1
            };
            const existing = cart.find(i => i.id === item.id);
            if (existing) existing.quantity += 1;
            else cart.push(item);

            btn.style.transform = 'scale(1.2)';
            setTimeout(() => btn.style.transform = '', 200);
            updateCartUI();
        }
    });

    if (cartFab) {
        cartFab.addEventListener('click', () => {
            cartPanel.classList.add('active');
            document.getElementById('cart-backdrop').classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    const closeCartFunc = () => {
        if (cartPanel) cartPanel.classList.remove('active');
        if (document.getElementById('cart-backdrop')) document.getElementById('cart-backdrop').classList.remove('active');
        document.body.style.overflow = '';
    };

    if (document.getElementById('close-cart')) {
        document.getElementById('close-cart').addEventListener('click', closeCartFunc);
    }
    if (document.getElementById('cart-backdrop')) {
        document.getElementById('cart-backdrop').addEventListener('click', closeCartFunc);
    }

    // --- Enhanced Checkout Handoff ---
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const name = document.getElementById('guest-name').value.trim();
            const email = document.getElementById('guest-email') ? document.getElementById('guest-email').value.trim() : '';
            const phone = document.getElementById('guest-phone').value.trim();
            const type = orderTypeSelect ? orderTypeSelect.value : 'pickup';
            const address = document.getElementById('guest-address') ? document.getElementById('guest-address').value.trim() : '';
            const table = document.getElementById('guest-table') ? document.getElementById('guest-table').value.trim() : '';

            // Validation
            if (!name || !phone || !email) {
                alert('Please provide your name, phone, and email to continue.');
                return;
            }
            if (type === 'delivery' && !address) {
                alert('Please provide your delivery address.');
                return;
            }
            if (type === 'eatin' && !table) {
                alert('Please provide your table number.');
                return;
            }

            // Calculation Constants
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const deliveryFee = (type === 'delivery' && subtotal < 1500) ? 100 : 0;
            const grandTotal = subtotal + deliveryFee;

            // Build Message
            const orderLines = cart.map(item =>
                `• ${item.name} x${item.quantity} — KSH ${(item.price * item.quantity).toLocaleString()}`
            ).join('\n');
            const typeLabel = type === 'delivery' ? 'Delivery' : (type === 'eatin' ? `Eat-in (Table ${table})` : 'Pick-up');
            const deliveryNote = type === 'delivery' ? `\n*Address:* ${address}\n*Delivery Fee:* KSH ${deliveryFee.toLocaleString()}` : '';

            const waMessage =
                `*🍽️ New Order — Azure Bay*\n\n` +
                `*Name:* ${name}\n` +
                `*Phone:* ${phone}\n` +
                `*Email:* ${email}\n` +
                `*Order Type:* ${typeLabel}` +
                deliveryNote +
                `\n\n*Items:*\n${orderLines}\n\n` +
                `*Subtotal: KSH ${subtotal.toLocaleString()}*\n` +
                `*Total: KSH ${grandTotal.toLocaleString()}*\n\n` +
                `_Sent via Azure Bay online ordering_`;

            const waUrl = `https://wa.me/254102880577?text=${encodeURIComponent(waMessage)}`;

            // 1. Instant WhatsApp Dispatch (Avoids Pop-up Blocker)
            const waWindow = window.open(waUrl, '_blank');

            // 2. EmailJS Confirmation Send (Simulation/Async)
            if (typeof emailjs !== 'undefined') {
                emailjs.send("service_placeholder", "template_placeholder", {
                    to_name: name,
                    to_email: email,
                    order_details: orderLines,
                    order_total: grandTotal.toLocaleString(),
                    order_type: typeLabel
                }).then(() => console.log('Confirmation email sent.')).catch(err => console.error('Email failed:', err));
            }

            // 3. Update Success Overlay
            if (handoffOverlay) {
                document.getElementById('handoff-title').textContent = `Order Placed, ${name.split(' ')[0]}!`;
                if (document.getElementById('order-success-details')) document.getElementById('order-success-details').style.display = 'block';
                if (document.getElementById('handoff-summary')) document.getElementById('handoff-summary').style.display = 'block';
                
                handoffOverlay.classList.add('active');
            }

            // Clear cart
            cart = [];
            localStorage.removeItem('azure_cart');
            updateCartUI();
        });
    }

    updateCartUI();
});

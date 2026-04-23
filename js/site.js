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

    // Dismiss Announcement Bar
    const closeAnnounce = document.getElementById('close-announcement');
    const announceBar = document.getElementById('announcement-bar');
    if (closeAnnounce && announceBar) {
        closeAnnounce.addEventListener('click', () => {
            announceBar.style.display = 'none';
            // Adjust header top if necessary
            document.body.style.paddingTop = '0';
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
    const currentPath = window.location.pathname;
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        let href = item.getAttribute('href');
        if (href) {
            // Normalize href for comparison (remove relative indicators)
            const normalizedHref = href.replace(/\.\.\//g, '/').replace(/\/$/, '');
            const normalizedPath = currentPath.replace(/\/$/, '');
            
            if (normalizedPath === normalizedHref || (normalizedHref === '' && normalizedPath === '')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
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

    // --- Universal Form Handling (Formspree + EmailJS) ---
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrerqnay";

    const submitToFormspree = async (formElement, successTitle, successMsg) => {
        const formData = new FormData(formElement);
        // Use a hidden loader or button state
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : "Submit";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Processing...";
        }

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                if (formElement.id === 'orderForm') {
                    // Order specific success handled in checkoutBtn listener
                } else {
                    showSuccess(formElement.id, successMsg);
                }
                return true;
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            alert("Oops! There was a problem submitting your request. Please try again or contact us directly.");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
            return false;
        }
    };

    // 3. Reservation Form Handler
    const reserveForm = document.getElementById('reserveForm');
    if (reserveForm) {
        reserveForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await submitToFormspree(reserveForm, "Booking Sent", "Your reservation request has been received. We will confirm your table via email shortly.");
        });
    }

    // 4. Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await submitToFormspree(contactForm, "Message Received", "Thank you for reaching out. Our team will get back to you within 24 hours.");
        });
    }

    // 5. Newsletter Forms
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            if (!emailInput) return;

            // Artificial success for newsletter to keep it quick
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = "Subscribed!";
            submitBtn.disabled = true;

            // Background submit
            fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
        });
    });

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

    // EmailJS Init
    if (typeof emailjs !== 'undefined') {
        emailjs.init("HZJp6uWwuezAcfzFw");
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

        // Populate Standalone Order Page Summary (order/)
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

    // Populate order/ Menu Grid if present
    if (orderMenuGrid) {
        const menuData = [
            { id: 'p1', name: 'Swahili Garlic Prawns', price: 1850 },
            { id: 'p5', name: 'Lamu Crab Cakes', price: 2100 },
            { id: 'p6', name: 'Beef Samosas (3)', price: 950 },
            { id: 'p7', name: 'Malindi Calamari', price: 1600 },
            { id: 'p2', name: 'Grilled Whole Tilapia', price: 2450 },
            { id: 'p8', name: 'Red Snapper', price: 2800 },
            { id: 'p9', name: 'Beef Biryani', price: 2100 },
            { id: 'p10', name: 'Chicken Pilau', price: 1950 },
            { id: 'p3', name: 'Diani Lobster tail', price: 4250 },
            { id: 'p12', name: 'Samaki wa Kupaka', price: 2300 },
            { id: 'p11', name: 'Zanzibar Platter (2)', price: 7500 },
            { id: 'p13', name: 'Mango Mousse', price: 850 },
            { id: 'p4', name: 'Nairobi Spritz', price: 1100 },
            { id: 'p14', name: 'Classic Dawa', price: 950 }
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

    if (goToInfoBtn) {
        goToInfoBtn.addEventListener('click', () => {
            // Determine if we are on the full order page or just the menu page cart
            const isOrderPage = window.location.pathname.includes('/order/');
            
            if (!isOrderPage) {
                // If on menu page or similar, redirect to full order page
                // We determine the correct relative path based on our script location
                const scriptTag = document.querySelector('script[src*="site.js"]');
                const isSubfolder = scriptTag && scriptTag.getAttribute('src').startsWith('../');
                const target = isSubfolder ? '../order/' : 'order/';
                window.location.href = target;
            } else {
                // We are already on the order page, try to switch to details view or scroll to form
                if (viewItems) viewItems.classList.remove('active');
                if (viewInfo) {
                    viewInfo.classList.add('active');
                } else {
                    // Fallback: if viewInfo doesn't exist, scroll to the order form
                    const orderForm = document.getElementById('orderForm');
                    if (orderForm) orderForm.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    if (backToItemsBtn) {
        backToItemsBtn.addEventListener('click', () => {
            if (viewInfo) viewInfo.classList.remove('active');
            if (viewItems) viewItems.classList.add('active');
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

    // --- Enhanced Checkout Handoff (Final Build) ---
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('guest-name').value.trim();
            const email = document.getElementById('guest-email').value.trim();
            const phone = document.getElementById('guest-phone').value.trim();
            const type = orderTypeSelect ? orderTypeSelect.value : 'pickup';
            const address = document.getElementById('guest-address') ? document.getElementById('guest-address').value.trim() : '';
            const table = document.getElementById('guest-table') ? document.getElementById('guest-table').value.trim() : '';

            // Validation (Standard HTML5 handled by 'required', but extra check for type specifics)
            if (type === 'delivery' && !address) { alert('Please provide your delivery address.'); return; }
            if (type === 'eatin' && !table) { alert('Please provide your table number.'); return; }

            // Calculation Constants
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const deliveryFee = (type === 'delivery' && subtotal < 1500) ? 100 : 0;
            const grandTotal = subtotal + deliveryFee;

            // Build Itemized Lists
            const orderLinesText = cart.map(item =>
                `• ${item.name} x${item.quantity} — KSH ${(item.price * item.quantity).toLocaleString()}`
            ).join('\n');

            const orderLinesHTML = cart.map(item =>
                `<li><strong>${item.name}</strong> x ${item.quantity} — KSH ${(item.price * item.quantity).toLocaleString()}</li>`
            ).join('');

            const typeLabel = type === 'delivery' ? 'Delivery' : (type === 'eatin' ? `Eat-in (Table ${table})` : 'Pick-up');
            const deliveryNote = type === 'delivery' ? `\n*Address:* ${address}\n*Delivery Fee:* KSH ${deliveryFee.toLocaleString()}` : '';

            // 1. Prepare Hidden Field for Formspree (Merchant Record)
            const hiddenDetails = document.getElementById('hidden_order_details');
            if (hiddenDetails) {
                hiddenDetails.value = `Items:\n${orderLinesText}\n\nTotal: KSH ${grandTotal.toLocaleString()}\nType: ${typeLabel}\nAddress/Table: ${address || table}`;
            }

            // 2. Open WhatsApp (Real-time Merchant Interaction)
            const waMessage =
                `*🍽️ New Order — Azure Bay*\n\n` +
                `*Name:* ${name}\n` +
                `*Phone:* ${phone}\n` +
                `*Email:* ${email}\n` +
                `*Order Type:* ${typeLabel}` +
                deliveryNote +
                `\n\n*Items:*\n${orderLinesText}\n\n` +
                `*Subtotal: KSH ${subtotal.toLocaleString()}*\n` +
                `*Total: KSH ${grandTotal.toLocaleString()}*\n\n` +
                `_Sent via Azure Bay online ordering_`;
            const waUrl = `https://wa.me/254102880577?text=${encodeURIComponent(waMessage)}`;
            window.open(waUrl, '_blank');

            // 3. Trigger Formspree (Database/Log Backup)
            submitToFormspree(orderForm, "Order Sent", "Processing...");

            // 4. Trigger EmailJS (Guest Automatic Confirmation)
            if (typeof emailjs !== 'undefined') {
                // TODO: Replace the two strings below with your real EmailJS Service ID and Template ID
                // Find them at: https://dashboard.emailjs.com/admin
                emailjs.send("YOUR_EMAILJS_SERVICE_ID", "YOUR_EMAILJS_TEMPLATE_ID", {
                    to_name: name,
                    to_email: email,
                    order_summary_html: `<ul>${orderLinesHTML}</ul>`,
                    order_total: grandTotal.toLocaleString(),
                    order_type: typeLabel,
                    delivery_info: address || table || "N/A",
                    payment_info: "Lipa Na M-Pesa Till: 557766 (Azure Bay)"
                }).then(() => console.log('Guest receipt sent.')).catch(err => console.error('Email failed:', err));
            }

            // 5. Success Overlay UI
            if (handoffOverlay) {
                document.getElementById('handoff-title').textContent = `Order Placed, ${name.split(' ')[0]}!`;
                if (document.getElementById('order-success-details')) document.getElementById('order-success-details').style.display = 'block';
                if (document.getElementById('mpesa-amount')) document.getElementById('mpesa-amount').textContent = `KSH ${grandTotal.toLocaleString()}`;
                handoffOverlay.classList.add('active');
            }

            // Clear cart
            cart = [];
            localStorage.removeItem('azure_cart');
            updateCartUI();
        });
    }

    // --- UI/UX & Accessibility Enhancements ---

    // 1. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 2. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // 3. Reading Progress Bar (for Blog Posts)
    const progressBar = document.querySelector('.reading-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }

    // 4. Mobile Drawer Accessibility (Focus Trap)
    if (drawer && drawerTrigger && overlay) {
        const focusableElements = drawer.querySelectorAll('a, button, input, textarea, select');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        drawerTrigger.setAttribute('aria-expanded', 'false');
        drawerTrigger.setAttribute('aria-controls', 'mobile-drawer');

        drawerTrigger.addEventListener('click', () => {
            drawerTrigger.setAttribute('aria-expanded', 'true');
            setTimeout(() => { if (firstFocusable) firstFocusable.focus(); }, 300);
        });

        overlay.addEventListener('click', () => {
            drawerTrigger.setAttribute('aria-expanded', 'false');
            drawerTrigger.focus();
        });

        drawer.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        if (lastFocusable) lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        if (firstFocusable) firstFocusable.focus();
                    }
                }
            }
            if (e.key === 'Escape') {
                drawer.classList.remove('active');
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                drawerTrigger.setAttribute('aria-expanded', 'false');
                drawerTrigger.focus();
            }
        });
    }

    // 5. Toast Notification Helper
    const showToast = (message) => {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    // 6. Copy Till Number Logic
    document.addEventListener('click', (e) => {
        const tillSpan = e.target.closest('.copy-till');
        if (tillSpan) {
            const till = tillSpan.getAttribute('data-till') || tillSpan.textContent;
            navigator.clipboard.writeText(till.replace(/\D/g, '')).then(() => {
                showToast(`Till Number ${till} Copied!`);
            });
        }
    });

    updateCartUI();
});

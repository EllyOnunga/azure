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
});

document.addEventListener('DOMContentLoaded', () => {
    // Add sticky class to header on scroll
    const header = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Standard elements
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    // --- PHASE 2: SCROLL REVEAL LOGIC ---
    function initScrollRevealAnimations() {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const main = document.querySelector('main');
        if (!main || reduceMotion) return;

        const baseSelector = 'h1, h2, h3, h4, p, li, img, .btn, .section-header, .about-glass-card, .service-card, .system-card, .integration-card, .project-card, .product-card, .feature-card, .stat-item';
        const candidates = main.querySelectorAll(baseSelector);

        // Group-based delays for grid layouts
        const containers = main.querySelectorAll('section, .hero, .about-glass-grid, .solutions-grid, .projects-list, .stats-container');
        const processed = new Set();

        containers.forEach(container => {
            const items = container.querySelectorAll(baseSelector);
            items.forEach((item, idx) => {
                if (processed.has(item)) return;
                processed.add(item);
                item.classList.add('reveal-on-scroll');
                // Incremental delay per grid item
                item.style.setProperty('--reveal-delay', `${Math.min(idx * 75, 600)}ms`);
                
                // Add specific variants
                if (item.tagName === 'IMG' || item.classList.contains('product-card')) {
                    item.classList.add('reveal-zoom');
                } else if (idx % 3 === 1) {
                    item.classList.add('reveal-left');
                } else if (idx % 3 === 2) {
                    item.classList.add('reveal-right');
                }
            });
        });

        // Sequence for HERO specifically
        const heroItems = main.querySelectorAll('.hero h1, .hero h2, .hero p, .hero .btn, .hero .hero-trust span, .phone-mockup-placeholder');
        heroItems.forEach((item, idx) => {
            item.classList.add('reveal-on-scroll');
            item.style.setProperty('--reveal-delay', `${200 + idx * 150}ms`);
            if (item.classList.contains('phone-mockup-placeholder')) item.classList.add('reveal-zoom');
        });

        // Intersection Observer
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

        main.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    }
    initScrollRevealAnimations();

    // Mobile menu toggle
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            navActions.classList.toggle('mobile-active');
            
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('mobile-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- PHASE 3: BUTTON HOVER EFFCTS ---
    const allBtns = document.querySelectorAll('.btn');
    allBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px) scale(1.02)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });


    // --- STATS COUNTER ANIMATION ---
    function initCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;

        const animate = (el) => {
            const target = +el.getAttribute('data-target');
            let count = 0;
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const step = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic for more natural feel
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentCount = Math.floor(easeOut * target);
                
                el.innerText = '+' + currentCount.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.innerText = '+' + target.toLocaleString();
                }
            };
            requestAnimationFrame(step);
        };

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            counters.forEach(c => observer.observe(c));
        } else {
            counters.forEach(c => animate(c));
        }
    }
    initCounterAnimations();

    // Close mobile menu on link click
    const mobileLinks = document.querySelectorAll('.nav-item, .nav-actions .btn, .dropdown-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('mobile-active');
                navActions.classList.remove('mobile-active');
                if (menuBtn) {
                    const icon = menuBtn.querySelector('i');
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // --- STORE LOGIC ---
    // 1. Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                productCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        card.style.animation = 'slideIn 0.4s ease'; // Simple transition
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 2. Shopping Cart Array & UI
    let cart = [];
    const cartToggleBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total');

    function toggleCart() {
        if(cartSidebar) {
            cartSidebar.classList.toggle('active');
            cartOverlay.classList.toggle('active');
        }
    }
    
    if(cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Add to Cart
    const addBtns = document.querySelectorAll('.add-to-cart');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));

            // Check array
            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            // Visual feedback on the button
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            btn.style.background = 'var(--brand-orange)';
            setTimeout(() => {
                btn.innerHTML = originalIcon;
                btn.style.background = ''; // reset
            }, 1000);

            // Update UI list
            updateCartUI();
        });
    });

    function updateCartUI() {
        if(!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        let totalItems = 0;
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Tu carrito está vacío</div>';
        } else {
            cart.forEach((item, index) => {
                totalItems += item.quantity;
                totalPrice += (item.price * item.quantity);

                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</span>
                    </div>
                    <button class="remove-item" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                `;
                cartItemsContainer.appendChild(div);
            });
        }

        if(cartCount) {
             cartCount.innerText = totalItems;
             // Tiny animation on badge update
             cartCount.style.transform = 'scale(1.5)';
             setTimeout(() => cartCount.style.transform = 'scale(1)', 200);
        }
        if(cartTotalPrice) cartTotalPrice.innerText = '$' + totalPrice.toFixed(2);

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cart.splice(idx, 1); // remove from array
                updateCartUI();
            });
        });
    }

    // --- NEW HERO ANIMATIONS LOGIC ---
    
    // Hero Carousel Logic
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Change image every 5 seconds
    }

    // Particle Canvas Logic
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5; // Small falling tech spots
                this.speedY = Math.random() * 1.5 + 0.5; // falling speed down
                this.opacity = Math.random() * 0.5 + 0.3; // Glow opacity
            }
            update() {
                this.y += this.speedY; // Falling down 
                if (this.y > canvas.height) { // If it goes off screen bottom
                    this.y = 0; // Back to top
                    this.x = Math.random() * canvas.width;
                }
            }
            draw() {
                ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity})`; // Neon Cyan
                ctx.shadowBlur = 15; // Tech glow
                ctx.shadowColor = '#00E5FF';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.width * canvas.height) / 7000;
            // Mobile optimization: use fewer particles on small screens
            if (window.innerWidth <= 768) {
                numberOfParticles = numberOfParticles / 2;
            }
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // --- WHATSAPP INTEGRATION & FORMS ---
    const WHATSAPP_PHONE = '51906681667';

    function formatWhatsAppOrder(cart, userDetails) {
        let message = `🚀 *NUEVO PEDIDO SAIDEX 4.0*\n`;
        message += `---------------------------\n`;
        message += `👤 *Cliente:* ${userDetails.name}\n`;
        message += `📍 *Dirección:* ${userDetails.address}\n\n`;
        message += `🛒 *PRODUCTOS:*\n`;
        
        let total = 0;
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            message += `- ${item.quantity}x ${item.name} ... $${subtotal.toFixed(2)}\n`;
            total += subtotal;
        });

        message += `\n---------------------------\n`;
        message += `💰 *TOTAL A PAGAR:* $${total.toFixed(2)}\n`;
        message += `---------------------------\n`;
        message += `_Enviado desde la Tienda Inteligente_`;
        return encodeURIComponent(message);
    }

    function sendToWhatsApp(message) {
        // Unique Design: Loading animation before redirection
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(2, 6, 23, 0.95); backdrop-filter: blur(10px);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 10000; color: #FFF; font-family: 'Inter', sans-serif;
        `;
        overlay.innerHTML = `
            <div class="loader-neon" style="width: 60px; height: 60px; border: 4px solid #00E5FF; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 20px; box-shadow: 0 0 20px #00E5FF;"></div>
            <h3 style="letter-spacing: 2px; color: #00E5FF; text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);">CONECTANDO CON SAIDEX...</h3>
            <p style="margin-top: 10px; opacity: 0.7;">Sincronizando despacho por WhatsApp</p>
            <style> @keyframes spin { to { transform: rotate(360deg); } } </style>
        `;
        document.body.appendChild(overlay);

        setTimeout(() => {
            window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank');
            document.body.removeChild(overlay);
        }, 1500);
    }

    // --- VISIT MODAL LOGIC (Updated for WA) ---
    const visitModal = document.getElementById('visit-modal');
    const openVisitBtn = document.getElementById('btn-agenda-visita');
    const closeVisitBtn = document.getElementById('close-visit-modal');
    const visitForm = document.getElementById('visita-tecnica-form');

    if (openVisitBtn && visitModal) {
        openVisitBtn.addEventListener('click', () => {
            visitModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        closeVisitBtn.addEventListener('click', () => {
            visitModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (e) => {
            if (e.target === visitModal) {
                visitModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        if (visitForm) {
            visitForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = visitForm.querySelector('.btn-submit');
                
                // Get data
                const name = visitForm.querySelector('input[type="text"]').value;
                const phone = visitForm.querySelector('input[type="tel"]').value;
                const type = visitForm.querySelector('select').value;
                const date = visitForm.querySelector('input[type="date"]').value;
                const desc = visitForm.querySelector('textarea').value;

                let waMsg = `🛠 *SOLICITUD TÉCNICA ESPECIALIZADA*\n`;
                waMsg += `---------------------------\n`;
                waMsg += `👤 *Nombre:* ${name}\n`;
                waMsg += `📞 *Teléfono:* ${phone}\n`;
                waMsg += `⚙️ *Servicio:* ${type}\n`;
                waMsg += `📅 *Fecha:* ${date}\n`;
                waMsg += `📝 *Detalle:* ${desc || 'Sin comentarios'}\n`;
                waMsg += `---------------------------\n`;
                waMsg += `_Sincronizado vía SAIDEX Web_`;

                sendToWhatsApp(encodeURIComponent(waMsg));
                visitForm.reset();
                visitModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }

    // --- STORE CHECKOUT LOGIC ---
    const checkoutBtn = document.querySelector('.btn-checkout'); // Added in HTML
    const checkoutModal = document.getElementById('checkout-modal'); // Added in HTML
    const closeCheckoutBtn = document.getElementById('close-checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('El carrito está vacío');
                return;
            }
            checkoutModal.classList.add('active');
            // Hide cart sidebar
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
        });

        closeCheckoutBtn.addEventListener('click', () => checkoutModal.classList.remove('active'));
        
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const userData = {
                    name: document.getElementById('check-name').value,
                    address: document.getElementById('check-address').value
                };
                
                const message = formatWhatsAppOrder(cart, userData);
                sendToWhatsApp(message);
                
                // Finalize
                checkoutModal.classList.remove('active');
                cart = [];
                updateCartUI();
            });
        }
    }


});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader logic
    const preloader = document.getElementById('preloader');
    
    // Exact 2 seconds as requested
    setTimeout(() => {
        if(preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
                preloader.style.display = 'none';
                initGSAPAnimations();
            }, 500); // Wait for transition
        } else {
            initGSAPAnimations();
        }
    }, 2000);

    // 2. Sticky Navbar & Active Link
    const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
    
    // Check main nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Check dropdown items
    document.querySelectorAll('.dropdown-item').forEach(item => {
        if (item.getAttribute('href') === currentLocation) {
            item.classList.add('active');
            // Highlight the parent dropdown link as well
            const parentDropdown = item.closest('.dropdown');
            if (parentDropdown) {
                const parentLink = parentDropdown.querySelector('.nav-link');
                if (parentLink) parentLink.classList.add('active');
            }
        } else {
            item.classList.remove('active');
        }
    });

    const navbar = document.getElementById('main-navbar');
    if (navbar) {
        document.body.classList.add('has-fixed-navbar');
        const updateNavbarOffset = () => {
            const wasScrolled = navbar.classList.contains('scrolled');
            if (wasScrolled) navbar.classList.remove('scrolled');
            const h = navbar.offsetHeight;
            if (wasScrolled) navbar.classList.add('scrolled');
            if (h > 0) {
                document.body.style.paddingTop = h + 'px';
            }
        };
        updateNavbarOffset();
        window.addEventListener('resize', updateNavbarOffset);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 3. Init AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // 4. GSAP Animations (Triggered after preloader)
    function initGSAPAnimations() {
        if (typeof gsap === 'undefined') return;
        
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline();

        // Hero Sequence
        if (document.querySelector('.hero-title')) {
            tl.fromTo('.hero-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
              .fromTo('.hero-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
              .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
              .fromTo('.hero-cta a', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }, "-=0.4");
              
            if(document.querySelector('.hero-main-img')) {
                tl.fromTo('.hero-main-img', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1 }, "-=1");
                
                // Floating cards
                tl.fromTo('.card-1', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.5");
                tl.fromTo('.card-2', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.4");
                
                // Continuous floating effect
                gsap.to('.card-1', {
                    y: -15,
                    duration: 2.5,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut"
                });
                gsap.to('.card-2', {
                    y: 15,
                    duration: 3,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut"
                });
            }
        }
    }

    // 5. Date input click handler
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.addEventListener('click', () => {
            if (typeof input.showPicker === 'function') {
                try { input.showPicker(); } catch(e) {}
            }
        });
    });

    // 6. Number Counter Animation (Count Up on Scroll)
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.counter-value');
        if (!counters.length) return;

        const animateCounter = (el) => {
            const target = parseFloat(el.getAttribute('data-target')) || 0;
            const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = parseInt(el.getAttribute('data-duration') || '1800', 10);
            const startTime = performance.now();

            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // easeOutExpo for ultra-smooth deceleration
                const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = (target * ease);

                const formatted = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();
                el.textContent = `${prefix}${formatted}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    const finalFormatted = decimals > 0 ? target.toFixed(decimals) : target.toString();
                    el.textContent = `${prefix}${finalFormatted}${suffix}`;
                    el.classList.add('counted');
                }
            };

            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -20px 0px'
        });

        counters.forEach(counter => observer.observe(counter));
    }

    initCounterAnimation();
});



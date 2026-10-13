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
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

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
});


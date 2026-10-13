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
                initCounterAnimation();
            }, 500); // Wait for transition
        } else {
            initGSAPAnimations();
            initCounterAnimation();
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

    // 2.1 Mobile Offcanvas Menu - Prevent Background Scrolling
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        let savedScrollY = 0;

        mobileMenu.addEventListener('show.bs.offcanvas', () => {
            savedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
            document.documentElement.classList.add('mobile-menu-active');
            document.body.classList.add('mobile-menu-active');
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${savedScrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
        });

        mobileMenu.addEventListener('hidden.bs.offcanvas', () => {
            document.documentElement.classList.remove('mobile-menu-active');
            document.body.classList.remove('mobile-menu-active');
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            window.scrollTo(0, savedScrollY);
        });

        // Prevent touch propagation from outside the scrollable offcanvas body
        mobileMenu.addEventListener('touchmove', (e) => {
            if (!e.target.closest('.offcanvas-body')) {
                e.preventDefault();
            }
        }, { passive: false });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992 && document.body.classList.contains('mobile-menu-active')) {
                if (typeof bootstrap !== 'undefined' && bootstrap.Offcanvas) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
                    if (bsOffcanvas) bsOffcanvas.hide();
                }
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
            if (el.classList.contains('counted')) return;
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
            threshold: 0.1,
            rootMargin: '0px 0px -10px 0px'
        });

        counters.forEach(counter => observer.observe(counter));
    }

    // 7. Global 404 Routing for Specified Action Buttons and Social Icons
    const targetPhrases = [
        'explore services',
        'book instant visit',
        'read our story',
        'explore hospital story',
        'book visit',
        'view all 12 departments',
        'all departments (12)',
        'visit our full faq knowledgebase',
        'full faq knowledgebase',
        'knowledgebase',
        'book consultation',
        'book consultation slot',
        'schedule a consultation',
        'campus map & parking',
        'campus map and parking',
        'campus map',
        'read more',
        'read full article',
        'read all articles',
        'book package',
        '1-800-stackly',
        'call: 1-800-stackly',
        'get directions',
        'browse all doctors & timings',
        'browse all doctors and timings',
        'browse all doctors',
        'explore all facilities',
        'explore facilities',
        'consult now',
        'consult specialists',
        'emergency call',
        'call emergency',
        'book checkup',
        'book executive plan',
        'book cardiac plan',
        'book women\'s plan',
        'view all specialists',
        'find specialists',
        'explore specialties',
        'view profile',
        'open in maps',
        // Additional requested targets
        'filter doctors',
        'book second opinion',
        'second opinion',
        'call hotline',
        'hotline',
        'submit enquiry',
        'submit query',
        'submit application',
        'apply now',
        'send spontaneous cv',
        'spontaneous cv',
        'insurance faq',
        'global services',
        'support@stacklyhealth.com',
        '+1 (555) 911-0000',
        '+1 (555) 234-8900',
        '555-911-0000',
        '555-234-8900'
    ];

    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button, .filter-pill, .page-link');
        if (!target) return;

        // Skip main navbar links and modal close triggers
        if (target.classList.contains('nav-link') || 
            target.classList.contains('dropdown-item') || 
            target.classList.contains('navbar-brand') ||
            target.classList.contains('btn-close') ||
            target.classList.contains('navbar-toggler') ||
            target.id === 'sendMessageBtn' ||
            target.closest('#contactForm') ||
            (target.closest('#main-navbar, #mobileMenu') && (target.classList.contains('nav-link') || target.classList.contains('dropdown-item') || target.getAttribute('href') === 'login.html' || target.getAttribute('href') === 'signup.html' || target.getAttribute('href') === 'index.html'))) {
            return;
        }

        // 0. Footer Newsletter Subscribe Button
        const text = (target.textContent || '').trim().toLowerCase().replace(/\s+/g, ' ');
        if (target.closest('footer') && (text === 'subscribe' || text.includes('subscribe'))) {
            const form = target.closest('form');
            if (form) {
                const emailInput = form.querySelector('input[type="email"], input[type="text"]');
                if (emailInput && !emailInput.value.trim()) {
                    emailInput.focus();
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                let msgEl = form.parentElement.querySelector('.subscription-success-msg');
                if (!msgEl) {
                    msgEl = document.createElement('div');
                    msgEl.className = 'subscription-success-msg mt-3 text-white fw-bold d-flex align-items-center gap-2';
                    msgEl.style.cssText = 'background: rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 50px; border: 1px solid rgba(255, 255, 255, 0.4); font-size: 0.95rem; width: fit-content;';
                    msgEl.innerHTML = '<i class="bi bi-check-circle-fill text-warning"></i> Thank You For Subscription';
                    form.parentElement.appendChild(msgEl);
                } else {
                    msgEl.style.display = 'flex';
                }

                target.disabled = true;

                setTimeout(() => {
                    try {
                        sessionStorage.setItem('resetFooterForm', 'true');
                        if (emailInput) emailInput.value = '';
                        if (form) form.reset();
                        if (msgEl) msgEl.style.display = 'none';
                        target.disabled = false;
                    } catch (err) {}
                    window.location.href = '404.html';
                }, 1500);

                return;
            }
        }

        // 1. Social icon link
        if (target.classList.contains('footer-social-icon') || 
            target.classList.contains('social-icon') ||
            target.closest('.footer-social-icons') ||
            target.querySelector('.bi-facebook, .bi-twitter, .bi-twitter-x, .bi-instagram, .bi-linkedin, .bi-youtube')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.location.href = '404.html';
            return;
        }

        // 2. Pagination links / buttons
        if (target.classList.contains('page-link') || target.closest('.pagination')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.location.href = '404.html';
            return;
        }

        // 3. Popular Patient Links (FAQ or anywhere)
        const popularCard = target.closest('#popularPatientLinksCard, .card');
        if (popularCard && popularCard.textContent.toLowerCase().includes('popular patient links')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.location.href = '404.html';
            return;
        }

        // 4. Careers Apply Now & Spontaneous CV
        if (target.classList.contains('apply-btn') || 
            target.id === 'openGeneralApply' || 
            target.id === 'spontaneousApplyBtn') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.location.href = '404.html';
            return;
        }

        // 5. Filter Doctors button
        if (target.id === 'searchBtn') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.location.href = '404.html';
            return;
        }

        // 6. Search buttons (FAQ search, Blog search, any search icon click)
        if (target.id === 'clearFaqSearch' || 
            target.id === 'blogSearchBtn' ||
            target.querySelector('.bi-search') ||
            target.classList.contains('bi-search') ||
            (target.closest('#blogSearchWidget') && (target.tagName === 'BUTTON' || target.querySelector('.bi-search'))) ||
            (target.closest('.search-box, .search-widget, .widget_search, .input-group') && (target.tagName === 'BUTTON' || target.querySelector('.bi-search')))) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.location.href = '404.html';
            return;
        }

        // 7. Blog Widgets: Categories, Trending Posts, Popular Tags
        const blogWidget = target.closest('#blogCategoriesWidget, #blogTrendingWidget, #blogTagsWidget');
        if (blogWidget) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.location.href = '404.html';
            return;
        }

        const href = (target.getAttribute('href') || '').toLowerCase();
        const title = (target.getAttribute('title') || '').toLowerCase();

        // 8. Phone / email button / links (Hotlines, Support desk, etc.)
        if (href.startsWith('tel:') || href.startsWith('mailto:')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.location.href = '404.html';
            return;
        }

        // Exact or phrase matching
        const matchesPhrase = targetPhrases.some(phrase => {
            return text.includes(phrase) || title.includes(phrase);
        });

        // Word-level matching
        const matchesWords = (
            text === 'book' ||
            text === 'book now' ||
            text.startsWith('book ') ||
            text === 'consult' ||
            text === 'consult now' ||
            text.startsWith('consult ') ||
            text === 'profile' ||
            text === 'view profile' ||
            text === 'search' ||
            text.startsWith('search ') ||
            text.includes('1-800-stackly')
        );

        // Href matching
        const matchesHref = href.includes('1-800-stackly') || 
                            href.includes('5559110000') ||
                            href.includes('5552348900') ||
                            href.includes('facebook.com') || 
                            href.includes('twitter.com') || 
                            href.includes('instagram.com') || 
                            href.includes('linkedin.com') || 
                            href.includes('youtube.com');

        if (matchesPhrase || matchesWords || matchesHref) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.location.href = '404.html';
        }
    }, true);

    // Form submit matching for "Book Instant Visit", enquiries, questions, search, etc.
    document.addEventListener('submit', (e) => {
        const form = e.target;
        if (form.id === 'loginForm' || form.id === 'signupForm' || form.id === 'contactForm') return;

        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        const btnText = submitBtn ? (submitBtn.textContent || submitBtn.value || '').trim().toLowerCase() : '';
        const formText = (form.textContent || '').toLowerCase();

        // Footer Newsletter Subscription submit
        const isFooterForm = form.closest('footer') || form.classList.contains('footer-subscribe-form') || form.querySelector('input[placeholder*="Email Address"]');
        if (isFooterForm && (btnText.includes('subscribe') || formText.includes('subscribe') || form.querySelector('input[type="email"]'))) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const emailInput = form.querySelector('input[type="email"], input[type="text"]');
            if (emailInput && !emailInput.value.trim()) {
                emailInput.focus();
                return;
            }

            let msgEl = form.parentElement.querySelector('.subscription-success-msg');
            if (!msgEl) {
                msgEl = document.createElement('div');
                msgEl.className = 'subscription-success-msg mt-3 text-white fw-bold d-flex align-items-center gap-2';
                msgEl.style.cssText = 'background: rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 50px; border: 1px solid rgba(255, 255, 255, 0.4); font-size: 0.95rem; width: fit-content;';
                msgEl.innerHTML = '<i class="bi bi-check-circle-fill text-warning"></i> Thank You For Subscription';
                form.parentElement.appendChild(msgEl);
            } else {
                msgEl.style.display = 'flex';
            }

            if (submitBtn) {
                submitBtn.disabled = true;
            }

            setTimeout(() => {
                try {
                    sessionStorage.setItem('resetFooterForm', 'true');
                    if (emailInput) emailInput.value = '';
                    if (form) form.reset();
                    if (msgEl) msgEl.style.display = 'none';
                    if (submitBtn) submitBtn.disabled = false;
                } catch (err) {}
                window.location.href = '404.html';
            }, 1500);

            return;
        }

        if (form.id === 'quickFaqForm' || 
            form.id === 'careerApplicationForm' ||
            form.closest('#blogSearchWidget') ||
            formText.includes('search') ||
            formText.includes('query') || 
            formText.includes('enquiry') ||
            btnText.includes('submit') ||
            btnText.includes('instant visit') || 
            btnText.includes('book checkup') ||
            btnText.includes('search')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.location.href = '404.html';
        }
    }, true);

    // Enter key press in search inputs redirects to 404
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = e.target;
            if (input && input.tagName === 'INPUT' && (input.id === 'blogSearchInput' || input.id === 'faqSearchInput' || (input.placeholder && input.placeholder.toLowerCase().includes('search medical topics')))) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                window.location.href = '404.html';
            }
        }
    }, true);

    // Function to reset forms across the site
    function resetAllPageForms() {
        // Reset footer subscription forms
        document.querySelectorAll('footer form, .footer-subscribe-form').forEach(f => {
            try { f.reset(); } catch (e) {}
            const inputs = f.querySelectorAll('input');
            inputs.forEach(inp => {
                inp.value = '';
            });
            const sBtn = f.querySelector('button[type="submit"], button');
            if (sBtn) {
                sBtn.disabled = false;
            }
        });

        document.querySelectorAll('.subscription-success-msg').forEach(msg => {
            msg.style.display = 'none';
        });

        // Reset other forms if flag is set
        if (sessionStorage.getItem('resetForms') === 'true' || sessionStorage.getItem('resetContactForm') === 'true') {
            document.querySelectorAll('form').forEach(f => {
                try { f.reset(); } catch (e) {}
                f.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea').forEach(inp => {
                    inp.value = '';
                    inp.classList.remove('is-invalid');
                    inp.style.border = '';
                });
                f.querySelectorAll('.invalid-feedback').forEach(fb => fb.style.display = 'none');
            });
            if (typeof window.resetContactForm === 'function') {
                try { window.resetContactForm(); } catch (e) {}
            }
        }
    }

    // Reset forms whenever page is loaded, navigated back (bfcache / pageshow), or window gets focus
    window.addEventListener('pageshow', (e) => {
        resetAllPageForms();
        setTimeout(resetAllPageForms, 50);
        setTimeout(resetAllPageForms, 150);
    });
    window.addEventListener('focus', resetAllPageForms);
    document.addEventListener('DOMContentLoaded', resetAllPageForms);

});

// BitsBreeze Website Main JavaScript
class BitsBreezeApp {
    constructor() {
        // Detect current language from page
        const pathname = window.location.pathname;
        const currentPage = pathname.split('/').pop() || 'index.html';
        const isEnglish = currentPage === 'index_en.html' || pathname.includes('index_en');
        this.currentLanguage = isEnglish ? 'en' : 'it';
        this.textAnimationInterval = null;
        this.init();
    }

    init() {
        this.setupParticleBackground();
        this.setupTypedText();
        this.setupScrollAnimations();
        this.setupTimelineInteractions();
        this.setupPublicationFilters();
        this.setupLanguageSwitcher();
        this.setupContactForm();
        this.setupSmoothScrolling();
        this.setupTextSplitting();
        this.setupMobileMenu();
    }

    // Particle Background Animation
    setupParticleBackground() {
        let particles = [];
        let canvas, ctx;
        
        const initParticles = () => {
            canvas = document.getElementById('particleCanvas');
            if (!canvas) return;
            
            ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Create particles
            particles = [];
            const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 3 + 1,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        };

        const animateParticles = () => {
            if (!ctx || !canvas) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(199, 125, 58, ${particle.opacity})`;
                ctx.fill();
                
                // Draw connections
                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(199, 125, 58, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animateParticles);
        };

        initParticles();
        window.addEventListener('resize', initParticles);
    }

    // Typed Text Animation - Smooth crossfade effect
    setupTypedText() {
        const typedElement = document.getElementById('typed-text');
        const typedElementNext = document.getElementById('typed-text-next');
        if (!typedElement || !typedElementNext) return;

        // Clear any existing interval
        if (this.textAnimationInterval) {
            clearInterval(this.textAnimationInterval);
            this.textAnimationInterval = null;
        }

        const messages = this.currentLanguage === 'it' ? [
            'Sviluppiamo tecnologie LENR per la produzione di calore pulito',
            'Integriamo intelligenza artificiale nella ricerca scientifica',
            'Trattiamo scorie nucleari con sensori avanzati',
            'Costruiamo il futuro dell\'energia sostenibile'
        ] : [
            'We develop LENR technologies for clean heat production',
            'We integrate artificial intelligence in scientific research',
            'We treat nuclear waste with advanced sensors',
            'We build the future of sustainable energy'
        ];

        let currentIndex = 0;
        let isAnimating = false;
        
        // Function to animate text change with smooth crossfade
        const animateTextChange = () => {
            if (isAnimating) return;
            isAnimating = true;
            
            const nextIndex = (currentIndex + 1) % messages.length;
            const nextMessage = messages[nextIndex];
            
            // Set next text
            typedElementNext.textContent = nextMessage;
            
            // Smooth crossfade animation
            anime.timeline({
                easing: 'easeInOutQuad',
                complete: () => {
                    // Swap elements
                    typedElement.textContent = nextMessage;
                    typedElement.style.opacity = '1';
                    typedElement.style.transform = 'translateY(0)';
                    typedElementNext.style.opacity = '0';
                    typedElementNext.style.transform = 'translateY(0)';
                    currentIndex = nextIndex;
                    isAnimating = false;
                }
            })
            .add({
                targets: typedElement,
                opacity: [1, 0],
                duration: 500,
                easing: 'easeInQuad'
            })
            .add({
                targets: typedElementNext,
                opacity: [0, 1],
                duration: 500,
                easing: 'easeOutQuad'
            }, '-=250'); // Overlap animations for smoother transition
        };

        // Set initial text
        typedElement.textContent = messages[0];
        typedElement.style.opacity = '1';
        typedElement.style.transform = 'translateY(0)';
        typedElementNext.style.opacity = '0';
        typedElementNext.style.transform = 'translateY(0)';
        
        // Start animation after initial delay
        setTimeout(() => {
            // Change text every 4 seconds
            this.textAnimationInterval = setInterval(animateTextChange, 4000);
        }, 2000);
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Animate timeline items
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: entry.target,
                        translateY: [50, 0],
                        opacity: [0, 1],
                        duration: 800,
                        easing: 'easeOutQuart',
                        delay: anime.stagger(200)
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.timeline-item').forEach(el => {
            timelineObserver.observe(el);
        });
    }

    // Timeline Interactions
    setupTimelineInteractions() {
        const timelineNodes = document.querySelectorAll('.timeline-node');
        
        timelineNodes.forEach(node => {
            node.addEventListener('click', (e) => {
                const item = e.target.closest('.timeline-item');
                const year = item.dataset.year;
                
                // Highlight selected item
                document.querySelectorAll('.timeline-item').forEach(el => {
                    el.classList.remove('selected');
                });
                item.classList.add('selected');
                
                // Animate the card
                anime({
                    targets: item.querySelector('.card-hover'),
                    scale: [1, 1.05, 1],
                    duration: 600,
                    easing: 'easeOutElastic(1, .8)'
                });
            });
        });
    }

    // Publication Filters
    setupPublicationFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const publicationCards = document.querySelectorAll('.publication-card');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                
                // Update active button
                filterButtons.forEach(b => {
                    b.classList.remove('active', 'bg-gray-900', 'text-white');
                    b.classList.add('bg-gray-200', 'text-gray-700');
                });
                e.target.classList.add('active', 'bg-gray-900', 'text-white');
                e.target.classList.remove('bg-gray-200', 'text-gray-700');
                
                // Filter publications
                publicationCards.forEach(card => {
                    const category = card.dataset.category;
                    const shouldShow = filter === 'all' || category === filter;
                    
                    if (shouldShow) {
                        card.style.display = 'block';
                        anime({
                            targets: card,
                            opacity: [0, 1],
                            translateY: [20, 0],
                            duration: 500,
                            easing: 'easeOutQuart'
                        });
                    } else {
                        anime({
                            targets: card,
                            opacity: [1, 0],
                            translateY: [0, -20],
                            duration: 300,
                            easing: 'easeInQuart',
                            complete: () => {
                                card.style.display = 'none';
                            }
                        });
                    }
                });
            });
        });
    }

    // Language Switcher
    setupLanguageSwitcher() {
        const languageSwitcher = document.getElementById('languageSwitcher');
        if (!languageSwitcher) return;

        languageSwitcher.addEventListener('change', (e) => {
            e.preventDefault();
            const newLanguage = e.target.value;
            const pathname = window.location.pathname;
            const currentPage = pathname.split('/').pop() || '';
            const htmlLang = document.documentElement.getAttribute('lang');
            
            // Better detection: check if we're on English page
            const isEnglish = currentPage === 'index_en.html' || 
                            pathname.includes('index_en') ||
                            htmlLang === 'en';
            
            // Only redirect if language actually needs to change
            if (newLanguage === 'en' && !isEnglish) {
                // Switch to English
                // Handle root case and subdirectory cases
                if (pathname === '/' || currentPage === '' || currentPage === 'index.html') {
                    window.location.href = './index_en.html';
                } else {
                    // Replace current filename with index_en.html
                    const newPath = pathname.replace(/\/[^/]*$/, '/index_en.html').replace(/\/index\.html$/, '/index_en.html');
                    window.location.href = newPath;
                }
            } else if (newLanguage === 'it' && isEnglish) {
                // Switch to Italian
                // Handle root case and subdirectory cases
                if (pathname === '/' || currentPage === '' || currentPage === 'index_en.html') {
                    window.location.href = './index.html';
                } else {
                    // Replace current filename with index.html
                    const newPath = pathname.replace(/\/[^/]*$/, '/index.html').replace(/\/index_en\.html$/, '/index.html');
                    window.location.href = newPath;
                }
            }
        });
    }

    // Contact Form
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = this.currentLanguage === 'it' ? 'Invio...' : 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Show success message
                this.showNotification(
                    this.currentLanguage === 'it' ? 'Messaggio inviato con successo!' : 'Message sent successfully!',
                    'success'
                );
                
                // Reset form
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Mobile Menu
    setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobileMenu');
        const menuIcon = document.getElementById('menuIcon');
        const closeIcon = document.getElementById('closeIcon');
        
        if (!mobileMenuButton || !mobileMenu) return;
        
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            
            if (isOpen) {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            } else {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('open');
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            }
        });
        
        // Close menu when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                if (mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    mobileMenu.classList.add('hidden');
                    menuIcon.classList.remove('hidden');
                    closeIcon.classList.add('hidden');
                }
            }
        });
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed header
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Text Splitting Animation
    setupTextSplitting() {
        Splitting();
        
        // Animate split text on scroll
        const splitTextObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const chars = entry.target.querySelectorAll('.char');
                    anime({
                        targets: chars,
                        translateY: [100, 0],
                        opacity: [0, 1],
                        duration: 1000,
                        delay: anime.stagger(50),
                        easing: 'easeOutExpo'
                    });
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-splitting]').forEach(el => {
            splitTextObserver.observe(el);
        });
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white max-w-sm ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutQuart'
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 300],
                opacity: [1, 0],
                duration: 500,
                easing: 'easeInQuart',
                complete: () => {
                    document.body.removeChild(notification);
                }
            });
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BitsBreezeApp();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Reinitialize particle background on resize
    setTimeout(() => {
        if (window.bitsBreezeApp) {
            window.bitsBreezeApp.setupParticleBackground();
        }
    }, 100);
});

// Add loading animation
window.addEventListener('load', () => {
    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        anime({
            targets: loader,
            opacity: [1, 0],
            duration: 500,
            complete: () => {
                loader.style.display = 'none';
            }
        });
    }
    
    // Animate hero elements
    anime.timeline()
        .add({
            targets: '.hero-bg h1',
            translateY: [100, 0],
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeOutQuart'
        })
        .add({
            targets: '.hero-bg .btn-primary, .hero-bg .border-2',
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 800,
            delay: anime.stagger(200),
            easing: 'easeOutQuart'
        }, '-=500');
});

// Export for global access
window.bitsBreezeApp = new BitsBreezeApp();
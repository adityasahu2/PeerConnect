// Theme Toggle
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        this.themeIcon = this.themeToggle.querySelector('i');
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.body.classList.toggle('dark-mode', savedTheme === 'dark');
            this.updateThemeIcon();
        }

        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        if (window.matchMedia && !savedTheme) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this.body.classList.toggle('dark-mode', mediaQuery.matches);
            this.updateThemeIcon();

            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.body.classList.toggle('dark-mode', e.matches);
                    this.updateThemeIcon();
                }
            });
        }
    }

    toggleTheme() {
        this.body.classList.toggle('dark-mode');
        const isDark = this.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.updateThemeIcon();
        this.animateToggle();
    }

    updateThemeIcon() {
        const isDark = this.body.classList.contains('dark-mode');
        this.themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    animateToggle() {
        this.themeToggle.style.transform = 'scale(0.8) rotate(180deg)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1) rotate(0deg)';
        }, 150);
    }
}

// Scroll Progress Indicator
class ScrollIndicator {
    constructor() {
        this.indicator = document.getElementById('scrollIndicator');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateProgress());
    }

    updateProgress() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        this.indicator.style.width = `${scrollPercent}%`;
    }
}

// Particle System for Hero Section
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles');
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        setInterval(() => this.createParticle(), 3000);
    }

    createParticles() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.createParticle(), i * 1000);
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 10;

        particle.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${left}%;
                    animation-duration: ${animationDuration}s;
                    animation-delay: ${Math.random() * 2}s;
                `;

        this.container.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, animationDuration * 1000);
    }
}

// Dashboard Redirect
class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        document.getElementById('getDashboardBtn').addEventListener('click', (e) => {
            this.redirectToDashboard(e.target);
        });

        document.getElementById('getStartedBtn').addEventListener('click', (e) => {
            this.redirectToDashboard(e.target);
        });
    }

    redirectToDashboard(button) {
        const originalContent = button.innerHTML;
        const loadingContent = '<span class="loading"></span> Launching Dashboard...';

        button.innerHTML = loadingContent;
        button.disabled = true;
        button.style.transform = 'scale(0.95)';

        // ripple effect
        this.createRipple(button);

        setTimeout(() => {
            window.location.href = 'home.html';
            button.innerHTML = originalContent;
            button.disabled = false;
            button.style.transform = 'scale(1)';
        }, 2500);
    }

    createRipple(button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.8s linear;
                    width: ${size}px;
                    height: ${size}px;
                    left: 50%;
                    top: 50%;
                    margin-left: -${size / 2}px;
                    margin-top: -${size / 2}px;
                    pointer-events: none;
                `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 800);
    }
}

// Animated Counter
class AnimatedCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.observer = null;
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    this.animateCounter(counter, target);
                    this.observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => this.observer.observe(counter));
    }

    animateCounter(element, target, duration = 2500) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = this.formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = this.formatNumber(Math.floor(start));
            }
        }, 16);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Animate feature cards
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            this.observer.observe(card);
        });

        // Animate steps
        document.querySelectorAll('.step').forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(50px)';
            step.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`;
            this.observer.observe(step);
        });
    }
}

// Header Behavior
class HeaderManager {
    constructor() {
        this.header = document.getElementById('header');
        this.lastScrollTop = 0;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;

        if (scrollTop > 20) {
            this.header.style.background = this.getBackgroundColor();
            this.header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            this.header.style.background = this.getBackgroundColor();
            this.header.style.boxShadow = 'none';
        }

        if (scrollTop > this.lastScrollTop && scrollTop > 100) this.header.style.transform = 'translateY(-100%)';
        else this.header.style.transform = 'translateY(0)';
        this.lastScrollTop = scrollTop;
    }

    getBackgroundColor() {
        const isDark = document.body.classList.contains('dark-mode');
        return isDark
            ? 'rgba(15, 23, 42, 0.95)'
            : 'rgba(255, 255, 255, 0.95)';
    }
}

// Smooth Scrolling for Navigation
class SmoothScroll {
    constructor() {this.init();}
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new ScrollIndicator();
    new ParticleSystem();
    new DashboardManager();
    new AnimatedCounter();
    new ScrollAnimations();
    new HeaderManager();
    new SmoothScroll();

    document.getElementById('index').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    const style = document.createElement('style');
    style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
    document.head.appendChild(style);
});

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
}
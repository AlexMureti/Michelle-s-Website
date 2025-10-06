// Michelle Wanjiru Maina - Website JavaScript Functionality
// Core interactive features and animations

class MichellePortfolio {
    constructor() {
        this.currentFilter = 'all';
        this.lightboxOpen = false;
        this.currentImageIndex = 0;
        this.portfolioImages = [];
        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupScrollAnimations();
        this.setupPortfolioFilter();
        this.setupLightbox();
        this.setupCustomConfigurator();
        this.setupSkillsVisualization();
        this.setupFormValidation();
        this.setupHoverEffects();
        this.loadPortfolioImages();
    }

    // Smooth scroll navigation
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Portfolio filtering system
    setupPortfolioFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.currentFilter = filter;

                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter items with animation
                portfolioItems.forEach((item, index) => {
                    const categories = item.dataset.categories.split(',');
                    const shouldShow = filter === 'all' || categories.includes(filter);

                    if (shouldShow) {
                        setTimeout(() => {
                            item.style.display = 'block';
                            item.classList.add('fade-in');
                        }, index * 50);
                    } else {
                        item.classList.remove('fade-in');
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Lightbox gallery functionality
    setupLightbox() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openLightbox(index);
            });
        });

        // Close lightbox events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox-overlay')) {
                this.closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (this.lightboxOpen) {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.previousImage();
                if (e.key === 'ArrowRight') this.nextImage();
            }
        });
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        this.lightboxOpen = true;
        
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-nav lightbox-prev">&larr;</button>
                <img src="${this.portfolioImages[index]}" alt="Portfolio Image" class="lightbox-image">
                <button class="lightbox-nav lightbox-next">&rarr;</button>
                <div class="lightbox-info">
                    <h3>${this.getImageTitle(index)}</h3>
                    <p>${this.getImageDescription(index)}</p>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Add event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.previousImage());
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.nextImage());

        // Animate in
        setTimeout(() => lightbox.classList.add('active'), 10);
    }

    closeLightbox() {
        const lightbox = document.querySelector('.lightbox-overlay');
        if (lightbox) {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
                this.lightboxOpen = false;
            }, 300);
        }
    }

    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.portfolioImages.length) % this.portfolioImages.length;
        this.updateLightboxImage();
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.portfolioImages.length;
        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const image = document.querySelector('.lightbox-image');
        const info = document.querySelector('.lightbox-info h3');
        const desc = document.querySelector('.lightbox-info p');
        
        if (image) {
            image.src = this.portfolioImages[this.currentImageIndex];
            info.textContent = this.getImageTitle(this.currentImageIndex);
            desc.textContent = this.getImageDescription(this.currentImageIndex);
        }
    }

    // Custom beadwork configurator
    setupCustomConfigurator() {
        const configurator = document.querySelector('.configurator');
        if (!configurator) return;

        const options = {
            type: document.querySelectorAll('.type-option'),
            colors: document.querySelectorAll('.color-option'),
            patterns: document.querySelectorAll('.pattern-option'),
            size: document.querySelectorAll('.size-option')
        };

        const preview = document.querySelector('.configurator-preview');
        const priceDisplay = document.querySelector('.configurator-price');

        Object.keys(options).forEach(key => {
            options[key].forEach(option => {
                option.addEventListener('click', () => {
                    // Update active state
                    options[key].forEach(o => o.classList.remove('active'));
                    option.classList.add('active');
                    
                    // Update preview and price
                    this.updateConfiguratorPreview();
                });
            });
        });
    }

    updateConfiguratorPreview() {
        const selectedOptions = {
            type: document.querySelector('.type-option.active')?.dataset.type || 'bracelet',
            colors: document.querySelector('.color-option.active')?.dataset.colors || 'traditional',
            patterns: document.querySelector('.pattern-option.active')?.dataset.pattern || 'geometric',
            size: document.querySelector('.size-option.active')?.dataset.size || 'medium'
        };

        const basePrice = this.calculatePrice(selectedOptions);
        const priceDisplay = document.querySelector('.configurator-price');
        if (priceDisplay) {
            priceDisplay.textContent = `KES ${basePrice.toLocaleString()}`;
        }

        // Update visual preview (simplified)
        const preview = document.querySelector('.configurator-preview');
        if (preview) {
            preview.className = `configurator-preview preview-${selectedOptions.colors}`;
        }
    }

    calculatePrice(options) {
        let basePrice = 2500; // Base price in KES
        
        // Type multiplier
        const typeMultipliers = {
            bracelet: 1,
            necklace: 1.5,
            earrings: 0.8,
            set: 2.2
        };
        basePrice *= typeMultipliers[options.type] || 1;

        // Color complexity
        const colorComplexity = {
            traditional: 1,
            modern: 1.2,
            luxury: 1.8,
            custom: 2.0
        };
        basePrice *= colorComplexity[options.colors] || 1;

        // Pattern complexity
        const patternComplexity = {
            simple: 1,
            geometric: 1.3,
            ceremonial: 1.7,
            custom: 2.1
        };
        basePrice *= patternComplexity[options.patterns] || 1;

        // Size adjustment
        const sizeAdjustments = {
            small: 0.9,
            medium: 1,
            large: 1.2,
            extraLarge: 1.4
        };
        basePrice *= sizeAdjustments[options.size] || 1;

        return Math.round(basePrice);
    }

    // Skills visualization with ECharts
    setupSkillsVisualization() {
        const skillsContainer = document.querySelector('#skills-chart');
        if (!skillsContainer) return;

        // Initialize ECharts
        const chart = echarts.init(skillsContainer);
        
        const option = {
            title: {
                text: 'Professional Skills',
                textStyle: {
                    color: '#2C2C2C',
                    fontSize: 24,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                max: 100,
                axisLabel: {
                    color: '#666'
                }
            },
            yAxis: {
                type: 'category',
                data: ['Beadwork Design', 'Business Strategy', 'Marketing', 'Cultural Knowledge', 'Creative Direction'],
                axisLabel: {
                    color: '#666'
                }
            },
            series: [{
                type: 'bar',
                data: [95, 88, 92, 98, 85],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#D2691E' },
                        { offset: 1, color: '#DAA520' }
                    ])
                },
                barWidth: '60%'
            }]
        };

        chart.setOption(option);

        // Animate on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    chart.setOption(option, true);
                }
            });
        });

        observer.observe(skillsContainer);
    }

    // Form validation
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        let isValid = true;
        let errorMessage = '';

        if (required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''));
    }

    showFieldValidation(field, isValid, message) {
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (isValid) {
            field.classList.remove('error');
            if (errorElement) errorElement.remove();
        } else {
            field.classList.add('error');
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'error-message';
                error.textContent = message;
                field.parentNode.appendChild(error);
            }
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) errorElement.remove();
    }

    handleFormSubmission(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            this.submitForm(form);
        }
    }

    submitForm(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage('Thank you! Your message has been sent successfully.');
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✓</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Hover effects and interactions
    setupHoverEffects() {
        // Card hover effects
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) rotateX(5deg)';
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0deg)';
                card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            });
        });

        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 8px 16px rgba(210, 105, 30, 0.3)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '0 4px 8px rgba(210, 105, 30, 0.2)';
            });
        });
    }

    // Load portfolio images
    loadPortfolioImages() {
        this.portfolioImages = [
            'resources/beadwork-1.jpg',
            'resources/beadwork-2.jpg',
            'resources/beadwork-3.jpg',
            'resources/beadwork-4.jpg',
            'resources/beadwork-5.jpg',
            'resources/beadwork-6.jpg',
            'resources/beadwork-7.jpg',
            'resources/beadwork-8.jpg',
            'resources/beadwork-9.jpg',
            'resources/beadwork-10.jpg'
        ];
    }

    getImageTitle(index) {
        const titles = [
            'Kenyan Flag Bracelets',
            'Traditional Maasai Necklace',
            'Contemporary Collection',
            'Custom Wedding Set',
            'Cultural Ceremony Pieces',
            'Modern Interpretations',
            'Tribal Inspired Collection',
            'Festival Jewelry',
            'Personalized Pieces',
            'Luxury Collection'
        ];
        return titles[index] || 'Beadwork Art';
    }

    getImageDescription(index) {
        const descriptions = [
            'Patriotic beadwork celebrating Kenyan heritage with traditional flag colors and Maasai shield symbols.',
            'Authentic Maasai necklace featuring intricate geometric patterns that tell stories of identity and tradition.',
            'Modern African jewelry that blends traditional beading techniques with contemporary design aesthetics.',
            'Elegant wedding jewelry set that incorporates traditional Maasai beading in sophisticated bridal colors.',
            'Ceremonial beadwork pieces used in traditional Kenyan celebrations and cultural events.',
            'Contemporary interpretations of African beadwork featuring minimalist designs with cultural influences.',
            'Bold statement pieces inspired by various Kenyan tribal patterns and traditional motifs.',
            'Vibrant festival jewelry designed for cultural celebrations and special occasions.',
            'Custom personalized beadwork featuring names, dates, and special meaningful patterns.',
            'Premium luxury beadwork collection featuring high-end materials and intricate craftsmanship.'
        ];
        return descriptions[index] || 'Beautiful handcrafted beadwork by Michelle Wanjiru Maina.';
    }
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MichellePortfolio();
});

// Additional utility functions
function showComingSoon() {
    alert('Coming soon! This feature is currently in development.');
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    menu.classList.toggle('active');
}

// Initialize carousels when Splide is available
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Splide !== 'undefined') {
        // Initialize image carousel
        const imageCarousel = document.querySelector('.image-carousel');
        if (imageCarousel) {
            new Splide(imageCarousel, {
                type: 'loop',
                autoplay: true,
                interval: 4000,
                pauseOnHover: true,
                arrows: false,
                pagination: true
            }).mount();
        }

        // Initialize testimonial carousel
        const testimonialCarousel = document.querySelector('.testimonial-carousel');
        if (testimonialCarousel) {
            new Splide(testimonialCarousel, {
                type: 'fade',
                autoplay: true,
                interval: 6000,
                pauseOnHover: true,
                arrows: true,
                pagination: false
            }).mount();
        }
    }
});
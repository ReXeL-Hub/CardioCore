// DOM Elements
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    // Toggle Nav
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

// Heart Rate Animation Control
const controlHeartRate = () => {
    // Default heart rate (animation speed)
    let currentHeartRate = 3; // seconds for animation duration
    
    // Get heart line element
    const heartLine = document.querySelector('.heart-line');
    if (!heartLine) return;
    
    // Function to update heart rate animation
    const updateHeartRate = (rate) => {
        heartLine.style.animationDuration = `${rate}s`;
    };
    
    // Add scroll event listener to simulate heart rate increasing with scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollPosition / maxScroll;
        
        // Calculate new heart rate between 1s (fast) and 3s (slow)
        const newHeartRate = 3 - (scrollPercentage * 2);
        const clampedHeartRate = Math.max(1, Math.min(3, newHeartRate));
        
        if (Math.abs(currentHeartRate - clampedHeartRate) > 0.2) {
            currentHeartRate = clampedHeartRate;
            updateHeartRate(currentHeartRate);
        }
    });
    
    // Initialize with default rate
    updateHeartRate(currentHeartRate);
}

// Modal Functionality
const initModal = () => {
    const modal = document.getElementById('cardioModal');
    const btn = document.getElementById('cardioButton');
    const closeBtn = document.querySelector('.close-button');

    if (!modal || !btn || !closeBtn) return;

    // Open modal
    btn.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        
        // Add entry animation class
        modal.classList.add('modal-active');
    });

    // Close modal with X button
    closeBtn.addEventListener('click', () => {
        closeModal();
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    const closeModal = () => {
        modal.classList.remove('modal-active');
        modal.classList.add('modal-closing');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling again
            modal.classList.remove('modal-closing');
        }, 300);
    };
}

// Tab Functionality
const initTabs = () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length === 0 || tabContents.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add sliding-out animation to active content
            const activeContent = document.querySelector('.tab-content.active');
            if (activeContent) {
                activeContent.classList.add('tab-sliding-out');
                
                // After animation completes, hide all contents and show the selected one
                setTimeout(() => {
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        content.classList.remove('tab-sliding-out');
                    });
                    
                    // Add active class to the clicked button and corresponding content
                    button.classList.add('active');
                    const selectedContent = document.getElementById(tabId);
                    if (selectedContent) {
                        selectedContent.classList.add('active');
                        selectedContent.classList.add('tab-sliding-in');
                        
                        // Remove the animation class after it completes
                        setTimeout(() => {
                            selectedContent.classList.remove('tab-sliding-in');
                        }, 500);
                    }
                }, 300);
            } else {
                // If no active content, just show the selected one
                button.classList.add('active');
                const selectedContent = document.getElementById(tabId);
                if (selectedContent) {
                    selectedContent.classList.add('active');
                }
            }
        });
    });
}

// Smooth scrolling for navigation
const smoothScroll = () => {
    const navLinks = document.querySelectorAll('header nav a, .footer-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const nav = document.querySelector('.nav-links');
                    const burger = document.querySelector('.burger');
                    
                    if (nav.classList.contains('nav-active')) {
                        nav.classList.remove('nav-active');
                        burger.classList.remove('toggle');
                        
                        // Reset animations
                        document.querySelectorAll('.nav-links li').forEach(link => {
                            link.style.animation = '';
                        });
                    }
                    
                    // Update URL without page jump
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
}

// Active nav link on scroll
const activeNavOnScroll = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const headerHeight = document.querySelector('header').offsetHeight;
            
            if (window.scrollY >= (sectionTop - headerHeight - 50)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Animation on scroll
const animateOnScroll = () => {
    // Add animation classes to elements when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    document.querySelectorAll('.program-card, .tip, .video-card, .metric, .section-heading').forEach(el => {
        observer.observe(el);
    });
}

// CountUp animation for metrics
const animateCounters = () => {
    const counters = document.querySelectorAll('.count');
    const speed = 200; // Lower is faster
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.innerText.replace(/[^\d]/g, ''));
                const countUnit = counter.innerText.replace(/[\d]/g, '');
                let count = 0;
                
                // Only animate if not already animated
                if (!counter.classList.contains('counted')) {
                    const updateCount = () => {
                        // Handle percentage special case
                        const increment = target / speed;
                        
                        if (count < target) {
                            count += increment;
                            counter.innerText = Math.ceil(count) + countUnit;
                            setTimeout(updateCount, 10);
                        } else {
                            counter.innerText = target + countUnit;
                            counter.classList.add('counted');
                        }
                    };
                    
                    updateCount();
                }
                
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Newsletter form handling
const handleNewsletterForm = () => {
    const form = document.querySelector('.newsletter-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(email)) {
                    // Show success message with animation
                    form.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <p>Thanks for subscribing!</p>
                        </div>
                    `;
                } else {
                    // Show error for invalid email
                    if (!emailInput.classList.contains('error')) {
                        emailInput.classList.add('error');
                        emailInput.insertAdjacentHTML('afterend', '<p class="error-message">Please enter a valid email address</p>');
                        
                        // Remove error after 3 seconds
                        setTimeout(() => {
                            emailInput.classList.remove('error');
                            const errorMessage = form.querySelector('.error-message');
                            if (errorMessage) {
                                errorMessage.remove();
                            }
                        }, 3000);
                    }
                }
            }
        });
    }
}

// Calculate max heart rate based on age (simple cardio calculator)
const initCardioCalculator = () => {
    const calculatorLink = document.querySelector('a[href="#calculator"]');
    if (!calculatorLink) return;
    
    calculatorLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // If calculator modal already exists, show it
        let calculatorModal = document.getElementById('calculatorModal');
        
        if (!calculatorModal) {
            // Create calculator modal if it doesn't exist
            calculatorModal = document.createElement('div');
            calculatorModal.id = 'calculatorModal';
            calculatorModal.className = 'modal';
            
            const modalContent = `
                <div class="modal-content calculator-content">
                    <span class="close-button">&times;</span>
                    <h2>Cardio Heart Rate Calculator</h2>
                    <p>Calculate your target heart rate zones for optimal cardio training.</p>
                    
                    <form id="heartRateForm" class="calculator-form">
                        <div class="form-group">
                            <label for="age">Your Age:</label>
                            <input type="number" id="age" min="10" max="100" required placeholder="Enter your age">
                        </div>
                        <div class="form-group">
                            <label for="restingHR">Resting Heart Rate (optional):</label>
                            <input type="number" id="restingHR" min="40" max="120" placeholder="Beats per minute">
                        </div>
                        <button type="submit" class="calculate-button">Calculate <i class="fas fa-calculator"></i></button>
                    </form>
                    
                    <div id="results" class="calculator-results"></div>
                </div>
            `;
            
            calculatorModal.innerHTML = modalContent;
            document.body.appendChild(calculatorModal);
            
            // Set up event listeners for the new modal
            const closeBtn = calculatorModal.querySelector('.close-button');
            closeBtn.addEventListener('click', () => {
                calculatorModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
            
            window.addEventListener('click', (e) => {
                if (e.target === calculatorModal) {
                    calculatorModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Set up form submission
            const form = calculatorModal.querySelector('#heartRateForm');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const age = parseInt(document.getElementById('age').value);
                const restingHR = parseInt(document.getElementById('restingHR').value) || 70; // Default if not provided
                
                // Calculate max heart rate (220 - age)
                const maxHR = 220 - age;
                
                // Calculate Karvonen Formula heart rate reserve (HRR)
                // Target HR = ((Max HR - Resting HR) × %Intensity) + Resting HR
                const zones = {
                    'Warm Up (50-60%)': [
                        Math.round(((maxHR - restingHR) * 0.5) + restingHR),
                        Math.round(((maxHR - restingHR) * 0.6) + restingHR)
                    ],
                    'Fat Burn (60-70%)': [
                        Math.round(((maxHR - restingHR) * 0.6) + restingHR),
                        Math.round(((maxHR - restingHR) * 0.7) + restingHR)
                    ],
                    'Aerobic (70-80%)': [
                        Math.round(((maxHR - restingHR) * 0.7) + restingHR),
                        Math.round(((maxHR - restingHR) * 0.8) + restingHR)
                    ],
                    'Anaerobic (80-90%)': [
                        Math.round(((maxHR - restingHR) * 0.8) + restingHR),
                        Math.round(((maxHR - restingHR) * 0.9) + restingHR)
                    ],
                    'Maximum Effort (90-100%)': [
                        Math.round(((maxHR - restingHR) * 0.9) + restingHR),
                        maxHR
                    ]
                };
                
                // Display results
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = `
                    <h3>Your Results:</h3>
                    <p class="max-hr">Estimated Maximum Heart Rate: <span>${maxHR} BPM</span></p>
                    <div class="heart-rate-zones">
                        <h4>Training Zones (Karvonen Method):</h4>
                        <ul class="zones-list">
                            ${Object.entries(zones).map(([zone, [min, max]]) => `
                                <li>
                                    <div class="zone-name">${zone}</div>
                                    <div class="zone-range">${min} - ${max} BPM</div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="calculator-note">
                        <p><i class="fas fa-info-circle"></i> These are estimated ranges. Always consult with a healthcare professional before starting a new exercise program.</p>
                    </div>
                `;
                
                resultsDiv.style.display = 'block';
            });
        }
        
        // Show the calculator modal
        calculatorModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
}

// Science tabs functionality
const initScienceTabs = () => {
    const scienceTabs = document.querySelectorAll('.science-tab');
    const sciencePanels = document.querySelectorAll('.science-panel');
    
    if (scienceTabs.length === 0 || sciencePanels.length === 0) return;
    
    scienceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Get target panel ID
            const targetId = tab.getAttribute('data-target');
            
            // Remove active class from all tabs and panels
            scienceTabs.forEach(t => t.classList.remove('active'));
            sciencePanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
            
            // Animate the heart rate in the visualization based on tab
            animateHeartForPanel(targetId);
        });
    });
    
    // Function to adjust heart animation based on selected panel
    const animateHeartForPanel = (panelId) => {
        const heart = document.querySelector('.heart');
        if (!heart) return;
        
        // Reset any custom animations
        heart.style.animationDuration = '';
        
        // Apply different heart animations based on the selected tab
        switch (panelId) {
            case 'aerobic':
                // Normal steady heart rate
                heart.style.animationDuration = '1.5s';
                break;
            case 'anaerobic':
                // Faster heart rate for anaerobic
                heart.style.animationDuration = '0.8s';
                break;
            case 'heart':
                // Strong beats for heart adaptations
                heart.style.animationDuration = '1.2s';
                break;
            case 'hormones':
                // Slightly elevated
                heart.style.animationDuration = '1s';
                break;
            default:
                heart.style.animationDuration = '1.5s';
        }
    };
    
    // Initialize with default animation
    animateHeartForPanel('aerobic');
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    initModal();
    initTabs();
    smoothScroll();
    activeNavOnScroll();
    animateOnScroll();
    handleNewsletterForm();
    controlHeartRate();
    animateCounters();
    initCardioCalculator();
    initScienceTabs();
    
    // Add animation class to body to enable CSS transitions
    document.body.classList.add('loaded');
}); 
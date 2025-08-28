// Campus Wellness Hub JavaScript
// Main functionality for interactive features

// Global variables
let currentTheme = localStorage.getItem('theme') || 'light';
let currentSlide = 0;
let mobileMenuOpen = false;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeTestimonialSlider();
    initializeFitnessTracker();
    initializeEventCalendar();
    initializeForms();
    initializeFAQ();
    initializeAssessments();
    initializeModals();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeFilters();
    initializeSleepTracker();
    initializeMeditationTimer();
    initializeSobrietyTracker();
    initializeNutritionPlanner();
    
    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'events':
            initializeEventFilters();
            break;
        case 'fitness':
            initializeFitnessTools();
            break;
        case 'nutrition':
            initializeNutritionTools();
            break;
        case 'mental':
            initializeMentalHealthTools();
            break;
        case 'sleep':
            initializeSleepTools();
            break;
        case 'addiction':
            initializeRecoveryTools();
            break;
        case 'login':
            initializeLoginForms();
            break;
    }
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        updateThemeIcon();
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Navigation
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // Handle dropdown menus on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuOpen = !mobileMenuOpen;
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Testimonial Slider
function initializeTestimonialSlider() {
    const slider = document.getElementById('testimonialsSlider');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.testimonial-slide');
    
    if (slides.length === 0) return;
    
    if (prevBtn) prevBtn.addEventListener('click', previousSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);
}

function nextSlide() {
    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

function previousSlide() {
    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Fitness Tracker
function initializeFitnessTracker() {
    const fitnessData = loadFitnessData();
    updateProgressDisplay(fitnessData);
    
    // Initialize activity buttons
    const activityBtns = document.querySelectorAll('.activity-btn');
    activityBtns.forEach(btn => {
        btn.addEventListener('click', handleActivityCompletion);
    });
}

function toggleActivity(activityType) {
    const activityCard = document.querySelector(`[data-activity="${activityType}"]`);
    const btn = activityCard.querySelector('.activity-btn');
    
    if (activityCard.classList.contains('completed')) {
        activityCard.classList.remove('completed');
        btn.textContent = 'Complete';
        btn.style.backgroundColor = '';
    } else {
        activityCard.classList.add('completed');
        btn.textContent = 'Completed';
        btn.style.backgroundColor = '#27AE60';
    }
    
    updateFitnessProgress();
}

function handleActivityCompletion(e) {
    const activityCard = e.target.closest('.activity-card');
    const activityType = activityCard.dataset.activity;
    toggleActivity(activityType);
}

function updateFitnessProgress() {
    const completedActivities = document.querySelectorAll('.activity-card.completed').length;
    const totalActivities = document.querySelectorAll('.activity-card').length;
    const progress = Math.round((completedActivities / totalActivities) * 100);
    
    // Update progress circle
    const progressCircle = document.querySelector('.circle');
    const progressValue = document.querySelector('.progress-value');
    
    if (progressCircle && progressValue) {
        progressCircle.style.setProperty('--progress', progress);
        progressValue.textContent = `${progress}%`;
    }
    
    // Save progress
    saveFitnessData({ progress, completedActivities, totalActivities });
}

function loadFitnessData() {
    const saved = localStorage.getItem('fitnessData');
    return saved ? JSON.parse(saved) : { progress: 0, completedActivities: 0, totalActivities: 4 };
}

function saveFitnessData(data) {
    localStorage.setItem('fitnessData', JSON.stringify(data));
}

function updateProgressDisplay(data) {
    const progressCircle = document.querySelector('.circle');
    const progressValue = document.querySelector('.progress-value');
    
    if (progressCircle && progressValue) {
        progressCircle.style.setProperty('--progress', data.progress);
        progressValue.textContent = `${data.progress}%`;
    }
}

// Event Calendar
function initializeEventCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    generateCalendar(currentMonth, currentYear);
    
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    if (prevBtn) prevBtn.addEventListener('click', previousMonth);
    if (nextBtn) nextBtn.addEventListener('click', nextMonth);
}

function generateCalendar(month, year) {
    const calendarGrid = document.getElementById('calendarGrid');
    const monthDisplay = document.getElementById('currentMonth');
    
    if (!calendarGrid) return;
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    if (monthDisplay) {
        monthDisplay.textContent = `${monthNames[month]} ${year}`;
    }
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        header.style.fontWeight = 'bold';
        header.style.textAlign = 'center';
        header.style.padding = '10px';
        header.style.backgroundColor = '#f8f9fa';
        calendarGrid.appendChild(header);
    });
    
    // Calculate first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        emptyCell.style.padding = '10px';
        emptyCell.style.minHeight = '60px';
        calendarGrid.appendChild(emptyCell);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.style.padding = '10px';
        dayCell.style.minHeight = '60px';
        dayCell.style.border = '1px solid #e8e8e8';
        dayCell.style.cursor = 'pointer';
        dayCell.style.transition = 'background-color 0.3s ease';
        
        dayCell.innerHTML = `<strong>${day}</strong>`;
        
        // Add events for specific days (demo data)
        if (day === 25) {
            dayCell.innerHTML += '<div style="font-size: 10px; color: #457B9D; margin-top: 5px;">Mindfulness Workshop</div>';
            dayCell.style.backgroundColor = 'rgba(168, 218, 220, 0.2)';
        } else if (day === 28) {
            dayCell.innerHTML += '<div style="font-size: 10px; color: #27AE60; margin-top: 5px;">Cooking Class</div>';
            dayCell.style.backgroundColor = 'rgba(39, 174, 96, 0.2)';
        } else if (day === 30) {
            dayCell.innerHTML += '<div style="font-size: 10px; color: #457B9D; margin-top: 5px;">Fitness Challenge</div>';
            dayCell.style.backgroundColor = 'rgba(168, 218, 220, 0.2)';
        }
        
        dayCell.addEventListener('mouseenter', () => {
            dayCell.style.backgroundColor = 'rgba(168, 218, 220, 0.3)';
        });
        
        dayCell.addEventListener('mouseleave', () => {
            if (day === 25 || day === 28 || day === 30) {
                dayCell.style.backgroundColor = day === 28 ? 'rgba(39, 174, 96, 0.2)' : 'rgba(168, 218, 220, 0.2)';
            } else {
                dayCell.style.backgroundColor = '';
            }
        });
        
        calendarGrid.appendChild(dayCell);
    }
    
    // Style the grid
    calendarGrid.style.display = 'grid';
    calendarGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
    calendarGrid.style.gap = '1px';
    calendarGrid.style.backgroundColor = '#e8e8e8';
    calendarGrid.style.borderRadius = '8px';
    calendarGrid.style.overflow = 'hidden';
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
}

// Form Handling
function initializeForms() {
    const contactForm = document.getElementById('contactForm');
    const eventRegistrationForm = document.getElementById('eventRegistrationForm');
    const volunteerForm = document.getElementById('volunteerForm');
    const donationForm = document.getElementById('donationForm');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    if (eventRegistrationForm) {
        eventRegistrationForm.addEventListener('submit', handleEventRegistration);
    }
    
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', handleVolunteerApplication);
    }
    
    if (donationForm) {
        donationForm.addEventListener('submit', handleDonation);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Real-time form validation
    initializeFormValidation();
}

function initializeFormValidation() {
    const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(e);
    
    if (!value && field.required) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Specific validation rules
    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            if (fieldName === 'signupEmail' && value && !value.endsWith('.edu')) {
                showFieldError(field, 'Please use your university email address');
                return false;
            }
            break;
            
        case 'tel':
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
            
        case 'password':
            if (fieldName === 'signupPassword') {
                validatePassword(field, value);
            }
            break;
    }
    
    if (fieldName === 'confirmPassword') {
        const password = document.getElementById('signupPassword');
        if (password && value !== password.value) {
            showFieldError(field, 'Passwords do not match');
            return false;
        }
    }
    
    return true;
}

function validatePassword(field, password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password)
    };
    
    // Update password requirements UI
    const lengthReq = document.getElementById('length-req');
    const uppercaseReq = document.getElementById('uppercase-req');
    const lowercaseReq = document.getElementById('lowercase-req');
    const numberReq = document.getElementById('number-req');
    
    if (lengthReq) lengthReq.className = requirements.length ? 'valid' : '';
    if (uppercaseReq) uppercaseReq.className = requirements.uppercase ? 'valid' : '';
    if (lowercaseReq) lowercaseReq.className = requirements.lowercase ? 'valid' : '';
    if (numberReq) numberReq.className = requirements.number ? 'valid' : '';
    
    const allValid = Object.values(requirements).every(req => req);
    if (!allValid) {
        showFieldError(field, 'Password does not meet requirements');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    field.style.borderColor = '#e74c3c';
}

function clearFieldError(e) {
    const field = e.target;
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    field.style.borderColor = '';
}

function handleContactForm(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        return;
    }
    
    // Simulate form submission
    showSuccessMessage('Message sent successfully! We\'ll respond within 24 hours.');
    e.target.reset();
}

function handleEventRegistration(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        return;
    }
    
    showSuccessMessage('Registration successful! You\'ll receive a confirmation email shortly.');
    closeModal('registrationModal');
    e.target.reset();
}

function handleVolunteerApplication(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        return;
    }
    
    showSuccessMessage('Application submitted! We\'ll review it and contact you within a week.');
    closeModal('volunteerModal');
    e.target.reset();
}

function handleDonation(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        return;
    }
    
    // In a real app, this would integrate with a payment processor
    showSuccessMessage('Thank you for your donation! You\'ll receive a receipt via email.');
    e.target.reset();
}

function handleLogin(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        return;
    }
    
    // Simulate login process
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Demo: Accept any email/password combination
    showSuccessMessage('Login successful! Redirecting to dashboard...');
    
    setTimeout(() => {
        // In a real app, this would redirect to the dashboard
        window.location.href = 'index.html';
    }, 2000);
}

function handleSignup(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        return;
    }
    
    // Simulate account creation
    showSuccessMessage('Account created successfully! Please check your email for verification.');
    
    // Switch to login tab
    setTimeout(() => {
        switchTab('login');
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// FAQ Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    const faqSearch = document.getElementById('faqSearch');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => toggleFAQ(item));
    });
    
    if (faqSearch) {
        faqSearch.addEventListener('input', filterFAQs);
    }
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => filterFAQsByCategory(btn.dataset.category));
    });
}

function toggleFAQ(item) {
    const isActive = item.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item.active').forEach(activeItem => {
        activeItem.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        item.classList.add('active');
    }
}

function filterFAQs(e) {
    const searchTerm = e.target.value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function filterFAQsByCategory(category) {
    const faqItems = document.querySelectorAll('.faq-item');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Update active button
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Filter items
    faqItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Assessment Tools
function initializeAssessments() {
    // Initialize mental health assessment
    if (document.getElementById('assessmentResult')) {
        // Assessment is present on the page
    }
}

function calculateAssessment() {
    const questions = document.querySelectorAll('input[name^="q"]:checked');
    
    if (questions.length < 4) {
        alert('Please answer all questions before getting your results.');
        return;
    }
    
    let totalScore = 0;
    questions.forEach(question => {
        totalScore += parseInt(question.value);
    });
    
    const resultDiv = document.getElementById('assessmentResult');
    const resultText = document.getElementById('resultText');
    const recommendations = document.getElementById('resultRecommendations');
    
    let resultMessage = '';
    let recommendationText = '';
    
    if (totalScore <= 4) {
        resultMessage = 'Your responses suggest you\'re managing well overall. Continue with your current self-care practices.';
        recommendationText = '<ul><li>Maintain regular exercise and sleep habits</li><li>Continue social connections</li><li>Consider our wellness workshops for additional support</li></ul>';
    } else if (totalScore <= 8) {
        resultMessage = 'Your responses indicate some areas that could benefit from additional support and attention.';
        recommendationText = '<ul><li>Consider scheduling a consultation with our wellness team</li><li>Explore our stress management resources</li><li>Join a support group or wellness program</li></ul>';
    } else {
        resultMessage = 'Your responses suggest you may benefit from professional support. Please consider reaching out to our counseling services.';
        recommendationText = '<ul><li>Schedule an appointment with a counselor</li><li>Contact our crisis line if you need immediate support</li><li>Explore our mental health resources</li><li>Consider joining a support group</li></ul>';
    }
    
    resultText.textContent = resultMessage;
    recommendations.innerHTML = recommendationText;
    resultDiv.style.display = 'block';
    
    // Smooth scroll to results
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function calculateSleepAssessment() {
    const questions = document.querySelectorAll('input[name^="sleep-q"]:checked');
    
    if (questions.length < 4) {
        alert('Please answer all questions before getting your results.');
        return;
    }
    
    let totalScore = 0;
    questions.forEach(question => {
        totalScore += parseInt(question.value);
    });
    
    const resultDiv = document.getElementById('sleepAssessmentResult');
    const scoreDisplay = document.getElementById('sleepScore');
    const resultText = document.getElementById('sleepResultText');
    const recommendations = document.getElementById('sleepResultRecommendations');
    
    scoreDisplay.textContent = totalScore;
    
    let resultMessage = '';
    let recommendationText = '';
    
    if (totalScore >= 16) {
        resultMessage = 'Excellent sleep habits! You\'re getting quality rest.';
        recommendationText = '<ul><li>Continue your current sleep routine</li><li>Share your success with others</li><li>Consider helping others with sleep challenges</li></ul>';
    } else if (totalScore >= 12) {
        resultMessage = 'Good sleep habits with room for improvement.';
        recommendationText = '<ul><li>Focus on consistency in sleep schedule</li><li>Review your sleep environment</li><li>Try our sleep hygiene tips</li></ul>';
    } else if (totalScore >= 8) {
        resultMessage = 'Your sleep could use some attention.';
        recommendationText = '<ul><li>Establish a consistent bedtime routine</li><li>Limit screen time before bed</li><li>Consider a sleep consultation</li></ul>';
    } else {
        resultMessage = 'Your sleep patterns may be significantly impacting your well-being.';
        recommendationText = '<ul><li>Schedule a sleep consultation immediately</li><li>Review all sleep hygiene practices</li><li>Consider keeping a sleep diary</li><li>Discuss with healthcare provider</li></ul>';
    }
    
    resultText.textContent = resultMessage;
    recommendations.innerHTML = recommendationText;
    resultDiv.style.display = 'block';
    
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function calculateAddictionAssessment() {
    const questions = document.querySelectorAll('input[name^="q"]:checked');
    
    if (questions.length < 4) {
        alert('Please answer all questions before getting your results.');
        return;
    }
    
    let totalScore = 0;
    questions.forEach(question => {
        totalScore += parseInt(question.value);
    });
    
    const resultDiv = document.getElementById('addictionAssessmentResult');
    const resultText = document.getElementById('addictionResultText');
    const recommendations = document.getElementById('addictionResultRecommendations');
    
    let resultMessage = '';
    let recommendationText = '';
    
    if (totalScore <= 4) {
        resultMessage = 'Your responses suggest low risk. Continue making healthy choices.';
        recommendationText = '<ul><li>Maintain current healthy habits</li><li>Be aware of risk factors</li><li>Support friends who may be struggling</li></ul>';
    } else if (totalScore <= 8) {
        resultMessage = 'Your responses indicate some areas of concern that may benefit from attention.';
        recommendationText = '<ul><li>Consider speaking with a counselor</li><li>Explore our harm reduction resources</li><li>Join a support group</li></ul>';
    } else {
        resultMessage = 'Your responses suggest you may benefit from professional support for substance use concerns.';
        recommendationText = '<ul><li>Schedule a confidential consultation</li><li>Contact our addiction recovery services</li><li>Consider joining a recovery program</li><li>Reach out to crisis support if needed</li></ul>';
    }
    
    resultText.textContent = resultMessage;
    recommendations.innerHTML = recommendationText;
    resultDiv.style.display = 'block';
    
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Modal Management
function initializeModals() {
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Close modals with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
    
    // Initialize specific modal triggers
    const registerBtns = document.querySelectorAll('.event-btn.register');
    registerBtns.forEach(btn => {
        btn.addEventListener('click', () => openModal('registrationModal'));
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.link-card, .program-card, .service-card, .team-member, .benefit-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Filter Functionality
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category || btn.dataset.filter;
            const filterType = btn.closest('.categories-filter') ? 'category' : 'filter';
            
            // Update active button
            btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter items
            const items = document.querySelectorAll(`[data-${filterType}]`);
            items.forEach(item => {
                const itemCategory = item.dataset[filterType];
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Sleep Tracker
function initializeSleepTracker() {
    const sleepQualitySlider = document.getElementById('sleepQuality');
    const qualityValue = document.getElementById('qualityValue');
    
    if (sleepQualitySlider && qualityValue) {
        sleepQualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = e.target.value;
        });
    }
}

function logSleep() {
    const bedtime = document.getElementById('bedtime').value;
    const waketime = document.getElementById('waketime').value;
    const quality = document.getElementById('sleepQuality').value;
    
    if (!bedtime || !waketime) {
        alert('Please enter both bedtime and wake time.');
        return;
    }
    
    // Calculate sleep duration
    const bedDate = new Date(`2000-01-01 ${bedtime}`);
    const wakeDate = new Date(`2000-01-02 ${waketime}`);
    const duration = (wakeDate - bedDate) / (1000 * 60 * 60);
    
    // Save to localStorage (in real app, would save to database)
    const sleepLog = JSON.parse(localStorage.getItem('sleepLog') || '[]');
    sleepLog.push({
        date: new Date().toISOString().split('T')[0],
        bedtime,
        waketime,
        quality: parseInt(quality),
        duration
    });
    localStorage.setItem('sleepLog', JSON.stringify(sleepLog));
    
    // Update display
    updateSleepStats();
    
    alert('Sleep logged successfully!');
}

function updateSleepStats() {
    const sleepLog = JSON.parse(localStorage.getItem('sleepLog') || '[]');
    
    if (sleepLog.length === 0) return;
    
    const avgDuration = sleepLog.reduce((sum, entry) => sum + entry.duration, 0) / sleepLog.length;
    const avgQuality = sleepLog.reduce((sum, entry) => sum + entry.quality, 0) / sleepLog.length;
    
    // Update UI elements
    const avgDurationEl = document.getElementById('avgSleepDuration');
    const avgQualityEl = document.getElementById('avgQuality');
    
    if (avgDurationEl) avgDurationEl.textContent = `${avgDuration.toFixed(1)}h`;
    if (avgQualityEl) avgQualityEl.textContent = avgQuality.toFixed(1);
}

// Meditation Timer
function initializeMeditationTimer() {
    const startBtn = document.getElementById('startMeditation');
    const pauseBtn = document.getElementById('pauseMeditation');
    const resetBtn = document.getElementById('resetMeditation');
    
    if (startBtn) startBtn.addEventListener('click', startMeditation);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseMeditation);
    if (resetBtn) resetBtn.addEventListener('click', resetMeditation);
}

let meditationTimer = null;
let meditationTime = 300; // 5 minutes in seconds
let meditationRunning = false;

function startMeditation() {
    if (!meditationRunning) {
        meditationRunning = true;
        
        document.getElementById('startMeditation').style.display = 'none';
        document.getElementById('pauseMeditation').style.display = 'inline-block';
        
        startBreathingAnimation();
        
        meditationTimer = setInterval(() => {
            meditationTime--;
            updateMeditationDisplay();
            
            if (meditationTime <= 0) {
                resetMeditation();
                alert('Meditation session complete! Great job!');
            }
        }, 1000);
    }
}

function pauseMeditation() {
    if (meditationRunning) {
        meditationRunning = false;
        clearInterval(meditationTimer);
        
        document.getElementById('startMeditation').style.display = 'inline-block';
        document.getElementById('pauseMeditation').style.display = 'none';
        
        stopBreathingAnimation();
    }
}

function resetMeditation() {
    meditationRunning = false;
    meditationTime = 300;
    clearInterval(meditationTimer);
    
    document.getElementById('startMeditation').style.display = 'inline-block';
    document.getElementById('pauseMeditation').style.display = 'none';
    
    updateMeditationDisplay();
    stopBreathingAnimation();
}

function updateMeditationDisplay() {
    const minutes = Math.floor(meditationTime / 60);
    const seconds = meditationTime % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = display;
    }
}

function startBreathingAnimation() {
    const breathingCircle = document.getElementById('breathingCircle');
    if (breathingCircle) {
        breathingCircle.style.animation = 'breathe 4s infinite';
    }
}

function stopBreathingAnimation() {
    const breathingCircle = document.getElementById('breathingCircle');
    if (breathingCircle) {
        breathingCircle.style.animation = 'none';
    }
}

// Add breathing animation CSS dynamically
const breathingCSS = `
@keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
}
`;

const style = document.createElement('style');
style.textContent = breathingCSS;
document.head.appendChild(style);

// Sobriety Tracker
function initializeSobrietyTracker() {
    loadSobrietyData();
}

function setSobrietyDate() {
    const dateInput = document.getElementById('sobrietyDate');
    if (!dateInput.value) {
        alert('Please select a sobriety date.');
        return;
    }
    
    localStorage.setItem('sobrietyDate', dateInput.value);
    updateSobrietyDisplay();
}

function resetSobrietyDate() {
    if (confirm('Are you sure you want to reset your sobriety date?')) {
        localStorage.removeItem('sobrietyDate');
        updateSobrietyDisplay();
    }
}

function loadSobrietyData() {
    const savedDate = localStorage.getItem('sobrietyDate');
    if (savedDate) {
        const dateInput = document.getElementById('sobrietyDate');
        if (dateInput) {
            dateInput.value = savedDate;
        }
        updateSobrietyDisplay();
    }
}

function updateSobrietyDisplay() {
    const savedDate = localStorage.getItem('sobrietyDate');
    const daysDisplay = document.getElementById('sobrietyDays');
    
    if (!savedDate || !daysDisplay) return;
    
    const sobrietyDate = new Date(savedDate);
    const today = new Date();
    const diffTime = Math.abs(today - sobrietyDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    daysDisplay.textContent = diffDays;
    
    // Update milestone achievements
    const milestones = document.querySelectorAll('.milestone');
    milestones.forEach(milestone => {
        const days = parseInt(milestone.dataset.days);
        if (diffDays >= days) {
            milestone.style.opacity = '1';
            milestone.style.backgroundColor = '#27AE60';
            milestone.style.color = 'white';
        } else {
            milestone.style.opacity = '0.5';
            milestone.style.backgroundColor = '';
            milestone.style.color = '';
        }
    });
}

// Nutrition Planner
function initializeNutritionPlanner() {
    const suggestionTabs = document.querySelectorAll('[data-tab]');
    
    suggestionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tab.parentElement.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            const tabContent = document.querySelectorAll('[data-tab-content]');
            tabContent.forEach(content => {
                if (content.dataset.tabContent === tab.dataset.tab) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });
}

// Page-specific initializations
function getCurrentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
}

function initializeEventFilters() {
    const eventItems = document.querySelectorAll('.event-item');
    
    // Set up date filtering
    eventItems.forEach(item => {
        const eventDate = new Date(item.dataset.date);
        const today = new Date();
        
        if (eventDate < today) {
            item.style.opacity = '0.6';
        }
    });
}

function initializeFitnessTools() {
    // Initialize workout category filtering
    const workoutCards = document.querySelectorAll('.workout-card');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter workouts
            workoutCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function initializeNutritionTools() {
    // Initialize meal planner functionality
    const mealSlots = document.querySelectorAll('.meal-slot');
    
    mealSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const mealType = slot.dataset.meal;
            // In a real app, this would open a meal selection modal
            const meal = prompt(`Add a meal for ${mealType}:`);
            if (meal) {
                slot.querySelector('.meal-content').textContent = meal;
            }
        });
    });
}

function initializeMentalHealthTools() {
    // Initialize coping strategy tabs
    const strategyTabs = document.querySelectorAll('.tab-btn[data-tab]');
    
    strategyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Update active tab
            strategyTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            const tabContents = document.querySelectorAll('.strategy-tab[data-tab-content]');
            tabContents.forEach(content => {
                if (content.dataset.tabContent === tabName) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
}

function initializeSleepTools() {
    // Initialize bedtime routine builder
    const routineSelects = document.querySelectorAll('.activity-select');
    
    routineSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const timeSlot = e.target.closest('.timeline-slot').dataset.time;
            const activity = e.target.value;
            
            // Save routine to localStorage
            const routine = JSON.parse(localStorage.getItem('bedtimeRoutine') || '{}');
            routine[timeSlot] = activity;
            localStorage.setItem('bedtimeRoutine', JSON.stringify(routine));
        });
    });
    
    // Load saved routine
    const savedRoutine = JSON.parse(localStorage.getItem('bedtimeRoutine') || '{}');
    Object.keys(savedRoutine).forEach(timeSlot => {
        const select = document.querySelector(`[data-time="${timeSlot}"] .activity-select`);
        if (select) {
            select.value = savedRoutine[timeSlot];
        }
    });
}

function initializeRecoveryTools() {
    // Initialize sobriety tracker
    initializeSobrietyTracker();
}

function initializeLoginForms() {
    // Initialize login/signup tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Initialize password toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const input = e.target.closest('.password-input').querySelector('input');
            const icon = e.target;
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
    
    // Initialize donation amount selection
    const amountOptions = document.querySelectorAll('.amount-option input[type="radio"]');
    const customAmountDiv = document.getElementById('customAmount');
    
    amountOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                customAmountDiv.style.display = 'block';
            } else {
                customAmountDiv.style.display = 'none';
            }
        });
    });
}

function switchTab(tabName) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Update buttons
    tabBtns.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update content
    tabContents.forEach(content => {
        if (content.dataset.tabContent === tabName) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Utility Functions
function showSuccessMessage(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.querySelector('p').textContent = message;
        successDiv.style.display = 'flex';
    } else {
        alert(message);
    }
}

function closeSuccessMessage() {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.style.display = 'none';
    }
}

function resetForm() {
    const form = document.querySelector('form');
    if (form) {
        form.reset();
        
        // Clear any error messages
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        
        // Reset field styles
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.style.borderColor = '';
        });
    }
}

// Global functions for modal triggers
function openVolunteerForm() {
    openModal('volunteerModal');
}

function openDonationForm() {
    // Scroll to donation section
    const donationSection = document.querySelector('.donation-section');
    if (donationSection) {
        donationSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function openAdvocacyForm() {
    alert('Advocacy program coming soon! Please contact us for more information.');
}

function openPartnershipForm() {
    alert('Partnership opportunities coming soon! Please contact us for more information.');
}

function openForgotPassword() {
    openModal('forgotPasswordModal');
}

function closeForgotPassword() {
    closeModal('forgotPasswordModal');
}

function openTerms() {
    alert('Terms of Service would be displayed here in a real application.');
}

function openPrivacy() {
    alert('Privacy Policy would be displayed here in a real application.');
}

function openHIPAA() {
    alert('HIPAA Privacy Notice would be displayed here in a real application.');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        toggle.className = 'fas fa-eye';
    }
}

function loginWithGoogle() {
    alert('Google login would be implemented here in a real application.');
}

function loginWithMicrosoft() {
    alert('Microsoft login would be implemented here in a real application.');
}

function openMap() {
    alert('Campus map with directions would open here in a real application.');
}

function openScheduler() {
    alert('Online appointment scheduler would open here in a real application.');
}

function saveRoutine() {
    alert('Bedtime routine saved successfully!');
}

function startBreathingExercise() {
    alert('Guided breathing exercise would start here. Follow the on-screen instructions.');
}

function startPMR() {
    alert('Progressive muscle relaxation guide would start here.');
}

function startBodyScan() {
    alert('Body scan meditation would begin here.');
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // In a production app, this would send error reports to a logging service
});

// Performance monitoring
window.addEventListener('load', () => {
    // Log page load time for performance monitoring
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

// Service Worker registration (for future PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // In a real app, we would register a service worker here
        // navigator.serviceWorker.register('/sw.js');
    });
}
// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme') || 
                    (prefersDarkScheme.matches ? 'dark' : 'light');

// Apply the current theme
if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Show sun icon for dark mode
} else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Show moon icon for light mode
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Switch to moon icon
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Switch to sun icon
        localStorage.setItem('theme', 'dark');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        // Toggle mobile menu
        function toggleMenu() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scrolling when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
        
        // Add click event to hamburger
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !hamburger.contains(e.target) && 
                !navMenu.contains(e.target)) {
                toggleMenu();
            }
        });
        
        // Handle dropdown menus on mobile
        const dropdownToggles = document.querySelectorAll('.dropdown > .nav-link');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const dropdown = this.parentElement;
                    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                    
                    // Close other open dropdowns
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        if (menu !== dropdownMenu && menu.style.display === 'block') {
                            menu.style.display = 'none';
                        }
                    });
                    
                    // Toggle current dropdown
                    if (dropdownMenu.style.display === 'block') {
                        dropdownMenu.style.display = 'none';
                    } else {
                        dropdownMenu.style.display = 'block';
                    }
                }
            });
        });
    }
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }
});
// newwwwwww
// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        function toggleMenu() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }
        
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    // For dropdown parents, don't close the menu immediately
                    if (!link.parentElement.classList.contains('dropdown')) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            });
        });
        
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !hamburger.contains(e.target) && 
                !navMenu.contains(e.target)) {
                toggleMenu();
            }
        });
        
        // Handle dropdowns on mobile
        const dropdownToggles = document.querySelectorAll('.dropdown > .nav-link');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    const dropdownMenu = this.nextElementSibling;
                    
                    // Close other dropdowns
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        if (menu !== dropdownMenu && menu.classList.contains('show')) {
                            menu.classList.remove('show');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdownMenu.classList.toggle('show');
                }
            });
        });
    }
});

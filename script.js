// Skills data with detailed information from official sources
const skillsData = [
    {
        id: 'flutter-mobile',
        name: 'Flutter Mobile Development',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
        description: 'Cross-platform mobile application development using Flutter framework for both Android and iOS platforms.',
        features: [
            'Single codebase for multiple platforms',
            'Hot reload for fast development',
            'Native performance with compiled code',
            'Rich widget library and customizable UI',
            'Strong community and Google support',
            'Integration with Firebase and other services'
        ],
        projects: 'Developed multiple mobile applications including e-commerce apps, social media platforms, and productivity tools using Flutter. Implemented features like user authentication, real-time chat, payment integration, and offline functionality.',
        level: 'Advanced',
        experience: '2+ years'
    },
    {
        id: 'flutter-web',
        name: 'Flutter Web Development',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
        description: 'Web application development using Flutter for web, creating responsive and performant web experiences.',
        features: [
            'Code sharing between mobile and web',
            'WebAssembly support for performance',
            'Responsive design capabilities',
            'Progressive Web App (PWA) support',
            'SEO optimization options',
            'Modern web standards compliance'
        ],
        projects: 'Built responsive web applications including portfolio websites, dashboard applications, and business management systems. Focused on performance optimization and user experience across different browsers.',
        level: 'Intermediate',
        experience: '1.5+ years'
    },
    {
        id: 'swift-ios',
        name: 'Swift iOS Development',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
        description: 'Native iOS application development using Swift programming language and Apple development frameworks.',
        features: [
            'Native iOS performance and capabilities',
            'SwiftUI for modern declarative UI',
            'Xcode development environment',
            'App Store distribution',
            'iOS-specific features and integrations',
            'Memory safety and performance optimization'
        ],
        projects: 'Created native iOS applications including utility apps, games, and business applications. Implemented features like Core Data, CloudKit integration, push notifications, and In-App purchases.',
        level: 'Intermediate',
        experience: '1+ years'
    },
    {
        id: 'java-enterprise',
        name: 'Java Enterprise Development',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
        description: 'Enterprise-level application development using Java programming language and related frameworks.',
        features: [
            'Object-oriented programming principles',
            'Spring Framework and Spring Boot',
            'RESTful API development',
            'Database integration with JPA/Hibernate',
            'Microservices architecture',
            'Enterprise security and scalability'
        ],
        projects: 'Developed enterprise applications including web services, RESTful APIs, and backend systems. Worked on projects involving database management, user authentication, and system integration.',
        level: 'Intermediate',
        experience: '2+ years'
    }
];

// DOM elements
const skillsGrid = document.getElementById('skillsGrid');
const modal = document.getElementById('skillModal');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalFeatures = document.getElementById('modalFeatures');
const modalProjects = document.getElementById('modalProjects');
const closeModal = document.querySelector('.close');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSkills();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    loadProfileImage();
    startProfileImageWatcher();
});

// Load profile image from localStorage
function loadProfileImage() {
    const savedData = localStorage.getItem('cvDashboardData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            if (data.profileImage) {
                const profileImg = document.querySelector('.profile-img');
                if (profileImg) {
                    // Add cache busting parameter to prevent caching issues
                    const cacheBuster = new Date().getTime();
                    const imageUrl = data.profileImage.includes('data:') 
                        ? data.profileImage 
                        : `${data.profileImage}?t=${cacheBuster}`;
                    
                    // Force image reload to prevent caching
                    profileImg.onload = null;
                    profileImg.onerror = null;
                    profileImg.src = '';
                    setTimeout(() => {
                        profileImg.src = imageUrl;
                    }, 10);
                }
            }
        } catch (error) {
            console.error('Error loading profile image:', error);
        }
    }
}

// Check for profile image updates periodically
function startProfileImageWatcher() {
    let lastProfileImage = null;
    
    setInterval(() => {
        const savedData = localStorage.getItem('cvDashboardData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.profileImage && data.profileImage !== lastProfileImage) {
                    lastProfileImage = data.profileImage;
                    loadProfileImage();
                }
            } catch (error) {
                console.error('Error checking profile image updates:', error);
            }
        }
    }, 2000); // Check every 2 seconds
}

// Force refresh profile image (useful for Netlify caching issues)
function forceRefreshProfileImage() {
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        const currentSrc = profileImg.src;
        profileImg.src = '';
        setTimeout(() => {
            loadProfileImage();
        }, 100);
    }
}

// Add keyboard shortcut to force refresh (Ctrl+Shift+R)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        forceRefreshProfileImage();
        console.log('Profile image force refreshed');
    }
});

// Initialize skills grid
function initializeSkills() {
    if (!skillsGrid) return;
    
    skillsGrid.innerHTML = '';
    
    skillsData.forEach(skill => {
        const skillCard = createSkillCard(skill);
        skillsGrid.appendChild(skillCard);
    });
}

// Create skill card element
function createSkillCard(skill) {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.dataset.skillId = skill.id;
    
    card.innerHTML = `
        <img src="${skill.icon}" alt="${skill.name}" class="skill-icon" onerror="this.src='https://via.placeholder.com/80x80/2563eb/FFFFFF?text=${skill.name.charAt(0)}'">
        <h3>${skill.name}</h3>
        <p>${skill.description}</p>
        <div class="skill-level">
            <span>${skill.level}</span>
            <span>•</span>
            <span>${skill.experience}</span>
        </div>
    `;
    
    // Add hover effect with cursor following
    card.addEventListener('mouseenter', function(e) {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        showSkillPreview(skill, e);
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        hideSkillPreview();
    });
    
    card.addEventListener('mousemove', function(e) {
        updateSkillPreview(e);
    });
    
    // Add click event to open modal
    card.addEventListener('click', function() {
        openSkillModal(skill);
    });
    
    return card;
}

// Show skill preview on hover
function showSkillPreview(skill, event) {
    let preview = document.getElementById('skillPreview');
    if (!preview) {
        preview = document.createElement('div');
        preview.id = 'skillPreview';
        preview.className = 'skill-preview';
        document.body.appendChild(preview);
    }
    
    preview.innerHTML = `
        <div class="preview-content">
            <img src="${skill.icon}" alt="${skill.name}" class="preview-icon">
            <h4>${skill.name}</h4>
            <p>Click for more details</p>
        </div>
    `;
    
    preview.style.display = 'block';
    updateSkillPreview(event);
}

// Update skill preview position
function updateSkillPreview(event) {
    const preview = document.getElementById('skillPreview');
    if (preview) {
        preview.style.left = (event.pageX + 20) + 'px';
        preview.style.top = (event.pageY - 50) + 'px';
    }
}

// Hide skill preview
function hideSkillPreview() {
    const preview = document.getElementById('skillPreview');
    if (preview) {
        preview.style.display = 'none';
    }
}

// Open skill modal
function openSkillModal(skill) {
    if (!modal) return;
    
    modalIcon.src = skill.icon;
    modalIcon.onerror = function() {
        this.src = `https://via.placeholder.com/80x80/2563eb/FFFFFF?text=${skill.name.charAt(0)}`;
    };
    modalTitle.textContent = skill.name;
    modalDescription.textContent = skill.description;
    
    // Populate features list
    modalFeatures.innerHTML = '';
    skill.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        modalFeatures.appendChild(li);
    });
    
    modalProjects.textContent = skill.projects;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
        modal.querySelector('.modal-content').style.opacity = '1';
    }, 10);
}

// Close skill modal
function closeSkillModal() {
    if (!modal) return;
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Initialize navigation
function initializeNavigation() {
    // Hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
}

// Update active navigation item
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.skill-card, .timeline-item, .stat, .education-item, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// Initialize animations
function initializeAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .skill-preview {
            position: absolute;
            background: white;
            border-radius: 0.5rem;
            padding: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 1500;
            display: none;
            pointer-events: none;
            max-width: 250px;
            border: 2px solid #2563eb;
        }
        
        .preview-content {
            text-align: center;
        }
        
        .preview-icon {
            width: 40px;
            height: 40px;
            margin-bottom: 0.5rem;
        }
        
        .preview-content h4 {
            margin: 0 0 0.25rem 0;
            color: #1e293b;
            font-size: 0.9rem;
        }
        
        .preview-content p {
            margin: 0;
            color: #64748b;
            font-size: 0.8rem;
        }
        
        .skill-card, .timeline-item, .stat, .education-item, .contact-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .skill-card.animate-in, .timeline-item.animate-in, .stat.animate-in, 
        .education-item.animate-in, .contact-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .nav-menu a.active {
            color: #2563eb !important;
        }
        
        .nav-menu a.active::after {
            width: 100% !important;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `;
    document.head.appendChild(style);
}

// Modal event listeners
if (closeModal) {
    closeModal.addEventListener('click', closeSkillModal);
}

if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeSkillModal();
        }
    });
}

// Keyboard events
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
        closeSkillModal();
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    if (!element) return;
    
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on page load
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 100);
    }
});

// Smooth reveal animations for sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.section-title, .about-text p, .timeline-content');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate skill cards with stagger
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = `slideInUp 0.6s ease forwards`;
        }, index * 100);
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
window.addEventListener('scroll', debounce(updateActiveNavigation, 10));
window.addEventListener('scroll', debounce(revealOnScroll, 10));
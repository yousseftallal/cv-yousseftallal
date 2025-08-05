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
    // Force reload to prevent caching issues - no localStorage to clear
    
    // Initialize About section with default data immediately
    const defaultAbout = {
        title: 'About Me',
        paragraph1: 'I am Yousef Talal, a dedicated computer science student with a passion for creating innovative applications that solve real-world problems. My expertise spans across multiple platforms and technologies, allowing me to develop comprehensive solutions for diverse user needs.',
        paragraph2: 'With a focus on mobile development using Flutter, iOS development with Swift, and enterprise applications with Java, I bring a versatile skill set to every project. I am committed to writing clean, efficient code and staying current with the latest industry trends and best practices.',
        stats: [
            {
                id: 'languages',
                icon: 'fas fa-code',
                title: '4+',
                description: 'Programming Languages'
            },
            {
                id: 'platforms',
                icon: 'fas fa-mobile-alt',
                title: 'Multi-Platform',
                description: 'Development Experience'
            },
            {
                id: 'education',
                icon: 'fas fa-graduation-cap',
                title: 'Computer Science',
                description: 'Student'
            }
        ]
    };
    // Initialize About section with delay to ensure DOM is ready
    setTimeout(() => {
        console.log('Initializing About section with default data');
        updateAboutSection(defaultAbout);
    }, 100);
    
    loadCVDataFromDatabase();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    loadProfileImage();
    checkUrlForImageData();
    addRefreshButton();
    
    // Force refresh data every 30 seconds to ensure latest data
    setInterval(() => {
        loadCVDataFromDatabase();
        loadProfileImage();
    }, 30000);
});

// Add refresh button to navigation
function addRefreshButton() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        const refreshLi = document.createElement('li');
        refreshLi.innerHTML = `
            <button onclick="forceRefresh()" class="refresh-btn" title="Force Refresh Data">
                <i class="fas fa-sync-alt"></i>
            </button>
        `;
        navMenu.appendChild(refreshLi);
    }
}

// Force refresh function
function forceRefresh() {
    console.log('Force refreshing data...');
    // No localStorage to clear - data comes from database only
    loadCVDataFromDatabase();
    loadProfileImage();
    
    // Show feedback
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        }, 2000);
    }
}



// Check URL for image data (for sharing)
function checkUrlForImageData() {
    const urlParams = new URLSearchParams(window.location.search);
    const imageData = urlParams.get('profileImage');
    
    if (imageData) {
        try {
            const decodedData = decodeURIComponent(imageData);
            if (decodedData.startsWith('http') || decodedData.startsWith('https')) {
                // Load the image directly without saving
                const profileImg = document.querySelector('.profile-img');
                if (profileImg) {
                    profileImg.src = decodedData;
                    showSuccessMessage('Profile image loaded from URL!');
                }
                
                // Remove the parameter from URL
                const newUrl = new URL(window.location);
                newUrl.searchParams.delete('profileImage');
                window.history.replaceState({}, '', newUrl);
            }
        } catch (error) {
            console.error('Error processing URL image data:', error);
        }
    }
}

// Show success message
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    messageDiv.innerHTML = `
        <i class="fas fa-check"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto;">&times;</button>
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}



// Load profile image from database
async function loadProfileImage() {
    const profileImg = document.querySelector('.profile-img');
    if (!profileImg) return;
    
    try {
        // Try to load from database first with cache busting
        const cacheBuster = new Date().getTime();
        const response = await fetch(`/.netlify/functions/profile-image?t=${cacheBuster}`);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.imageUrl) {
                // Add cache busting to image URL
                const imageUrl = `${data.imageUrl}${data.imageUrl.includes('?') ? '&' : '?'}t=${cacheBuster}`;
                
                profileImg.onload = () => {
                    console.log('Profile image loaded successfully from database:', data.imageUrl);
                };
                profileImg.onerror = () => {
                    console.error('Failed to load image from database URL:', data.imageUrl);
                    // Fallback to default
                    profileImg.src = 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=YT';
                };
                profileImg.src = imageUrl;
                return;
            }
        }
    } catch (error) {
        console.error('Error loading profile image from database:', error);
    }
    
    // No localStorage fallback - data comes from database only
    
    // Default placeholder
    profileImg.src = 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=YT';
    console.log('Using default profile image placeholder');
}





// Load CV data from database
async function loadCVDataFromDatabase() {
    try {
        // Add cache busting to prevent caching issues
        const cacheBuster = new Date().getTime();
        console.log('Loading CV data from database...');
        
        const response = await fetch(`/.netlify/functions/cv-data?t=${cacheBuster}`);
        console.log('Database response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('Database response:', result);
            
            if (result.success && result.data) {
                console.log('Personal data from database:', result.data.personal);
                
                // Update skills data
                if (result.data.skills) {
                    window.skillsData = result.data.skills;
                    console.log('Skills data updated:', result.data.skills);
                }
                
                // Update personal info
                if (result.data.personal) {
                    updatePersonalInfo(result.data.personal);
                    console.log('Personal info updated');
                }
                
                // Update experience
                if (result.data.experience) {
                    updateExperience(result.data.experience);
                    console.log('Experience updated');
                }
                
                // Update education
                if (result.data.education) {
                    updateEducation(result.data.education);
                    console.log('Education updated');
                }
                
                // Update about section
                if (result.data.about) {
                    updateAboutSection(result.data.about);
                    console.log('About section updated');
                }
                
                // Initialize skills with new data
                initializeSkills();
                
                console.log('CV data loaded from database successfully');
                return;
            }
        }
    } catch (error) {
        console.error('Error loading CV data from database:', error);
    }
    
    // Fallback to default data
    console.log('Using default CV data');
    
    // Default about data as fallback
    const defaultAbout = {
        title: 'About Me',
        paragraph1: 'I am Yousef Talal, a dedicated computer science student with a passion for creating innovative applications that solve real-world problems. My expertise spans across multiple platforms and technologies, allowing me to develop comprehensive solutions for diverse user needs.',
        paragraph2: 'With a focus on mobile development using Flutter, iOS development with Swift, and enterprise applications with Java, I bring a versatile skill set to every project. I am committed to writing clean, efficient code and staying current with the latest industry trends and best practices.',
        stats: [
            {
                id: 'languages',
                icon: 'fas fa-code',
                title: '4+',
                description: 'Programming Languages'
            },
            {
                id: 'platforms',
                icon: 'fas fa-mobile-alt',
                title: 'Multi-Platform',
                description: 'Development Experience'
            },
            {
                id: 'education',
                icon: 'fas fa-graduation-cap',
                title: 'Computer Science',
                description: 'Student'
            }
        ]
    };
    
    updateAboutSection(defaultAbout);
    initializeSkills();
}

// Update personal information
function updatePersonalInfo(personal) {
    console.log('Updating personal info with:', personal);
    
    // Update navbar
    const navBrandImage = document.getElementById('navBrandImage');
    const navBrandText = document.getElementById('navBrandText');
    const navBrandTitle = document.getElementById('navBrandTitle');
    const navBrandSubtitle = document.getElementById('navBrandSubtitle');
    
    // Update brand icon/image
    if (personal.brandImage) {
        navBrandImage.src = personal.brandImage;
        navBrandImage.style.display = 'block';
        navBrandText.style.display = 'none';
    } else if (personal.brandIcon) {
        navBrandImage.style.display = 'none';
        navBrandText.style.display = 'block';
        navBrandText.textContent = personal.brandIcon;
    }
    
    if (navBrandTitle && personal.brandTitle) {
        navBrandTitle.textContent = personal.brandTitle;
        // Add Arabic text class if contains Arabic characters
        if (/[\u0600-\u06FF]/.test(personal.brandTitle)) {
            navBrandTitle.classList.add('arabic-text');
        } else {
            navBrandTitle.classList.add('english-text');
        }
    }
    
    if (navBrandSubtitle && personal.brandSubtitle) {
        navBrandSubtitle.textContent = personal.brandSubtitle;
        // Add Arabic text class if contains Arabic characters
        if (/[\u0600-\u06FF]/.test(personal.brandSubtitle)) {
            navBrandSubtitle.classList.add('arabic-text');
        } else {
            navBrandSubtitle.classList.add('english-text');
        }
    }
    
    // Update hero section
    const nameElement = document.querySelector('.hero-text h1');
    const subtitleElement = document.querySelector('.hero-subtitle');
    const descriptionElement = document.querySelector('.hero-description');
    
    console.log('Found elements:', {
        nameElement: !!nameElement,
        subtitleElement: !!subtitleElement,
        descriptionElement: !!descriptionElement
    });
    
    if (nameElement && personal.fullName) {
        nameElement.textContent = personal.fullName;
        console.log('Updated name to:', personal.fullName);
    }
    
    if (subtitleElement && personal.jobTitle) {
        subtitleElement.textContent = personal.jobTitle;
        console.log('Updated job title to:', personal.jobTitle);
    }
    
    if (descriptionElement && personal.aboutText) {
        descriptionElement.textContent = personal.aboutText;
        console.log('Updated description to:', personal.aboutText);
    }
    
    // Update contact section with clickable links
    updateContactSection(personal);

    
    // Update contact information
    const emailElement = document.querySelector('.contact-item:nth-child(1) p');
    const phoneElement = document.querySelector('.contact-item:nth-child(2) p');
    const locationElement = document.querySelector('.contact-item:nth-child(3) p');
    
    console.log('Found contact elements:', {
        emailElement: !!emailElement,
        phoneElement: !!phoneElement,
        locationElement: !!locationElement
    });
    
    if (emailElement && personal.email) {
        emailElement.textContent = personal.email;
        console.log('Updated email to:', personal.email);
    }
    
    if (phoneElement && personal.phone) {
        phoneElement.textContent = personal.phone;
        console.log('Updated phone to:', personal.phone);
    }
    
    if (locationElement && personal.location) {
        locationElement.textContent = personal.location;
        console.log('Updated location to:', personal.location);
    }
    
    // Update stats if available
    if (personal.stats) {
        const statsContainer = document.querySelector('.about-stats');
        if (statsContainer && personal.stats.length > 0) {
            let statsHTML = '';
            personal.stats.forEach(stat => {
                statsHTML += `
                    <div class="stat">
                        <i class="${stat.icon || 'fas fa-chart-bar'}"></i>
                        <h3>${stat.value || '0'}</h3>
                        <p>${stat.label || 'Stat'}</p>
                    </div>
                `;
            });
            statsContainer.innerHTML = statsHTML;
        }
    }
}

// Update contact section with clickable links
function updateContactSection(personal) {
    console.log('Updating contact section with:', personal);
    
    // Update contact items with clickable functionality
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const icon = item.querySelector('i');
        const h4 = item.querySelector('h4');
        const p = item.querySelector('p');
        
        if (!icon || !h4 || !p) return;
        
        // Remove existing click handlers and styles
        item.style.cursor = 'default';
        item.onclick = null;
        item.title = '';
        item.classList.remove('clickable');
        
        // Email contact item
        if (icon.classList.contains('fa-envelope') && personal.emailLink) {
            item.style.cursor = 'pointer';
            item.classList.add('clickable');
            item.onclick = () => window.open(personal.emailLink, '_blank');
            item.title = 'Click to contact via email';
        }
        
        // Phone contact item
        if (icon.classList.contains('fa-phone') && personal.phoneLink) {
            item.style.cursor = 'pointer';
            item.classList.add('clickable');
            item.onclick = () => window.open(personal.phoneLink, '_blank');
            item.title = 'Click to call or message';
        }
        
        // Location contact item
        if (icon.classList.contains('fa-map-marker-alt') && personal.locationLink) {
            item.style.cursor = 'pointer';
            item.classList.add('clickable');
            item.onclick = () => window.open(personal.locationLink, '_blank');
            item.title = 'Click to view location';
        }
    });
    
    // Update social media links
    const socialLinks = document.querySelectorAll('.social-link');
    const socialUrls = [
        personal.linkedinUrl,
        personal.githubUrl, 
        personal.twitterUrl,
        personal.websiteUrl
    ];
    
    const socialNames = ['LinkedIn', 'GitHub', 'Twitter', 'Website'];
    
    socialLinks.forEach((link, index) => {
        if (socialUrls[index]) {
            link.href = socialUrls[index];
            link.target = '_blank';
            link.style.opacity = '1';
            link.style.pointerEvents = 'auto';
            link.classList.remove('disabled');
            link.title = `Visit my ${socialNames[index]} profile`;
        } else {
            link.href = '#';
            link.target = '';
            link.style.opacity = '0.5';
            link.style.pointerEvents = 'none';
            link.classList.add('disabled');
            link.title = `${socialNames[index]} link not configured`;
            link.onclick = (e) => e.preventDefault();
        }
    });
    
    console.log('Contact section updated with links');
}

// Update About Me section
function updateAboutSection(about) {
    console.log('Updating about section with:', about);
    
    // Wait a bit for DOM to be ready
    setTimeout(() => {
        console.log('DOM should be ready now, updating about section...');
        
        // Check if about section exists
        const aboutSection = document.querySelector('#about');
        console.log('About section found:', !!aboutSection);
        
        // Update section title
        const sectionTitle = document.querySelector('#about .section-title');
        console.log('Section title element:', sectionTitle);
        if (sectionTitle && about && about.title) {
            sectionTitle.textContent = about.title;
            console.log('Updated section title to:', about.title);
        }
        
        // Update paragraphs
        const aboutTextDiv = document.querySelector('.about-text');
        console.log('About text div:', aboutTextDiv);
        console.log('About paragraphs:', about?.paragraph1, about?.paragraph2);
        
        if (aboutTextDiv) {
            aboutTextDiv.innerHTML = '';
            
            if (about && about.paragraph1) {
                const p1 = document.createElement('p');
                p1.textContent = about.paragraph1;
                aboutTextDiv.appendChild(p1);
                console.log('Added paragraph 1');
            }
            
            if (about && about.paragraph2) {
                const p2 = document.createElement('p');
                p2.textContent = about.paragraph2;
                aboutTextDiv.appendChild(p2);
                console.log('Added paragraph 2');
            }
            
            // If no paragraphs, show default message
            if (!about || (!about.paragraph1 && !about.paragraph2)) {
                const defaultP = document.createElement('p');
                defaultP.textContent = 'No content available. Please update from dashboard.';
                aboutTextDiv.appendChild(defaultP);
                console.log('Added default message');
            }
        }
        
        // Update stats
        const statsContainer = document.querySelector('.about-stats');
        console.log('Stats container:', statsContainer);
        console.log('About stats:', about?.stats);
        
        if (statsContainer) {
            statsContainer.innerHTML = '';
            
            if (about && about.stats && about.stats.length > 0) {
                about.stats.forEach((stat, index) => {
                    const statDiv = document.createElement('div');
                    statDiv.className = 'stat';
                    statDiv.innerHTML = `
                        <i class="${stat.icon}"></i>
                        <h3>${stat.title}</h3>
                        <p>${stat.description}</p>
                    `;
                    statsContainer.appendChild(statDiv);
                    console.log(`Added stat ${index + 1}:`, stat);
                });
            } else {
                // Show default loading stat if no data
                const loadingStat = document.createElement('div');
                loadingStat.className = 'stat';
                loadingStat.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>No Data</h3>
                    <p>Please update from dashboard</p>
                `;
                statsContainer.appendChild(loadingStat);
                console.log('Added no data message');
            }
        }
        
        console.log('About section updated successfully');
    }, 50); // Small delay to ensure DOM is ready
}

// Update experience section
function updateExperience(experience) {
    const timeline = document.querySelector('.timeline');
    if (timeline && experience.length > 0) {
        let experienceHTML = '';
        experience.forEach((exp, index) => {
            const isEven = index % 2 === 0;
            const sideClass = isEven ? 'timeline-left' : 'timeline-right';
            
            experienceHTML += `
                <div class="timeline-item ${sideClass}" style="animation-delay: ${index * 0.2}s" data-index="${index}">
                    <div class="timeline-content">
        
                        <div class="timeline-header">
                            <div class="timeline-title-group">
                                <h3>${exp.title || 'Experience'}</h3>
                            </div>
                            <span class="timeline-date">
                                <i class="fas fa-calendar-alt"></i>
                                ${exp.period || 'Period'}
                            </span>
                        </div>
                        <p>${exp.description || 'No description available'}</p>
                        ${exp.technologies && exp.technologies.length > 0 ? `
                            <div class="tech-stack">
                                <i class="fas fa-code" style="color: #2563eb; margin-right: 0.5rem; font-size: 0.9rem;"></i>
                                ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        timeline.innerHTML = experienceHTML;
        
        // Trigger animations after a short delay
        setTimeout(() => {
            document.querySelectorAll('.timeline-item').forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate-in');
                }, index * 200);
            });
        }, 100);
    }
}

// Update education section
function updateEducation(education) {
    const educationGrid = document.querySelector('.education-grid');
    if (educationGrid && education.length > 0) {
        let educationHTML = '';
        education.forEach((edu, index) => {
            educationHTML += `
                <div class="education-item" style="animation-delay: ${index * 0.3}s">
                    <div class="education-header">
                        <div class="education-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div class="education-info">
                            <h3>${edu.title || 'Education'}</h3>
                            <div class="institution">${edu.institution || 'Institution'}</div>
                            <div class="duration">${edu.period || 'Period'}</div>
                        </div>
                    </div>
                    <div class="education-content">
                        <div class="description">${edu.description || 'No description available'}</div>
                    </div>
                </div>
            `;
        });
        educationGrid.innerHTML = educationHTML;
        
        // Trigger animations after a short delay
        setTimeout(() => {
            document.querySelectorAll('.education-item').forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate-in');
                }, index * 300);
            });
        }, 100);
    }
}

// Initialize skills grid
function initializeSkills() {
    if (!skillsGrid) return;
    
    skillsGrid.innerHTML = '';
    
    const currentSkillsData = window.skillsData || skillsData;
    
    // Create skill cards
    currentSkillsData.forEach(skill => {
        const skillCard = createSkillCard(skill);
        skillsGrid.appendChild(skillCard);
    });
    
    // Start carousel animation
    startCarousel();
}

// Carousel function
function startCarousel() {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid) return;
    
    const cards = skillsGrid.querySelectorAll('.skill-card');
    if (cards.length === 0) return;
    
    let currentIndex = 0;
    const totalCards = cards.length;
    const autoRotateSpeed = 4000; // 4 seconds per card
    
    function updateCarousel() {
        cards.forEach((card, index) => {
            const position = index - currentIndex;
            let translateX = 0;
            let translateZ = 0;
            let rotateY = 0;
            let opacity = 0;
            let scale = 0.8;
            let zIndex = 1;
            
            // Show 3 cards: center, left, right
            if (position === 0) {
                // Center card (main focus)
                translateX = 0;
                translateZ = 0;
                rotateY = 0;
                opacity = 1;
                scale = 1;
                zIndex = 10;
            } else if (position === 1 || (position === -(totalCards - 1))) {
                // Right card
                translateX = 280;
                translateZ = -100;
                rotateY = -25;
                opacity = 0.7;
                scale = 0.85;
                zIndex = 5;
            } else if (position === -1 || (position === totalCards - 1)) {
                // Left card
                translateX = -280;
                translateZ = -100;
                rotateY = 25;
                opacity = 0.7;
                scale = 0.85;
                zIndex = 5;
            } else {
                // Hidden cards
                opacity = 0;
                scale = 0.6;
                zIndex = 1;
                if (position > 0) {
                    translateX = 400;
                    rotateY = -45;
                } else {
                    translateX = -400;
                    rotateY = 45;
                }
            }
            
            card.style.transform = `
                translateX(${translateX}px) 
                translateZ(${translateZ}px) 
                rotateY(${rotateY}deg) 
                scale(${scale})
            `;
            card.style.opacity = opacity;
            card.style.zIndex = zIndex;
        });
    }
    
    function nextCard() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    }
    
    // Initial setup
    updateCarousel();
    
    // Auto-rotate
    setInterval(nextCard, autoRotateSpeed);
    
    // Add navigation controls (only if not already exists)
    const skillsContainer = skillsGrid.parentElement;
    let navContainer = skillsContainer.querySelector('.carousel-nav');
    
    if (!navContainer) {
        navContainer = document.createElement('div');
        navContainer.className = 'carousel-nav';
        navContainer.innerHTML = `
            <button class="carousel-btn prev-btn" onclick="prevSkill()">
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="carousel-indicators">
                ${cards.length > 0 ? Array.from(cards).map((_, index) => 
                    `<span class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
                ).join('') : ''}
            </div>
            <button class="carousel-btn next-btn" onclick="nextSkill()">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        skillsContainer.appendChild(navContainer);
    }
    
    // Add click handlers for indicators
    const indicators = navContainer.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            updateIndicators();
        });
    });
    
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Global functions for navigation buttons
    window.nextSkill = () => {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
        updateIndicators();
    };
    
    window.prevSkill = () => {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
        updateIndicators();
    };
    
    // Add click handlers for manual navigation
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            updateIndicators();
        });
        
        // Add hover effect for side cards
        card.addEventListener('mouseenter', () => {
            const position = index - currentIndex;
            if (position === 1 || position === -(totalCards - 1) || position === -1 || position === totalCards - 1) {
                card.style.transform = card.style.transform.replace(/scale\([^)]*\)/, 'scale(0.9)');
            }
        });
        
        card.addEventListener('mouseleave', () => {
            updateCarousel(); // Reset to original position
        });
    });
}

// Create skill card element
function createSkillCard(skill) {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.dataset.skillId = skill.id || 'skill-' + Math.random().toString(36).substr(2, 9);
    
    // Handle null/undefined values
    const skillName = skill.name || 'Unnamed Skill';
    const skillIcon = skill.icon || 'https://via.placeholder.com/80x80/2563eb/FFFFFF?text=?';
    const skillDescription = skill.description || 'No description available';
    const skillLevel = skill.level || 'Beginner';
    const skillExperience = skill.experience || '0 years';
    const skillFeatures = skill.features || [];
    const skillProjects = skill.projects || '';
    
    // Create level badge color based on level
    const levelColors = {
        'Beginner': 'linear-gradient(135deg, #10b981, #059669)',
        'Intermediate': 'linear-gradient(135deg, #f59e0b, #d97706)', 
        'Advanced': 'linear-gradient(135deg, #3b82f6, #2563eb)',
        'Expert': 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    };
    
    const levelColor = levelColors[skillLevel] || levelColors['Beginner'];
    
    card.innerHTML = `
        <div class="skill-card-inner">
            <div class="skill-level-badge" style="background: ${levelColor}">
                ${skillLevel}
            </div>
            <div class="skill-header">
                <div class="skill-icon-wrapper">
                    <img src="${skillIcon}" alt="${skillName}" class="skill-icon" onerror="this.src='https://via.placeholder.com/60x60/2563eb/FFFFFF?text=${skillName.charAt(0)}'">
                </div>
                <div class="skill-info">
                    <h3 class="skill-title">${skillName}</h3>
                    <div class="skill-experience">
                        <i class="fas fa-clock"></i>
                        <span>${skillExperience}</span>
                    </div>
                </div>
            </div>
            <div class="skill-body">
                <p class="skill-description">${skillDescription}</p>
                ${skillFeatures.length > 0 ? `
                    <div class="skill-features">
                        <div class="features-preview">
                            ${skillFeatures.slice(0, 2).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                            ${skillFeatures.length > 2 ? `<span class="feature-more">+${skillFeatures.length - 2} more</span>` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
            <div class="skill-footer">
                <div class="skill-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" data-level="${skillLevel}"></div>
                    </div>
                </div>
                <div class="skill-action">
                    <i class="fas fa-arrow-right"></i>
                </div>
            </div>
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
    
    // Handle null/undefined values
    const skillName = skill.name || 'Unnamed Skill';
    const skillIcon = skill.icon || 'https://via.placeholder.com/80x80/2563eb/FFFFFF?text=?';
    const skillDescription = skill.description || 'No description available';
    
    preview.innerHTML = `
        <div class="preview-content">
            <img src="${skillIcon}" alt="${skillName}" class="preview-icon">
            <h4>${skillName}</h4>
            <p>${skillDescription}</p>
            <p class="preview-hint">Click for more details</p>
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
    
    // Handle null/undefined values
    const skillName = skill.name || 'Unnamed Skill';
    const skillIcon = skill.icon || 'https://via.placeholder.com/80x80/2563eb/FFFFFF?text=?';
    const skillDescription = skill.description || 'No description available';
    const skillFeatures = skill.features || ['No features listed'];
    const skillProjects = skill.projects || ['No project information available'];
    
    modalIcon.src = skillIcon;
    modalIcon.onerror = function() {
        this.src = `https://via.placeholder.com/80x80/2563eb/FFFFFF?text=${skillName.charAt(0)}`;
    };
    modalTitle.textContent = skillName;
    modalDescription.textContent = skillDescription;
    
    // Populate features list
    modalFeatures.innerHTML = '';
    if (Array.isArray(skillFeatures)) {
        skillFeatures.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            modalFeatures.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = skillFeatures;
        modalFeatures.appendChild(li);
    }
    
    // Populate projects list (same format as features)
    modalProjects.innerHTML = '';
    if (Array.isArray(skillProjects)) {
        skillProjects.forEach(project => {
            const li = document.createElement('li');
            li.textContent = project;
            modalProjects.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = skillProjects;
        modalProjects.appendChild(li);
    }
    
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
        const handleNavbarScroll = debounce(() => {
            if (window.scrollY > 50) {
                // Scrolled state - add scrolled class
                navbar.classList.add('scrolled');
            } else {
                // Top of page state - remove scrolled class
                navbar.classList.remove('scrolled');
            }
        }, 10);
        
        window.addEventListener('scroll', handleNavbarScroll);
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
                console.log('Added animate-in class to:', entry.target.className);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.skill-card, .timeline-item, .stat, .education-item, .contact-item').forEach(el => {
        observer.observe(el);
        // Fallback: ensure elements are visible after a short delay
        setTimeout(() => {
            if (!el.classList.contains('animate-in')) {
                el.classList.add('animate-in');
                console.log('Fallback: Added animate-in class to:', el.className);
            }
        }, 1000);
    });
    
    // Special handling for timeline items with staggered animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        const timelineObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 150); // Staggered animation
                }
            });
        }, { threshold: 0.2 });
        
        timelineObserver.observe(item);
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
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .skill-card.animate-in, .timeline-item.animate-in, .stat.animate-in, 
        .education-item.animate-in, .contact-item.animate-in {
            opacity: 1;
            transform: translateY(0) scale(1.02);
            transition: opacity 0.6s ease, transform 0.6s ease;
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
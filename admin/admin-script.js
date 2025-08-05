// Admin Dashboard JavaScript
class CVDashboard {
    constructor() {
        // Check authentication
        this.checkAuthentication();
        
        this.currentSection = 'overview';
        this.data = this.loadData();
        this.init();
    }

    checkAuthentication() {
        // Authentication handled by server session only - no client-side check needed
        // If needed, add server-side session validation here
    }

    init() {
        this.setupNavigation();
        this.setupForms();
        this.setupModals();
        this.setupProfileImagePreview();
        this.loadDashboardData();
        this.bindEvents();
        this.loadDataFromDatabase();
    }

    // Navigation
    setupNavigation() {
        console.log('=== SETTING UP NAVIGATION ===');
        
        // Wait a bit for DOM to be fully ready
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.nav-link');
            console.log('Found navigation links:', navLinks.length);
            
            if (navLinks.length === 0) {
                console.error('No navigation links found! DOM might not be ready.');
                return;
            }
            
            navLinks.forEach((link, index) => {
                const href = link.getAttribute('href');
                console.log(`Nav link ${index}: ${href} - Text: "${link.textContent.trim()}"`);
                
                // Remove any existing event listeners
                link.removeEventListener('click', this.handleNavClick);
                
                // Add new event listener
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('=== NAVIGATION CLICKED ===');
                    console.log('Clicked link:', link.textContent.trim());
                    console.log('Href:', href);
                    
                    const section = href ? href.substring(1) : 'overview';
                    console.log('Target section:', section);
                    
                    try {
                        this.showSection(section);
                        this.updateActiveNav(link);
                    } catch (error) {
                        console.error('Error in navigation click:', error);
                    }
                });
            });
            
            console.log('Navigation setup completed');
        }, 100);
    }

    showSection(sectionName) {
        console.log('=== SHOW SECTION CALLED ===');
        console.log('Section name:', sectionName);
        
        try {
            // Hide all sections first
            const allSections = document.querySelectorAll('.content-section');
            console.log('Found total sections:', allSections.length);
            
            // List all sections for debugging
            allSections.forEach((section, index) => {
                console.log(`Section ${index}: ${section.id}`);
                section.classList.remove('active');
                section.style.display = 'none';
                section.style.opacity = '0';
            });

            // Show target section
            const targetSectionId = `${sectionName}-section`;
            const targetSection = document.getElementById(targetSectionId);
            console.log('Looking for section ID:', targetSectionId);
            console.log('Target section found:', !!targetSection);
            
            if (targetSection) {
                console.log('Activating section:', targetSectionId);
                
                // Force show the section
                targetSection.style.display = 'block';
                targetSection.style.opacity = '1';
                targetSection.style.visibility = 'visible';
                targetSection.classList.add('active');
                
                // Update current section
                this.currentSection = sectionName;
                
                // Update page title
                this.updatePageTitle(sectionName);
                
                // Load section data
                setTimeout(() => {
                    console.log('Loading data for section:', sectionName);
                    this.loadSectionData(sectionName);
                }, 100);
                
                console.log('✅ Section activated successfully:', sectionName);
                
                // Scroll to top of main content
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                    mainContent.scrollTop = 0;
                }
                
            } else {
                console.error('❌ Section not found:', targetSectionId);
                console.log('Available sections:');
                allSections.forEach(section => {
                    console.log(' - ', section.id);
                });
            }
        } catch (error) {
            console.error('❌ Error in showSection:', error);
            console.error('Error stack:', error.stack);
        }
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    updatePageTitle(section) {
        const titles = {
            overview: 'Dashboard Overview',
            personal: 'Personal Information',
            skills: 'Technical Skills',
            experience: 'Experience & Projects',
            education: 'Education',
            about: 'About Me',
            'profile-image': 'Profile Image',

        };
        document.getElementById('page-title').textContent = titles[section] || section;
    }

    // Data Management
    loadData() {
        const defaultData = {
            personal: {
                fullName: 'Yousef Talal',
                jobTitle: 'Computer Science Student & Application Developer',
                email: 'yousef.talal@email.com',
                phone: '+123 456 7890',
                location: 'City, Country',
                aboutText: 'I am Yousef Talal, a dedicated computer science student with a passion for creating innovative applications that solve real-world problems.',
                brandIcon: 'YT',
                brandTitle: 'Yousef Talal',
                brandSubtitle: 'Developer',
                brandImage: '',
                // Contact links
                emailLink: 'mailto:yousef.talal@email.com',
                phoneLink: 'tel:+1234567890',
                locationLink: '',
                // Social media links
                linkedinUrl: '',
                githubUrl: '',
                twitterUrl: '',
                websiteUrl: ''
            },
            about: {
                title: 'About Me',
                paragraph1: 'I am Yousef Talal, a dedicated computer science student with a passion for creating innovative applications that solve real-world problems. My expertise spans across multiple platforms and technologies, allowing me to develop comprehensive solutions for diverse user needs.',
                paragraph2: 'With a focus on mobile development using Flutter, iOS development with Swift, and enterprise applications with Java, I bring a versatile skill set to every project. I\'m committed to writing clean, efficient code and staying current with the latest industry trends and best practices.',
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
            },
            skills: [
                {
                    id: 'flutter-mobile',
                    name: 'Flutter Mobile Development',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
                    description: 'Cross-platform mobile application development using Flutter framework.',
                    features: [
                        'Cross-platform app development',
                        'Native performance',
                        'Hot reload for fast development',
                        'Rich UI components and widgets'
                    ],
                    projects: [
                        'E-commerce mobile app with payment integration',
                        'Social media app with real-time messaging',
                        'Fitness tracking app with GPS integration'
                    ],
                    level: 'Advanced',
                    experience: '2+ years'
                },
                {
                    id: 'flutter-web',
                    name: 'Flutter Web Development',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
                    description: 'Web application development using Flutter for web.',
                    features: [
                        'Responsive web applications',
                        'Progressive Web Apps (PWA)',
                        'Code sharing between mobile and web'
                    ],
                    projects: [
                        'Portfolio website with Flutter',
                        'Dashboard application for data visualization'
                    ],
                    level: 'Intermediate',
                    experience: '1.5+ years'
                },
                {
                    id: 'swift-ios',
                    name: 'Swift iOS Development',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
                    description: 'Native iOS application development using Swift.',
                    features: [
                        'Native iOS app development',
                        'Core Data for data persistence',
                        'UIKit and SwiftUI frameworks',
                        'App Store optimization'
                    ],
                    projects: [
                        'Task management iOS app',
                        'Weather app with location services',
                        'Photo editing app with Core Image'
                    ],
                    level: 'Intermediate',
                    experience: '1+ years'
                },
                {
                    id: 'java-enterprise',
                    name: 'Java Enterprise Development',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
                    description: 'Enterprise-level application development using Java.',
                    level: 'Intermediate',
                    experience: '2+ years'
                }
            ],
            experience: [
                {
                    id: 'mobile-dev',
                    title: 'Mobile App Development',
                    period: '2023 - Present',
                    description: 'Developing cross-platform mobile applications using Flutter.',
                    technologies: ['Flutter', 'Dart', 'Firebase']
                },
                {
                    id: 'web-dev',
                    title: 'Web Application Development',
                    period: '2022 - Present',
                    description: 'Creating responsive web applications using Flutter for web.',
                    technologies: ['Flutter Web', 'HTML/CSS', 'JavaScript']
                },
                {
                    id: 'ios-dev',
                    title: 'iOS Development',
                    period: '2022 - Present',
                    description: 'Building native iOS applications using Swift.',
                    technologies: ['Swift', 'SwiftUI', 'Xcode']
                },
                {
                    id: 'java-dev',
                    title: 'Java Application Development',
                    period: '2021 - Present',
                    description: 'Developing enterprise-level applications using Java.',
                    technologies: ['Java', 'Spring Boot', 'Maven']
                }
            ],
            education: [
                {
                    id: 'cs-degree',
                    title: 'Bachelor of Computer Science',
                    institution: 'University Name',
                    period: '2021 - 2025 (Expected)',
                    description: 'Specialized in software engineering and mobile application development.'
                }
            ]
        };

        // Load data from database only, no localStorage fallback
        return defaultData;
    }

    saveData() {
        // Save to database only, no localStorage
        this.saveDataToDatabase();
    }

    // Save data to database
    async saveDataToDatabase() {
        try {
            const response = await fetch('/.netlify/functions/cv-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('Data saved to database successfully');
                return true;
            } else {
                console.error('Error saving to database:', result.error);
                return false;
            }
        } catch (error) {
            console.error('Error saving to database:', error);
            return false;
        }
    }

    // Load data from database
    async loadDataFromDatabase() {
        try {
            const response = await fetch('/.netlify/functions/cv-data');
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    // Load database data
                    this.data = { ...this.data, ...result.data };
                    this.loadDashboardData(); // Refresh dashboard
                    console.log('Data loaded from database successfully');
                }
            }
        } catch (error) {
            console.error('Error loading data from database:', error);
        }
    }

    loadDashboardData() {
        this.updateStats();
        this.loadPersonalForm();
        this.loadAboutForm();
        this.loadSkillsList();
        this.loadExperienceList();
        this.loadEducationList();
        this.loadSettingsForm();
        this.loadProfileImagePreview();
    }

    loadProfileImagePreview() {
        if (this.data.profileImage) {
            const profilePreview = document.getElementById('profilePreview');
            const urlInput = document.getElementById('profileImageUrl');
            if (profilePreview) {
                profilePreview.src = this.data.profileImage;
            }
            if (urlInput) {
                urlInput.value = this.data.profileImage;
            }
        }
    }

    loadSectionData(section) {
        console.log('Loading section data for:', section);
        
        try {
            switch (section) {
                case 'overview':
                    this.updateStats();
                    break;
                case 'personal':
                    this.loadPersonalForm();
                    break;
                case 'skills':
                    this.loadSkillsList();
                    break;
                case 'experience':
                    this.loadExperienceList();
                    break;
                case 'education':
                    this.loadEducationList();
                    break;
                case 'about':
                    this.loadAboutForm();
                    break;
                case 'profile-image':
                    this.loadProfileImagePreview();
                    break;

                default:
                    console.log('No specific data loading for section:', section);
            }
        } catch (error) {
            console.error('Error loading section data:', error);
        }
    }

    updateStats() {
        document.getElementById('skills-count').textContent = this.data.skills.length;
        document.getElementById('experience-count').textContent = this.data.experience.length;
        document.getElementById('education-count').textContent = this.data.education.length;
        document.getElementById('last-updated').textContent = new Date().toLocaleDateString();
    }

    // Form Management
    setupForms() {
        // Personal Info Form
        const personalForm = document.getElementById('personal-form');
        if (personalForm) {
            personalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePersonalInfo();
            });
        }

        // About Me Form
        const aboutForm = document.getElementById('about-form');
        if (aboutForm) {
            aboutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAboutMe();
            });
        }

        

    }

    loadPersonalForm() {
        const personal = this.data.personal;
        document.getElementById('fullName').value = personal.fullName;
        document.getElementById('jobTitle').value = personal.jobTitle;
        document.getElementById('email').value = personal.email;
        document.getElementById('phone').value = personal.phone;
        document.getElementById('location').value = personal.location;
        
        // Load navbar brand fields
        if (document.getElementById('brandIcon')) {
            document.getElementById('brandIcon').value = personal.brandIcon || '';
        }
        if (document.getElementById('brandTitle')) {
            document.getElementById('brandTitle').value = personal.brandTitle || personal.fullName || '';
        }
        if (document.getElementById('brandSubtitle')) {
            document.getElementById('brandSubtitle').value = personal.brandSubtitle || '';
        }
        
        // Load brand image
        if (personal.brandImage) {
            const preview = document.getElementById('brandImagePreview');
            const previewImg = document.getElementById('brandImagePreviewImg');
            if (preview && previewImg) {
                previewImg.src = personal.brandImage;
                preview.style.display = 'flex';
            }
        }
        
        // Load contact links
        if (document.getElementById('emailLink')) {
            document.getElementById('emailLink').value = personal.emailLink || '';
        }
        if (document.getElementById('phoneLink')) {
            document.getElementById('phoneLink').value = personal.phoneLink || '';
        }
        if (document.getElementById('locationLink')) {
            document.getElementById('locationLink').value = personal.locationLink || '';
        }
        
        // Load social media links
        if (document.getElementById('linkedinUrl')) {
            document.getElementById('linkedinUrl').value = personal.linkedinUrl || '';
        }
        if (document.getElementById('githubUrl')) {
            document.getElementById('githubUrl').value = personal.githubUrl || '';
        }
        if (document.getElementById('twitterUrl')) {
            document.getElementById('twitterUrl').value = personal.twitterUrl || '';
        }
        if (document.getElementById('websiteUrl')) {
            document.getElementById('websiteUrl').value = personal.websiteUrl || '';
        }
    }

    loadAboutForm() {
        const about = this.data.about;
        if (document.getElementById('aboutTitle')) {
            document.getElementById('aboutTitle').value = about.title || 'About Me';
        }
        if (document.getElementById('aboutParagraph1')) {
            document.getElementById('aboutParagraph1').value = about.paragraph1 || '';
        }
        if (document.getElementById('aboutParagraph2')) {
            document.getElementById('aboutParagraph2').value = about.paragraph2 || '';
        }
        
        // Load stats
        this.renderStatsList();
    }

    renderStatsList() {
        const statsList = document.getElementById('stats-list');
        if (!statsList) return;

        statsList.innerHTML = '';
        
        this.data.about.stats.forEach((stat, index) => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            statItem.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Icon Class</label>
                        <input type="text" value="${stat.icon}" onchange="cvDashboard.updateStat(${index}, 'icon', this.value)" placeholder="fas fa-code">
                    </div>
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" value="${stat.title}" onchange="cvDashboard.updateStat(${index}, 'title', this.value)" placeholder="4+">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <input type="text" value="${stat.description}" onchange="cvDashboard.updateStat(${index}, 'description', this.value)" placeholder="Programming Languages">
                    </div>
                    <button type="button" class="btn btn-danger" onclick="cvDashboard.removeStat(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            statsList.appendChild(statItem);
        });
    }

    updateStat(index, field, value) {
        if (this.data.about.stats[index]) {
            this.data.about.stats[index][field] = value;
        }
    }

    removeStat(index) {
        this.data.about.stats.splice(index, 1);
        this.renderStatsList();
    }

    addNewStat() {
        const newStat = {
            id: 'stat-' + Date.now(),
            icon: 'fas fa-star',
            title: 'New Stat',
            description: 'Description'
        };
        this.data.about.stats.push(newStat);
        this.renderStatsList();
    }

    async saveAboutMe() {
        this.data.about = {
            title: document.getElementById('aboutTitle').value || 'About Me',
            paragraph1: document.getElementById('aboutParagraph1').value || '',
            paragraph2: document.getElementById('aboutParagraph2').value || '',
            stats: this.data.about.stats
        };
        this.saveData();
        this.showNotification('About Me information saved successfully!', 'success');
    }

    async savePersonalInfo() {
        this.data.personal = {
            fullName: document.getElementById('fullName').value,
            jobTitle: document.getElementById('jobTitle').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            brandIcon: document.getElementById('brandIcon')?.value || '',
            brandTitle: document.getElementById('brandTitle')?.value || document.getElementById('fullName').value,
            brandSubtitle: document.getElementById('brandSubtitle')?.value || '',
            brandImage: this.data.personal.brandImage || '', // Keep existing brand image
            // Contact links
            emailLink: document.getElementById('emailLink')?.value || '',
            phoneLink: document.getElementById('phoneLink')?.value || '',
            locationLink: document.getElementById('locationLink')?.value || '',
            // Social media links
            linkedinUrl: document.getElementById('linkedinUrl')?.value || '',
            githubUrl: document.getElementById('githubUrl')?.value || '',
            twitterUrl: document.getElementById('twitterUrl')?.value || '',
            websiteUrl: document.getElementById('websiteUrl')?.value || ''
        };
        this.saveData();
        
        // Save to database
        const dbSuccess = await this.saveDataToDatabase();
        if (dbSuccess) {
            this.showToast('Personal info saved to database!', 'success');
        } else {
            this.showToast('Saved locally, but failed to save to database', 'warning');
        }
    }



    // Skills Management
    loadSkillsList() {
        console.log('Loading skills list...');
        console.log('Current data object:', this.data);
        const skillsList = document.getElementById('skills-list');
        console.log('Skills list element:', skillsList);
        if (!skillsList) {
            console.error('Skills list element not found!');
            return;
        }

        skillsList.innerHTML = '';
        console.log('Skills data:', this.data.skills);
        
        if (!this.data.skills || this.data.skills.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-icon">
                    <i class="fas fa-code"></i>
                </div>
                <h4>No Skills Added Yet</h4>
                <p>Click "Add New Skill" to get started</p>
            `;
            skillsList.appendChild(emptyState);
            return;
        }
        
        this.data.skills.forEach((skill, index) => {
            console.log(`Creating skill card ${index}:`, skill);
            try {
                const skillCard = this.createSkillCard(skill);
                skillCard.style.animationDelay = `${index * 0.1}s`;
                skillsList.appendChild(skillCard);
                console.log(`Skill card ${index} added successfully`);
            } catch (error) {
                console.error(`Error creating skill card ${index}:`, error);
            }
        });
    }

    createSkillCard(skill) {
        console.log('Creating skill card for:', skill);
        
        const card = document.createElement('div');
        card.className = 'item-card skill-card';
        
        // Handle undefined/null values safely
        const skillName = skill.name || 'Unnamed Skill';
        const skillIcon = skill.icon || 'https://via.placeholder.com/60x60/3b82f6/FFFFFF?text=S';
        const skillLevel = skill.level || 'Beginner';
        const skillExperience = skill.experience || '0 years';
        const skillDescription = skill.description || 'No description available';
        const skillFeatures = Array.isArray(skill.features) ? skill.features : [];
        const skillProjects = Array.isArray(skill.projects) ? skill.projects : [];
        
        card.innerHTML = `
            <div class="card-header">
                <div class="card-icon">
                    <img src="${skillIcon}" alt="${skillName}" onerror="this.style.display='none'">
                </div>
                <div class="card-info">
                    <div class="card-title">${skillName}</div>
                    <div class="card-subtitle">
                        <span class="level-badge ${skillLevel.toLowerCase()}">${skillLevel}</span>
                        <span class="experience-text">${skillExperience}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-sm btn-primary" onclick="dashboard.editSkill('${skill.id}')" title="Edit Skill">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="dashboard.deleteSkill('${skill.id}')" title="Delete Skill">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <div class="content-section">
                    <h5><i class="fas fa-info-circle"></i> Description</h5>
                    <p>${skillDescription}</p>
                </div>
                ${skillFeatures.length > 0 ? `
                <div class="content-section">
                    <h5><i class="fas fa-star"></i> Key Features</h5>
                    <ul class="features-list">
                        ${skillFeatures.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                ${skillProjects.length > 0 ? `
                <div class="content-section">
                    <h5><i class="fas fa-project-diagram"></i> Projects & Experience</h5>
                    <ul class="features-list">
                        ${skillProjects.map(project => `<li>${project}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `;
        return card;
    }

    addSkill() {
        this.openModal('Add New Skill', this.getSkillForm());
    }

    editSkill(skillId) {
        const skill = this.data.skills.find(s => s.id === skillId);
        if (skill) {
            this.openModal('Edit Skill', this.getSkillForm(skill));
        }
    }

    async deleteSkill(skillId) {
        if (confirm('Are you sure you want to delete this skill?')) {
            this.data.skills = this.data.skills.filter(s => s.id !== skillId);
            this.saveData();
            
            // Save to database
            const dbSuccess = await this.saveDataToDatabase();
            if (dbSuccess) {
                this.showToast('Skill deleted from database!', 'success');
            } else {
                this.showToast('Deleted locally, but failed to update database', 'warning');
            }
            
            this.loadSkillsList();
            this.updateStats();
        }
    }

    getSkillForm(skill = {}) {
        return `
            <form id="skill-form" class="admin-form">
                <input type="hidden" id="skill-id" name="skill-id" value="${skill.id || ''}">
                <div class="form-group">
                    <label for="skill-name">Skill Name</label>
                    <input type="text" id="skill-name" name="skill-name" value="${skill.name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="skill-icon">Icon URL</label>
                    <input type="url" id="skill-icon" name="skill-icon" value="${skill.icon || ''}" required>
                </div>
                <div class="form-group">
                    <label for="skill-description">Description</label>
                    <textarea id="skill-description" name="skill-description" rows="3" required>${skill.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="skill-features">Key Features & Capabilities:</label>
                    <textarea id="skill-features" name="skill-features" rows="4" placeholder="Enter key features separated by new lines">${skill.features?.join('\n') || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="skill-projects">Projects & Experience:</label>
                    <textarea id="skill-projects" name="skill-projects" rows="4" placeholder="Enter projects and experience separated by new lines">${skill.projects?.join('\n') || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="skill-level">Level</label>
                        <select id="skill-level" name="skill-level" required>
                            <option value="Beginner" ${skill.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
                            <option value="Intermediate" ${skill.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                            <option value="Advanced" ${skill.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
                            <option value="Expert" ${skill.level === 'Expert' ? 'selected' : ''}>Expert</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="skill-experience">Experience</label>
                        <select id="skill-experience" name="skill-experience" required>
                            <option value="">Select experience level</option>
                            <option value="Less than 1 year" ${skill.experience === 'Less than 1 year' ? 'selected' : ''}>Less than 1 year</option>
                            <option value="1 year" ${skill.experience === '1 year' ? 'selected' : ''}>1 year</option>
                            <option value="2 years" ${skill.experience === '2 years' ? 'selected' : ''}>2 years</option>
                            <option value="3 years" ${skill.experience === '3 years' ? 'selected' : ''}>3 years</option>
                            <option value="4 years" ${skill.experience === '4 years' ? 'selected' : ''}>4 years</option>
                            <option value="5 years" ${skill.experience === '5 years' ? 'selected' : ''}>5 years</option>
                            <option value="6 years" ${skill.experience === '6 years' ? 'selected' : ''}>6 years</option>
                            <option value="7 years" ${skill.experience === '7 years' ? 'selected' : ''}>7 years</option>
                            <option value="8 years" ${skill.experience === '8 years' ? 'selected' : ''}>8 years</option>
                            <option value="9 years" ${skill.experience === '9 years' ? 'selected' : ''}>9 years</option>
                            <option value="10+ years" ${skill.experience === '10+ years' ? 'selected' : ''}>10+ years</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Skill</button>
                    <button type="button" class="btn btn-secondary" onclick="dashboard.closeModal()">Cancel</button>
                </div>
            </form>
        `;
    }

    async saveSkill(formData) {
        const skillId = formData.get('skill-id') || this.generateId();
        const featuresText = formData.get('skill-features');
        const features = featuresText ? featuresText.split('\n').filter(f => f.trim()) : [];
        
        const projectsText = formData.get('skill-projects');
        const projects = projectsText ? projectsText.split('\n').filter(p => p.trim()) : [];
        
        const skillData = {
            id: skillId,
            name: formData.get('skill-name'),
            icon: formData.get('skill-icon'),
            description: formData.get('skill-description'),
            features: features,
            projects: projects,
            level: formData.get('skill-level'),
            experience: formData.get('skill-experience')
        };

        const existingIndex = this.data.skills.findIndex(s => s.id === skillId);
        if (existingIndex >= 0) {
            this.data.skills[existingIndex] = skillData;
        } else {
            this.data.skills.push(skillData);
        }

        this.saveData();
        
        // Save to database
        const dbSuccess = await this.saveDataToDatabase();
        if (dbSuccess) {
            this.showToast('Skill saved to database!', 'success');
        } else {
            this.showToast('Saved locally, but failed to save to database', 'warning');
        }
        
        this.loadSkillsList();
        this.updateStats();
        this.closeModal();
    }

    // Experience Management
    loadExperienceList() {
        const experienceList = document.getElementById('experience-list');
        if (!experienceList) return;

        experienceList.innerHTML = '';
        
        if (this.data.experience.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <h4>No Experience Added Yet</h4>
                <p>Click "Add New Experience" to get started</p>
            `;
            experienceList.appendChild(emptyState);
            return;
        }
        
        this.data.experience.forEach((exp, index) => {
            const expCard = this.createExperienceCard(exp);
            expCard.style.animationDelay = `${index * 0.1}s`;
            experienceList.appendChild(expCard);
        });
    }

    createExperienceCard(experience) {
        const card = document.createElement('div');
        card.className = 'item-card experience-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="card-info">
                    <div class="card-title">${experience.title}</div>
                    <div class="card-subtitle">
                        <span class="period-badge">${experience.period}</span>
                        ${experience.company ? `<span class="company-text">${experience.company}</span>` : ''}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-sm btn-primary" onclick="dashboard.editExperience('${experience.id}')" title="Edit Experience">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="dashboard.deleteExperience('${experience.id}')" title="Delete Experience">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <div class="content-section">
                    <h5><i class="fas fa-align-left"></i> Description</h5>
                    <p>${experience.description}</p>
                </div>
                ${experience.technologies && experience.technologies.length > 0 ? `
                <div class="content-section">
                    <h5><i class="fas fa-tools"></i> Technologies Used</h5>
                    <div class="tech-tags">
                        ${experience.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                ${experience.features && experience.features.length > 0 ? `
                <div class="content-section">
                    <h5><i class="fas fa-star"></i> Key Features & Capabilities</h5>
                    <ul class="features-list">
                        ${experience.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                ${experience.projects ? `
                <div class="content-section">
                    <h5><i class="fas fa-project-diagram"></i> Projects & Experience Details</h5>
                    <p>${experience.projects}</p>
                </div>
                ` : ''}
            </div>
        `;
        return card;
    }

    addExperience() {
        this.openModal('Add New Experience', this.getExperienceForm());
    }

    editExperience(expId) {
        const experience = this.data.experience.find(e => e.id === expId);
        if (experience) {
            this.openModal('Edit Experience', this.getExperienceForm(experience));
        }
    }

    async deleteExperience(expId) {
        if (confirm('Are you sure you want to delete this experience?')) {
            this.data.experience = this.data.experience.filter(e => e.id !== expId);
            this.saveData();
            
            // Save to database
            const dbSuccess = await this.saveDataToDatabase();
            if (dbSuccess) {
                this.showToast('Experience deleted from database!', 'success');
            } else {
                this.showToast('Deleted locally, but failed to update database', 'warning');
            }
            
            this.loadExperienceList();
            this.updateStats();
        }
    }

    getExperienceForm(experience = {}) {
        return `
            <form id="experience-form" class="admin-form">
                <input type="hidden" id="experience-id" name="experience-id" value="${experience.id || ''}">
                <div class="form-group">
                    <label for="experience-title">Title</label>
                    <input type="text" id="experience-title" name="experience-title" value="${experience.title || ''}" required>
                </div>
                <div class="form-group">
                    <label for="experience-period">Period</label>
                    <input type="text" id="experience-period" name="experience-period" value="${experience.period || ''}" placeholder="e.g., 2023 - Present" required>
                </div>
                <div class="form-group">
                    <label for="experience-description">Description</label>
                    <textarea id="experience-description" name="experience-description" rows="4" required>${experience.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="experience-technologies">Technologies (comma-separated)</label>
                    <input type="text" id="experience-technologies" name="experience-technologies" value="${experience.technologies?.join(', ') || ''}" placeholder="e.g., Flutter, Dart, Firebase" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Experience</button>
                    <button type="button" class="btn btn-secondary" onclick="dashboard.closeModal()">Cancel</button>
                </div>
            </form>
        `;
    }

    async saveExperience(formData) {
        const expId = formData.get('experience-id') || this.generateId();
        const expData = {
            id: expId,
            title: formData.get('experience-title'),
            period: formData.get('experience-period'),
            description: formData.get('experience-description'),
            technologies: formData.get('experience-technologies').split(',').map(t => t.trim())
        };

        const existingIndex = this.data.experience.findIndex(e => e.id === expId);
        if (existingIndex >= 0) {
            this.data.experience[existingIndex] = expData;
        } else {
            this.data.experience.push(expData);
        }

        this.saveData();
        
        // Save to database
        const dbSuccess = await this.saveDataToDatabase();
        if (dbSuccess) {
            this.showToast('Experience saved to database!', 'success');
        } else {
            this.showToast('Saved locally, but failed to save to database', 'warning');
        }
        
        this.loadExperienceList();
        this.updateStats();
        this.closeModal();
    }

    // Education Management
    loadEducationList() {
        const educationList = document.getElementById('education-list');
        if (!educationList) return;

        educationList.innerHTML = '';
        
        if (this.data.education.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h4>No Education Added Yet</h4>
                <p>Click "Add New Education" to get started</p>
            `;
            educationList.appendChild(emptyState);
            return;
        }
        
        this.data.education.forEach((edu, index) => {
            const eduCard = this.createEducationCard(edu);
            eduCard.style.animationDelay = `${index * 0.1}s`;
            educationList.appendChild(eduCard);
        });
    }

    createEducationCard(education) {
        const card = document.createElement('div');
        card.className = 'item-card education-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="card-info">
                    <div class="card-title">${education.title}</div>
                    <div class="card-subtitle">
                        <span class="institution-badge">${education.institution}</span>
                        <span class="period-text">${education.period}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-sm btn-primary" onclick="dashboard.editEducation('${education.id}')" title="Edit Education">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="dashboard.deleteEducation('${education.id}')" title="Delete Education">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <div class="content-section">
                    <h5><i class="fas fa-info-circle"></i> Description</h5>
                    <p>${education.description}</p>
                </div>
                ${education.gpa ? `
                <div class="content-section">
                    <h5><i class="fas fa-chart-line"></i> Academic Performance</h5>
                    <p><strong>GPA:</strong> ${education.gpa}</p>
                </div>
                ` : ''}
                ${education.achievements && education.achievements.length > 0 ? `
                <div class="content-section">
                    <h5><i class="fas fa-trophy"></i> Achievements</h5>
                    <ul class="achievements-list">
                        ${education.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `;
        return card;
    }

    addEducation() {
        this.openModal('Add New Education', this.getEducationForm());
    }

    editEducation(eduId) {
        const education = this.data.education.find(e => e.id === eduId);
        if (education) {
            this.openModal('Edit Education', this.getEducationForm(education));
        }
    }

    async deleteEducation(eduId) {
        if (confirm('Are you sure you want to delete this education?')) {
            this.data.education = this.data.education.filter(e => e.id !== eduId);
            this.saveData();
            
            // Save to database
            const dbSuccess = await this.saveDataToDatabase();
            if (dbSuccess) {
                this.showToast('Education deleted from database!', 'success');
            } else {
                this.showToast('Deleted locally, but failed to update database', 'warning');
            }
            
            this.loadEducationList();
            this.updateStats();
        }
    }

    getEducationForm(education = {}) {
        return `
            <form id="education-form" class="admin-form">
                <input type="hidden" id="education-id" name="education-id" value="${education.id || ''}">
                <div class="form-group">
                    <label for="education-title">Degree/Title</label>
                    <input type="text" id="education-title" name="education-title" value="${education.title || ''}" required>
                </div>
                <div class="form-group">
                    <label for="education-institution">Institution</label>
                    <input type="text" id="education-institution" name="education-institution" value="${education.institution || ''}" required>
                </div>
                <div class="form-group">
                    <label for="education-period">Period</label>
                    <input type="text" id="education-period" name="education-period" value="${education.period || ''}" placeholder="e.g., 2021 - 2025" required>
                </div>
                <div class="form-group">
                    <label for="education-description">Description</label>
                    <textarea id="education-description" name="education-description" rows="3" required>${education.description || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Education</button>
                    <button type="button" class="btn btn-secondary" onclick="dashboard.closeModal()">Cancel</button>
                </div>
            </form>
        `;
    }

    async saveEducation(formData) {
        const eduId = formData.get('education-id') || this.generateId();
        const eduData = {
            id: eduId,
            title: formData.get('education-title'),
            institution: formData.get('education-institution'),
            period: formData.get('education-period'),
            description: formData.get('education-description')
        };

        const existingIndex = this.data.education.findIndex(e => e.id === eduId);
        if (existingIndex >= 0) {
            this.data.education[existingIndex] = eduData;
        } else {
            this.data.education.push(eduData);
        }

        this.saveData();
        
        // Save to database
        const dbSuccess = await this.saveDataToDatabase();
        if (dbSuccess) {
            this.showToast('Education saved to database!', 'success');
        } else {
            this.showToast('Saved locally, but failed to save to database', 'warning');
        }
        
        this.loadEducationList();
        this.updateStats();
        this.closeModal();
    }

    // Modal Management
    setupModals() {
        const modal = document.getElementById('modal');
        const closeBtn = document.getElementById('modal-close');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    openModal(title, content) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.style.display = 'block';

        // Setup form submission
        const form = modalBody.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                
                if (form.id === 'skill-form') {
                    this.saveSkill(formData);
                } else if (form.id === 'experience-form') {
                    this.saveExperience(formData);
                } else if (form.id === 'education-form') {
                    this.saveEducation(formData);
                }
            });
        }
    }

    closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }

    // Profile Image Management
    async updateProfileImage() {
        const urlInput = document.getElementById('profileImageUrl');
        const imageUrl = urlInput.value.trim();
        
        if (!imageUrl) {
            this.showToast('Please enter a profile image URL', 'error');
            return;
        }
        
        this.showToast('Updating profile image...', 'info');
        
        try {
            // Save to database directly
            const response = await fetch('/.netlify/functions/profile-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageUrl: imageUrl
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Update local data
                this.data.profileImage = imageUrl;
                this.saveData();
                
                // Update preview
                const preview = document.getElementById('profilePreview');
                if (preview) {
                    preview.src = imageUrl;
                }
                
                this.showToast('Profile image updated successfully in database!', 'success');
                
                // Open main site to show the updated image
                setTimeout(() => {
                    window.open('../index.html', '_blank');
                }, 1000);
            } else {
                this.showToast('Error: ' + (data.error || 'Failed to update image'), 'error');
            }
        } catch (error) {
            console.error('Error updating profile image:', error);
            this.showToast('Error: Failed to connect to database', 'error');
        }
    }

    setupProfileImagePreview() {
        const urlInput = document.getElementById('profileImageUrl');
        if (urlInput) {
            urlInput.addEventListener('input', (e) => {
                const imageUrl = e.target.value.trim();
                if (imageUrl) {
                    const preview = document.getElementById('profilePreview');
                    if (preview) {
                        preview.onload = () => {
                            // Image loaded successfully
                        };
                        preview.onerror = () => {
                            // Image failed to load, keep default
                            preview.src = 'https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=YT';
                        };
                        preview.src = imageUrl;
                    }
                }
            });
        }
    }

    testProfileImage() {
        const urlInput = document.getElementById('profileImageUrl');
        const imageUrl = urlInput.value.trim();
        
        if (!imageUrl) {
            this.showToast('Please enter a profile image URL first', 'error');
            return;
        }
        
        const preview = document.getElementById('profilePreview');
        if (preview) {
            preview.onload = () => {
                this.showToast('Image loaded successfully! Click "Save Profile Image" to apply it.', 'success');
            };
            preview.onerror = () => {
                this.showToast('Could not load image. Please check the URL.', 'error');
            };
            preview.src = imageUrl;
        }
    }

    async clearProfileImage() {
        try {
            // Reset to default image in database
            const response = await fetch('/.netlify/functions/profile-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageUrl: 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=YT'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Clear profile image data
                this.data.profileImage = null;
                
                const urlInput = document.getElementById('profileImageUrl');
                const preview = document.getElementById('profilePreview');
                
                if (urlInput) urlInput.value = '';
                if (preview) preview.src = 'https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=YT';
                
                this.showToast('Profile image cleared successfully!');
            } else {
                this.showToast('Error: ' + (data.error || 'Failed to clear image'), 'error');
            }
        } catch (error) {
            console.error('Error clearing profile image:', error);
            this.showToast('Error: Failed to connect to database', 'error');
        }
    }

    createShareableUrlFromCurrent() {
        const currentImage = this.data.profileImage;
        if (currentImage) {
            this.createShareableUrl(currentImage);
        } else {
            this.showToast('No profile image set. Please save an image first.', 'error');
        }
    }

    isValidImageUrl(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const lowerUrl = url.toLowerCase();
        
        // Check for direct image extensions
        if (imageExtensions.some(ext => lowerUrl.includes(ext))) {
            return true;
        }
        
        // Check for known image hosting services
        const imageServices = [
            'imgur.com',
            'drive.google.com',
            'suar.me',
            'postimages.org',
            'imgbb.com',
            'tinypic.com',
            'photobucket.com',
            'flickr.com',
            'imageshack.us',
            'picasaweb.google.com',
            'dropbox.com',
            'box.com',
            'onedrive.live.com',
            'icloud.com'
        ];
        
        if (imageServices.some(service => lowerUrl.includes(service))) {
            return true;
        }
        
        // Check for data URLs
        if (lowerUrl.includes('data:image/')) {
            return true;
        }
        
        // If none of the above, still allow it but show a warning
        return true;
    }

    async setAsProfileImage(imageSrc) {
        // Save to database
        try {
            const response = await fetch('/.netlify/functions/profile-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageUrl: imageSrc
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Update profile image data
                this.data.profileImage = imageSrc;
                
                this.showToast('Profile image updated successfully in database!');
                
                // Update the profile image preview in admin
                const profilePreview = document.getElementById('profilePreview');
                if (profilePreview) {
                    profilePreview.src = imageSrc;
                }
                
                // Create shareable URL
                this.createShareableUrl(imageSrc);
                
                // Open main site to show the updated image
                setTimeout(() => {
                    window.open('../index.html', '_blank');
                }, 1000);
            } else {
                this.showToast('Error: ' + (data.error || 'Failed to update image'), 'error');
            }
        } catch (error) {
            console.error('Error updating profile image:', error);
            this.showToast('Error: Failed to connect to database', 'error');
        }
    }

    createShareableUrl(imageSrc) {
        try {
            // Create a shareable URL with the image data
            const encodedImage = encodeURIComponent(imageSrc);
            const shareableUrl = `${window.location.origin}/index.html?profileImage=${encodedImage}`;
            
            // Show the shareable URL in a modal
            this.openModal('Share Profile Image', `
                <div style="text-align: center;">
                    <h4>Share this URL to apply the profile image on any device:</h4>
                    <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                        <code style="word-break: break-all; font-size: 12px;">${shareableUrl}</code>
                    </div>
                    <div style="margin: 1rem 0;">
                        <button class="btn btn-primary" onclick="navigator.clipboard.writeText('${shareableUrl}').then(() => dashboard.showToast('URL copied!'))">
                            <i class="fas fa-copy"></i> Copy URL
                        </button>
                        <button class="btn btn-secondary" onclick="window.open('${shareableUrl}', '_blank')">
                            <i class="fas fa-external-link-alt"></i> Test URL
                        </button>
                    </div>
                    <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                        <p><strong>Instructions:</strong></p>
                        <ul style="text-align: left;">
                            <li>Copy this URL and share it with others</li>
                            <li>Open the URL in any browser or device</li>
                            <li>The profile image will automatically load</li>
                            <li>The image will be saved locally on that device</li>
                        </ul>
                    </div>
                </div>
            `);
        } catch (error) {
            console.error('Error creating shareable URL:', error);
        }
    }

    // Event Bindings
    bindEvents() {
        // Add buttons
        document.getElementById('addSkill')?.addEventListener('click', () => this.addSkill());
        document.getElementById('addExperience')?.addEventListener('click', () => this.addExperience());
        document.getElementById('addEducation')?.addEventListener('click', () => this.addEducation());

        // Header buttons
        document.getElementById('saveChanges')?.addEventListener('click', () => this.saveData());
        document.getElementById('previewSite')?.addEventListener('click', () => window.open('../index.html', '_blank'));

        // Export/Import


        // Social links
        document.getElementById('addSocialLink')?.addEventListener('click', () => this.addSocialLink());
        
        // Brand image upload
        document.getElementById('brandImageUpload')?.addEventListener('change', (e) => this.handleBrandImageUpload(e));
        
        // About Me
        document.getElementById('addStat')?.addEventListener('click', () => this.addNewStat());
        
        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    }

    // Utility Functions
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'check';
        if (type === 'error') icon = 'times';
        else if (type === 'info') icon = 'info-circle';
        else if (type === 'warning') icon = 'exclamation';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        const container = document.getElementById('toast-container');
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }



    addSocialLink() {
        const container = document.querySelector('.social-links-editor');
        const addButton = document.getElementById('addSocialLink');
        
        const newLinkItem = document.createElement('div');
        newLinkItem.className = 'social-link-item';
        newLinkItem.innerHTML = `
            <input type="text" placeholder="Social Media URL">
            <button type="button" class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">Remove</button>
        `;
        
        container.insertBefore(newLinkItem, addButton);
    }

    // Brand Image Management
    handleBrandImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.includes('png')) {
            this.showToast('Please select a PNG image file only', 'error');
            event.target.value = '';
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            this.showToast('Image size must be less than 2MB', 'error');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Image = e.target.result;
            
            // Update preview
            const preview = document.getElementById('brandImagePreview');
            const previewImg = document.getElementById('brandImagePreviewImg');
            if (preview && previewImg) {
                previewImg.src = base64Image;
                preview.style.display = 'flex';
            }

            // Save to data
            this.data.personal.brandImage = base64Image;
            this.saveData();
            
            // Save to database
            this.saveDataToDatabase().then(success => {
                if (success) {
                    this.showToast('Brand logo uploaded and saved to database!', 'success');
                } else {
                    this.showToast('Logo uploaded locally, but failed to save to database', 'warning');
                }
            });
        };
        reader.readAsDataURL(file);
    }

    logout() {
        // Clear any server-side session if needed
        window.location.href = 'login.html';
    }


}

// Global function for removing brand image
function removeBrandImage() {
    const dashboard = window.cvDashboard;
    if (dashboard) {
        dashboard.data.personal.brandImage = '';
        
        // Hide preview
        const preview = document.getElementById('brandImagePreview');
        if (preview) {
            preview.style.display = 'none';
        }
        
        // Clear file input
        const fileInput = document.getElementById('brandImageUpload');
        if (fileInput) {
            fileInput.value = '';
        }
        
        dashboard.saveData();
        
        // Save to database
        dashboard.saveDataToDatabase().then(success => {
            if (success) {
                dashboard.showToast('Brand logo removed from database!', 'success');
            } else {
                dashboard.showToast('Logo removed locally, but failed to update database', 'warning');
            }
        });
    }
}

// Initialize Dashboard
let dashboard;

// Add some debugging info
console.log('=== ADMIN SCRIPT LOADED ===');
console.log('Document ready state:', document.readyState);

document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM CONTENT LOADED ===');
    console.log('Document ready state:', document.readyState);
    
    // Wait a bit more for everything to be ready
    setTimeout(() => {
        console.log('=== INITIALIZING DASHBOARD ===');
        
        try {
            dashboard = new CVDashboard();
            window.cvDashboard = dashboard; // Make it globally accessible
            window.dashboard = dashboard; // Make it globally accessible
            
            console.log('Dashboard object created:', !!dashboard);
            console.log('Dashboard methods available:', {
                showSection: typeof dashboard.showSection,
                setupNavigation: typeof dashboard.setupNavigation
            });
            
            // Show overview section by default after everything is set up
            setTimeout(() => {
                console.log('=== SHOWING DEFAULT SECTION ===');
                if (dashboard && dashboard.showSection) {
                    dashboard.showSection('overview');
                } else {
                    console.error('Dashboard or showSection method not available');
                }
            }, 200);
            
            console.log('✅ Dashboard initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing dashboard:', error);
            console.error('Error stack:', error.stack);
        }
    }, 100);
});

// Also try to initialize when window loads (fallback)
window.addEventListener('load', () => {
    console.log('=== WINDOW LOADED ===');
    if (!dashboard) {
        console.log('Dashboard not initialized yet, trying again...');
        setTimeout(() => {
            if (!dashboard) {
                try {
                    dashboard = new CVDashboard();
                    window.cvDashboard = dashboard;
                    window.dashboard = dashboard;
                    dashboard.showSection('overview');
                } catch (error) {
                    console.error('Fallback initialization failed:', error);
                }
            }
        }, 100);
    }
});
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
        const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
        if (!isAuthenticated) {
            window.location.href = 'login.html';
            return;
        }
        
        // Check if login is still valid (24 hours)
        const loginTime = localStorage.getItem('adminLoginTime');
        if (loginTime) {
            const currentTime = new Date().getTime();
            const hoursSinceLogin = (currentTime - loginTime) / (1000 * 60 * 60);
            
            if (hoursSinceLogin >= 24) {
                localStorage.removeItem('adminAuthenticated');
                localStorage.removeItem('adminLoginTime');
                window.location.href = 'login.html';
                return;
            }
        }
    }

    init() {
        this.setupNavigation();
        this.setupForms();
        this.setupModals();
        this.setupProfileImagePreview();
        this.loadDashboardData();
        this.bindEvents();
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.showSection(section);
                this.updateActiveNav(link);
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
            this.updatePageTitle(sectionName);
            this.loadSectionData(sectionName);
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
            'profile-image': 'Profile Image',
            settings: 'Site Settings'
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
                aboutText: 'I am Yousef Talal, a dedicated computer science student with a passion for creating innovative applications that solve real-world problems.'
            },
            skills: [
                {
                    id: 'flutter-mobile',
                    name: 'Flutter Mobile Development',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
                    description: 'Cross-platform mobile application development using Flutter framework.',
                    level: 'Advanced',
                    experience: '2+ years'
                },
                {
                    id: 'flutter-web',
                    name: 'Flutter Web Development',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
                    description: 'Web application development using Flutter for web.',
                    level: 'Intermediate',
                    experience: '1.5+ years'
                },
                {
                    id: 'swift-ios',
                    name: 'Swift iOS Development',
                    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
                    description: 'Native iOS application development using Swift.',
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
            ],
            settings: {
                siteTitle: 'Yousef Talal - CV & Resume',
                metaDescription: 'Computer Science Student & Application Developer',
                themeColor: '#2563eb',
                socialLinks: [
                    'https://linkedin.com/in/yousef-talal',
                    'https://github.com/yousef-talal'
                ]
            }
        };

        const savedData = localStorage.getItem('cvDashboardData');
        return savedData ? { ...defaultData, ...JSON.parse(savedData) } : defaultData;
    }

    saveData() {
        localStorage.setItem('cvDashboardData', JSON.stringify(this.data));
        this.showToast('Data saved successfully!', 'success');
    }

    loadDashboardData() {
        this.updateStats();
        this.loadPersonalForm();
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
        switch (section) {
            case 'overview':
                this.updateStats();
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
            case 'profile-image':
                this.loadProfileImagePreview();
                break;
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

        // Settings Form
        const settingsForm = document.getElementById('settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettings();
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
        document.getElementById('aboutText').value = personal.aboutText;
    }

    savePersonalInfo() {
        this.data.personal = {
            fullName: document.getElementById('fullName').value,
            jobTitle: document.getElementById('jobTitle').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            aboutText: document.getElementById('aboutText').value
        };
        this.saveData();
    }

    loadSettingsForm() {
        const settings = this.data.settings;
        document.getElementById('siteTitle').value = settings.siteTitle;
        document.getElementById('metaDescription').value = settings.metaDescription;
        document.getElementById('themeColor').value = settings.themeColor;
    }

    saveSettings() {
        this.data.settings = {
            siteTitle: document.getElementById('siteTitle').value,
            metaDescription: document.getElementById('metaDescription').value,
            themeColor: document.getElementById('themeColor').value,
            socialLinks: this.data.settings.socialLinks // Keep existing social links
        };
        this.saveData();
    }

    // Skills Management
    loadSkillsList() {
        const skillsList = document.getElementById('skills-list');
        if (!skillsList) return;

        skillsList.innerHTML = '';
        this.data.skills.forEach(skill => {
            const skillCard = this.createSkillCard(skill);
            skillsList.appendChild(skillCard);
        });
    }

    createSkillCard(skill) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${skill.name}</div>
                    <div class="item-subtitle">${skill.level} • ${skill.experience}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-primary" onclick="dashboard.editSkill('${skill.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="dashboard.deleteSkill('${skill.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="item-content">${skill.description}</div>
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

    deleteSkill(skillId) {
        if (confirm('Are you sure you want to delete this skill?')) {
            this.data.skills = this.data.skills.filter(s => s.id !== skillId);
            this.saveData();
            this.loadSkillsList();
            this.updateStats();
        }
    }

    getSkillForm(skill = {}) {
        return `
            <form id="skill-form" class="admin-form">
                <input type="hidden" id="skill-id" value="${skill.id || ''}">
                <div class="form-group">
                    <label for="skill-name">Skill Name</label>
                    <input type="text" id="skill-name" value="${skill.name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="skill-icon">Icon URL</label>
                    <input type="url" id="skill-icon" value="${skill.icon || ''}" required>
                </div>
                <div class="form-group">
                    <label for="skill-description">Description</label>
                    <textarea id="skill-description" rows="3" required>${skill.description || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="skill-level">Level</label>
                        <select id="skill-level" required>
                            <option value="Beginner" ${skill.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
                            <option value="Intermediate" ${skill.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                            <option value="Advanced" ${skill.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
                            <option value="Expert" ${skill.level === 'Expert' ? 'selected' : ''}>Expert</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="skill-experience">Experience</label>
                        <input type="text" id="skill-experience" value="${skill.experience || ''}" placeholder="e.g., 2+ years" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Skill</button>
                    <button type="button" class="btn btn-secondary" onclick="dashboard.closeModal()">Cancel</button>
                </div>
            </form>
        `;
    }

    saveSkill(formData) {
        const skillId = formData.get('skill-id') || this.generateId();
        const skillData = {
            id: skillId,
            name: formData.get('skill-name'),
            icon: formData.get('skill-icon'),
            description: formData.get('skill-description'),
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
        this.loadSkillsList();
        this.updateStats();
        this.closeModal();
    }

    // Experience Management
    loadExperienceList() {
        const experienceList = document.getElementById('experience-list');
        if (!experienceList) return;

        experienceList.innerHTML = '';
        this.data.experience.forEach(exp => {
            const expCard = this.createExperienceCard(exp);
            experienceList.appendChild(expCard);
        });
    }

    createExperienceCard(experience) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${experience.title}</div>
                    <div class="item-subtitle">${experience.period}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-primary" onclick="dashboard.editExperience('${experience.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="dashboard.deleteExperience('${experience.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="item-content">${experience.description}</div>
            <div class="item-tags">
                ${experience.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
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

    deleteExperience(expId) {
        if (confirm('Are you sure you want to delete this experience?')) {
            this.data.experience = this.data.experience.filter(e => e.id !== expId);
            this.saveData();
            this.loadExperienceList();
            this.updateStats();
        }
    }

    getExperienceForm(experience = {}) {
        return `
            <form id="experience-form" class="admin-form">
                <input type="hidden" id="experience-id" value="${experience.id || ''}">
                <div class="form-group">
                    <label for="experience-title">Title</label>
                    <input type="text" id="experience-title" value="${experience.title || ''}" required>
                </div>
                <div class="form-group">
                    <label for="experience-period">Period</label>
                    <input type="text" id="experience-period" value="${experience.period || ''}" placeholder="e.g., 2023 - Present" required>
                </div>
                <div class="form-group">
                    <label for="experience-description">Description</label>
                    <textarea id="experience-description" rows="4" required>${experience.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="experience-technologies">Technologies (comma-separated)</label>
                    <input type="text" id="experience-technologies" value="${experience.technologies?.join(', ') || ''}" placeholder="e.g., Flutter, Dart, Firebase" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Experience</button>
                    <button type="button" class="btn btn-secondary" onclick="dashboard.closeModal()">Cancel</button>
                </div>
            </form>
        `;
    }

    saveExperience(formData) {
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
        this.loadExperienceList();
        this.updateStats();
        this.closeModal();
    }

    // Education Management
    loadEducationList() {
        const educationList = document.getElementById('education-list');
        if (!educationList) return;

        educationList.innerHTML = '';
        this.data.education.forEach(edu => {
            const eduCard = this.createEducationCard(edu);
            educationList.appendChild(eduCard);
        });
    }

    createEducationCard(education) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${education.title}</div>
                    <div class="item-subtitle">${education.institution} • ${education.period}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-primary" onclick="dashboard.editEducation('${education.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="dashboard.deleteEducation('${education.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="item-content">${education.description}</div>
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

    deleteEducation(eduId) {
        if (confirm('Are you sure you want to delete this education?')) {
            this.data.education = this.data.education.filter(e => e.id !== eduId);
            this.saveData();
            this.loadEducationList();
            this.updateStats();
        }
    }

    getEducationForm(education = {}) {
        return `
            <form id="education-form" class="admin-form">
                <input type="hidden" id="education-id" value="${education.id || ''}">
                <div class="form-group">
                    <label for="education-title">Degree/Title</label>
                    <input type="text" id="education-title" value="${education.title || ''}" required>
                </div>
                <div class="form-group">
                    <label for="education-institution">Institution</label>
                    <input type="text" id="education-institution" value="${education.institution || ''}" required>
                </div>
                <div class="form-group">
                    <label for="education-period">Period</label>
                    <input type="text" id="education-period" value="${education.period || ''}" placeholder="e.g., 2021 - 2025" required>
                </div>
                <div class="form-group">
                    <label for="education-description">Description</label>
                    <textarea id="education-description" rows="3" required>${education.description || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Education</button>
                    <button type="button" class="btn btn-secondary" onclick="dashboard.closeModal()">Cancel</button>
                </div>
            </form>
        `;
    }

    saveEducation(formData) {
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
    updateProfileImage() {
        const urlInput = document.getElementById('profileImageUrl');
        const imageUrl = urlInput.value.trim();
        
        if (!imageUrl) {
            this.showToast('Please enter a profile image URL', 'error');
            return;
        }
        
        // Always try to load the image, regardless of URL validation
        this.showToast('Testing image...', 'info');
        
        // Test if the image loads
        const testImg = new Image();
        testImg.onload = () => {
            this.setAsProfileImage(imageUrl);
            this.showToast('Profile image updated successfully! The main site will open in a new tab.');
        };
        testImg.onerror = () => {
            this.showToast('Could not load image. Please check the URL and make sure it\'s a direct link to an image.', 'error');
        };
        testImg.src = imageUrl;
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

    clearProfileImage() {
        this.data.profileImage = null;
        this.saveData();
        
        if (window.imageStorage) {
            window.imageStorage.clearProfileImage();
        }
        
        const urlInput = document.getElementById('profileImageUrl');
        const preview = document.getElementById('profilePreview');
        
        if (urlInput) urlInput.value = '';
        if (preview) preview.src = 'https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=YT';
        
        this.showToast('Profile image cleared successfully!');
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

    setAsProfileImage(imageSrc) {
        // Save to both localStorage and the new image storage system
        this.data.profileImage = imageSrc;
        this.saveData();
        
        // Use the new image storage system
        if (window.imageStorage) {
            window.imageStorage.saveProfileImage(imageSrc);
        }
        
        this.showToast('Profile image updated successfully!');
        
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
        document.getElementById('exportData')?.addEventListener('click', () => this.exportData());
        document.getElementById('importData')?.addEventListener('click', () => this.importData());

        // Social links
        document.getElementById('addSocialLink')?.addEventListener('click', () => this.addSocialLink());
        
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

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cv_data.json';
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Data exported successfully!');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        this.data = { ...this.data, ...importedData };
                        this.saveData();
                        this.loadDashboardData();
                        this.showToast('Data imported successfully!');
                    } catch (error) {
                        this.showToast('Error importing data!', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
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

    logout() {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        window.location.href = 'login.html';
    }
}

// Initialize Dashboard
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new CVDashboard();
});

// Make functions available globally for onclick handlers
window.dashboard = dashboard;
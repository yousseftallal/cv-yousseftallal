// Admin Dashboard JavaScript
class CVDashboard {
    constructor() {
        // Check authentication first
        if (!this.checkAuth()) {
            window.location.href = 'login.html';
            return;
        }
        
        this.currentSection = 'overview';
        this.data = this.loadData();
        this.init();
    }

    checkAuth() {
        const loggedIn = localStorage.getItem('dashboardLoggedIn');
        const loginTime = localStorage.getItem('dashboardLoginTime');
        
        if (!loggedIn || !loginTime) return false;
        
        // Check if login is still valid (24 hours)
        const now = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const hoursSinceLogin = (now - loginTimestamp) / (1000 * 60 * 60);
        
        if (hoursSinceLogin > 24) {
            this.logout();
            return false;
        }
        
        return true;
    }

    logout() {
        localStorage.removeItem('dashboardLoggedIn');
        localStorage.removeItem('dashboardLoginTime');
        window.location.href = 'login.html';
    }

    init() {
        this.setupNavigation();
        this.setupForms();
        this.setupModals();
        this.setupImageUpload();
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
            images: 'Image Management',
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
            },
            images: [
                {
                    id: 'profile-default',
                    src: 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=YT',
                    name: 'Profile Image',
                    type: 'profile',
                    isDefault: true
                }
            ]
        };

        const savedData = localStorage.getItem('cvDashboardData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                // Deep merge to preserve nested objects properly
                return this.deepMerge(defaultData, parsedData);
            } catch (error) {
                console.error('Error parsing saved data:', error);
                return defaultData;
            }
        }
        return defaultData;
    }

    // Helper function for deep merging objects
    deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            } else if (Array.isArray(source[key])) {
                // Preserve arrays if they have content, otherwise keep target
                result[key] = source[key].length > 0 ? source[key] : (target[key] || []);
            } else if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
                result[key] = source[key];
            } else if (source[key] === '' && target[key]) {
                // Keep existing value if new value is empty
                result[key] = target[key];
            }
        }
        
        return result;
    }

    saveData() {
        localStorage.setItem('cvDashboardData', JSON.stringify(this.data));
        this.showToast('Data saved successfully!', 'success');
        
        // Dispatch custom event to notify CV page
        window.dispatchEvent(new CustomEvent('cvDataUpdated'));
        
        // Also try to notify other tabs
        try {
            localStorage.setItem('cvDataTimestamp', Date.now().toString());
        } catch (error) {
            console.log('Could not update timestamp for cross-tab sync');
        }
    }

    loadDashboardData() {
        this.updateStats();
        this.loadPersonalForm();
        this.loadSkillsList();
        this.loadExperienceList();
        this.loadEducationList();
        this.loadImagesList();
        this.loadSettingsForm();
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
            case 'images':
                this.loadImagesList();
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
            socialLinks: this.data.settings?.socialLinks || [] // Safely access social links
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
        console.log('Adding new skill...');
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
            try {
                this.data.skills = this.data.skills.filter(s => s.id !== skillId);
                this.saveData();
                this.loadSkillsList();
                this.updateStats();
                this.showToast('Skill deleted successfully!', 'success');
            } catch (error) {
                console.error('Error deleting skill:', error);
                this.showToast('Error deleting skill', 'error');
            }
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
        try {
            const skillId = formData.get('skill-id') || this.generateId();
            const skillData = {
                id: skillId,
                name: formData.get('skill-name') || '',
                icon: formData.get('skill-icon') || '',
                description: formData.get('skill-description') || '',
                level: formData.get('skill-level') || 'Beginner',
                experience: formData.get('skill-experience') || ''
            };

            // Validate required fields
            if (!skillData.name || !skillData.description) {
                this.showToast('Please fill in all required fields', 'error');
                return;
            }

            const existingIndex = this.data.skills.findIndex(s => s.id === skillId);
            if (existingIndex >= 0) {
                this.data.skills[existingIndex] = skillData;
                this.showToast('Skill updated successfully!', 'success');
            } else {
                this.data.skills.push(skillData);
                this.showToast('Skill added successfully!', 'success');
            }

            this.saveData();
            this.loadSkillsList();
            this.updateStats();
            this.closeModal();
        } catch (error) {
            console.error('Error saving skill:', error);
            this.showToast('Error saving skill', 'error');
        }
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
        console.log('Adding new experience...');
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
            try {
                this.data.experience = this.data.experience.filter(e => e.id !== expId);
                this.saveData();
                this.loadExperienceList();
                this.updateStats();
                this.showToast('Experience deleted successfully!', 'success');
            } catch (error) {
                console.error('Error deleting experience:', error);
                this.showToast('Error deleting experience', 'error');
            }
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
        try {
            const expId = formData.get('experience-id') || this.generateId();
            const expData = {
                id: expId,
                title: formData.get('experience-title') || '',
                period: formData.get('experience-period') || '',
                description: formData.get('experience-description') || '',
                technologies: formData.get('experience-technologies') ? 
                    formData.get('experience-technologies').split(',').map(t => t.trim()).filter(t => t) : []
            };

            // Validate required fields
            if (!expData.title || !expData.description) {
                this.showToast('Please fill in all required fields', 'error');
                return;
            }

            const existingIndex = this.data.experience.findIndex(e => e.id === expId);
            if (existingIndex >= 0) {
                this.data.experience[existingIndex] = expData;
                this.showToast('Experience updated successfully!', 'success');
            } else {
                this.data.experience.push(expData);
                this.showToast('Experience added successfully!', 'success');
            }

            this.saveData();
            this.loadExperienceList();
            this.updateStats();
            this.closeModal();
        } catch (error) {
            console.error('Error saving experience:', error);
            this.showToast('Error saving experience', 'error');
        }
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
        console.log('Adding new education...');
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
            try {
                this.data.education = this.data.education.filter(e => e.id !== eduId);
                this.saveData();
                this.loadEducationList();
                this.updateStats();
                this.showToast('Education deleted successfully!', 'success');
            } catch (error) {
                console.error('Error deleting education:', error);
                this.showToast('Error deleting education', 'error');
            }
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
        try {
            const eduId = formData.get('education-id') || this.generateId();
            const eduData = {
                id: eduId,
                title: formData.get('education-title') || '',
                institution: formData.get('education-institution') || '',
                period: formData.get('education-period') || '',
                description: formData.get('education-description') || ''
            };

            // Validate required fields
            if (!eduData.title || !eduData.institution || !eduData.description) {
                this.showToast('Please fill in all required fields', 'error');
                return;
            }

            const existingIndex = this.data.education.findIndex(e => e.id === eduId);
            if (existingIndex >= 0) {
                this.data.education[existingIndex] = eduData;
                this.showToast('Education updated successfully!', 'success');
            } else {
                this.data.education.push(eduData);
                this.showToast('Education added successfully!', 'success');
            }

            this.saveData();
            this.loadEducationList();
            this.updateStats();
            this.closeModal();
        } catch (error) {
            console.error('Error saving education:', error);
            this.showToast('Error saving education', 'error');
        }
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

        if (!modal || !modalTitle || !modalBody) {
            console.error('Modal elements not found');
            return;
        }

        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.style.display = 'block';

        // Setup form submission
        const form = modalBody.querySelector('form');
        if (form) {
            // Remove existing event listeners
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(newForm);
                
                if (newForm.id === 'skill-form') {
                    this.saveSkill(formData);
                } else if (newForm.id === 'experience-form') {
                    this.saveExperience(formData);
                } else if (newForm.id === 'education-form') {
                    this.saveEducation(formData);
                }
            });
        }
    }

    closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }

    // Image Upload
    setupImageUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const imageUpload = document.getElementById('imageUpload');

        if (uploadArea && imageUpload) {
            uploadArea.addEventListener('click', () => imageUpload.click());
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#3b82f6';
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = '#d1d5db';
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#d1d5db';
                this.handleFileUpload(e.dataTransfer.files);
            });

            imageUpload.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }

    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.addImageToPreview(e.target.result, file.name);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    addImageToPreview(src, name) {
        // Add image to data
        const imageId = this.generateId();
        const imageData = {
            id: imageId,
            src: src,
            name: name,
            type: 'uploaded',
            isDefault: false
        };
        
        // Initialize images array if it doesn't exist
        if (!this.data.images) {
            this.data.images = [];
        }
        
        this.data.images.push(imageData);
        
        // Update preview
        const imagePreview = document.getElementById('imagePreview');
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.setAttribute('data-image-id', imageId);
        imageItem.innerHTML = `
            <img src="${src}" alt="${name}">
            <div class="image-actions">
                <button class="btn btn-sm btn-primary" onclick="dashboard.setAsProfile('${imageId}')">Set as Profile</button>
                <button class="btn btn-sm btn-danger" onclick="dashboard.deleteImage('${imageId}')">Delete</button>
            </div>
            <p>${name}</p>
        `;
        imagePreview.appendChild(imageItem);
        
        // Save data
        this.saveData();
        this.showToast('Image uploaded successfully!', 'success');
    }

    // Image Management Functions
    setAsProfile(imageId) {
        try {
            console.log('Setting profile image for ID:', imageId);
            console.log('Current images:', this.data.images);
            
            // Find the image
            const image = this.data.images.find(img => img.id === imageId);
            if (!image) {
                console.error('Image not found with ID:', imageId);
                this.showToast('Image not found!', 'error');
                return;
            }
            
            console.log('Found image:', image);
            
            // Update all images to not be profile
            this.data.images.forEach(img => {
                img.isProfile = false;
            });
            
            // Set this image as profile
            image.isProfile = true;
            
            console.log('Updated images data:', this.data.images);
            
            // Save data
            this.saveData();
            this.showToast('Profile image updated successfully!', 'success');
            
            // Update preview
            this.loadImagesList();
            
            console.log('Profile image set successfully');
        } catch (error) {
            console.error('Error setting profile image:', error);
            this.showToast('Error updating profile image', 'error');
        }
    }

    deleteImage(imageId) {
        try {
            if (confirm('Are you sure you want to delete this image?')) {
                // Remove from data
                this.data.images = this.data.images.filter(img => img.id !== imageId);
                
                // Remove from DOM
                const imageElement = document.querySelector(`[data-image-id="${imageId}"]`);
                if (imageElement) {
                    imageElement.remove();
                }
                
                // Save data
                this.saveData();
                this.showToast('Image deleted successfully!', 'success');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            this.showToast('Error deleting image', 'error');
        }
    }

    loadImagesList() {
        const imagePreview = document.getElementById('imagePreview');
        if (!imagePreview) return;
        
        // Clear existing images
        imagePreview.innerHTML = '';
        
        // Load images from data
        if (this.data.images && this.data.images.length > 0) {
            this.data.images.forEach(image => {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.setAttribute('data-image-id', image.id);
                
                const isProfile = image.isProfile || image.isDefault;
                const profileBadge = isProfile ? '<span class="profile-badge">Profile</span>' : '';
                
                imageItem.innerHTML = `
                    <img src="${image.src}" alt="${image.name}">
                    <div class="image-actions">
                        ${!isProfile ? `<button class="btn btn-sm btn-primary" onclick="dashboard.setAsProfile('${image.id}')">Set as Profile</button>` : ''}
                        ${!image.isDefault ? `<button class="btn btn-sm btn-danger" onclick="dashboard.deleteImage('${image.id}')">Delete</button>` : ''}
                    </div>
                    <p>${image.name} ${profileBadge}</p>
                `;
                imagePreview.appendChild(imageItem);
            });
        } else {
            // Show default placeholder
            const defaultItem = document.createElement('div');
            defaultItem.className = 'image-item';
            defaultItem.innerHTML = `
                <img src="https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=YT" alt="Default Profile">
                <div class="image-actions">
                    <button class="btn btn-sm btn-secondary" disabled>Default Image</button>
                </div>
                <p>Default Profile Image</p>
            `;
            imagePreview.appendChild(defaultItem);
        }
    }

    // Event Bindings
    bindEvents() {
        console.log('Binding events...');
        
        // Add buttons
        const addSkillBtn = document.getElementById('addSkill');
        const addExperienceBtn = document.getElementById('addExperience');
        const addEducationBtn = document.getElementById('addEducation');
        
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => {
                console.log('Add skill button clicked');
                this.addSkill();
            });
        } else {
            console.error('Add skill button not found');
        }
        
        if (addExperienceBtn) {
            addExperienceBtn.addEventListener('click', () => {
                console.log('Add experience button clicked');
                this.addExperience();
            });
        } else {
            console.error('Add experience button not found');
        }
        
        if (addEducationBtn) {
            addEducationBtn.addEventListener('click', () => {
                console.log('Add education button clicked');
                this.addEducation();
            });
        } else {
            console.error('Add education button not found');
        }

        // Header buttons
        document.getElementById('saveChanges')?.addEventListener('click', () => this.saveData());
        document.getElementById('previewSite')?.addEventListener('click', () => window.open('../index.html', '_blank'));

        // Export/Import
        document.getElementById('exportData')?.addEventListener('click', () => this.exportData());
        document.getElementById('importData')?.addEventListener('click', () => this.importData());

        // Social links
        document.getElementById('addSocialLink')?.addEventListener('click', () => this.addSocialLink());

        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
        
        console.log('Events bound successfully');
    }

    // Utility Functions
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    }

    showToast(message, type = 'success') {
        try {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'exclamation'}"></i>
                <span>${message}</span>
            `;

            const container = document.getElementById('toast-container');
            if (container) {
                container.appendChild(toast);

                // Auto remove after 3 seconds
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 3000);
            } else {
                // Fallback to alert if toast container not found
                alert(`${type.toUpperCase()}: ${message}`);
            }
        } catch (error) {
            console.error('Error showing toast:', error);
            alert(`${type.toUpperCase()}: ${message}`);
        }
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
}

// Initialize Dashboard
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new CVDashboard();
    // Make functions available globally for onclick handlers
    window.dashboard = dashboard;
});
// Admin Dashboard JavaScript
class CVDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.data = this.loadData();
        this.init();
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
            const profilePreview = document.querySelector('.image-preview .image-item img');
            if (profilePreview) {
                profilePreview.src = this.data.profileImage;
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
        const imagePreview = document.getElementById('imagePreview');
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
            <img src="${src}" alt="${name}">
            <div class="image-actions">
                <button class="btn btn-sm btn-primary" onclick="dashboard.setAsProfileImage('${src}')">Set as Profile</button>
                <button class="btn btn-sm btn-danger" onclick="this.parentElement.parentElement.remove()">Delete</button>
            </div>
            <p>${name}</p>
        `;
        imagePreview.appendChild(imageItem);
    }

    setAsProfileImage(imageSrc) {
        this.data.profileImage = imageSrc;
        this.saveData();
        this.showToast('Profile image updated successfully!');
        
        // Update the profile image preview in admin
        const profilePreview = document.querySelector('.image-preview .image-item img');
        if (profilePreview) {
            profilePreview.src = imageSrc;
        }
        
        // Also update the first image item if it exists
        const firstImageItem = document.querySelector('.image-item img');
        if (firstImageItem) {
            firstImageItem.src = imageSrc;
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
    }

    // Utility Functions
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'exclamation'}"></i>
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
}

// Initialize Dashboard
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new CVDashboard();
});

// Make functions available globally for onclick handlers
window.dashboard = dashboard;
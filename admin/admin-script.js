// Admin Dashboard JavaScript
class CVDashboard {
    constructor() {
        console.log('🚀 CVDashboard constructor called');
        // Check authentication
        this.checkAuthentication();
        
        this.currentSection = 'overview';
        this.data = this.loadData();
        console.log('📊 Initial data loaded:', Object.keys(this.data));
        this.init();
        console.log('✅ CVDashboard initialized');
    }

    checkAuthentication() {
        // Authentication handled by server session only - no client-side check needed
        // If needed, add server-side session validation here
    }

    init() {
        console.log('🔧 Initializing dashboard components...');
        this.setupNavigation();
        this.setupForms();
        this.setupModals();
        this.setupProfileImagePreview();
        this.setupGalleryManagement();
        this.loadDashboardData();
        this.bindEvents();
        this.loadDataFromDatabase();
        console.log('✅ Dashboard initialization complete');
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach((link, index) => {
            const href = link.getAttribute('href');
            const section = href ? href.replace('#', '') : null;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');
                
                // Show corresponding section
                if (section) {
                    this.showSection(section);
                }
            });
        });
    }

    showSection(sectionName) {
        try {
            // Hide all sections first
            const allSections = document.querySelectorAll('.content-section');
            
            // List all sections for debugging
            allSections.forEach((section, index) => {
                section.classList.remove('active');
                section.style.display = 'none';
                section.style.opacity = '0';
            });

            // Show target section
            const targetSectionId = `${sectionName}-section`;
            const targetSection = document.getElementById(targetSectionId);
            
            if (targetSection) {
                
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
                    this.loadSectionData(sectionName);
                }, 100);
                
                
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
        // Return basic empty structure for dashboard to function
        return {
            personalInfo: {},
            about: {
                stats: []
            },
            skills: [],
            experience: [],
            education: [],
            projects: [],
            educationGallery: [],
            profileImage: ''
        };
    }

    saveData() {
        // Save to database only, no localStorage
        this.saveDataToDatabase();
    }

    // Save data to database
    async saveDataToDatabase() {
        try {
            console.log('💾 Saving data to database...');
            console.log('Data keys to save:', Object.keys(this.data || {}));
            console.log('Personal info name:', this.data?.personalInfo?.name);
            
            const response = await fetch('/api/cv-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.data)
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('HTTP error:', response.status, response.statusText);
                console.error('Error response:', errorText);
                return false;
            }
            
            const result = await response.json();
            console.log('API response:', result);
            
            if (result.success) {
                console.log('✅ Database save successful');
                return true;
            } else {
                console.error('❌ Database returned error:', result.error);
                return false;
            }
        } catch (error) {
            console.error('❌ Network/Parse error saving to database:', error);
            console.error('Error details:', error.message);
            return false;
        }
    }

    // Load data from database
    async loadDataFromDatabase() {
        try {
            const response = await fetch('/api/cv-data');
            
            if (response.ok) {
                const result = await response.json();
                
                if (result.success && result.data) {
                    this.data = { ...this.data, ...result.data };
                    this.loadDashboardData(); // Refresh dashboard
                } else {
                    console.log('❌ No valid data in database response');
                }
            } else {
                console.error('❌ Database load HTTP error:', response.status);
            }
        } catch (error) {
            console.error('❌ Error loading from database:', error);
        }
    }

    loadDashboardData() {
        this.updateStats();
        this.loadPersonalForm();
        this.loadAboutForm();
        this.loadSkillsList();
        this.loadExperienceList();
        this.loadEducationList();
        this.loadProfileImagePreview();
    }

    loadProfileImagePreview() {
        const profilePreview = document.getElementById('profilePreview');
        const urlInput = document.getElementById('profileImageUrl');
        
        if (this.data.profileImage) {
            if (profilePreview) {
                profilePreview.src = this.data.profileImage;
            }
            if (urlInput) {
                urlInput.value = this.data.profileImage;
            }
        } else {
            if (profilePreview) {
                profilePreview.src = 'https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=YT';
            }
            if (urlInput) {
                urlInput.value = '';
            }
        }
    }

    loadSectionData(section) {
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
                this.loadGalleryImages();
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
        const personal = this.data.personalInfo || {};
        
        // Load basic info with safe fallbacks
        const fullNameEl = document.getElementById('fullName');
        const jobTitleEl = document.getElementById('jobTitle');
        const emailEl = document.getElementById('email');
        const phoneEl = document.getElementById('phone');
        const locationEl = document.getElementById('location');
        
        if (fullNameEl) fullNameEl.value = personal.fullName || personal.name || '';
        if (jobTitleEl) jobTitleEl.value = personal.jobTitle || personal.title || '';
        if (emailEl) emailEl.value = personal.email || '';
        if (phoneEl) phoneEl.value = personal.phone || '';
        if (locationEl) locationEl.value = personal.location || '';
        
        // Load navbar brand fields
        if (document.getElementById('brandIcon')) {
            document.getElementById('brandIcon').value = personal.brandIcon || '';
        }
        if (document.getElementById('brandTitle')) {
            document.getElementById('brandTitle').value = personal.brandTitle || personal.fullName || personal.name || '';
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
        // Ensure personalInfo object exists
        if (!this.data.personalInfo) {
            this.data.personalInfo = {};
        }
        
        this.data.personalInfo = {
            name: document.getElementById('fullName')?.value || '',
            fullName: document.getElementById('fullName')?.value || '',
            title: document.getElementById('jobTitle')?.value || '',
            jobTitle: document.getElementById('jobTitle')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            location: document.getElementById('location')?.value || '',
            brandIcon: document.getElementById('brandIcon')?.value || '',
            brandTitle: document.getElementById('brandTitle')?.value || document.getElementById('fullName')?.value || '',
            brandSubtitle: document.getElementById('brandSubtitle')?.value || '',
            brandImage: this.data.personalInfo.brandImage || '', // Keep existing brand image
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

        // Save to database
        const dbSuccess = await this.saveDataToDatabase();
        if (dbSuccess) {
            this.showToast('Personal information saved successfully!', 'success');
        } else {
            this.showToast('Failed to save to database', 'error');
        }
    }



    // Skills Management
    loadSkillsList() {
        const skillsList = document.getElementById('skills-list');
        if (!skillsList) {
            console.error('Skills list element not found!');
            return;
        }

        skillsList.innerHTML = '';
        
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
            try {
                const skillCard = this.createSkillCard(skill);
                skillCard.style.animationDelay = `${index * 0.1}s`;
                skillsList.appendChild(skillCard);
            } catch (error) {
                console.error(`Error creating skill card ${index}:`, error);
            }
        });
    }

    createSkillCard(skill) {
        
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
                this.showToast('Failed to delete skill from database', 'error');
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
            this.showToast('Failed to save skill to database', 'error');
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
                this.showToast('Failed to delete experience from database', 'error');
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
            this.showToast('Failed to save experience to database', 'error');
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
                this.showToast('Failed to delete education from database', 'error');
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
            this.showToast('Failed to save education to database', 'error');
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
            // Update local data first
            this.data.profileImage = imageUrl;
            
            // Save to database
            const saveSuccess = await this.saveDataToDatabase();
            if (!saveSuccess) {
                this.showToast('Failed to save profile image to database', 'error');
                return;
            }
            
            // Update preview immediately
            const preview = document.getElementById('profilePreview');
            if (preview) {
                preview.src = imageUrl;
            }
            
            // Notify any open CV windows IMMEDIATELY about the image update
            try {
                // Send message to all possible windows
                const message = {
                    type: 'profile-image-updated',
                    imageUrl: imageUrl,
                    timestamp: Date.now()
                };
                
                // Send to parent window
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage(message, '*');
                }
                
                // Send to opener window
                if (window.opener) {
                    window.opener.postMessage(message, '*');
                }
                
                // Try to find and update any CV windows directly
                if (typeof window.cvWindows !== 'undefined') {
                    window.cvWindows.forEach(cvWindow => {
                        if (cvWindow && !cvWindow.closed) {
                            cvWindow.postMessage(message, '*');
                        }
                    });
                }
                
            } catch (error) {
                console.log('Could not send message to other windows:', error);
            }
            
            // Update main CV page immediately using direct DOM manipulation if possible
            try {
                // Try to access CV window if it's open
                const cvWindows = window.open('', '_blank');
                if (cvWindows) {
                    const cvImg = cvWindows.document.querySelector('.profile-img');
                    if (cvImg) {
                        cvImg.src = imageUrl;
                    }
                }
            } catch (error) {
                // Cross-origin restrictions, use postMessage instead
            }
            
            // Open main site immediately to show the updated image
            const newWindow = window.open('../index.html', '_blank');
            
            // Try to update the image in the new window when it loads
            if (newWindow) {
                newWindow.addEventListener('load', () => {
                    try {
                        const cvImg = newWindow.document.querySelector('.profile-img');
                        if (cvImg) {
                            cvImg.src = imageUrl;
                        }
                    } catch (error) {
                        console.log('Could not update image in new window:', error);
                    }
                });
            }
            
        } catch (error) {
            console.error('Error updating profile image:', error);
            
            // Still update locally even if database fails
            this.data.profileImage = imageUrl;
            this.saveData();
            
            const preview = document.getElementById('profilePreview');
            if (preview) {
                preview.src = imageUrl;
            }
            
            this.showToast('Profile image saved locally, but failed to sync with database', 'warning');
        }
    }

    setupProfileImagePreview() {
        const urlInput = document.getElementById('profileImageUrl');
        if (urlInput) {
            
            // Debounce function for better performance
            let timeout;
            urlInput.addEventListener('input', (e) => {
                const imageUrl = e.target.value.trim();
                
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    const preview = document.getElementById('profilePreview');
                    if (preview) {
                        if (imageUrl) {
                            // Show loading state
                            preview.style.opacity = '0.5';
                            
                            // Preload image for instant preview
                            const img = new Image();
                            img.onload = () => {
                                preview.src = imageUrl;
                                preview.style.opacity = '1';
                            };
                            img.onerror = () => {
                                preview.src = 'https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=YT';
                                preview.style.opacity = '1';
                            };
                            img.src = imageUrl;
                        } else {
                            preview.src = 'https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=YT';
                            preview.style.opacity = '1';
                        }
                    }
                }, 300); // 300ms debounce
            });
        } else {
            console.error('Profile image URL input not found');
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
            // Clear profile image data
            this.data.profileImage = null;
            
            // Save to database
            const success = await this.saveDataToDatabase();
            
            if (success) {
                const urlInput = document.getElementById('profileImageUrl');
                const preview = document.getElementById('profilePreview');
                
                if (urlInput) urlInput.value = '';
                if (preview) preview.src = 'https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=YT';
                
                this.showToast('Profile image cleared successfully!', 'success');
            } else {
                this.showToast('Profile image cleared locally, but failed to sync with database', 'warning');
                
                // Still update UI
                const urlInput = document.getElementById('profileImageUrl');
                const preview = document.getElementById('profilePreview');
                
                if (urlInput) urlInput.value = '';
                if (preview) preview.src = 'https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=YT';
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
        // Save to database using main CV data API
        try {
            // Update local data
            this.data.profileImage = imageSrc;
            
            // Save to database
            const saveSuccess = await this.saveDataToDatabase();
            
            if (saveSuccess) {
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
                this.showToast('Error: Failed to save profile image to database', 'error');
            }
        } catch (error) {
            console.error('Error updating profile image:', error);
            this.showToast('Error: Failed to save profile image', 'error');
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
        console.log('🔗 Binding events...');
        
        // Add buttons
        const addSkillBtn = document.getElementById('addSkill');
        const addExpBtn = document.getElementById('addExperience');
        const addEduBtn = document.getElementById('addEducation');
        const saveBtn = document.getElementById('saveChanges');
        
        console.log('Buttons found:', {
            addSkill: !!addSkillBtn,
            addExperience: !!addExpBtn,
            addEducation: !!addEduBtn,
            saveChanges: !!saveBtn
        });
        
        addSkillBtn?.addEventListener('click', () => {
            console.log('Add skill clicked');
            this.addSkill();
        });
        addExpBtn?.addEventListener('click', () => {
            console.log('Add experience clicked');
            this.addExperience();
        });
        addEduBtn?.addEventListener('click', () => {
            console.log('Add education clicked');
            this.addEducation();
        });

        // Header buttons
        saveBtn?.addEventListener('click', () => {
            console.log('Save changes clicked');
            this.saveData();
        });
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
        
        console.log('✅ Events bound successfully');
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
            if (!this.data.personalInfo) {
                this.data.personalInfo = {};
            }
            this.data.personalInfo.brandImage = base64Image;
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

    // Education Gallery Management
    setupGalleryManagement() {
        const addGalleryImageBtn = document.getElementById('addGalleryImage');
        const galleryImageUpload = document.getElementById('galleryImageUpload');
        
        if (addGalleryImageBtn) {
            addGalleryImageBtn.addEventListener('click', () => this.addGalleryImage());
        }
        
        if (galleryImageUpload) {
            galleryImageUpload.addEventListener('change', (e) => this.handleGalleryImageUpload(e));
        }
    }

    async addGalleryImage() {
        const urlInput = document.getElementById('galleryImageUrl');
        const titleInput = document.getElementById('galleryImageTitle');
        
        const imageUrl = urlInput.value.trim();
        const imageTitle = titleInput.value.trim() || 'Education Image';
        
        if (!imageUrl) {
            this.showToast('Please enter an image URL or upload an image', 'error');
            return;
        }
        
        // Validate image URL
        if (!this.isValidImageUrl(imageUrl)) {
            this.showToast('Please enter a valid image URL (JPG, PNG, WEBP)', 'error');
            return;
        }
        
        const newImage = {
            id: Date.now().toString(),
            url: imageUrl,
            title: imageTitle,
            timestamp: new Date().toISOString()
        };
        
        // Add to gallery data
        if (!this.data.educationGallery) {
            this.data.educationGallery = [];
        }
        
        this.data.educationGallery.push(newImage);
        
        // Clear inputs
        urlInput.value = '';
        titleInput.value = '';
        
        // Update display
        this.renderGalleryImages();
        
        // Save to database
        const success = await this.saveDataToDatabase();
        if (success) {
            this.showToast('Image added to gallery successfully!', 'success');
        } else {
            this.showToast('Failed to add image to gallery', 'error');
        }
        
    }

    async handleGalleryImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select a valid image file', 'error');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Image size must be less than 5MB', 'error');
            return;
        }
        
        this.showToast('Converting image...', 'info');
        
        try {
            // Convert to base64
            const base64 = await this.fileToBase64(file);
            
            // Set the URL input with base64 data
            document.getElementById('galleryImageUrl').value = base64;
            
            this.showToast('Image uploaded! Click "Add to Gallery" to save.', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showToast('Failed to upload image', 'error');
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    isValidImageUrl(url) {
        // Check if it's a base64 image
        if (url.startsWith('data:image/')) {
            return true;
        }
        
        // Check if it's a valid URL with image extension
        try {
            const urlObj = new URL(url);
            const path = urlObj.pathname.toLowerCase();
            return path.match(/\.(jpg|jpeg|png|gif|webp|svg)$/);
        } catch {
            return false;
        }
    }

    renderGalleryImages() {
        const container = document.getElementById('galleryImagesList');
        if (!container) return;
        
        const gallery = this.data.educationGallery || [];
        
        if (gallery.length === 0) {
            container.innerHTML = `
                <div class="gallery-empty-state">
                    <i class="fas fa-images" style="font-size: 2rem; margin-bottom: 1rem; color: #9ca3af;"></i>
                    <p>No images in gallery yet. Add some images to get started!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = gallery.map(image => `
            <div class="gallery-image-item" data-id="${image.id}">
                <img src="${image.url}" alt="${image.title}" loading="lazy">
                <div class="gallery-image-overlay">
                    <div class="gallery-image-title">${image.title}</div>
                    <div class="gallery-image-actions">
                        <button class="btn btn-danger" onclick="window.cvDashboard.removeGalleryImage('${image.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
    }

    async removeGalleryImage(imageId) {
        if (!confirm('Are you sure you want to remove this image from the gallery?')) {
            return;
        }
        
        // Remove from data
        this.data.educationGallery = (this.data.educationGallery || []).filter(img => img.id !== imageId);
        
        // Update display
        this.renderGalleryImages();
        
        // Save to database
        const success = await this.saveDataToDatabase();
        if (success) {
            this.showToast('Image removed from gallery', 'success');
        } else {
            this.showToast('Failed to remove image from gallery', 'error');
        }
        
    }

    loadGalleryImages() {
        this.renderGalleryImages();
    }


}

// Global function for removing brand image
function removeBrandImage() {
    const dashboard = window.cvDashboard;
    if (dashboard) {
        dashboard.data.personalInfo.brandImage = '';
        
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
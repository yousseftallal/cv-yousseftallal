// Content Control Script
class ContentController {
    constructor() {
        this.data = {
            keyFeatures: [],
            projects: [],
            contactLinks: [],
            skills: [],
            jobs: [],
            education: []
        };
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.renderAllLists();
    }

    async loadData() {
        try {
            const response = await fetch('/.netlify/functions/admin-control');
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    this.data = {
                        keyFeatures: result.data.keyFeatures || [],
                        projects: result.data.projects || [],
                        contactLinks: result.data.contactLinks || [],
                        skills: result.data.skills || [],
                        jobs: result.data.jobs || [],
                        education: result.data.education || []
                    };
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('adminLoggedIn');
            window.location.href = 'login.html';
        });

        // Platform change handler
        document.getElementById('contactPlatform').addEventListener('change', (e) => {
            const platform = e.target.value;
            const iconInput = document.getElementById('contactIcon');
            const urlInput = document.getElementById('contactUrl');
            
            // Set default icon based on platform
            const iconMap = {
                linkedin: 'fab fa-linkedin',
                github: 'fab fa-github',
                twitter: 'fab fa-twitter',
                facebook: 'fab fa-facebook',
                instagram: 'fab fa-instagram',
                website: 'fas fa-globe',
                email: 'fas fa-envelope',
                phone: 'fas fa-phone'
            };
            
            iconInput.value = iconMap[platform] || '';
            
            // Set placeholder for URL
            const urlPlaceholders = {
                linkedin: 'https://linkedin.com/in/...',
                github: 'https://github.com/...',
                twitter: 'https://twitter.com/...',
                facebook: 'https://facebook.com/...',
                instagram: 'https://instagram.com/...',
                website: 'https://yourwebsite.com',
                email: 'mailto:your@email.com',
                phone: 'tel:+1234567890'
            };
            
            urlInput.placeholder = urlPlaceholders[platform] || 'https://...';
        });
    }

    // Key Features Methods
    addFeature() {
        const title = document.getElementById('featureTitle').value.trim();
        const description = document.getElementById('featureDescription').value.trim();
        const icon = document.getElementById('featureIcon').value.trim();
        
        if (!title || !description) {
            alert('Please fill in all required fields');
            return;
        }
        
        const feature = {
            id: Date.now(),
            title,
            description,
            icon
        };
        
        this.data.keyFeatures.push(feature);
        this.renderFeaturesList();
        this.clearFeatureForm();
    }

    removeFeature(id) {
        this.data.keyFeatures = this.data.keyFeatures.filter(f => f.id !== id);
        this.renderFeaturesList();
    }

    renderFeaturesList() {
        const list = document.getElementById('featuresList');
        list.innerHTML = this.data.keyFeatures.map(feature => `
            <div class="item-card">
                <div class="item-content">
                    <h4><i class="${feature.icon}"></i> ${feature.title}</h4>
                    <p>${feature.description}</p>
                </div>
                <button class="btn btn-danger" onclick="controller.removeFeature(${feature.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    clearFeatureForm() {
        document.getElementById('featureTitle').value = '';
        document.getElementById('featureDescription').value = '';
        document.getElementById('featureIcon').value = '';
    }

    // Projects Methods
    addProject() {
        const title = document.getElementById('projectTitle').value.trim();
        const description = document.getElementById('projectDescription').value.trim();
        const technologies = document.getElementById('projectTechnologies').value.trim();
        const url = document.getElementById('projectUrl').value.trim();
        
        if (!title || !description) {
            alert('Please fill in all required fields');
            return;
        }
        
        const project = {
            id: Date.now(),
            title,
            description,
            technologies: technologies ? technologies.split(',').map(t => t.trim()) : [],
            url
        };
        
        this.data.projects.push(project);
        this.renderProjectsList();
        this.clearProjectForm();
    }

    removeProject(id) {
        this.data.projects = this.data.projects.filter(p => p.id !== id);
        this.renderProjectsList();
    }

    renderProjectsList() {
        const list = document.getElementById('projectsList');
        list.innerHTML = this.data.projects.map(project => `
            <div class="item-card">
                <div class="item-content">
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                    ${project.technologies.length > 0 ? `<div class="tech-tags">${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}</div>` : ''}
                    ${project.url ? `<a href="${project.url}" target="_blank" class="project-link">View Project</a>` : ''}
                </div>
                <button class="btn btn-danger" onclick="controller.removeProject(${project.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    clearProjectForm() {
        document.getElementById('projectTitle').value = '';
        document.getElementById('projectDescription').value = '';
        document.getElementById('projectTechnologies').value = '';
        document.getElementById('projectUrl').value = '';
    }

    // Contact Links Methods
    addContactLink() {
        const platform = document.getElementById('contactPlatform').value;
        const url = document.getElementById('contactUrl').value.trim();
        const icon = document.getElementById('contactIcon').value.trim();
        
        if (!url) {
            alert('Please fill in the URL');
            return;
        }
        
        const link = {
            id: Date.now(),
            platform,
            url,
            icon
        };
        
        this.data.contactLinks.push(link);
        this.renderContactLinksList();
        this.clearContactLinkForm();
    }

    removeContactLink(id) {
        this.data.contactLinks = this.data.contactLinks.filter(l => l.id !== id);
        this.renderContactLinksList();
    }

    renderContactLinksList() {
        const list = document.getElementById('contactLinksList');
        list.innerHTML = this.data.contactLinks.map(link => `
            <div class="item-card">
                <div class="item-content">
                    <h4><i class="${link.icon}"></i> ${link.platform}</h4>
                    <a href="${link.url}" target="_blank">${link.url}</a>
                </div>
                <button class="btn btn-danger" onclick="controller.removeContactLink(${link.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    clearContactLinkForm() {
        document.getElementById('contactUrl').value = '';
        document.getElementById('contactIcon').value = '';
    }

    // Skills Methods
    addSkill() {
        const name = document.getElementById('skillName').value.trim();
        const level = parseInt(document.getElementById('skillLevel').value);
        const icon = document.getElementById('skillIcon').value.trim();
        const description = document.getElementById('skillDescription').value.trim();
        const experience = document.getElementById('skillExperience').value.trim();
        const featuresText = document.getElementById('skillFeatures').value.trim();
        const projectsText = document.getElementById('skillProjects').value.trim();
        
        if (!name) {
            alert('Please fill in the skill name');
            return;
        }
        
        // Convert features text to array, always array
        const features = featuresText ? featuresText.split('\n').map(f => f.trim()).filter(f => f) : [];
        // Convert projects text to array, always array
        const projects = projectsText ? projectsText.split('\n').map(p => p.trim()).filter(p => p) : [];
        
        const skill = {
            id: Date.now(),
            name: name || '',
            level: isNaN(level) ? 80 : level,
            icon: icon || '',
            description: description || '',
            experience: experience || 'Beginner',
            features: Array.isArray(features) ? features : [],
            projects: Array.isArray(projects) ? projects : []
        };
        
        this.data.skills.push(skill);
        this.renderSkillsList();
        this.clearSkillForm();
    }

    removeSkill(id) {
        this.data.skills = this.data.skills.filter(s => s.id !== id);
        this.renderSkillsList();
    }

    renderSkillsList() {
        const list = document.getElementById('skillsList');
        list.innerHTML = this.data.skills.map(skill => `
            <div class="item-card">
                <div class="item-content">
                    <h4>${skill.name}</h4>
                    <div class="skill-level-bar">
                        <div class="skill-level-fill" style="width: ${skill.level}%"></div>
                    </div>
                    <span class="skill-level-text">${skill.level}% • ${skill.experience || 'Beginner'}</span>
                    ${skill.description ? `<p>${skill.description}</p>` : ''}
                    ${skill.features && skill.features.length > 0 ? `
                        <div class="skill-features-preview">
                            <strong>Features:</strong> ${skill.features.slice(0, 2).join(', ')}${skill.features.length > 2 ? '...' : ''}
                        </div>
                    ` : ''}
                    ${skill.projects && skill.projects.length > 0 ? `
                        <div class="skill-projects-preview">
                            <strong>Projects:</strong> ${skill.projects.slice(0, 2).join(', ')}${skill.projects.length > 2 ? '...' : ''}
                        </div>
                    ` : ''}
                </div>
                <button class="btn btn-danger" onclick="controller.removeSkill(${skill.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    clearSkillForm() {
        document.getElementById('skillName').value = '';
        document.getElementById('skillLevel').value = '80';
        document.getElementById('skillIcon').value = '';
        document.getElementById('skillDescription').value = '';
        document.getElementById('skillExperience').value = '';
        document.getElementById('skillFeatures').value = '';
        document.getElementById('skillProjects').value = '';
    }

    // Jobs Methods
    addJob() {
        const title = document.getElementById('jobTitle').value.trim();
        const company = document.getElementById('jobCompany').value.trim();
        const period = document.getElementById('jobPeriod').value.trim();
        const description = document.getElementById('jobDescription').value.trim();
        const technologies = document.getElementById('jobTechnologies').value.trim();
        
        if (!title || !company) {
            alert('Please fill in all required fields');
            return;
        }
        
        const job = {
            id: Date.now(),
            title,
            company,
            period,
            description,
            technologies: technologies ? technologies.split(',').map(t => t.trim()) : []
        };
        
        this.data.jobs.push(job);
        this.renderJobsList();
        this.clearJobForm();
    }

    removeJob(id) {
        this.data.jobs = this.data.jobs.filter(j => j.id !== id);
        this.renderJobsList();
    }

    renderJobsList() {
        const list = document.getElementById('jobsList');
        list.innerHTML = this.data.jobs.map(job => `
            <div class="item-card">
                <div class="item-content">
                    <h4>${job.title}</h4>
                    <p class="job-company">${job.company}</p>
                    <p class="job-period">${job.period}</p>
                    <p>${job.description}</p>
                    ${job.technologies.length > 0 ? `<div class="tech-tags">${job.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}</div>` : ''}
                </div>
                <button class="btn btn-danger" onclick="controller.removeJob(${job.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    clearJobForm() {
        document.getElementById('jobTitle').value = '';
        document.getElementById('jobCompany').value = '';
        document.getElementById('jobPeriod').value = '';
        document.getElementById('jobDescription').value = '';
        document.getElementById('jobTechnologies').value = '';
    }

    // Education Methods
    addEducation() {
        const degree = document.getElementById('educationDegree').value.trim();
        const institution = document.getElementById('educationInstitution').value.trim();
        const period = document.getElementById('educationPeriod').value.trim();
        const description = document.getElementById('educationDescription').value.trim();
        
        if (!degree || !institution) {
            alert('Please fill in all required fields');
            return;
        }
        
        const education = {
            id: Date.now(),
            degree,
            institution,
            period,
            description
        };
        
        this.data.education.push(education);
        this.renderEducationList();
        this.clearEducationForm();
    }

    removeEducation(id) {
        this.data.education = this.data.education.filter(e => e.id !== id);
        this.renderEducationList();
    }

    renderEducationList() {
        const list = document.getElementById('educationList');
        list.innerHTML = this.data.education.map(edu => `
            <div class="item-card">
                <div class="item-content">
                    <h4>${edu.degree}</h4>
                    <p class="education-institution">${edu.institution}</p>
                    <p class="education-period">${edu.period}</p>
                    ${edu.description ? `<p>${edu.description}</p>` : ''}
                </div>
                <button class="btn btn-danger" onclick="controller.removeEducation(${edu.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    clearEducationForm() {
        document.getElementById('educationDegree').value = '';
        document.getElementById('educationInstitution').value = '';
        document.getElementById('educationPeriod').value = '';
        document.getElementById('educationDescription').value = '';
    }

    // Save and Refresh Methods
    async saveAllChanges() {
        try {
            const response = await fetch('/.netlify/functions/admin-control', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    section: 'all',
                    data: this.data
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    alert('All changes saved successfully!');
                } else {
                    alert('Error saving changes: ' + result.error);
                }
            } else {
                alert('Error saving changes');
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Error saving changes');
        }
    }

    async refreshContent() {
        await this.loadData();
        this.renderAllLists();
        alert('Content refreshed successfully!');
    }

    renderAllLists() {
        this.renderFeaturesList();
        this.renderProjectsList();
        this.renderContactLinksList();
        this.renderSkillsList();
        this.renderJobsList();
        this.renderEducationList();
    }
}

// Global functions for HTML onclick handlers
function addFeature() { controller.addFeature(); }
function addProject() { controller.addProject(); }
function addContactLink() { controller.addContactLink(); }
function addSkill() { controller.addSkill(); }
function addJob() { controller.addJob(); }
function addEducation() { controller.addEducation(); }
function saveAllChanges() { controller.saveAllChanges(); }
function refreshContent() { controller.refreshContent(); }

// Initialize controller
let controller;
document.addEventListener('DOMContentLoaded', () => {
    controller = new ContentController();
});
// Database configuration for Neon
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Create tables if they don't exist
async function initializeDatabase() {
    try {
        const client = await pool.connect();
        
        // Create profile_image table
        await client.query(`
            CREATE TABLE IF NOT EXISTS profile_image (
                id SERIAL PRIMARY KEY,
                image_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create cv_data table for all CV content
        await client.query(`
            CREATE TABLE IF NOT EXISTS cv_data (
                id SERIAL PRIMARY KEY,
                section_name VARCHAR(100) NOT NULL,
                content JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(section_name)
            )
        `);
        
        // Insert default image if table is empty
        const result = await client.query('SELECT COUNT(*) FROM profile_image');
        if (parseInt(result.rows[0].count) === 0) {
            await client.query(`
                INSERT INTO profile_image (image_url) 
                VALUES ('https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=YT')
            `);
        }
        
        // Insert default CV data if table is empty
        const cvResult = await client.query('SELECT COUNT(*) FROM cv_data');
        if (parseInt(cvResult.rows[0].count) === 0) {
            const defaultData = {
                personalInfo: {
                    name: "Youssef Tallal",
                    title: "Full Stack Developer",
                    email: "youssef@example.com",
                    phone: "+1234567890",
                    location: "Cairo, Egypt",
                    about: "Passionate full stack developer with experience in modern web technologies."
                },
                about: {
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
                },
                skills: [
                    {
                        id: 'javascript',
                        name: "JavaScript",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
                        description: "Modern JavaScript development for web and mobile applications.",
                        features: [
                            "ES6+ syntax and features",
                            "Async/await programming",
                            "DOM manipulation",
                            "API integration"
                        ],
                        projects: [
                            "Interactive web applications",
                            "RESTful API development",
                            "Single Page Applications (SPA)"
                        ],
                        level: "Advanced",
                        experience: "3+ years"
                    },
                    {
                        id: 'react',
                        name: "React",
                        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
                        description: "Building modern user interfaces with React framework.",
                        features: [
                            "Component-based architecture",
                            "State management with hooks",
                            "Virtual DOM optimization",
                            "JSX templating"
                        ],
                        projects: [
                            "E-commerce frontend application",
                            "Dashboard with real-time data",
                            "Portfolio website"
                        ],
                        level: "Advanced",
                        experience: "2+ years"
                    }
                ],
                experience: [
                    {
                        title: "Senior Developer",
                        company: "Tech Company",
                        period: "2022 - Present",
                        description: "Leading development team and implementing new features."
                    }
                ],
                education: [
                    {
                        degree: "Bachelor of Computer Science",
                        institution: "University Name",
                        period: "2018 - 2022",
                        description: "Studied computer science and software engineering."
                    }
                ],
                projects: [
                    {
                        title: "E-commerce Platform",
                        description: "Built a full-stack e-commerce platform using React and Node.js",
                        technologies: ["React", "Node.js", "MongoDB"],
                        link: "https://github.com/example/project"
                    }
                ],
                educationGallery: [
                    {
                        id: "cert1",
                        url: "https://via.placeholder.com/420x280/667eea/FFFFFF?text=Certificate+1",
                        title: "Computer Science Certificate"
                    },
                    {
                        id: "cert2", 
                        url: "https://via.placeholder.com/420x280/764ba2/FFFFFF?text=Certificate+2",
                        title: "Web Development Certificate"
                    },
                    {
                        id: "cert3",
                        url: "https://via.placeholder.com/420x280/f093fb/FFFFFF?text=Certificate+3", 
                        title: "Mobile Development Certificate"
                    }
                ],
                profileImage: "https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=YT"
            };
            
            await client.query(`
                INSERT INTO cv_data (section_name, content) 
                VALUES ('allData', $1)
            `, [JSON.stringify(defaultData)]);
        }
        
        client.release();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

// Get current profile image
async function getProfileImage() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT image_url FROM profile_image ORDER BY updated_at DESC LIMIT 1');
        client.release();
        return result.rows[0]?.image_url || null;
    } catch (error) {
        console.error('Error getting profile image:', error);
        return null;
    }
}

// Update profile image
async function updateProfileImage(imageUrl) {
    try {
        const client = await pool.connect();
        await client.query(`
            INSERT INTO profile_image (image_url) 
            VALUES ($1)
        `, [imageUrl]);
        client.release();
        return true;
    } catch (error) {
        console.error('Error updating profile image:', error);
        return false;
    }
}

// Get all CV data
async function getCVData() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT content FROM cv_data WHERE section_name = $1', ['allData']);
        client.release();
        return result.rows[0]?.content || null;
    } catch (error) {
        console.error('Error getting CV data:', error);
        return null;
    }
}

// Update CV data
async function updateCVData(data) {
    try {
        const client = await pool.connect();
        await client.query(`
            INSERT INTO cv_data (section_name, content) 
            VALUES ('allData', $1)
            ON CONFLICT (section_name) 
            DO UPDATE SET content = $1, updated_at = CURRENT_TIMESTAMP
        `, [JSON.stringify(data)]);
        client.release();
        return true;
    } catch (error) {
        console.error('Error updating CV data:', error);
        return false;
    }
}

module.exports = {
    pool,
    initializeDatabase,
    getProfileImage,
    updateProfileImage,
    getCVData,
    updateCVData
};
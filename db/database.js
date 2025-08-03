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
        
        // Insert default image if table is empty
        const result = await client.query('SELECT COUNT(*) FROM profile_image');
        if (parseInt(result.rows[0].count) === 0) {
            await client.query(`
                INSERT INTO profile_image (image_url) 
                VALUES ('https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=YT')
            `);
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

module.exports = {
    pool,
    initializeDatabase,
    getProfileImage,
    updateProfileImage
};
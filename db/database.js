// Database configuration for Neon
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 
    "postgresql://neondb_owner:npg_4lrSGXds7KCv@ep-flat-credit-a9xeg52u-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Create tables if they don't exist
async function initializeDatabase() {
    try {
        const client = await pool.connect();
        
        // Create cv_data table for all CV content
        await client.query(`
            CREATE TABLE IF NOT EXISTS cv_data (
                id SERIAL PRIMARY KEY,
                data_key VARCHAR(100) NOT NULL,
                data_value JSONB NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(data_key)
            )
        `);
        
        // Database is ready - no default data insertion
        // All data must be entered through the dashboard
        
        client.release();
        console.log('Database initialized successfully - ready for data entry');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

// Get all CV data
async function getCVData() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT data_value FROM cv_data WHERE data_key = $1', ['allData']);
        client.release();
        return result.rows[0]?.data_value || null;
    } catch (error) {
        console.error('Error getting CV data:', error);
        return null;
    }
}

// Update CV data
async function updateCVData(data) {
    try {
        console.log('📊 updateCVData called with data keys:', Object.keys(data || {}));
        console.log('🔗 Database URL available:', !!DATABASE_URL);
        
        const client = await pool.connect();
        console.log('✅ Database connection established');
        
        await client.query(`
            INSERT INTO cv_data (data_key, data_value) 
            VALUES ('allData', $1)
            ON CONFLICT (data_key) 
            DO UPDATE SET data_value = $1, updated_at = CURRENT_TIMESTAMP
        `, [JSON.stringify(data)]);
        
        console.log('✅ Database query executed successfully');
        client.release();
        console.log('✅ Database connection released');
        
        return true;
    } catch (error) {
        console.error('❌ Error updating CV data:', error.message);
        console.error('❌ Error stack:', error.stack);
        return false;
    }
}

module.exports = {
    pool,
    initializeDatabase,
    getCVData,
    updateCVData
};
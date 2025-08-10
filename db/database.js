// Database configuration for Neon (serverless)
const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL || 
    "postgresql://neondb_owner:npg_4lrSGXds7KCv@ep-calm-morning-a9g6k8gb-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);

// Create tables if they don't exist
async function initializeDatabase() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS cv_data (
                id SERIAL PRIMARY KEY,
                data_key VARCHAR(100) NOT NULL,
                data_value JSONB NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(data_key)
            )
        `;
        console.log('Database initialized successfully - ready for data entry');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

// Get all CV data
async function getCVData() {
    try {
        const rows = await sql`SELECT data_value FROM cv_data WHERE data_key = 'allData'`;
        return rows[0]?.data_value || null;
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
        
        await sql`
            INSERT INTO cv_data (data_key, data_value)
            VALUES ('allData', ${JSON.stringify(data)}::jsonb)
            ON CONFLICT (data_key)
            DO UPDATE SET data_value = ${JSON.stringify(data)}::jsonb, updated_at = CURRENT_TIMESTAMP
        `;
        
        console.log('✅ Database query executed successfully');
        return true;
    } catch (error) {
        console.error('❌ Error updating CV data:', error.message);
        console.error('❌ Error stack:', error.stack);
        return false;
    }
}

module.exports = {
    sql,
    initializeDatabase,
    getCVData,
    updateCVData
};
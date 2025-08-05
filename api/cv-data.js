const { getCVData, updateCVData, initializeDatabase } = require('../db/database');

// Initialize database on first load
initializeDatabase().catch(console.error);

// CV Data API endpoint
exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        if (event.httpMethod === 'GET') {
            // Get all CV data
            const data = await getCVData();
            
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    data: data
                })
            };
        }
        
        else if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
            // Update CV data
            console.log('📝 POST/PUT request received');
            console.log('Request body length:', event.body?.length || 0);
            
            const body = JSON.parse(event.body);
            console.log('Parsed body keys:', Object.keys(body || {}));
            
            if (!body) {
                console.log('❌ No body provided');
                return {
                    statusCode: 400,
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        success: false,
                        error: 'Data is required'
                    })
                };
            }
            
            console.log('🔄 Attempting to update CV data...');
            const success = await updateCVData(body);
            console.log('Database update result:', success);
            
            if (success) {
                console.log('✅ Database update successful');
                return {
                    statusCode: 200,
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        success: true,
                        message: 'CV data updated successfully'
                    })
                };
            } else {
                console.log('❌ Database update failed');
                return {
                    statusCode: 500,
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        success: false,
                        error: 'Failed to update CV data'
                    })
                };
            }
        }
        
        else {
            return {
                statusCode: 405,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Method not allowed'
                })
            };
        }
        
    } catch (error) {
        console.error('CV Data API Error:', error);
        return {
            statusCode: 500,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                error: 'Internal server error'
            })
        };
    }
};
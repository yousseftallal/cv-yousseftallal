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
            const body = JSON.parse(event.body);
            
            if (!body) {
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
            
            const success = await updateCVData(body);
            
            if (success) {
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
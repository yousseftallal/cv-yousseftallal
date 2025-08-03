const { getCVData, updateCVData } = require('../db/database');

// Admin Control API endpoint
exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
            // Get all CV data for admin control
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
            // Update specific section or all data
            const body = JSON.parse(event.body);
            
            if (!body || !body.section) {
                return {
                    statusCode: 400,
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        success: false,
                        error: 'Section and data are required'
                    })
                };
            }
            
            // Get current data
            const currentData = await getCVData() || {};
            
            // Update specific section
            if (body.section === 'keyFeatures') {
                currentData.keyFeatures = body.data;
            } else if (body.section === 'projects') {
                currentData.projects = body.data;
            } else if (body.section === 'contactLinks') {
                currentData.contactLinks = body.data;
            } else if (body.section === 'skills') {
                currentData.skills = body.data;
            } else if (body.section === 'jobs') {
                currentData.jobs = body.data;
            } else if (body.section === 'education') {
                currentData.education = body.data;
            } else if (body.section === 'all') {
                // Update all data
                Object.assign(currentData, body.data);
            }
            
            const success = await updateCVData(currentData);
            
            if (success) {
                return {
                    statusCode: 200,
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        success: true,
                        message: `${body.section} updated successfully`,
                        data: currentData
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
                        error: 'Failed to update data'
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
        console.error('Admin Control API Error:', error);
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
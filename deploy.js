#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.json': 'application/json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    
    // Default to index.html for root path
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Construct file path
    const filePath = path.join(__dirname, pathname);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(`
                <html>
                    <head>
                        <title>404 - Page Not Found</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                text-align: center;
                                padding: 50px;
                                background: #f8fafc;
                            }
                            .error-container {
                                max-width: 600px;
                                margin: 0 auto;
                                background: white;
                                padding: 40px;
                                border-radius: 10px;
                                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                            }
                            h1 { color: #e74c3c; }
                            .btn {
                                display: inline-block;
                                padding: 12px 24px;
                                background: #3498db;
                                color: white;
                                text-decoration: none;
                                border-radius: 5px;
                                margin-top: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="error-container">
                            <h1>404 - Page Not Found</h1>
                            <p>The page you're looking for doesn't exist.</p>
                            <a href="/" class="btn">Go Home</a>
                        </div>
                    </body>
                </html>
            `);
            return;
        }
        
        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.end('<h1>500 - Internal Server Error</h1>');
                return;
            }
            
            // Get file extension and corresponding MIME type
            const ext = path.extname(filePath).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            
            // Set appropriate headers
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000'
            });
            
            res.end(data);
        });
    });
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log('🚀 CV Website deployed successfully!');
    console.log(`📍 Server running at http://${HOST}:${PORT}/`);
    console.log(`🌐 Main Website: http://${HOST}:${PORT}/`);
    console.log(`⚙️  Admin Dashboard: http://${HOST}:${PORT}/admin/`);
    console.log('\n📋 Features:');
    console.log('   ✅ Responsive CV/Resume website');
    console.log('   ✅ Interactive skills showcase');
    console.log('   ✅ Admin dashboard for content management');
    console.log('   ✅ Real-time data synchronization');
    console.log('   ✅ Contact section with social links');
    console.log('\n🛠️  To stop the server, press Ctrl+C');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server gracefully...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    process.exit(1);
});
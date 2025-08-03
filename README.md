# CV Dashboard - Neon Database Integration

## Profile Image Management with Neon PostgreSQL Database

This update integrates Neon PostgreSQL database for persistent profile image storage across all devices and browsers.

### What's New:

1. **Neon Database Integration**: Profile images are now stored in Neon PostgreSQL database
2. **Automatic Loading**: Images load automatically from database on all devices
3. **No Local Storage**: No need for localStorage or URL parameters
4. **Real-time Updates**: Changes appear immediately across all devices
5. **Admin Authentication**: Secure login system for dashboard access
6. **API Endpoints**: RESTful API for image management

### Setup Instructions:

#### 1. Neon Database Setup:
1. Create a Neon account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy your database connection string
4. Add it as environment variable in Netlify:
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add: `DATABASE_URL` = your Neon connection string

#### 2. Netlify Functions Setup:
The project includes Netlify Functions for database operations:
- `api/profile-image.js`: Handles GET/POST requests for profile images
- `db/database.js`: Database connection and operations

#### 3. Dependencies:
Install required packages:
```bash
npm install
```

### How to Use:

#### Admin Access:
- **Username**: `admin`
- **Password**: `admin123`
- Go to `/admin/login.html` to access the dashboard

#### Profile Image Management:
1. **Login**: Access the admin dashboard with the credentials above
2. **Enter Image URL**: Paste an image URL in the Profile Image section
3. **Update Image**: Click "Update Image" to save to database
4. **Automatic Loading**: The image will appear on all devices automatically

### Technical Details:

- **Database**: Neon PostgreSQL with automatic table creation
- **API**: Netlify Functions for database operations
- **Authentication**: Client-side login with 24-hour session
- **Caching**: Cache-busting mechanisms for reliable image loading
- **Fallback**: localStorage backup for admin dashboard

### Files Structure:

```
├── api/
│   └── profile-image.js          # API endpoints
├── db/
│   └── database.js               # Database operations
├── admin/
│   ├── login.html               # Admin login
│   ├── index.html               # Admin dashboard
│   └── admin-script.js          # Dashboard logic
├── script.js                    # Main site logic
├── index.html                   # Main CV page
├── package.json                 # Dependencies
└── netlify.toml                # Netlify configuration
```

### Environment Variables:

Required in Netlify:
- `DATABASE_URL`: Your Neon PostgreSQL connection string

### Troubleshooting:

If the profile image doesn't update:
1. Check Netlify Functions logs in the dashboard
2. Verify `DATABASE_URL` environment variable is set
3. Check browser console for API errors
4. Ensure the image URL is accessible

### Security Note:

The current authentication is client-side only. For production use, consider implementing server-side authentication.

### Deployment:

1. Push code to GitHub
2. Connect repository to Netlify
3. Set `DATABASE_URL` environment variable
4. Deploy automatically

The system will automatically create the required database table on first deployment.
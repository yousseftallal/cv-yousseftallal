# CV Dashboard - Profile Image Update Guide

## Overview
This CV dashboard allows you to manage your personal information, skills, experience, and profile image. The profile image update feature has been enhanced to work properly with Netlify deployments.

## How to Update Profile Image

### Local Development
1. Open the admin dashboard at `admin/index.html`
2. Go to the "Images" section
3. Upload your new profile image by dragging and dropping or clicking to browse
4. Click "Set as Profile" on the uploaded image
5. The image will be saved to localStorage and immediately visible on the main site

### Netlify Deployment Issue
When you deploy to Netlify, the localStorage data doesn't transfer to the published site. Here's how to fix this:

#### Method 1: Export/Import Data (Recommended)
1. **Export Data**: In your local admin dashboard, go to Settings and click "Export Data" to download a JSON file
2. **Deploy to Netlify**: Deploy your site to Netlify
3. **Import Data**: On the published Netlify site, use the admin controls (bottom-right corner) to import the JSON file you exported

#### Method 2: Manual Cache Refresh
1. After updating your profile image locally, deploy to Netlify
2. On the published site, click the refresh button (🔄) in the bottom-right corner
3. If the image still doesn't appear, try importing the data using Method 1

## Admin Controls on Published Site
The published site includes hidden admin controls in the bottom-right corner:
- **🔄 Refresh Cache**: Forces reload of profile image and data
- **📁 Import Data**: Import JSON data file from your local dashboard
- **💾 Export Data**: Export current data to JSON file

## Features
- ✅ Profile image upload and management
- ✅ Personal information editing
- ✅ Skills, experience, and education management
- ✅ Data export/import functionality
- ✅ Cache refresh for deployed sites
- ✅ Responsive design
- ✅ Modern UI with animations

## File Structure
```
├── index.html          # Main CV site
├── script.js           # Main site JavaScript
├── style.css           # Main site styles
├── admin/
│   ├── index.html      # Admin dashboard
│   ├── admin-script.js # Admin dashboard JavaScript
│   ├── admin-style.css # Admin dashboard styles
│   └── config.yml      # Netlify configuration
└── README.md           # This file
```

## Technical Details
- Uses localStorage for data persistence
- Base64 encoding for image storage
- Cache-busting mechanisms for image updates
- Export/import functionality for data transfer
- Responsive design with modern CSS

## Troubleshooting
- **Image not updating**: Try the refresh button or re-import your data
- **Data not saving**: Check browser console for errors
- **Import not working**: Ensure the JSON file is valid and from the same dashboard version
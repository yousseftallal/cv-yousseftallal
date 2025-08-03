# CV Dashboard - Profile Image Management

This CV dashboard allows you to manage your profile information, including profile images, and automatically updates the main site.

## Features

- **Profile Image Management**: Upload and set profile images that automatically appear on the main site
- **Personal Information**: Update name, job title, contact information, and about text
- **Skills Management**: Add, edit, and delete skills with icons and descriptions
- **Experience & Education**: Manage your work experience and education history
- **Real-time Preview**: See changes immediately on the main site

## How to Use

### Profile Image Management

1. **Access the Dashboard**: Open `admin/index.html` in your browser
2. **Upload Images**: 
   - Click on the upload area or drag and drop images
   - Supported formats: JPG, PNG, GIF, etc.
3. **Set Profile Image**: 
   - Click "Set as Profile" on any uploaded image
   - The image will immediately update on the main site
4. **Clear Profile Image**: 
   - Click "Clear Profile Image" to reset to the default placeholder

### Main Site Updates

The main site (`index.html`) automatically loads:
- Profile image from localStorage
- Personal information (name, job title, about text)
- Skills data
- All changes are saved to localStorage and persist between sessions

### Publishing to Netlify

When you deploy to Netlify:
1. All your changes are saved in localStorage
2. The main site will display your updated profile image and information
3. The site will work exactly as it does locally

## File Structure

```
├── index.html          # Main CV site
├── script.js           # Main site JavaScript
├── style.css           # Main site styles
├── admin/
│   ├── index.html      # Dashboard interface
│   ├── admin-script.js # Dashboard functionality
│   └── admin-style.css # Dashboard styles
└── README.md           # This file
```

## Technical Details

- **Data Storage**: All data is stored in browser localStorage
- **Image Handling**: Images are converted to base64 data URLs for storage
- **Cross-page Updates**: Changes in admin automatically update the main site
- **Error Handling**: Fallback to default image if profile image fails to load

## Browser Compatibility

- Modern browsers with localStorage support
- File API support for image uploads
- Base64 image encoding support

## Troubleshooting

**Profile image not updating on Netlify:**
- Ensure you've saved your changes in the admin dashboard
- Check that localStorage is working in your browser
- Verify the image file is valid and not too large

**Image upload not working:**
- Check browser console for errors
- Ensure you're using a modern browser
- Try a different image format
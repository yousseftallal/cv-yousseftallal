# CV Website with Dynamic Content Control

A modern, responsive CV/Portfolio website with dynamic content management system powered by Neon database and Netlify.

## 🌟 Key Features

### Dynamic Content Management
- **Key Features & Capabilities Control**: Add, edit, and manage your key skills and capabilities
- **Projects & Experience Management**: Manage your projects with descriptions, technologies, and links
- **Contact Links Control**: Dynamic social media and contact links management
- **Skills Management**: Add, edit, and manage technical skills with levels and descriptions
- **Jobs & Experience**: Manage work experience with company details and technologies
- **Education Management**: Add and manage educational background

### Technical Features
- **Real-time Updates**: Content updates immediately reflect on the live website
- **Database Integration**: PostgreSQL database hosted on Neon for reliable data storage
- **Responsive Design**: Works perfectly on all devices
- **Interactive Skills Cards**: Hover effects and detailed skill information
- **Admin Dashboard**: Comprehensive control panel for content management
- **Modern UI/UX**: Clean, professional design with smooth animations

## 🚀 Live Demo

The website is live and accessible at: [Your Netlify URL]

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Netlify Functions (Serverless)
- **Database**: PostgreSQL (Neon)
- **Deployment**: Netlify
- **Styling**: Custom CSS with modern design principles
- **Icons**: Font Awesome 6.4.0

## 📁 Project Structure

```
├── index.html                 # Main website
├── style.css                  # Main stylesheet
├── script.js                  # Main JavaScript
├── admin/
│   ├── index.html            # Admin dashboard
│   ├── control.html          # Content control panel
│   ├── login.html            # Admin login
│   ├── admin-style.css       # Admin styles
│   ├── admin-script.js       # Admin dashboard logic
│   └── control-script.js     # Content control logic
├── api/
│   ├── cv-data.js            # CV data API
│   ├── admin-control.js      # Admin control API
│   └── profile-image.js      # Profile image API
├── db/
│   └── database.js           # Database configuration
├── netlify.toml              # Netlify configuration
└── package.json              # Dependencies
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- Neon database account
- Netlify account

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd cv-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Set up your Neon database
   - Update `DATABASE_URL` in `netlify.toml`

4. **Deploy to Netlify**
   ```bash
   netlify deploy --prod
   ```

## 🎯 Content Management

### Admin Access
- Navigate to `/admin/login.html`
- Use admin credentials to access the dashboard
- Access content control panel at `/admin/control.html`

### Available Controls

#### 1. Key Features & Capabilities
- Add feature titles and descriptions
- Include custom icons
- Manage multiple features

#### 2. Projects & Experience
- Add project titles and descriptions
- Include technology stacks
- Add project URLs
- Manage project portfolios

#### 3. Contact Links
- LinkedIn, GitHub, Twitter, etc.
- Custom platform support
- Automatic icon mapping

#### 4. Skills Management
- Add skill names and levels (1-100)
- Include skill descriptions
- Custom skill icons
- Interactive skill cards

#### 5. Jobs & Experience
- Job titles and companies
- Employment periods
- Job descriptions
- Technology stacks used

#### 6. Education
- Degree information
- Institution names
- Study periods
- Educational descriptions

## 🎨 Design Features

### Responsive Layout
- Mobile-first design approach
- Adaptive grid systems
- Touch-friendly interfaces

### Interactive Elements
- Hover effects on skill cards
- Smooth animations
- Modal dialogs for detailed information
- Real-time content updates

### Visual Enhancements
- Modern gradient backgrounds
- Professional color scheme
- Smooth transitions
- Loading animations

## 🔄 Real-time Updates

The website automatically updates when content is changed through the admin panel:

1. **Immediate Reflection**: Changes appear instantly on the live website
2. **Database Sync**: All changes are stored in the Neon PostgreSQL database
3. **Cache Busting**: Ensures fresh content delivery
4. **Error Handling**: Graceful fallbacks for failed updates

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-optimized interactions
- Fast loading on mobile networks
- Progressive enhancement

## 🔒 Security Features

- Admin authentication system
- Secure API endpoints
- Input validation and sanitization
- CORS protection
- Rate limiting on API calls

## 🚀 Performance Optimizations

- Optimized images and assets
- Minified CSS and JavaScript
- Efficient database queries
- CDN integration for static assets
- Lazy loading for better performance

## 📊 Database Schema

### Tables
- `cv_data`: Stores all CV content in JSON format
- `profile_image`: Manages profile images

### Data Structure
```json
{
  "personal": {
    "fullName": "string",
    "jobTitle": "string",
    "aboutText": "string"
  },
  "skills": [...],
  "experience": [...],
  "education": [...],
  "contactLinks": [...],
  "keyFeatures": [...],
  "projects": [...],
  "jobs": [...]
}
```

## 🔧 Customization

### Styling
- Modify `style.css` for main website styling
- Update `admin/admin-style.css` for admin panel styling
- Customize color schemes and typography

### Functionality
- Extend `script.js` for additional frontend features
- Modify API endpoints in `/api/` directory
- Add new content types in the database

## 📈 Future Enhancements

- [ ] Blog section
- [ ] Portfolio gallery
- [ ] Contact form integration
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Advanced animations
- [ ] SEO optimization tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using modern web technologies**
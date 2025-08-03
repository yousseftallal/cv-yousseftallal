// Image Storage System
class ImageStorage {
    constructor() {
        this.storageKey = 'cvProfileImage';
        this.backupKey = 'cvProfileImageBackup';
    }

    // Save profile image to localStorage and create backup
    saveProfileImage(imageData) {
        try {
            // Save to localStorage
            localStorage.setItem(this.storageKey, imageData);
            
            // Create backup with timestamp
            const backup = {
                image: imageData,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem(this.backupKey, JSON.stringify(backup));
            
            // Also save to sessionStorage for immediate access
            sessionStorage.setItem(this.storageKey, imageData);
            
            return true;
        } catch (error) {
            console.error('Error saving profile image:', error);
            return false;
        }
    }

    // Load profile image from localStorage
    loadProfileImage() {
        try {
            // Try localStorage first
            let imageData = localStorage.getItem(this.storageKey);
            
            // If not in localStorage, try sessionStorage
            if (!imageData) {
                imageData = sessionStorage.getItem(this.storageKey);
            }
            
            // If still not found, try backup
            if (!imageData) {
                const backup = localStorage.getItem(this.backupKey);
                if (backup) {
                    const backupData = JSON.parse(backup);
                    imageData = backupData.image;
                }
            }
            
            return imageData;
        } catch (error) {
            console.error('Error loading profile image:', error);
            return null;
        }
    }

    // Check if profile image exists
    hasProfileImage() {
        return this.loadProfileImage() !== null;
    }

    // Clear profile image
    clearProfileImage() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.backupKey);
        sessionStorage.removeItem(this.storageKey);
    }

    // Get image info
    getImageInfo() {
        const backup = localStorage.getItem(this.backupKey);
        if (backup) {
            try {
                return JSON.parse(backup);
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    // Export image data for sharing
    exportImageData() {
        const imageData = this.loadProfileImage();
        if (imageData) {
            const exportData = {
                image: imageData,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            return JSON.stringify(exportData);
        }
        return null;
    }

    // Import image data from shared data
    importImageData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.image) {
                return this.saveProfileImage(data.image);
            }
        } catch (error) {
            console.error('Error importing image data:', error);
        }
        return false;
    }
}

// Create global instance
window.imageStorage = new ImageStorage();
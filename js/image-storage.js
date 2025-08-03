// Image Storage System
class ImageStorage {
    constructor() {
        this.storageKey = 'cvProfileImage';
        this.backupKey = 'cvProfileImageBackup';
        this.centralStorageKey = 'cvCentralImageStorage';
        this.initCentralStorage();
    }

    initCentralStorage() {
        // Initialize central storage for cross-browser sharing
        if (!localStorage.getItem(this.centralStorageKey)) {
            localStorage.setItem(this.centralStorageKey, JSON.stringify({
                images: {},
                lastUpdated: null
            }));
        }
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
            
            // Save to central storage for cross-browser sharing
            this.saveToCentralStorage(imageData);
            
            return true;
        } catch (error) {
            console.error('Error saving profile image:', error);
            return false;
        }
    }

    saveToCentralStorage(imageData) {
        try {
            const centralStorage = JSON.parse(localStorage.getItem(this.centralStorageKey) || '{"images":{}}');
            const imageId = this.generateImageId(imageData);
            
            centralStorage.images[imageId] = {
                data: imageData,
                timestamp: new Date().toISOString(),
                isActive: true
            };
            
            // Mark all other images as inactive
            Object.keys(centralStorage.images).forEach(id => {
                if (id !== imageId) {
                    centralStorage.images[id].isActive = false;
                }
            });
            
            centralStorage.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.centralStorageKey, JSON.stringify(centralStorage));
        } catch (error) {
            console.error('Error saving to central storage:', error);
        }
    }

    generateImageId(imageData) {
        // Create a simple hash of the image data
        let hash = 0;
        for (let i = 0; i < imageData.length; i++) {
            const char = imageData.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
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
            
            // If still not found, try central storage
            if (!imageData) {
                imageData = this.getActiveImageFromCentralStorage();
            }
            
            return imageData;
        } catch (error) {
            console.error('Error loading profile image:', error);
            return null;
        }
    }

    getActiveImageFromCentralStorage() {
        try {
            const centralStorage = JSON.parse(localStorage.getItem(this.centralStorageKey) || '{"images":{}}');
            const activeImage = Object.values(centralStorage.images).find(img => img.isActive);
            return activeImage ? activeImage.data : null;
        } catch (error) {
            console.error('Error getting active image from central storage:', error);
            return null;
        }
    }

    getImageById(imageId) {
        try {
            const centralStorage = JSON.parse(localStorage.getItem(this.centralStorageKey) || '{"images":{}}');
            const image = centralStorage.images[imageId];
            return image ? image.data : null;
        } catch (error) {
            console.error('Error getting image by ID:', error);
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